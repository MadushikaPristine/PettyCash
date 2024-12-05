import React, { useCallback, useEffect, useState } from "react";
import {
    Alert,
    Dimensions,
    FlatList,
    SafeAreaView,
    ScrollView,
    Text,
    View,
} from 'react-native';
import ComponentsStyles from "../../Constant/Components.styles";
import Header from "../../Components/Header";
import AsyncStorageConstants from "../../Constant/AsyncStorageConstants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import DropdownAlert, { DropdownAlertData, DropdownAlertType } from "react-native-dropdownalert";
import ComStyles from "../../Constant/Components.styles";
import DetailsBox from "../../Components/DetailsBox";
import { useFocusEffect } from "@react-navigation/native";
import { get_ASYNC_COST_CENTER, get_ASYNC_EPFNO, get_ASYNC_IS_Auth_Requester, get_ASYNC_IsInprogress_IOU, getLoginUserID, getLoginUserName, getLoginUserRoll } from "../../Constant/AsynStorageFuntion";
import { generateReferenceNo } from "../../Constant/IDGenerator";
import { getAllLoginUserDetails, getAllTransportOfficers } from "../../SQLiteDBAction/Controllers/UserController";
import { getLoggedUserHOD } from "../../SQLiteDBAction/Controllers/DepartmentController";
import { getIOUTypes } from "../../SQLiteDBAction/Controllers/IOUTypeController";
import style from './IOUStyle';
import { Dropdown } from "react-native-element-dropdown";
import { getAllJobOwnersBYDep } from "../../SQLiteDBAction/Controllers/JobOwnerController";
import AntDesign from 'react-native-vector-icons/AntDesign';
import { getAllEmployee } from "../../SQLiteDBAction/Controllers/EmployeeController";
import ActionButton from "../../Components/ActionButton";
import NewJobsView from "../../Components/NewJobView";
let width = Dimensions.get("screen").width;
let alert = (_data: DropdownAlertData) => new Promise<DropdownAlertData>(res => res);
const CreateNewIOUScreen = (props: any) => {
    const { navigation, route } = props;
    const [IOUData, setIOUData] = useState(route.params?.ioudataSet || {});
    const [IOUJobData, setIOUJobData] = useState(route.params?.IOUJobdataSet || []);
    const [IOUAttachments, setIOUAttachments] = useState(route.params?.IOUAttachmentSet || []);
    var currentDate = moment(new Date()).utcOffset('+05:30').format('YYYY-MM-DD');
    const [isFocus, setIsFocus] = useState(false);
    const [IOUTypeList, setIOUTypeList] = useState([]);
    const [jobOwnerList, setJobOwnerlist] = useState([]);
    const [EmployeeList, setEmployeeList] = useState([]);
    const back = async () => {
        setIOUData([]);
        setIOUJobData([]);
        setIOUAttachments([]);
        await AsyncStorage.setItem(AsyncStorageConstants.ASYNC_STORAGE_Is_inprogressIOU, "false");
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
            setIOUData((prevState: any) => ({
                ...prevState, [key]: { value, Id }
            }));
        } catch (error) {
        }
    }
    const generateNo = () => {
        try {
            if (route.params?.Rtype == 0) {
                generateReferenceNo("IOU", (ID: any) => {
                    handleChange(ID, null, "IOUNo");
                });
            } else {
                get_ASYNC_IsInprogress_IOU().then(res => {
                    if (res == "true") {
                    } else {
                        generateReferenceNo("IOU", (ID: any) => {
                            handleChange(ID, null, "IOUNo");
                        });
                    }
                });
            }
        } catch (error) {
        }
    }
    const getJJobOwnerTransportHOD = (type: any) => {
        // type = 1 - job owner / 2 - transport officer / 3 - hod
        try {
            let userRole = IOUData.UserRole?.value + "";
            if (type == 1) {
                //get job owners
                getAllJobOwnersBYDep((resp1: any) => {
                    // console.log(" job owners == [][][][]    ", resp1);
                    setJobOwnerlist(resp1);
                    if (userRole == '3' || userRole == '4') {
                        const empdata = resp1?.filter((a: any) => a.ID == parseInt(IOUData.UserID?.value))[0];
                        handleChange(empdata.EPFNo, null, "JobOwnerEPF")
                        handleChange(empdata.Name, empdata.ID, "JobOwner")
                        handleChange(parseFloat(empdata.IOULimit), null, "IOULimit")
                    }
                });
            } else if (type == 2) {
                //get transport officer
                getAllTransportOfficers((resp2: any) => {
                    // console.log(" transport officers == [][][][]    ", resp2);
                    setJobOwnerlist(resp2);
                    if (userRole == '3' || userRole == '4') {
                        const empdata = resp2?.filter((a: any) => a.ID == parseInt(IOUData.UserID?.value))[0];
                        handleChange(empdata.Name, empdata.ID, "JobOwner")
                        handleChange(parseFloat(empdata.IOULimit), null, "IOULimit")
                    }
                });
            } else {
                //get hod
                getLoggedUserHOD((resp3: any) => {
                    // console.log(" hod == [][][][]    ", resp3);
                    setJobOwnerlist(resp3);
                    handleChange(resp3[0].Name, resp3[0].ID, "JobOwner")
                    handleChange(null, resp3[0].ID, "HOD")
                });
            }
        } catch (error) {
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
    const getEmployeeList = () => {
        console.log(" get employeee ");
        setEmployeeList([]);
        getAllEmployee((result: any) => {
            setEmployeeList(result);
            get_ASYNC_IS_Auth_Requester().then(async resp => {
                if (resp === '1') {
                    //auth requester
                    handleChange(false, null, "isEditEmp")
                } else {
                    //requester
                    handleChange(true, null, "isEditEmp")
                    get_ASYNC_EPFNO().then(async resu => {
                        const empdata = result?.filter((a: any) => a.EPFNo == parseInt(resu + ""))[0];
                        handleChange(empdata.Name, empdata.ID, "employee")
                    });
                }
            });
        });
    }
    const getAllIOUTypes = () => {
        setIOUTypeList([]);
        try {
            getIOUTypes((result: any) => {
                setIOUTypeList(result);
            });
        } catch (error) {
        }
    }
    const gotoNextScreen = async () => {
        await AsyncStorage.setItem(AsyncStorageConstants.ASYNC_STORAGE_Is_inprogressIOU, "true");
        navigation.navigate('AddIOUDetailScreen', { ioudataSet: IOUData, IOUJobdataSet: IOUJobData, IOUAttachmentSet: IOUAttachments });
    }
    const AddAttachments = async () => {
        await AsyncStorage.setItem(AsyncStorageConstants.ASYNC_STORAGE_Is_inprogressIOU, "true");
        navigation.navigate('AddAttatchmentIOUScreen', { ioudataSet: IOUData, IOUJobdataSet: IOUJobData, IOUAttachmentSet: IOUAttachments });
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
        const newData = IOUJobData.filter((item: { key: any; }) => item.key !== keyR);
        setIOUJobData(newData);
        let amountTot = parseFloat(IOUData.totAmount?.value);
        let newAmnt = amountTot - parseFloat(amount);
        console.log("  newAmnt    ", newAmnt);

        if (!Number.isNaN(newAmnt)) {
            handleChange(newAmnt, null, "totAmount");
        } else {
            handleChange(0, null, "totAmount");
        }
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
    const chechMandetory = async (type: any) => {
        if ('IOUType' in IOUData && IOUData.IOUType?.Id != '' && IOUData.IOUType?.Id != null) {
            if ('JobOwner' in IOUData && IOUData.JobOwner?.Id != '' && IOUData.JobOwner?.Id != null) {
                if ('employee' in IOUData && IOUData.employee?.Id != '' && IOUData.employee?.Id != null) {
                    if (type == 1) {
                        gotoNextScreen();
                    } else {
                        AddAttachments();
                    }
                } else {
                    showErrorAlert('Error', 'Please Select Employee');
                }
            } else {
                if (IOUData.IOUType?.Id == 1) {
                    showErrorAlert('Error', 'Please Select Job Owner');
                } else if (IOUData.IOUType?.Id == 2) {
                    showErrorAlert('Error', 'Please Select Transport Officer');
                }
            }
        } else {
            showErrorAlert('Error', 'Please Select IOU Type');
        }
    }
    const editJobs = (key: any, type: any) => {
        navigation.navigate('AddIOUDetailScreen', { ioudataSet: IOUData, IOUJobdataSet: IOUJobData, IOUAttachmentSet: IOUAttachments, isEdit: type, jobKey: key });
    }
    useEffect(() => {
        if (route.params?.IOUJobdataSet) {
            setIOUJobData(route.params.IOUJobdataSet);
        }
    }, [route.params?.IOUJobdataSet]);
    useEffect(() => {
        if (route.params?.ioudataSet) {
            setIOUData(route.params.ioudataSet);
        }
    }, [route.params?.ioudataSet]);
    useEffect(() => {
        if (route.params?.IOUAttachmentSet) {
            setIOUAttachments(route.params.IOUAttachmentSet);
        }
    }, [route.params?.IOUAttachmentSet]);
    useFocusEffect(
        useCallback(() => {
            generateNo();
            getInitialData();
            getAllIOUTypes();
            getEmployeeList();
        }, [])
    );
    return (
        <SafeAreaView style={ComponentsStyles.CONTAINER}>
            <Header title="Add New IOU" isBtn={true} btnOnPress={naviBack} />
            <DropdownAlert alert={func => (alert = func)} alertPosition="top" />
            <ScrollView style={ComStyles.CONTENT} showsVerticalScrollIndicator={false}>
                <View style={{ padding: 5 }} />
                <DetailsBox
                    reqNo={IOUData.IOUNo?.value}
                    empNo={IOUData.EpfNo?.value}
                    RequestBy={IOUData.UserName?.value}
                    Rdate={currentDate}
                />
                <View>
                    <View style={{ flexDirection: 'row', marginTop: 15 }}>
                        <Text style={style.bodyTextLeft}>
                            IOU Type*
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
                        data={IOUTypeList}
                        search
                        maxHeight={300}
                        labelField="Description"
                        valueField="Description"
                        placeholder={!isFocus ? 'Select IOU Type ' : '...'}
                        searchPlaceholder="Search Type"
                        value={IOUData.IOUType?.value}
                        onFocus={() => setIsFocus(true)}
                        onBlur={() => setIsFocus(false)}
                        onChange={item => {
                            handleChange(item.Description, item.IOUType_ID, "IOUType")
                            handleChange(null, null, "JobOwner")
                            handleChange(0, null, "totAmount");
                            get_ASYNC_IS_Auth_Requester().then(async resp => {
                                if (resp === '1') {
                                    handleChange(null, null, "employee")
                                }
                            })
                            setIOUJobData([]);
                            if (item.IOUType_ID == 1) {
                                handleChange("Job Owner", null, "OwnerType")
                                handleChange("Job No", null, "IOUTypeName")
                                handleChange(false, null, "IsEditable")
                                getJJobOwnerTransportHOD(1);
                            } else if (item.IOUType_ID == 2) {
                                handleChange("Transport Officer", null, "OwnerType")
                                handleChange("Vehicle No", null, "IOUTypeName")
                                handleChange(false, null, "IsEditable")
                                getJJobOwnerTransportHOD(2);
                            } else {
                                handleChange("HOD", null, "OwnerType")
                                handleChange("HOD", null, "IOUTypeName")
                                handleChange(true, null, "IsEditable")
                                getJJobOwnerTransportHOD(3);
                                get_ASYNC_COST_CENTER().then(async res => {
                                    handleChange(res, null, "costCenter")
                                });
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
                            {IOUData.OwnerType?.value}*
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
                        data={jobOwnerList}
                        search
                        autoScroll={false}
                        maxHeight={300}
                        labelField="Name"
                        valueField="Name"
                        disable={IOUData.IsEditable?.value}
                        placeholder={!isFocus ? IOUData.OwnerType?.value : '...'}
                        searchPlaceholder="Search Owner"
                        value={IOUData.JobOwner?.value}
                        onFocus={() => setIsFocus(true)}
                        onBlur={() => setIsFocus(false)}
                        onChange={item => {
                            handleChange(item.Name, item.ID, "JobOwner")
                            if (IOUData.IOUType?.Id == 1) {
                                console.log(" epf select ====    " , item.EPFNo);
                                handleChange(item.EPFNo, null, "JobOwnerEPF")
                                handleChange(parseFloat(item.IOULimit), null, "IOULimit")
                            } else if (IOUData.IOUType?.Id == 2) {
                                handleChange(parseFloat(item.IOULimit), null, "IOULimit")
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
                            Employee*
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
                        data={EmployeeList}
                        search
                        autoScroll={false}
                        maxHeight={300}
                        labelField="Name"
                        valueField="Name"
                        disable={IOUData.isEditEmp?.value}
                        placeholder={!isFocus ? 'Select Employee ' : '...'}
                        searchPlaceholder="Search Employee"
                        value={IOUData.employee?.value}
                        onFocus={() => setIsFocus(true)}
                        onBlur={() => setIsFocus(false)}
                        onChange={item => {
                            handleChange(item.Name, item.ID, "employee")
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
                <ScrollView horizontal>
                    <FlatList
                        nestedScrollEnabled={true}
                        data={IOUJobData}
                        //horizontal={false}
                        renderItem={({ item }) => {
                            return (
                                <View style={{ width: width - 30, padding: 5 }}>
                                    <NewJobsView
                                        IOU_Type={IOUData.IOUType?.Id}
                                        amount={item.arr.requestAmount?.value}
                                        IOUTypeNo={item.arr.SelectJobVehicle?.value || ''}
                                        ExpenseType={item.arr.ExpenseType?.value}
                                        jobremarks={item.arr.remark?.value || "-"}
                                        accNo={item.arr.GLAccount?.value}
                                        costCenter={item.arr.CostCenter?.value || '-'}
                                        resource={item.arr.Resource?.value || "-"}
                                        isDelete={true}
                                        isEdit={true}
                                        onPressIcon={() => editJobs(item.key, 1)}
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
    );
}
export default CreateNewIOUScreen;