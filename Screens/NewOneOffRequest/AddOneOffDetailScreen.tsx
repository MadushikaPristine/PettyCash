import DropdownAlert, { DropdownAlertData, DropdownAlertType } from 'react-native-dropdownalert';
import style from './OneOffStyle';
import ComStyles from "../../Constant/Components.styles";
import { Alert, SafeAreaView, ScrollView, Text, View } from 'react-native';
import Header from '../../Components/Header';
import { Dropdown } from 'react-native-element-dropdown';
import { useCallback, useEffect, useState } from 'react';
import { getGLAccNo } from '../../SQLiteDBAction/Controllers/GLAccountController';
import { getCostCenterByJobNo, getJobNOByOwners } from '../../SQLiteDBAction/Controllers/JobNoController';
import { get_ASYNC_COST_CENTER } from '../../Constant/AsynStorageFuntion';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useFocusEffect } from '@react-navigation/native';
import { getVehicleNoAll } from '../../SQLiteDBAction/Controllers/VehicleNoController';
import { getExpenseTypeAll } from '../../SQLiteDBAction/Controllers/ExpenseTypeController';
import InputText from '../../Components/InputText';
import ActionButton from '../../Components/ActionButton';
import { generateReferenceNo } from '../../Constant/IDGenerator';
let alert = (_data: DropdownAlertData) => new Promise<DropdownAlertData>(res => res);
const AddOneOffDetailScreen = (props: any) => {
    const { navigation, route } = props;
    const [isFocus, setIsFocus] = useState(false);
    const [OneOffData, setOneOffData] = useState(route.params?.OneOffdataSet || []);
    const [OneOffJobData, setOneOffJobData] = useState(route.params?.OneOffJobdataSet || []);
    const [OneOffAttachments, setOneOffAttachments] = useState(route.params?.OneOffAttachmentSet || []);
    const [NewOneOffJobData, setNewOneOffJobData]: any[] = useState({});
    const [Job_NoList, setJob_NoList] = useState([]);
    const [Vehicle_NoList, setVehicle_NoList] = useState([]);
    const [ExpenseTypeList, setExpenseTypeList] = useState([]);
    const back = () => {
        navigation.navigate('NewOneOffScreen', { OneOffdataSet: OneOffData, OneOffJobdataSet: OneOffJobData, OneOffAttachmentSet: OneOffAttachments });
    }
    const naviBack = () => {
        Alert.alert('Go Back !', 'Are you sure you want to Go Back ?', [
            {
                text: 'No',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            { text: 'Yes', onPress: (back) },
        ]);
    }
    const handleNewJobDataChange = (value: any, Id: any, key: any) => {
        try {
            setNewOneOffJobData((prevData: any) => ({
                ...prevData, [key]: { value, Id }
            }));
        } catch (error) {
        }
    }
    const handleChange = (value: any, Id: any, key: any) => {
        try {
            setOneOffData((prevState: any) => ({
                ...prevState, [key]: { value, Id }
            }));
        } catch (error) {
        }
    }
    const getCostCenter = (ID: any) => {
        handleNewJobDataChange(null, null, "CostCenter")
        getCostCenterByJobNo(ID, (res: any) => {
            handleNewJobDataChange(res[0].CostCenter, null, "CostCenter")
        });
    }
    const getGL_AccNo = (typeID: any, code: any) => {
        handleNewJobDataChange(null, null, "GLAccount")
        getGLAccNo(typeID, code, (res: any) => {
            handleNewJobDataChange(res[0].GL_ACCOUNT, null, "GLAccount")
        });
    }
    const getVehicleNo = () => {
        getVehicleNoAll((resp: any) => {
            //console.log("Vehicle No............", resp);
            setVehicle_NoList(resp);
        })
    }
    const getJobNoByJobOwner = (ID: any) => {
        getJobNOByOwners(OneOffData.JobOwnerEPF?.value, (res: any) => {
            setJob_NoList(res);
        });
    }
    const getExpenseTypes = () => {
        getExpenseTypeAll((result: any) => {
            setExpenseTypeList(result);
        });
    }
    const setFormatAmount = (amount: any) => {
        try {
            let isDecimal = amount.indexOf(".");
            if (isDecimal != -1) {
                // console.log(" decimal number =====    ");
                const split = amount.split(".");
                handleNewJobDataChange(Intl.NumberFormat('en-US').format(split[0].replace(/[^a-zA-Z0-9 ]/g, '')) + "." + split[1].replace(/[^a-zA-Z0-9 ]/g, ''), null, "requestAmount")
            } else {
                handleNewJobDataChange(Intl.NumberFormat('en-US').format(amount.replace(/[^a-zA-Z0-9 ]/g, '')), null, "requestAmount");
            }
        } catch (error) {
        }
    }
    const saveJobDetail = () => {
        try {
            setOneOffJobData((prevState: any) => [
                ...prevState,
                {
                    key: prevState.length + 1, // Generate a unique key for each entry
                    arr: { ...NewOneOffJobData }
                }
            ]);
            if ('totAmount' in NewOneOffJobData && OneOffData.totAmount?.value != '') {
                let amount = parseFloat(OneOffData.totAmount?.value);
                let updateAmount = parseFloat(NewOneOffJobData.requestAmount?.value) + amount;
                console.log("");

                handleChange(updateAmount, null, "totAmount");
            } else {
                let newAmount = parseFloat(NewOneOffJobData.requestAmount?.value)
                console.log(" new amount ----   ", newAmount);

                handleChange(newAmount, null, "totAmount");
            }
            setNewOneOffJobData([]); // Reset NewOneOffJobData
            generateNo();
        } catch (error) {
        }
    };
    const checkMandetory = async () => {
        if (OneOffData.IOUType?.Id == 1 || OneOffData.IOUType?.Id == 2) {
            if ('SelectJobVehicle' in NewOneOffJobData && NewOneOffJobData.SelectJobVehicle?.Id != '' && NewOneOffJobData.SelectJobVehicle?.Id != null) {
                if ('ExpenseType' in NewOneOffJobData && NewOneOffJobData.ExpenseType?.Id != '' && NewOneOffJobData.ExpenseType?.Id != null) {
                    if ('requestAmount' in NewOneOffJobData && NewOneOffJobData.requestAmount?.value != '' && NewOneOffJobData.requestAmount?.value != null) {
                        if (NewOneOffJobData.requestAmount?.value != 0 && NewOneOffJobData.requestAmount?.value != 0.0 && NewOneOffJobData.requestAmount?.value != 'NaN') {
                            if ('GLAccount' in NewOneOffJobData && NewOneOffJobData.GLAccount?.value != '' && NewOneOffJobData.GLAccount?.value != null) {
                                //save
                                saveJobDetail();
                            } else { // No Account
                                await alert({
                                    type: DropdownAlertType.Error,
                                    title: 'Error',
                                    message: 'Account No is required',
                                });
                            }
                        } else { // invalid amount
                            await alert({
                                type: DropdownAlertType.Error,
                                title: 'Error',
                                message: 'Please Enter Valid Request Amount',
                            });
                        }
                    } else { //No Amount 
                        await alert({
                            type: DropdownAlertType.Error,
                            title: 'Error',
                            message: 'Please Enter Request Amount',
                        });
                    }
                } else { // No expense Type
                    await alert({
                        type: DropdownAlertType.Error,
                        title: 'Error',
                        message: 'Please Select Expense Type',
                    });
                }
            } else {
                if (OneOffData.IOUType?.Id == 1) {
                    await alert({
                        type: DropdownAlertType.Error,
                        title: 'Error',
                        message: 'Please Select Job No',
                    });
                } else if (OneOffData.IOUType?.Id == 2) {
                    await alert({
                        type: DropdownAlertType.Error,
                        title: 'Error',
                        message: 'Please Select Vehicle',
                    });
                }
            }
        } else {
            if ('ExpenseType' in NewOneOffJobData && NewOneOffJobData.ExpenseType?.Id != '' && NewOneOffJobData.ExpenseType?.Id != null) {
                if ('requestAmount' in NewOneOffJobData && NewOneOffJobData.requestAmount?.value != '' && NewOneOffJobData.requestAmount?.value != null) {
                    if (NewOneOffJobData.requestAmount?.value != 0 && NewOneOffJobData.requestAmount?.value != 0.0 && NewOneOffJobData.requestAmount?.value != 'NaN') {
                        if ('GLAccount' in NewOneOffJobData && NewOneOffJobData.GLAccount?.value != '' && NewOneOffJobData.GLAccount?.value != null) {
                            //save
                            saveJobDetail();
                        } else { // No Account
                            await alert({
                                type: DropdownAlertType.Error,
                                title: 'Error',
                                message: 'Account No is required',
                            });
                        }
                    } else { // invalid amount
                        await alert({
                            type: DropdownAlertType.Error,
                            title: 'Error',
                            message: 'Please Enter Valid Request Amount',
                        });
                    }
                } else { //No Amount 
                    await alert({
                        type: DropdownAlertType.Error,
                        title: 'Error',
                        message: 'Please Enter Request Amount',
                    });
                }
            } else { // No expense Type
                await alert({
                    type: DropdownAlertType.Error,
                    title: 'Error',
                    message: 'Please Select Expense Type',
                });
            }
        }
    }
    const cancel = () => {
        Alert.alert('Cancel !', 'Are you sure you want to cancel and Go Back ?', [
            {
                text: 'No',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            { text: 'Yes', onPress: (back) },
        ]);
    }
    const generateNo = () => {
        try {
            generateReferenceNo("job", (ID: any) => {
                handleChange(ID, null, "jobNo");
            });
        } catch (error) {
        }
    }
    useEffect(() => {
        if (route.params?.OneOffAttachmentSet) {
            setOneOffAttachments(route.params.OneOffAttachmentSet);
        }
    }, [route.params?.OneOffAttachmentSet]);
    useEffect(() => {
        if (route.params?.OneOffJobdataSet) {
            setOneOffJobData(route.params.OneOffJobdataSet);
        }
    }, [route.params?.OneOffdataSet]);
    useEffect(() => {
        if (route.params?.OneOffdataSet) {
            setOneOffData(route.params.OneOffdataSet);
            if (route.params?.OneOffdataSet.IOUType?.Id == 1) {
                getJobNoByJobOwner(route.params?.OneOffdataSet.IOUType?.Id);
            }
            getVehicleNo();
            getExpenseTypes();
            generateNo();
        }
    }, [route.params?.OneOffdataSet]);
    return (
        <SafeAreaView style={ComStyles.CONTAINER}>
            <Header title="Add Details" isBtn={true} btnOnPress={naviBack} />
            <DropdownAlert alert={func => (alert = func)} alertPosition="top" />
            <ScrollView style={ComStyles.CONTENT} showsVerticalScrollIndicator={false}>
                {
                    OneOffData.IOUType?.Id == 1 || OneOffData.IOUType?.Id == 2 ?
                        // isJob ?
                        <View>
                            <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                <Text style={style.bodyTextLeft}>
                                    {OneOffData.IOUType?.Id == 1 ? "Select Job*" : "Select Vehicle*"}
                                </Text>
                            </View>
                            <Dropdown
                                style={[
                                    style.dropdown,
                                    isFocus && { borderColor: ComStyles.COLORS.BORDER_COLOR },
                                ]}
                                itemTextStyle={{ color: ComStyles.COLORS.BLACK, }}
                                placeholderStyle={style.placeholderStyle}
                                selectedTextStyle={style.selectedTextStyle}
                                inputSearchStyle={style.inputSearchStyle}
                                iconStyle={style.iconStyle}
                                data={OneOffData.IOUType?.Id == "1" ? Job_NoList : Vehicle_NoList}
                                search
                                autoScroll={false}
                                maxHeight={300}
                                labelField={OneOffData.IOUType?.Id == "1" ? "Job_No" : "Vehicle_No"}
                                valueField={OneOffData.IOUType?.Id == "1" ? "Job_No" : "Vehicle_No"}
                                placeholder={!isFocus ? OneOffData.IOUTypeName?.value : '...'}
                                searchPlaceholder={OneOffData.IOUType?.Id == 1 ? "Select Job" : "Select Vehicle"}
                                value={NewOneOffJobData.SelectJobVehicle?.Id}
                                onFocus={() => setIsFocus(true)}
                                onBlur={() => setIsFocus(false)}
                                onChange={item => {
                                    if (OneOffData.IOUType?.Id == "1") {
                                        const name = item.Job_No + "";
                                        const no = name.split("-");
                                        console.log(" job no === ", no[0].trim());
                                        handleNewJobDataChange(no[0].trim(), item.Job_No, "SelectJobVehicle")
                                        // setSelecteJoborVehicle(no[0].trim());
                                        // setselectJOBVehicleNo(item.Job_No);
                                        getGL_AccNo(1, 0);
                                        handleNewJobDataChange(true, null, "AccDisable")
                                        getCostCenter(item.DocEntry);
                                    } else {
                                        handleNewJobDataChange(item.Vehicle_No, item.Vehicle_No, "SelectJobVehicle")
                                        // setSelecteJoborVehicle(item.Vehicle_No);
                                        // setselectJOBVehicleNo(item.Vehicle_No);
                                        handleNewJobDataChange(true, null, "AccDisable")
                                        get_ASYNC_COST_CENTER().then(async res => {
                                            handleNewJobDataChange(res, null, "CostCenter")
                                        });
                                        handleNewJobDataChange(item.Vehicle_No, null, "Resource")
                                    }
                                    setIsFocus(false);
                                }}
                                renderLeftIcon={() => (
                                    <AntDesign
                                        style={style.icon}
                                        color={isFocus ? 'blue' : 'black'}
                                        name="Safety"
                                        size={15}
                                    />
                                )}
                            />
                        </View>
                        :
                        <></>
                }
                <View style={{ flexDirection: 'row' }}>
                    <Text style={style.bodyTextLeft}>
                        Expense Type*
                    </Text>
                </View>
                <Dropdown
                    style={[
                        style.dropdown,
                        isFocus && { borderColor: ComStyles.COLORS.BORDER_COLOR },
                    ]}
                    itemTextStyle={{ color: ComStyles.COLORS.BLACK, }}
                    placeholderStyle={style.placeholderStyle}
                    selectedTextStyle={style.selectedTextStyle}
                    inputSearchStyle={style.inputSearchStyle}
                    iconStyle={style.iconStyle}
                    data={ExpenseTypeList}
                    search
                    autoScroll={false}
                    maxHeight={300}
                    labelField="Description"
                    valueField="Description"
                    placeholder={!isFocus ? 'Expense Type* ' : '...'}
                    searchPlaceholder="Search Type"
                    value={NewOneOffJobData.ExpenseType?.value}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                    onChange={item => {
                        handleNewJobDataChange(item.Description, item.ExpType_ID, "ExpenseType")
                        if (OneOffData.IOUType?.Id == "2") {
                            getGL_AccNo(2, item.ExpType_ID);
                        } else if (OneOffData.IOUType?.Id == "3") {
                            getGL_AccNo(3, item.ExpType_ID);
                        }
                        setIsFocus(false);
                    }}
                    renderLeftIcon={() => (
                        <AntDesign
                            style={style.icon}
                            color={isFocus ? 'blue' : 'black'}
                            name="Safety"
                            size={15}
                        />
                    )}
                />
                <View style={{ flexDirection: 'row' }}>
                    <Text style={style.bodyTextLeft}>
                        Requested amount*
                    </Text>
                </View>
                <InputText
                    placeholderColor={ComStyles.COLORS.PROCEED_ASH}
                    placeholder="Requested amount(LKR)*"
                    keyType='decimal-pad'
                    returnKeyType='done'
                    stateValue={NewOneOffJobData.requestAmount?.value || ""}
                    editable={true}
                    setState={(val: any) => setFormatAmount(val)}
                    style={ComStyles.IOUInput}
                />
                <View style={{ flexDirection: 'row' }}>
                    <Text style={style.bodyTextLeft}>
                        Remark
                    </Text>
                </View>
                <InputText
                    placeholderColor={ComStyles.COLORS.PROCEED_ASH}
                    placeholder="Remarks"
                    stateValue={NewOneOffJobData.remark?.value || ""}
                    max={30}
                    setState={(val: any) => handleNewJobDataChange(val, null, "remark")}
                    editable={true}
                    style={ComStyles.IOUInput}
                />
                <View style={{ flexDirection: 'row' }}>
                    <Text style={style.bodyTextLeft}>
                        Account No*
                    </Text>
                </View>
                <InputText
                    placeholderColor={ComStyles.COLORS.PROCEED_ASH}
                    placeholder="Account No*"
                    stateValue={NewOneOffJobData.GLAccount?.value || ""}
                    editable={false}
                    style={ComStyles.IOUInput}
                />
                <View style={{ flexDirection: 'row' }}>
                    <Text style={style.bodyTextLeft}>
                        Cost Center
                    </Text>
                </View>
                <InputText
                    placeholderColor={ComStyles.COLORS.PROCEED_ASH}
                    placeholder="Cost Center"
                    stateValue={NewOneOffJobData.CostCenter?.value || ""}
                    editable={false}
                    style={ComStyles.IOUInput}
                />
                <View style={{ flexDirection: 'row' }}>
                    <Text style={style.bodyTextLeft}>
                        Resource
                    </Text>
                </View>
                <Dropdown
                    style={[
                        style.dropdown,
                        isFocus && { borderColor: ComStyles.COLORS.BORDER_COLOR },
                    ]}
                    itemTextStyle={{ color: ComStyles.COLORS.BLACK, }}
                    placeholderStyle={style.placeholderStyle}
                    selectedTextStyle={style.selectedTextStyle}
                    inputSearchStyle={style.inputSearchStyle}
                    iconStyle={style.iconStyle}
                    data={Vehicle_NoList}
                    search
                    autoScroll={false}
                    maxHeight={300}
                    labelField={"Vehicle_No"}
                    valueField={"Vehicle_No"}
                    placeholder={!isFocus ? "Resource" : '...'}
                    searchPlaceholder="Search Resource"
                    value={NewOneOffJobData.Resource?.value || ""}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                    onChange={item => {
                        handleNewJobDataChange(item.Vehicle_No, null, "Resource")
                        setIsFocus(false);
                    }}
                    renderLeftIcon={() => (
                        <AntDesign
                            style={style.icon}
                            color={isFocus ? 'blue' : 'black'}
                            name="Safety"
                            size={15}
                        />
                    )}
                />
            </ScrollView>
            <View style={{ flexDirection: 'row', marginBottom: 5, alignContent: 'center' }}>
                <ActionButton
                    title="Add"
                    styletouchable={{ width: '49%', marginLeft: 5 }}
                    onPress={() => checkMandetory()}
                />
                <ActionButton
                    title="Cancel"
                    styletouchable={{ width: '48%', marginLeft: 5 }}
                    style={{ backgroundColor: ComStyles.COLORS.RED_COLOR }}
                    onPress={() => cancel()}
                />
            </View>
        </SafeAreaView>
    );
}
export default AddOneOffDetailScreen;