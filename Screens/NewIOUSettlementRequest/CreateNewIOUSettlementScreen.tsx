import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { Alert, Dimensions, FlatList, SafeAreaView, ScrollView, Text, View } from "react-native";
import DropdownAlert, { DropdownAlertData, DropdownAlertType } from "react-native-dropdownalert";
import AsyncStorageConstants from "../../Constant/AsyncStorageConstants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { generateReferenceNo } from "../../Constant/IDGenerator";
import { get_ASYNC_COST_CENTER, get_ASYNC_IsInprogress_IOUSET, getLoginUserID, getLoginUserName, getLoginUserRoll } from "../../Constant/AsynStorageFuntion";
import { useFocusEffect } from "@react-navigation/native";
import { getIOU, getIOUJobsListByID, getIOUJobsListForSellementsByID } from "../../SQLiteDBAction/Controllers/IOUController";
import style from './IOUSetStyle';
import DetailsBox from "../../Components/DetailsBox";
import ComponentsStyles from "../../Constant/Components.styles";
import ComStyles from "../../Constant/Components.styles";
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Dropdown } from "react-native-element-dropdown";
import { getEmployeeByID } from "../../SQLiteDBAction/Controllers/EmployeeController";
import Header from "../../Components/Header";
import { getJobOWnerDetails } from "../../SQLiteDBAction/Controllers/JobOwnerController";
import { getAllLoginUserDetails, getTransportOfficerDetails } from "../../SQLiteDBAction/Controllers/UserController";
import { getHODDetails, getLoggedUserHOD } from "../../SQLiteDBAction/Controllers/DepartmentController";
import { getJobNOByOwners } from "../../SQLiteDBAction/Controllers/JobNoController";
import InputText from "../../Components/InputText";
import ActionButton from "../../Components/ActionButton";
import NewJobsView from "../../Components/NewJobView";

let width = Dimensions.get("screen").width;
let alert = (_data: DropdownAlertData) => new Promise<DropdownAlertData>(res => res);
const CreateNewIOUSettlementScreen = (props: any) => {
    const { navigation, route } = props;
    const [IOUSettlementData, setIOUSettlementData] = useState(route.params?.iouSetdataSet || {});
    const [IOUSettlementJobData, setIOUSettlementJobData] = useState(route.params?.IOUSetJobdataSet || []);
    const [IOUSettlementAttachments, setIOUSettlementAttachments] = useState(route.params?.IOUSetAttachmentSet || []);
    var currentDate = moment(new Date()).utcOffset('+05:30').format('YYYY-MM-DD');
    const [isFocus, setIsFocus] = useState(false);
    const [IOUList, setIOUList] = useState([]);
    const [ioujoblist, setiouJobList] = useState([]);
    const back = async () => {
        setIOUSettlementData([]);
        await AsyncStorage.setItem(AsyncStorageConstants.ASYNC_STORAGE_Is_inprogressIOUSettlement, "false");
        navigation.navigate('Home');
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
    const handleChange = (value: any, Id: any, key: any) => {
        try {
            setIOUSettlementData((prevState: any) => ({
                ...prevState, [key]: { value, Id }
            }));
            // console.log("iou set data ========  " , IOUSettlementData);
        } catch (error) {
        }
    }
    const generateNo = () => {
        try {
            get_ASYNC_IsInprogress_IOUSET().then(res => {
                if (res == "true") {
                } else {
                    generateReferenceNo("IOUSET", (ID: any) => {
                        handleChange(ID, null, "IOUSetNo");
                    });
                }
            });
        } catch (error) {
        }
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
    const deleteDetail = async (keyR: any, amount: any) => {
        const newData = IOUSettlementJobData.filter((item: { key: any; }) => item.key !== keyR);
        setIOUSettlementJobData(newData);
        let amountTot = parseFloat(IOUSettlementData.totAmount?.value);
        let newAmnt = amountTot - parseFloat(amount);
        handleChange(newAmnt, null, "totAmount");
        showSuccessAlert('Success', 'Detail Deleted Successfully...');
    }
    const deletePermission = (key: any, amount: any) => {
        Alert.alert('Delete Data !', 'Are you sure delete detail ?', [
            {
                text: 'No',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            { text: 'Yes', onPress: () => deleteDetail(key, amount) },
        ]);
    }
    const gotoNextScreen = async () => {
        await AsyncStorage.setItem(AsyncStorageConstants.ASYNC_STORAGE_Is_inprogressIOUSettlement, "true");
        navigation.navigate('AddIOUSETDetailScreen', { iouSetdataSet: IOUSettlementData, IOUSetJobdataSet: IOUSettlementJobData, IOUSetAttachmentSet: IOUSettlementAttachments, isEdit: 0 });
    }
    const AddAttachments = async () => {
        await AsyncStorage.setItem(AsyncStorageConstants.ASYNC_STORAGE_Is_inprogressIOUSettlement, "true");
        navigation.navigate('AddAttatchmmentSettlement', { iouSetdataSet: IOUSettlementData, IOUSetJobdataSet: IOUSettlementJobData, IOUSetAttachmentSet: IOUSettlementAttachments });
    }
    const chechMandetory = async (type: any) => {
        if ('IOUNO' in IOUSettlementData && IOUSettlementData.IOUNO?.value != '' && IOUSettlementData.IOUNO?.value != null) {
            if (type == 1) {
                gotoNextScreen();
            } else {
                AddAttachments();
            }
        } else {
            showErrorAlert('Error', 'Please Select IOU Request');
        }
    }
    const getAllIOUNo = () => {
        setIOUList([]);
        getIOU((result1: any) => {
            setIOUList(result1);
        });
    }
    const getEmpDetails = (ID: any) => {
        try {
            getEmployeeByID(ID, (res: any) => {
                handleChange(res[0].EmpName, res[0].Emp_ID, "employee")
            });
        } catch (error) {
        }
    }
    const getIOUJobList = (IOUID: any) => {
        try {
            setIOUSettlementJobData([]);
            let totalAmount = 0.0;
            getIOUJobsListForSellementsByID(IOUID, (response: any) => {
                response.forEach((element: any , index:any) => {
                    totalAmount = totalAmount + parseFloat(element.Amount);
                    generateReferenceNo("job", (ID: any) => {
                        const arr =
                        {
                            Job_ID: ID,
                            IOUTypeNo: element.IOUTypeNo,
                            JobOwner_ID: element.JobOwner_ID,
                            AccNo: element.AccNo,
                            CostCenter: element.CostCenter,
                            Resource: element.Resource,
                            ExpenseType: element.ExpenseType,
                            ExpenseTypeID: element.ExpID,
                            Amount: element.Amount,
                            Remark: element.Remark,
                            RequestedBy: IOUSettlementData.UserID?.value,
                            RequestedAmount: element.Amount,
                            IOU_TYPEID: element.IOU_Type,
                            IsDelete: false,
                        }
                        setIOUSettlementJobData((prevState: any) => [
                            ...prevState,
                            {
                                key: prevState.length + 1, // Generate a unique key for each entry
                                arr: { ...arr }
                            }
                        ]);
                        if(index === response.length-1){
                            handleChange(totalAmount, null, "totAmount");
                        }
                    });
                })
            });
        } catch (error) {
        }
    }
    const editJobs = (key: any, type: any) => {
        navigation.navigate('AddIOUSETDetailScreen', { iouSetdataSet: IOUSettlementData, IOUSetJobdataSet: IOUSettlementJobData, IOUSetAttachmentSet: IOUSettlementAttachments, isEdit: type, jobKey: key });
    }
    const getJJobOwnerTransportHOD = (ID: any, type: any) => {
        // type = 1 - job owner / 2 - transport officer / 3 - hod
        console.log(" Owner ID ==  ", ID);
        if (type == 1) {
            //get job owners
            // console.log(" Owner ID ==  ", ID);
            getJobOWnerDetails(ID, (res: any) => {
                console.log(" response === ", res);
                handleChange(res[0].Name, res[0].ID, "JobOwner")
                handleChange(parseFloat(res[0].IOULimit), null, "IOULimit")
                handleChange(res[0].EPFNo, null, "JobOwnerEPF")
            });
        } else if (type == 2) {
            //get transport officer
            getTransportOfficerDetails(ID, (resp: any) => {
                console.log(" transport officer details ---  ", resp);
                handleChange(resp[0].Name, resp[0].ID, "JobOwner")
                handleChange(parseFloat(resp[0].IOULimit), null, "IOULimit")
            });
        } else {
            //get hod
            console.log(" HOD ID ===  ", ID);
            getHODDetails(ID, (rest: any) => {
                console.log(" hod details ---  ", rest);

                handleChange(rest[0].Name, rest[0].ID, "JobOwner")
            });
        }
    }
    const getInitialData = () => {
        try {
            getLoginUserName().then(res => {
                handleChange(res, null, "UserName")
            });
            getLoginUserID().then(result => {
                handleChange(result, null, "UserID")
                getLoginUserRoll().then(res => {
                    handleChange(res, null, "UserRole")
                    getAllLoginUserDetails(result, (resp: any) => {
                        handleChange(resp[0].EPFNo, null, "EpfNo")
                        handleChange(parseFloat(resp[0].IOULimit), null, "RequesterLimit")
                        handleChange(parseFloat(resp[0].ReqLimit), null, "CreateRequestLimit")
                    });
                });
            })
            getLoggedUserHOD(async (resH: any) => {
                handleChange(resH[0].ID, null, "LoggerUserHOD")
            });
        } catch (error) {
        }
    }
    useEffect(() => {
        if (route.params?.IOUSetJobdataSet) {
            console.log(" job data array >>>>>>>>>>>>>>  ", route.params.IOUSetJobdataSet);

            setIOUSettlementJobData(route.params.IOUSetJobdataSet);
        }
    }, [route.params?.IOUSetJobdataSet]);
    useEffect(() => {
        if (route.params?.iouSetdataSet) {
            setIOUSettlementData(route.params.iouSetdataSet);
        }
    }, [route.params?.iouSetdataSet]);
    useEffect(() => {
        if (route.params?.IOUSetAttachmentSet) {
            setIOUSettlementAttachments(route.params.IOUSetAttachmentSet);
        }
    }, [route.params?.IOUSetAttachmentSet]);
    useFocusEffect(
        useCallback(() => {
            generateNo();
            getInitialData();
            getAllIOUNo();
        }, [])
    );
    return (
        <SafeAreaView style={ComponentsStyles.CONTAINER}>
            <Header title="Add IOU Settlement" isBtn={true} btnOnPress={naviBack} />
            <DropdownAlert alert={func => (alert = func)} alertPosition="top" />
            <ScrollView style={ComStyles.CONTENT} showsVerticalScrollIndicator={false}>
                <View style={{ padding: 5 }} />
                <DetailsBox
                    reqNo={IOUSettlementData.IOUSetNo?.value}
                    empNo={IOUSettlementData.EpfNo?.value}
                    RequestBy={IOUSettlementData.UserName?.value}
                    Rdate={currentDate}
                />
                <View>
                    <View style={{ flexDirection: 'row', marginTop: 15 }}>
                        <Text style={style.bodyTextLeft}>
                            Select IOU *
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
                        data={IOUList}
                        search
                        autoScroll={false}
                        maxHeight={300}
                        labelField="IOU_ID"
                        valueField="IOU_ID"
                        placeholder={!isFocus ? 'Select IOU ' : '...'}
                        searchPlaceholder="Search IOU"
                        value={IOUSettlementData.IOUNO?.value}
                        onFocus={() => setIsFocus(true)}
                        onBlur={() => setIsFocus(false)}
                        onChange={item => {
                            console.log(" select item ----------- ", item);
                            handleChange(null, item.IOU_Type, "IOUType")
                            handleChange(item.IOU_ID, item.ID, "IOUNO")
                            getEmpDetails(item.EmpId);
                            handleChange(null, null, "JobOwner")
                            getIOUJobList(item.ID);
                            if (item.IOU_Type == 1) {
                                handleChange("Job Owner", null, "OwnerType")
                                handleChange("Job No", null, "IOUTypeName")
                                handleChange(false, null, "IsEditable")
                                handleChange(false, null, "IsDisable")
                                getJJobOwnerTransportHOD(item.JobOwner_ID, 1);
                            } else if (item.IOU_Type == 2) {
                                handleChange("Transport Officer", null, "OwnerType")
                                handleChange("Vehicle No", null, "IOUTypeName")
                                handleChange(false, null, "IsEditable")
                                handleChange(true, null, "IsDisable")
                                getJJobOwnerTransportHOD(item.JobOwner_ID, 2);
                            } else {
                                handleChange("HOD", null, "OwnerType")
                                handleChange("Other", null, "IOUTypeName")
                                handleChange(true, null, "IsEditable")
                                handleChange(false, null, "IsDisable")
                                getJJobOwnerTransportHOD(item.JobOwner_ID, 3);
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
                    <View style={{ flexDirection: 'row', }}>
                        <Text style={style.bodyTextLeft}>
                            IOU Type
                        </Text>
                    </View>
                    <InputText
                        placeholderColor={ComStyles.COLORS.PROCEED_ASH}
                        placeholder="IOU Type"
                        stateValue={IOUSettlementData.IOUTypeName?.value}
                        // setState={(val: any) => setSelectIOUType(val)}
                        editable={false}
                        style={ComStyles.IOUInput}
                    />
                    <View style={{ flexDirection: 'row', }}>
                        <Text style={style.bodyTextLeft}>
                            {IOUSettlementData.OwnerType?.value || 'Job Owner'}
                        </Text>
                    </View>
                    <InputText
                        placeholderColor={ComStyles.COLORS.PROCEED_ASH}
                        placeholder={IOUSettlementData.OwnerType?.value}
                        stateValue={IOUSettlementData.JobOwner?.value}
                        // setState={(val: any) => setSelectJobOwner(val)}
                        editable={false}
                        style={ComStyles.IOUInput}
                    />
                    <View style={{ flexDirection: 'row', }}>
                        <Text style={style.bodyTextLeft}>
                            Employee
                        </Text>
                    </View>
                    <InputText
                        placeholderColor={ComStyles.COLORS.PROCEED_ASH}
                        placeholder="Employee"
                        stateValue={IOUSettlementData.employee?.value}
                        // setState={(val: any) => setSelectEmployee(val)}
                        editable={false}
                        style={ComStyles.IOUInput}
                    />
                </View>
                <ScrollView horizontal>
                    <FlatList
                        nestedScrollEnabled={true}
                        data={IOUSettlementJobData}
                        //horizontal={false}
                        renderItem={({ item }) => {
                            return (
                                <View style={{ width: width - 30, padding: 5 }}>
                                    <NewJobsView
                                        IOU_Type={IOUSettlementData.IOUType?.Id}
                                        amount={item.arr.RequestedAmount}
                                        IOUTypeNo={IOUSettlementData.IOUType?.Id == 1 ? item.arr.IOUTypeNo : item.arr.Resource}
                                        ExpenseType={item.arr.ExpenseType}
                                        jobremarks={item.arr.Remark}
                                        accNo={item.arr.AccNo}
                                        costCenter={item.arr.CostCenter}
                                        resource={item.arr.Resource}
                                        isEdit={true}
                                        isDelete={item.arr.IsDelete}
                                        onPressIcon={() => editJobs(item.key, item.arr.IsDelete ? 1 : 2)}
                                        settlementAmount={item.arr.Amount}
                                        isSettlementAmount={!item.arr.IsDelete}
                                        onPressDeleteIcon={() => deletePermission(item.key, item.arr.requestAmount?.value)}
                                    />
                                </View>
                            )
                        }
                        }
                        keyExtractor={item => `${item.key}`}
                    />
                </ScrollView>
            </ScrollView>
            <View style={{ padding: 5 }}>
                <View style={{ flexDirection: 'row', marginBottom: 5, alignContent: 'center' }}>
                    <ActionButton
                        title="Add Details"
                        styletouchable={{ width: '49%', marginLeft: 5 }}
                        style={{ backgroundColor: ComStyles.COLORS.SUB_COLOR }}
                        textStyle={{ color: ComStyles.COLORS.BLACK }}
                        onPress={() => chechMandetory(1)}
                    />
                    <ActionButton
                        title="Next"
                        styletouchable={{ width: '48%', marginLeft: 5 }}
                        onPress={() => chechMandetory(2)}
                    />
                </View>
            </View>
        </SafeAreaView>
    )
}
export default CreateNewIOUSettlementScreen; 