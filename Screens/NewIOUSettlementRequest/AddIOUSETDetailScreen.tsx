import { Alert, SafeAreaView, ScrollView, Text, View } from "react-native";
import ComponentsStyles from "../../Constant/Components.styles";
import Header from "../../Components/Header";
import DropdownAlert, { DropdownAlertData, DropdownAlertType } from "react-native-dropdownalert";
import { useEffect, useState } from "react";
import ComStyles from "../../Constant/Components.styles";
import { Dropdown } from "react-native-element-dropdown";
import style from './IOUSetStyle';
import { getVehicleNoAll } from "../../SQLiteDBAction/Controllers/VehicleNoController";
import { getCostCenterByJobNo, getJobNOByOwners } from "../../SQLiteDBAction/Controllers/JobNoController";
import { getExpenseTypeAll } from "../../SQLiteDBAction/Controllers/ExpenseTypeController";
import { getGLAccNo } from "../../SQLiteDBAction/Controllers/GLAccountController";
import { get_ASYNC_COST_CENTER } from "../../Constant/AsynStorageFuntion";
import AntDesign from 'react-native-vector-icons/AntDesign';
import ActionButton from "../../Components/ActionButton";
import InputText from "../../Components/InputText";
import { generateReferenceNo } from "../../Constant/IDGenerator";
let alert = (_data: DropdownAlertData) => new Promise<DropdownAlertData>(res => res);
const AddIOUSETDetailScreen = (props: any) => {
    const { navigation, route } = props;
    const [IOUSettlementData, setIOUSettlementData] = useState(route.params?.iouSetdataSet || {});
    const [IOUSettlementJobData, setIOUSettlementJobData] = useState(route.params?.IOUSetJobdataSet || []);
    const [IOUSettlementAttachments, setIOUSettlementAttachments] = useState(route.params?.IOUSetAttachmentSet || []);
    const [NewIOUSETJobData, setNewIOUSETJobData]: any[] = useState({});
    const [isFocus, setIsFocus] = useState(false);
    const [Job_NoList, setJob_NoList] = useState([]);
    const [Vehicle_NoList, setVehicle_NoList] = useState([]);
    const [ExpenseTypeList, setExpenseTypeList] = useState([]);
    const back = () => {
        navigation.navigate('CreateNewIOUSettlementScreen', { iouSetdataSet: IOUSettlementData, IOUSetJobdataSet: IOUSettlementJobData, IOUSetAttachmentSet: IOUSettlementAttachments });
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
    const handleNewJobDataChange = (value: any, Id: any, key: any) => {
        try {
            setNewIOUSETJobData((prevData: any) => ({
                ...prevData, [key]: { value, Id }
            }));
        } catch (error) {
        }
    }
    const handleChange = (value: any, Id: any, key: any) => {
        try {
            setIOUSettlementData((prevData: any) => ({
                ...prevData, [key]: { value, Id }
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
    const setFormatAmount = (amount: any) => {
        try {
            console.log("amount ------  ", amount);
            const parseAmount = (amount: any) => {
                if (!amount) return 0.0; // Default to 0.0 if the amount is empty or undefined
                const isDecimal = amount.indexOf(".") !== -1;
                if (isDecimal) {
                    const [integerPart, decimalPart] = amount.split(".");
                    return parseFloat(
                        (integerPart?.replaceAll(',', '') || '0') + "." + (decimalPart || '0')
                    );
                } else {
                    return parseFloat(amount.replaceAll(',', '') || '0');
                }
            };
           let finalAmount =  parseAmount(amount+"");
            if (route.params?.isEdit == 2) { //edited iou job
                handleNewJobDataChange(finalAmount, null, "settleAmount");
            }else{
                handleNewJobDataChange(finalAmount, null, "requestAmount");
                handleNewJobDataChange(finalAmount, null, "settleAmount");
            }
            // let isDecimal = amount.indexOf(".");
            // if (route.params?.isEdit == 2) { //edited iou job
            //     if (isDecimal != -1) {
            //         // console.log(" decimal number =====    ");
            //         const split = amount.split(".");
            //         handleNewJobDataChange(Intl.NumberFormat('en-US').format(split[0].replace(/[^a-zA-Z0-9 ]/g, '')) + "." + split[1].replace(/[^a-zA-Z0-9 ]/g, ''), null, "settleAmount")
            //     } else {
            //         handleNewJobDataChange(Intl.NumberFormat('en-US').format(amount.replace(/[^a-zA-Z0-9 ]/g, '')), null, "settleAmount");
            //     }
            // } else {
            //     if (isDecimal != -1) {
            //         // console.log(" decimal number =====    ");
            //         const split = amount.split(".");
            //         handleNewJobDataChange(Intl.NumberFormat('en-US').format(split[0].replace(/[^a-zA-Z0-9 ]/g, '')) + "." + split[1].replace(/[^a-zA-Z0-9 ]/g, ''), null, "requestAmount")
            //         handleNewJobDataChange(Intl.NumberFormat('en-US').format(split[0].replace(/[^a-zA-Z0-9 ]/g, '')) + "." + split[1].replace(/[^a-zA-Z0-9 ]/g, ''), null, "settleAmount")
            //     } else {
            //         handleNewJobDataChange(Intl.NumberFormat('en-US').format(amount.replace(/[^a-zA-Z0-9 ]/g, '')), null, "requestAmount");
            //         handleNewJobDataChange(Intl.NumberFormat('en-US').format(amount.replace(/[^a-zA-Z0-9 ]/g, '')), null, "settleAmount");
            //     }
            // }

        } catch (error) {
            console.log("error amount format");

        }
    }
    const getVehicleNo = () => {
        getVehicleNoAll((resp: any) => {
            //console.log("Vehicle No............", resp);
            setVehicle_NoList(resp);
        })
    }
    const getJobNoByJobOwner = (ID: any) => {
        getJobNOByOwners(IOUSettlementData.JobOwnerEPF?.value, (res: any) => {
            setJob_NoList(res);
        });
    }
    const getExpenseTypes = () => {
        getExpenseTypeAll((result: any) => {
            setExpenseTypeList(result);
        });
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
    const getJobDataFromKey = (jKey: any) => {
        try {
            const foundObject = IOUSettlementJobData.find((item: any) => item.key === jKey);
            console.log("found ==  ", foundObject);
            if (foundObject.arr.IOU_TYPEID == 2) {
                handleNewJobDataChange(foundObject.arr.Resource, foundObject.arr.Resource, "SelectJobVehicle")
            } else {
                handleNewJobDataChange(foundObject.arr.IOUTypeNo, foundObject.arr.IOUTypeNo, "SelectJobVehicle")
            }
            handleNewJobDataChange(foundObject.arr.CostCenter, null, "CostCenter")
            handleNewJobDataChange(foundObject.arr.Resource, null, "Resource")
            handleNewJobDataChange(foundObject.arr.ExpenseType, foundObject.arr.ExpenseTypeID, "ExpenseType")
            handleNewJobDataChange(foundObject.arr.RequestedAmount+"", null, "requestAmount")
            handleNewJobDataChange(foundObject.arr.Amount+"", null, "settleAmount")
            handleNewJobDataChange(foundObject.arr.Remark, null, "remark")
            handleNewJobDataChange(foundObject.arr.AccNo, null, "GLAccount")
            handleNewJobDataChange(foundObject.arr.IsDelete, null, "isDelete")
        } catch (error) {
            console.log("catch update error");
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
            const arr =
            {
                Job_ID: IOUSettlementData.jobNo?.value,
                IOUTypeNo: NewIOUSETJobData.SelectJobVehicle?.value || '',
                JobOwner_ID: IOUSettlementData.JobOwner?.Id,
                AccNo: NewIOUSETJobData.GLAccount?.value,
                CostCenter: NewIOUSETJobData.CostCenter?.value,
                Resource: NewIOUSETJobData.Resource?.value || "",
                ExpenseType: NewIOUSETJobData.ExpenseType?.value,
                ExpenseTypeID: NewIOUSETJobData.ExpenseType?.Id,
                Amount: NewIOUSETJobData.requestAmount?.value,
                Remark: NewIOUSETJobData.remark?.value || "",
                RequestedBy: IOUSettlementData.UserID?.value,
                RequestedAmount: NewIOUSETJobData.requestAmount?.value,
                IOU_TYPEID: IOUSettlementData.IOUType?.Id,
                IsDelete: true
            }
            setIOUSettlementJobData((prevState: any) => {
                // Calculate the maximum key in the existing array
                const maxKey = prevState.reduce((max: number, item: any) => Math.max(max, item.key), 0);
                return [
                    ...prevState,
                    {
                        key: maxKey + 1, // Set key as max key + 1
                        arr: { ...arr }
                    }
                ];
            });
            showSuccessAlert('Success', 'Detail Added Successfully...');
            if ('totAmount' in IOUSettlementData && IOUSettlementData.totAmount?.value != '') {
                let amount = parseFloat(IOUSettlementData.totAmount?.value);
                let updateAmount = parseFloat(NewIOUSETJobData.requestAmount?.value) + amount;
                handleChange(updateAmount, null, "totAmount");
            } else {
                let newAmount = parseFloat(NewIOUSETJobData.requestAmount?.value)
                console.log(" new amount ----   ", newAmount);
                handleChange(newAmount, null, "totAmount");
            }
            setNewIOUSETJobData([]); // Reset NewIOUJobData
            generateNo();
        } catch (error) {
        }
    };
    const UpdateDetail = () => {
        const arr =
        {
            Job_ID: IOUSettlementData.jobNo?.value || '',
            IOUTypeNo: NewIOUSETJobData.SelectJobVehicle?.value || '',
            JobOwner_ID: IOUSettlementData.JobOwner?.Id,
            AccNo: NewIOUSETJobData.GLAccount?.value,
            CostCenter: NewIOUSETJobData.CostCenter?.value,
            Resource: NewIOUSETJobData.Resource?.value || "",
            ExpenseType: NewIOUSETJobData.ExpenseType?.value,
            ExpenseTypeID: NewIOUSETJobData.ExpenseType?.Id,
            Amount: NewIOUSETJobData.settleAmount?.value || NewIOUSETJobData.requestAmount?.value,
            Remark: NewIOUSETJobData.remark?.value || "",
            RequestedBy: IOUSettlementData.UserID?.value,
            RequestedAmount: NewIOUSETJobData.requestAmount?.value,
            IOU_TYPEID: IOUSettlementData.IOUType?.Id,
            IsDelete: NewIOUSETJobData.isDelete?.value
        }
        setIOUSettlementJobData((prevState: any) =>
            prevState.map((item: any) =>
                item.key === route.params?.jobKey
                    ? { ...item, arr } // Update the relevant entry
                    : item // Leave other entries unchanged
            )
        );
        showSuccessAlert('Success', 'Detail Updated Successfully...');
        if (route.params?.isEdit == 2) { // edited iou added detail
            let amount = parseFloat(IOUSettlementData.totAmount?.value);
            let updateAmount = amount - parseFloat(NewIOUSETJobData.requestAmount?.value) + parseFloat(NewIOUSETJobData.settleAmount?.value);
            handleChange(updateAmount, null, "totAmount");
        } else { // edited newly added detail
            if ('totAmount' in IOUSettlementData && IOUSettlementData.totAmount?.value != '') {
                let amount = parseFloat(IOUSettlementData.totAmount?.value);
                let updateAmount = parseFloat(NewIOUSETJobData.requestAmount?.value) + amount;
                handleChange(updateAmount, null, "totAmount");
            } else {
                let newAmount = parseFloat(NewIOUSETJobData.requestAmount?.value)
                handleChange(newAmount, null, "totAmount");
            }
        }
        setNewIOUSETJobData([]); // Reset NewIOUJobData
    }
    const checkMandetory = async () => {
        if (IOUSettlementData.IOUType?.Id == 1 || IOUSettlementData.IOUType?.Id == 2) {
            if ('SelectJobVehicle' in NewIOUSETJobData && NewIOUSETJobData.SelectJobVehicle?.Id != '' && NewIOUSETJobData.SelectJobVehicle?.Id != null) {
                if ('ExpenseType' in NewIOUSETJobData && NewIOUSETJobData.ExpenseType?.Id != '' && NewIOUSETJobData.ExpenseType?.Id != null) {
                    if ('requestAmount' in NewIOUSETJobData && NewIOUSETJobData.requestAmount?.value != '' && NewIOUSETJobData.requestAmount?.value != null) {
                        if (NewIOUSETJobData.requestAmount?.value != 0 && NewIOUSETJobData.requestAmount?.value != 0.0 && NewIOUSETJobData.requestAmount?.value != 'NaN') {
                            if ('GLAccount' in NewIOUSETJobData && NewIOUSETJobData.GLAccount?.value != '' && NewIOUSETJobData.GLAccount?.value != null) {
                                //save
                                if (route.params?.isEdit == 0) {
                                    saveJobDetail();
                                } else {
                                    UpdateDetail();
                                }
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
                if (IOUSettlementData.IOUType?.Id == 1) {
                    showErrorAlert('Error', 'Please Select Job No');
                } else if (IOUSettlementData.IOUType?.Id == 2) {
                    showErrorAlert('Error', 'Please Select Vehicle');
                }
            }
        } else {
            if ('ExpenseType' in NewIOUSETJobData && NewIOUSETJobData.ExpenseType?.Id != '' && NewIOUSETJobData.ExpenseType?.Id != null) {
                if ('requestAmount' in NewIOUSETJobData && NewIOUSETJobData.requestAmount?.value != '' && NewIOUSETJobData.requestAmount?.value != null) {
                    if (NewIOUSETJobData.requestAmount?.value != 0 && NewIOUSETJobData.requestAmount?.value != 0.0 && NewIOUSETJobData.requestAmount?.value != 'NaN') {
                        if ('GLAccount' in NewIOUSETJobData && NewIOUSETJobData.GLAccount?.value != '' && NewIOUSETJobData.GLAccount?.value != null) {
                            //save
                            if (route.params?.isEdit == 0) {
                                saveJobDetail();
                            } else {
                                UpdateDetail();
                            }
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
    useEffect(() => {
        if (route.params?.IOUSetAttachmentSet) {
            setIOUSettlementAttachments(route.params.IOUSetAttachmentSet);
        }
    }, [route.params?.IOUSetAttachmentSet]);
    useEffect(() => {
        if (route.params?.IOUSetJobdataSet) {
            // console.log(" job data ............. >>>>>>>>>>>>>>>> ", route.params?.IOUSetJobdataSet);
            setIOUSettlementJobData(route.params.IOUSetJobdataSet);
        }
    }, [route.params?.IOUSetJobdataSet]);
    useEffect(() => {
        if (route.params?.iouSetdataSet) {
            setIOUSettlementData(route.params.iouSetdataSet);
            if (route.params?.iouSetdataSet.IOUType?.Id == 1) {
                getJobNoByJobOwner(route.params?.iouSetdataSet.IOUType?.Id);
            }
            getVehicleNo();
            getExpenseTypes();
            generateNo();
            if (route.params?.isEdit == 0) { // new job create 
              
            } else {
                getJobDataFromKey(route.params?.jobKey);
            }
        }
    }, [route.params?.iouSetdataSet]);
    return (
        <SafeAreaView style={ComponentsStyles.CONTAINER}>
            <Header title={route.params?.isEdit == 0 ? "Add Details" : "Update Details"} isBtn={true} btnOnPress={naviBack} />
            <DropdownAlert alert={func => (alert = func)} alertPosition="top" />
            <ScrollView style={ComStyles.CONTENT} showsVerticalScrollIndicator={false}>
                {
                    IOUSettlementData.IOUType?.Id == 1 || IOUSettlementData.IOUType?.Id == 2 ?
                        // isJob ?
                        <View>
                            <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                <Text style={style.bodyTextLeft}>
                                    {IOUSettlementData.IOUType?.Id == 1 ? "Select Job*" : "Select Vehicle*"}
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
                                data={IOUSettlementData.IOUType?.Id == "1" ? Job_NoList : Vehicle_NoList}
                                search
                                autoScroll={false}
                                maxHeight={300}
                                disable={route.params?.isEdit == 2 ? true : false}
                                labelField={IOUSettlementData.IOUType?.Id == "1" ? "Job_No" : "Vehicle_No"}
                                valueField={IOUSettlementData.IOUType?.Id == "1" ? "Job_No" : "Vehicle_No"}
                                placeholder={!isFocus ? IOUSettlementData.IOUTypeName?.value : '...'}
                                searchPlaceholder={IOUSettlementData.IOUType?.Id == 1 ? "Select Job" : "Select Vehicle"}
                                value={NewIOUSETJobData.SelectJobVehicle?.Id}
                                onFocus={() => setIsFocus(true)}
                                onBlur={() => setIsFocus(false)}
                                onChange={item => {
                                    if (IOUSettlementData.IOUType?.Id == "1") {
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
                    disable={route.params?.isEdit == 2 ? true : false}
                    labelField="Description"
                    valueField="Description"
                    placeholder={!isFocus ? 'Expense Type* ' : '...'}
                    searchPlaceholder="Search Type"
                    value={NewIOUSETJobData.ExpenseType?.value}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                    onChange={item => {
                        handleNewJobDataChange(item.Description, item.ExpType_ID, "ExpenseType")
                        if (IOUSettlementData.IOUType?.Id == "2") {
                            getGL_AccNo(2, item.ExpType_ID);
                        } else if (IOUSettlementData.IOUType?.Id == "3") {
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
                        {route.params?.isEdit == 2 ? 'Settlement Amount*' : 'Requested amount*'}
                    </Text>
                </View>
                <InputText
                    placeholderColor={ComStyles.COLORS.PROCEED_ASH}
                    placeholder={route.params?.isEdit == 2 ? "Settlement Amount(LKR)*" : "Requested amount(LKR)*"}
                    keyType='decimal-pad'
                    returnKeyType='done'
                    stateValue={route.params?.isEdit == 2 ? NewIOUSETJobData?.settleAmount?.value  || '' : NewIOUSETJobData?.requestAmount?.value || ''}
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
                    stateValue={NewIOUSETJobData.remark?.value || ""}
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
                    stateValue={NewIOUSETJobData.GLAccount?.value || ""}
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
                    stateValue={NewIOUSETJobData.CostCenter?.value || ""}
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
                    disable={IOUSettlementData.IOUType?.Id == 2 ? true : route.params?.isEdit == 2 ? true : false}
                    value={NewIOUSETJobData.Resource?.value || ""}
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
                    title={route.params?.isEdit == 0 ? "Add" : "Update"}
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
export default AddIOUSETDetailScreen;