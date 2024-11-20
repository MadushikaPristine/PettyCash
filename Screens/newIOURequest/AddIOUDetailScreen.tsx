import { Alert, SafeAreaView, ScrollView, Text, View } from "react-native";
import ComponentsStyles from "../../Constant/Components.styles";
import DropdownAlert, { DropdownAlertData, DropdownAlertType } from "react-native-dropdownalert";
import Header from "../../Components/Header";
import { useState } from "react";
import moment from "moment";
import ComStyles from "../../Constant/Components.styles";
import style from './IOUStyle';
import { Dropdown } from "react-native-element-dropdown";
import InputText from "../../Components/InputText";
import ActionButton from "../../Components/ActionButton";
import AntDesign from 'react-native-vector-icons/AntDesign';
import { getCostCenterByJobNo } from "../../SQLiteDBAction/Controllers/JobNoController";
import { getGLAccNo } from "../../SQLiteDBAction/Controllers/GLAccountController";
import { get_ASYNC_COST_CENTER } from "../../Constant/AsynStorageFuntion";
import { generateReferenceNo } from "../../Constant/IDGenerator";
let alert = (_data: DropdownAlertData) => new Promise<DropdownAlertData>(res => res);
const AddIOUDetailScreen = (props: any) => {
    const { navigation, route } = props;
    const [IOUData, setIOUData] = useState(route.params?.ioudataSet || {});
    const [IOUJobData, setIOUJobData] = useState(route.params?.IOUJobdataSet || []);
    const [IOUAttachments, setIOUAttachments] = useState(route.params?.IOUAttachmentSet || []);
    const [NewIOUJobData, setNewIOUJobData]: any[] = useState({});
    var currentDate = moment(new Date()).utcOffset('+05:30').format('YYYY-MM-DD');
    const [isFocus, setIsFocus] = useState(false);
    const [Job_NoList, setJob_NoList] = useState([]);
    const [Vehicle_NoList, setVehicle_NoList] = useState([]);
    const [ExpenseTypeList, setExpenseTypeList] = useState([]);
    const back = () => {
        navigation.navigate('CreateNewIOUScreen', { ioudataSet: IOUData, IOUJobdataSet: IOUJobData, IOUAttachmentSet: IOUAttachments });
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
    const showErrorAlert = async (title: any, message: any) => {
        await alert({
            type: DropdownAlertType.Error,
            title: title,
            message,
        });
    };
    const showSuccessAlert = async (title: any, message: any) => {
        await alert({
            type: DropdownAlertType.Success,
            title: title,
            message,
        });
    };
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
    const handleNewJobDataChange = (value: any, Id: any, key: any) => {
        try {
            setNewIOUJobData((prevData: any) => ({
                ...prevData, [key]: { value, Id }
            }));
        } catch (error) {
        }
    }
    const handleChange = (value: any, Id: any, key: any) => {
        try {
            setIOUData((prevData: any) => ({
                ...prevData, [key]: { value, Id }
            }));
        } catch (error) {
        }
    }
    const generateNo = () => {
        try {
            generateReferenceNo("job", (ID: any) => {
                handleChange(ID, null, "jobNo");
            });
        } catch (error) {
        }
    }
    const saveJobDetail = () => {
        try {
            setIOUJobData((prevState: any) => [
                ...prevState,
                {
                    key: prevState.length + 1, // Generate a unique key for each entry
                    arr: { ...NewIOUJobData }
                }
            ]);
            if ('totAmount' in NewIOUJobData && IOUData.totAmount?.value != '') {
                let amount = parseFloat(IOUData.totAmount?.value);
                let updateAmount = parseFloat(NewIOUJobData.requestAmount?.value) + amount;
                console.log("");

                handleChange(updateAmount, null, "totAmount");
            } else {
                let newAmount = parseFloat(NewIOUJobData.requestAmount?.value)
                console.log(" new amount ----   ", newAmount);

                handleChange(newAmount, null, "totAmount");
            }
            setNewIOUJobData([]); // Reset NewIOUJobData
            generateNo();
        } catch (error) {
        }
    };
    const checkMandetory = async () => {
        if (IOUData.IOUType?.Id == 1 || IOUData.IOUType?.Id == 2) {
            if ('SelectJobVehicle' in NewIOUJobData && NewIOUJobData.SelectJobVehicle?.Id != '' && NewIOUJobData.SelectJobVehicle?.Id != null) {
                if ('ExpenseType' in NewIOUJobData && NewIOUJobData.ExpenseType?.Id != '' && NewIOUJobData.ExpenseType?.Id != null) {
                    if ('requestAmount' in NewIOUJobData && NewIOUJobData.requestAmount?.value != '' && NewIOUJobData.requestAmount?.value != null) {
                        if (NewIOUJobData.requestAmount?.value != 0 && NewIOUJobData.requestAmount?.value != 0.0 && NewIOUJobData.requestAmount?.value != 'NaN') {
                            if ('GLAccount' in NewIOUJobData && NewIOUJobData.GLAccount?.value != '' && NewIOUJobData.GLAccount?.value != null) {
                                //save
                                saveJobDetail();
                            } else { // No Account
                                showErrorAlert('Error', 'Account No is required');
                            }
                        } else { // invalid amount
                            showErrorAlert('Error', 'Please Enter Valid Request Amount');
                        }
                    } else { //No Amount 
                        showErrorAlert('Error', 'Please Enter Request Amount');
                    }
                } else { // No expense Type
                    showErrorAlert('Error', 'Please Select Expense Type');
                }
            } else {
                if (IOUData.IOUType?.Id == 1) {
                    showErrorAlert('Error', 'Please Select Job No');
                } else if (IOUData.IOUType?.Id == 2) {
                    showErrorAlert('Error', 'Please Select Vehicle');
                }
            }
        } else {
            if ('ExpenseType' in NewIOUJobData && NewIOUJobData.ExpenseType?.Id != '' && NewIOUJobData.ExpenseType?.Id != null) {
                if ('requestAmount' in NewIOUJobData && NewIOUJobData.requestAmount?.value != '' && NewIOUJobData.requestAmount?.value != null) {
                    if (NewIOUJobData.requestAmount?.value != 0 && NewIOUJobData.requestAmount?.value != 0.0 && NewIOUJobData.requestAmount?.value != 'NaN') {
                        if ('GLAccount' in NewIOUJobData && NewIOUJobData.GLAccount?.value != '' && NewIOUJobData.GLAccount?.value != null) {
                            //save
                            saveJobDetail();
                        } else { // No Account
                            showErrorAlert('Error', 'Account No is required');
                        }
                    } else { // invalid amount
                        showErrorAlert('Error', 'Please Enter Valid Request Amount');
                    }
                } else { //No Amount 
                    showErrorAlert('Error', 'Please Enter Request Amount');
                }
            } else { // No expense Type
                showErrorAlert('Error', 'Please Select Expense Type');
            }
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
    return (
        <SafeAreaView style={ComponentsStyles.CONTAINER}>
            <Header title="Add Details" isBtn={true} btnOnPress={naviBack} />
            <DropdownAlert alert={func => (alert = func)} alertPosition="top" />
            <ScrollView style={ComStyles.CONTENT} showsVerticalScrollIndicator={false}>
                {
                    IOUData.IOUType?.Id == 1 || IOUData.IOUType?.Id == 2 ?
                        // isJob ?
                        <View>
                            <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                <Text style={style.bodyTextLeft}>
                                    {IOUData.IOUType?.Id == 1 ? "Select Job*" : "Select Vehicle*"}
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
                                data={IOUData.IOUType?.Id == "1" ? Job_NoList : Vehicle_NoList}
                                search
                                autoScroll={false}
                                maxHeight={300}
                                labelField={IOUData.IOUType?.Id == "1" ? "Job_No" : "Vehicle_No"}
                                valueField={IOUData.IOUType?.Id == "1" ? "Job_No" : "Vehicle_No"}
                                placeholder={!isFocus ? IOUData.IOUTypeName?.value : '...'}
                                searchPlaceholder={IOUData.IOUType?.Id == 1 ? "Select Job" : "Select Vehicle"}
                                value={NewIOUJobData.SelectJobVehicle?.Id}
                                onFocus={() => setIsFocus(true)}
                                onBlur={() => setIsFocus(false)}
                                onChange={item => {
                                    if (IOUData.IOUType?.Id == "1") {
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
                    value={NewIOUJobData.ExpenseType?.value}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                    onChange={item => {
                        handleNewJobDataChange(item.Description, item.ExpType_ID, "ExpenseType")
                        if (IOUData.IOUType?.Id == "2") {
                            getGL_AccNo(2, item.ExpType_ID);
                        } else if (IOUData.IOUType?.Id == "3") {
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
                    stateValue={NewIOUJobData.requestAmount?.value || ""}
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
                    stateValue={NewIOUJobData.remark?.value || ""}
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
                    stateValue={NewIOUJobData.GLAccount?.value || ""}
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
                    stateValue={NewIOUJobData.CostCenter?.value || ""}
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
                    value={NewIOUJobData.Resource?.value || ""}
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
    )
}
export default AddIOUDetailScreen;