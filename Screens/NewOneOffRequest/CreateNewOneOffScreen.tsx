import { Alert, Dimensions, FlatList, SafeAreaView, ScrollView, Text, View } from "react-native";
import ComStyles from "../../Constant/Components.styles";
import Header from "../../Components/Header";
import DropdownAlert, { DropdownAlertData, DropdownAlertType } from "react-native-dropdownalert";
import DetailsBox from "../../Components/DetailsBox";
import { useCallback, useEffect, useState } from "react";
import { getLastOneOffSettlement } from "../../SQLiteDBAction/Controllers/OneOffSettlementController";
import { useFocusEffect } from "@react-navigation/native";
import { get_ASYNC_COST_CENTER, get_ASYNC_IsInprogress_OneOff, getLoginUserID, getLoginUserName, getLoginUserRoll } from "../../Constant/AsynStorageFuntion";
import { getAllLoginUserDetails, getAllTransportOfficers } from "../../SQLiteDBAction/Controllers/UserController";
import moment from "moment";
import { generateReferenceNo } from "../../Constant/IDGenerator";
import style from './OneOffStyle';
import { Dropdown } from "react-native-element-dropdown";
import { getIOUTypes } from "../../SQLiteDBAction/Controllers/IOUTypeController";
import { getAllJobOwnersBYDep } from "../../SQLiteDBAction/Controllers/JobOwnerController";
import { getJobNOByOwners } from "../../SQLiteDBAction/Controllers/JobNoController";
import { getLoggedUserHOD } from "../../SQLiteDBAction/Controllers/DepartmentController";
import AntDesign from 'react-native-vector-icons/AntDesign';
import ActionButton from "../../Components/ActionButton";
import NewJobsView from "../../Components/NewJobView";
import { FAB } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AsyncStorageConstants from "../../Constant/AsyncStorageConstants";
let width = Dimensions.get("screen").width;
let alert = (_data: DropdownAlertData) => new Promise<DropdownAlertData>(res => res);
const NewOneOffScreen = (props: any) => {
    const { navigation, route } = props;
    const [OneOffData, setOneOffData] = useState(route.params?.OneOffdataSet || {});
    const [OneOffJobData, setOneOffJobData] = useState(route.params?.OneOffJobdataSet || []);
    const [OneOffAttachments, setOneOffAttachments] = useState(route.params?.OneOffAttachmentSet || []);
    var currentDate = moment(new Date()).utcOffset('+05:30').format('YYYY-MM-DD');
    const [isFocus, setIsFocus] = useState(false);
    const [IOUTypeList, setIOUTypeList] = useState([]);
    const [jobOwnerList, setJobOwnerlist] = useState([]);
    const back = async () => {
        setOneOffData([]);
        setOneOffJobData([]);
        setOneOffAttachments([]);
        await AsyncStorage.setItem(AsyncStorageConstants.ASYNC_STORAGE_Is_inprogressOneOff, "false");
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
    const gotoNextScreen = async () => {
        await AsyncStorage.setItem(AsyncStorageConstants.ASYNC_STORAGE_Is_inprogressOneOff, "true");
        navigation.navigate('AddOneOffDetailScreen', { OneOffdataSet: OneOffData, OneOffJobdataSet: OneOffJobData, OneOffAttachmentSet: OneOffAttachments });
    }
    const AddAttachments = async () => {
        await AsyncStorage.setItem(AsyncStorageConstants.ASYNC_STORAGE_Is_inprogressOneOff, "true");
        navigation.navigate('AddAttatchmentOneOffScreen', { OneOffdataSet: OneOffData, OneOffJobdataSet: OneOffJobData, OneOffAttachmentSet: OneOffAttachments });
    }
    const chechMandetory = async (type: any) => {
        if ('IOUType' in OneOffData && OneOffData.IOUType?.Id != '' && OneOffData.IOUType?.Id != null) {
            if ('JobOwner' in OneOffData && OneOffData.JobOwner?.Id != '' && OneOffData.JobOwner?.Id != null) {
                if (type == 1) {
                    gotoNextScreen();
                } else {
                    AddAttachments();
                }
            } else {
                if (OneOffData.IOUType?.Id == 1) {
                    await alert({
                        type: DropdownAlertType.Error,
                        title: 'Error',
                        message: 'Please Select Job Owner',
                    });
                } else if (OneOffData.IOUType?.Id == 2) {
                    await alert({
                        type: DropdownAlertType.Error,
                        title: 'Error',
                        message: 'Please Select Transport Officer',
                    });
                }
            }
        } else {
            await alert({
                type: DropdownAlertType.Error,
                title: 'Error',
                message: 'Please Select IOU Type',
            });
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
    const getJJobOwnerTransportHOD = (type: any) => {
        // type = 1 - job owner / 2 - transport officer / 3 - hod
        try {
            let userRole = OneOffData.UserRole?.value + "";
            if (type == 1) {
                //get job owners
                getAllJobOwnersBYDep((resp1: any) => {
                    // console.log(" job owners == [][][][]    ", resp1);
                    setJobOwnerlist(resp1);
                    if (userRole == '3' || userRole == '4') {
                        const empdata = resp1?.filter((a: any) => a.ID == parseInt(OneOffData.UserID?.value))[0];
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
                        const empdata = resp2?.filter((a: any) => a.ID == parseInt(OneOffData.UserID?.value))[0];
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
    const getAllIOUTypes = () => {
        setIOUTypeList([]);
        try {
            getIOUTypes((result: any) => {
                setIOUTypeList(result);
            });
        } catch (error) {
        }
    }
    const generateNo = () => {
        try {
            if (route.params?.Rtype == 0) {
                generateReferenceNo("OFS", (ID: any) => {
                    handleChange(ID, null, "OneOffNo");
                });
            } else {
                get_ASYNC_IsInprogress_OneOff().then(res => {
                    if (res == "true") {
                    } else {
                        generateReferenceNo("OFS", (ID: any) => {
                            handleChange(ID, null, "OneOffNo");
                        });
                    }
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
    const deleteDetail = async (keyR: any, amount: any) => {
        const newData = OneOffJobData.filter((item: { key: any; }) => item.key !== keyR);
        setOneOffJobData(newData);
        let amountTot = parseFloat(OneOffData.totAmount?.value);
        let newAmnt = amountTot - parseFloat(amount);
        console.log(" now amount ---  ", newAmnt);

        if (!Number.isNaN(newAmnt)) {
            handleChange(newAmnt, null, "totAmount");
        } else {
            handleChange(0, null, "totAmount");
        }
        await alert({
            type: DropdownAlertType.Success,
            title: 'Success',
            message: 'Detail Deleted Successfully...',
        });
    }
    const editJobs = (key: any, type: any) => {
        navigation.navigate('AddOneOffDetailScreen', { OneOffdataSet: OneOffData, OneOffJobdataSet: OneOffJobData, OneOffAttachmentSet: OneOffAttachments, isEdit: type, jobKey: key });
    }
    useEffect(() => {
        if (route.params?.OneOffJobdataSet) {
            setOneOffJobData(route.params.OneOffJobdataSet);
        }
    }, [route.params?.OneOffJobdataSet]);
    useEffect(() => {
        if (route.params?.OneOffdataSet) {
            console.log("total amount -------------   ", route.params?.OneOffdataSet);

            setOneOffData(route.params.OneOffdataSet);
        }
    }, [route.params?.OneOffdataSet]);
    useEffect(() => {
        if (route.params?.OneOffAttachmentSet) {
            setOneOffAttachments(route.params.OneOffAttachmentSet);
        }
    }, [route.params?.OneOffAttachmentSet]);
    useFocusEffect(
        useCallback(() => {
            generateNo();
            getInitialData();
            getAllIOUTypes();
        }, [])
    );
    return (
        <SafeAreaView style={ComStyles.CONTAINER}>
            <Header title="Add One-Off Settlement" isBtn={true} btnOnPress={naviBack} />
            <DropdownAlert alert={func => (alert = func)} alertPosition="top" />
            <ScrollView style={ComStyles.CONTENT} showsVerticalScrollIndicator={false}>
                {/* <View style={ComStyles.CONTENT}> */}
                <View style={{ padding: 5 }} />
                <DetailsBox
                    reqNo={OneOffData.OneOffNo?.value}
                    empNo={OneOffData.EpfNo?.value}
                    RequestBy={OneOffData.UserName?.value}
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
                        value={OneOffData.IOUType?.value}
                        onFocus={() => setIsFocus(true)}
                        onBlur={() => setIsFocus(false)}
                        onChange={item => {
                            handleChange(item.Description, item.IOUType_ID, "IOUType")
                            handleChange(null, null, "JobOwner")
                            handleChange(0, null, "totAmount");
                            setOneOffJobData([]);
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
                            {OneOffData.OwnerType?.value}*
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
                        disable={OneOffData.IsEditable?.value}
                        placeholder={!isFocus ? OneOffData.OwnerType?.value : '...'}
                        searchPlaceholder="Search Owner"
                        value={OneOffData.JobOwner?.value}
                        onFocus={() => setIsFocus(true)}
                        onBlur={() => setIsFocus(false)}
                        onChange={item => {
                            handleChange(item.Name, item.ID, "JobOwner")
                            if (OneOffData.IOUType?.Id == 1) {
                                handleChange(item.EPFNo, null, "JobOwnerEPF")
                                handleChange(parseFloat(item.IOULimit), null, "IOULimit")
                            } else if (OneOffData.IOUType?.Id == 2) {
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
                </View>
                <ScrollView horizontal>
                    <FlatList
                        nestedScrollEnabled={true}
                        data={OneOffJobData}
                        //horizontal={false}
                        renderItem={({ item }) => {
                            return (
                                <View style={{ width: width - 30, padding: 5 }}>
                                    <NewJobsView
                                        IOU_Type={OneOffData.IOUType?.Id}
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
                {/* </View> */}
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
export default NewOneOffScreen;