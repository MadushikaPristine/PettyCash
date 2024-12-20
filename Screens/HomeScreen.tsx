import React, { useEffect, useId, useState } from "react";
import {
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    FlatList,
    Dimensions,
    Alert,
    BackHandler
} from 'react-native';
import Header from "../Components/Header";
import ComponentsStyles from "../Constant/Components.styles";
import IconA from 'react-native-vector-icons/FontAwesome';
import { IOU } from "../Constant/DummyData";
import ListBox from "../Components/ListBox";
import { ProgressBar } from "react-native-paper";
import ActionButton from "../Components/ActionButton";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { checkOpenRequests, getAllPendingIOUList, getIOUForUpload, getIOUToatalAmount, getPendingHODApprovalIOUList, getPendingIOU, getPendingIOUHome, getPendingIOUList, saveIOU, updateIDwithStatus } from "../SQLiteDBAction/Controllers/IOUController";
import { getAllPendingIOUSetList, getHODPendingIOUSetList, getIOUSETToatalAmount, getPendingIOUSetList, getPendingIOUSettlement, getPendingIOUSettlementHome, saveIOUSettlement } from "../SQLiteDBAction/Controllers/IouSettlementController";
import { getAllPendingOneOffSetList, getHODPendingOneOffSetList, getONEOFFToatalAmount, getPendingOneOffSetList, getPendingOneOffSettlement, getPendingOneOffSettlementHome, saveOneOffSettlement } from "../SQLiteDBAction/Controllers/OneOffSettlementController";
import AsyncStorageConstants from "../Constant/AsyncStorageConstants";
import * as DB from '../SQLiteDBAction/DBService';
import { getIsLogFileView, getLoginUserID, getLoginUserName, getLoginUserRoll, get_ASYNC_CHECKSYNC, get_ASYNC_JOBOWNER_APPROVAL_AMOUNT, get_ASYNC_LOGIN_ROUND } from "../Constant/AsynStorageFuntion";
import Modal from "react-native-modal";
import { BASE_URL, BASE_URL_LOOKUPS, COMMON_BASE_URL, DB_LIVE, SAP_LIVE_DB, headers } from "../Constant/ApiConstants";
import axios from "axios";
import { saveIOUType } from "../SQLiteDBAction/Controllers/IOUTypeController";
import { saveExpenseType } from "../SQLiteDBAction/Controllers/ExpenseTypeController";
import { getAllJobOwners, saveUser } from "../SQLiteDBAction/Controllers/UserController";
import { saveVehicleNo } from "../SQLiteDBAction/Controllers/VehicleNoController";
import { saveJobOwners } from "../SQLiteDBAction/Controllers/JobOwnerController";
import { saveJobNo } from "../SQLiteDBAction/Controllers/JobNoController";
import { DeleteIOUSyncedDetailLine, getIOUJOBDataBYRequestID, saveIOUJOB, updateIOUDetailLineSyncStatus } from "../SQLiteDBAction/Controllers/IOUJobController";
import { DeleteSETSyncedDetailLine, saveIOUSETJOB } from "../SQLiteDBAction/Controllers/IOUSettlementJobController";
import { DeleteOneOffSyncedDetailLine, saveOneOffJOB } from "../SQLiteDBAction/Controllers/OneOffJobController";
import { saveUserRolls } from "../SQLiteDBAction/Controllers/UserRollController";
import { saveDepartment } from "../SQLiteDBAction/Controllers/DepartmentController";
import { Conection_Checking } from "../Constant/InternetConection_Checking";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import { saveEmployee } from "../SQLiteDBAction/Controllers/EmployeeController";
import { saveGLAccount } from "../SQLiteDBAction/Controllers/GLAccountController";
import logFileDialogBox from "../Components/LogFileDialogBox";
import LogFileDialogBox from "../Components/LogFileDialogBox";
import { getIOUAttachmentListByID } from "../SQLiteDBAction/Controllers/AttachmentController";
import RNFS from 'react-native-fs';
import { logger, saveJsonObject_To_Loog } from "../Constant/Logger";
import CardView from "../Components/CardView";
import DropdownAlert, { DropdownAlertData, DropdownAlertType } from "react-native-dropdownalert";
let alert = (_data: DropdownAlertData) => new Promise<DropdownAlertData>(res => res);
let SyncArray1: any[] = [];
let arrayindex = 0;
let userID: any;
let UserRoleID: any;

const HomeScreen = () => {
    const width = Dimensions.get('screen').width;
    let formattedTotal: any;
    // List View
    const [IOUList, setIOUList] = useState([]);
    const [IOUSettlementList, setIOUSettlementList] = useState([]);
    const [OneOFfSettlementList, setOneOffettlementList] = useState([]);
    const [IOUTotalAmount, setIOUTotalAmount] = useState(0);
    const [IOUSETTotalAmount, setIOUSETTotalAmount] = useState(0);
    const [ONEOFFTotalAmount, setONEOFFTotalAmount] = useState(0);
    const [roll, setRoll] = useState('');
    const [uName, setUname] = useState('');
    const [viewLogFileList, setviewLogFileList] = useState(false);
    //Sync Modal
    const [isModalVisible, setModalVisible] = useState(false);
    const [CloseBtnSync, SetCloseBtnSync] = useState(false);
    const [SyncArray, setSyncArray]: any[] = useState([]);
    const [onRefresh, setOnRefresh] = useState(false);
    const [TotalIOUAmount, setTotalIOUAmount] = useState(0);
    const [TotalIOUSETAmount, setTotalIOUSETAmount] = useState(0);
    const [TotalONEOFFAmount, setTotalONEOFFAmount] = useState(0);
    const [TotalPayableAmount, setTotalPayableAmount] = useState(0);
    const [HeaderText, setHeaderText] = useState('');
    const navigation = useNavigation();

    const getIOU_request = () => {
        if (UserRoleID == '5') {
            console.log(" HOD LOgged ");
            getPendingHODApprovalIOUList((res: any) => {
                console.log(res, "================================================");
                setIOUList(res);
            })
        } else {
            if (UserRoleID == '3' || UserRoleID == '4') {
                //Job owner or transport officer
                console.log(" Job owner or transport officer ");
                getPendingIOUList(UserRoleID, (result: any) => {
                    setIOUList(result);
                    // console.log(result)
                });
            } else {
                //Requester
                console.log(" Requester ");
                getAllPendingIOUList((result: any) => {
                    setIOUList(result);
                    // console.log(result)
                });
            }
        }
    }
    const getsettlment_request = () => {
        if (UserRoleID == '5') {
            // console.log("roll 5--------");
            getHODPendingIOUSetList((res: any) => {
                setIOUSettlementList(res);
                //console.log("roll 5--------", res[0].Amount)
            })
        } else {
            if (UserRoleID == '3' || UserRoleID == '4') {
                //Job owner or transport officer
                getPendingIOUSetList(UserRoleID, (resp: any) => {
                    setIOUSettlementList(resp);
                });
            } else {
                //Requester
                getAllPendingIOUSetList((resp: any) => {
                    setIOUSettlementList(resp);
                });
            }
        }
    }
    const getONEoffsettlment_request = () => {
        console.log("one of ----");
        if (UserRoleID === '5') {
            //HOD
            console.log("roll 5--------");
            getHODPendingOneOffSetList((res: any) => {
                setOneOffettlementList(res);
            })
        } else {

            if (UserRoleID === '3' || UserRoleID === '4') {
                //Job owner or transport officer
                console.log("roll 3 ..... 4--------");
                getPendingOneOffSetList(UserRoleID, (res: any) => {
                    setOneOffettlementList(res);
                });

            } else {
                console.log("roll requester--------");
                getAllPendingOneOffSetList((res: any) => {
                    setOneOffettlementList(res);
                });


            }
        }
    }
    const setFlatListData = () => {
        getIOU_request();
        getsettlment_request();
        getONEoffsettlment_request();

        // getPendingIOUHome((result: any) => {
        //     setIOUList(result);
        // });

        // getPendingIOUSettlementHome((response: any) => {
        //     setIOUSettlementList(response);
        // });

        // getPendingOneOffSettlementHome((res: any) => {

        //     console.log(res,"==============================================");

        //     setOneOffettlementList(res);
        // });

        // getIOUToatalAmount ((resp: any) => {
        //     setIOUTotalAmount(resp);
        //     console.log(resp)
        // })

    }
    const getTotalAmount = () => {
        let iouamount = 0.0;
        let iousetamount = 0.0;
        let oneoffamount = 0.0;
        getIOUToatalAmount((resp1: any) => {
            setTotalIOUAmount(resp1[0].TotalAmount);
            iouamount = resp1[0].TotalAmount;
            const totalAmount = resp1[0].TotalAmount.toLocaleString("en-LK", {
                style: "currency",
                currency: "LKR",
                minimumFractionDigits: 2,
            });
            setIOUTotalAmount(totalAmount);
            // console.log("getTotalAmount:", totalAmount);
            // console.log("getTotalAmount", resp[0].TotalAmount);
            // console.log("getTotalIOUAmount-----", TotalIOUAmount);
        });
        // console.log("getTotalIOUAmount-----", TotalIOUAmount);
        getIOUSETToatalAmount((resp2: any) => {
            setTotalIOUSETAmount(resp2[0].TotalAmount);
            iousetamount = resp2[0].TotalAmount;
            const totalAmount = resp2[0].TotalAmount.toLocaleString("en-LK", {
                style: "currency",
                currency: "LKR",
                minimumFractionDigits: 2,
            });
            setIOUSETTotalAmount(totalAmount);
            // console.log("getTotalSETAmount", totalAmount);
            // console.log("getTotalSETAmount");
        });
        // console.log("getTotalIOUSETAmount");
        getONEOFFToatalAmount((resp3: any) => {
            setTotalONEOFFAmount(resp3[0].TotalAmount);
            oneoffamount = resp3[0].TotalAmount;
            const totalAmount = resp3[0].TotalAmount.toLocaleString("en-LK", {
                style: "currency",
                currency: "LKR",
                minimumFractionDigits: 2,
            });
            setONEOFFTotalAmount(totalAmount);
            // console.log("getTotalONEAmount", totalAmount);
            // console.log("getTotalONEAmount");

            // getTotalPayableAmount();
            let Total = iouamount + iousetamount + oneoffamount;
            console.log("set Amount ===   ", Total);
            setTotalPayableAmount(Total);
            formattedTotal = Total.toLocaleString("en-LK", {
                style: "currency",
                currency: "LKR",
                minimumFractionDigits: 2,
            });
            setTotalPayableAmount(formattedTotal);
        });
    }
    const getTotalPayableAmount = () => {

        let Total = TotalIOUAmount + TotalIOUSETAmount + TotalONEOFFAmount;

        console.log("set Amount ===   ", Total);

        setTotalPayableAmount(Total);

        formattedTotal = Total.toLocaleString("en-LK", {
            style: "currency",
            currency: "LKR",
            minimumFractionDigits: 2,
        });

        setTotalPayableAmount(formattedTotal);
    }
    const setPendingListType = async (type: any) => {
        await AsyncStorage.setItem(AsyncStorageConstants.ASYNC_CURRENT_PENDING_LIST_TYPE, type);
        navigation.navigate('PendingList');
        // navigation.navigate('PendingRequestList');
    }
    const createRequest = (type: any) => {
        if (type == 'IOU') {
            getLoginUserID().then(result => {
                checkOpenRequests(parseInt(result + ""), async (resp: any) => {
                    if (resp.length > 0) {
                        await alert({
                            type: DropdownAlertType.Error,
                            title: 'Can not create a new Request',
                            message: "You already have an open status request",
                        });
                    } else {
                        navigation.navigate('NewIOU');
                        AsyncStorage.setItem(AsyncStorageConstants.ASYNC_STORAGE_IS_COPY, "False");
                    }
                });
            })
        } else if (type == 'SETTLEMENT') {
            navigation.navigate('NewIOUSettlement');
            AsyncStorage.setItem(AsyncStorageConstants.ASYNC_STORAGE_IS_COPY, "False");
        } else if (type == 'ONEOFF') {
            navigation.navigate('NewOneOffSettlement');
            AsyncStorage.setItem(AsyncStorageConstants.ASYNC_STORAGE_IS_COPY, "False");
        }
    }
    const checkCurrentTime = () => {
        var today = new Date()
        var curHr = today.getHours()
        if (curHr < 12) {
            setHeaderText('Good Morning !');
            // console.log('Good Morning!');
        } else if (curHr < 18) {
            setHeaderText('Good Afternoon !');
            // console.log('Good Afternoon!');
        } else {
            setHeaderText('Good Evening !');
            // console.log('Good Evening!');
        }
    }
    const OnLoadData = () => {
        getTotalAmount();
        getLoginUserRoll().then(res => {
            setRoll(res);
            setFlatListData();
            // console.log("User Roll: ", res);
        })
        getLoginUserName().then(res => {
            setUname(res);
            // console.log(" user name ....... ", res);

        });
        get_ASYNC_CHECKSYNC().then(result => {
            if (result === "1") {
                toggleModal();
                Conection_Checking((res: any) => {
                    if (res != false) {
                        console.log("conection is tru");
                        Download_IOU_Types();
                    } else {
                        console.log("no connection");
                    }
                })
            }
        })
    }
    const handleBackButton = () => {
        // Disable the default back button behavior
        console.log("Hardware back button is pressed");
        return true;
    };
    // Sync Modal Functions ------
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };
    // -------------------- Upload IOU Requests -------------------------------------
    // const UploadIOU = () => {
    //     try {
    //         getIOUForUpload((result: any) => {
    //             if (result.length > 0) {
    //                 console.log(" iou array ====    ", result);
    //                 var obj = [];
    //                 for (let i = 0; i < result.length; i++) {
    //                     let IOUID = result[i].IOU_ID;
    //                     let IOUTypeID = result[i].IOU_Type;
    //                     let HOD = result[i].HOD;
    //                     let IsLimit = result[i].RIsLimit;
    //                     let userID = result[i].CreatedBy;
    //                     let RequestDate = result[i].RequestDate;
    //                     let EmpID = result[i].EmpId;
    //                     let Job_Owner = result[i].JobOwner_ID;
    //                     let amount = result[i].Amount;
    //                     let JobDetails: any[] = [];
    //                     var Fileobj: any[] = [];
    //                     getIOUJOBDataBYRequestID(IOUID, (result: any) => {
    //                         console.log(result, '+++++++++++++++++++++++++++');
    //                         for (let i = 0; i < result.length; i++) {
    //                             // console.log(result[i]);
    //                             JobDetails.push(result[i]);
    //                         }
    //                         getIOUAttachmentListByID(IOUID, async (rest: any) => {
    //                             Fileobj = [];
    //                             if (rest.length > 0) {
    //                                 for (let i = 0; i < rest.length; i++) {
    //                                     const arr = {
    //                                         "IOUTypeNo": IOUTypeID,
    //                                         "FileName": rest[i].Img_url,
    //                                         "File": await RNFS.readFile(rest[i].Img_url, 'base64'),
    //                                         "FileType": "image/jpeg"
    //                                     }
    //                                     Fileobj.push(arr);
    //                                     if (i + 1 == rest.length) {
    //                                         const prams = {
    //                                             "PettycashID": IOUID,
    //                                             "RequestedBy": parseInt(userID),
    //                                             "ReqChannel": "Mobile",
    //                                             "Date": RequestDate,
    //                                             "IOUtype": parseInt(IOUTypeID),
    //                                             "EmpNo": parseInt(EmpID),
    //                                             "JobOwner": parseInt(Job_Owner),
    //                                             "CreateAt": RequestDate,
    //                                             "TotalAmount": parseFloat(amount),
    //                                             "IOUTypeDetails": obj,
    //                                             "attachments": Fileobj,
    //                                             "Hod": parseFloat(HOD),
    //                                             "RIsLimit": result[i].RIsLimit,
    //                                             "RIouLimit": result[i].RIOULimit
    //                                         }
    //                                         Conection_Checking(async (res: any) => {
    //                                             if (res != false) {
    //                                                 UploadIOURequest(IOUID,IOUTypeID,JobDetails, HOD, IsLimit, Fileobj,prams);
    //                                             }
    //                                         })
    //                                     }
    //                                 }
    //                             } else {
    //                                 Conection_Checking(async (res: any) => {
    //                                     if (res != false) {
    //                                         UploadIOURequest(IOUID,IOUTypeID,JobDetails, HOD, IsLimit, Fileobj,prams);
    //                                     }
    //                                 })
    //                             }
    //                         })
    //                     })
    //                 }
    //             } else {
    //                 //No Available data for upload
    //             }
    //         });
    //     } catch (error) {
    //     }
    // }
    // const UploadIOURequest = async (IOUNo:any, IOUTypeID:any, detailsData: any, HOD: any, isLimit: any, Fileobj: any, prams:any) => {
    //     console.log(" details data --------------   ", detailsData);
    //     const URL = BASE_URL + '/Mob_PostIOURequests.xsjs?dbName=' + DB_LIVE;
    //     var loggerDate = "Date - " + moment().utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss') + "+++++++++++++  Upload IOU  ++++++++++++++++";
    //     logger(loggerDate, " UPLOAD IOU REQUEST URL " + "   *******   " + URL);

    //     var obj = [];

    //     try {
    //         if (parseInt(IOUTypeID) == 1) {
    //             for (let i = 0; i < detailsData.length; i++) {
    //                 const arr = {
    //                     "IOUTypeID": detailsData[i].IOUTypeID,
    //                     "IOUTypeNo": detailsData[i].IOUTypeNo,
    //                     "ExpenseType": detailsData[i].ExpenseType,
    //                     "Amount": detailsData[i].Amount,
    //                     "Remark": detailsData[i].Remark,
    //                     "AccNo": detailsData[i].AccNo,
    //                     "CostCenter": detailsData[i].CostCenter,
    //                     "Resource": detailsData[i].Resource
    //                 }
    //                 obj.push(arr);
    //             }
    //         } else {
    //             for (let i = 0; i < detailsData.length; i++) {
    //                 const arr = {
    //                     "IOUTypeID": detailsData[i].IOUTypeID,
    //                     "IOUTypeNo": "",
    //                     "ExpenseType": detailsData[i].ExpenseType,
    //                     "Amount": detailsData[i].Amount,
    //                     "Remark": detailsData[i].Remark,
    //                     "AccNo": detailsData[i].AccNo,
    //                     "CostCenter": detailsData[i].CostCenter,
    //                     "Resource": detailsData[i].Resource
    //                 }
    //                 obj.push(arr);
    //             }
    //         }
    //         saveJsonObject_To_Loog(prams);
    //         console.log("[][][][][] IOU UPLOAD JSON ", prams, '=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=--');
    //         console.log("[][][][][] IOU UPLOAD JSON job details ", obj, '=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=--');
    //         // console.log("[][][][][] IOU UPLOAD JSON attachments ", Fileobj, '=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=--');
    //         await axios.get(URL, { headers })
    //         axios.post(URL, prams, {
    //             headers: headers
    //         }).then((response) => {
    //             // console.log("[s][t][a][t][u][s][]", response.status);
    //             logger(" IOU Upload Response Status ", response.status + "");
    //             saveJsonObject_To_Loog(response.data);
    //             if (response.status == 200) {
    //                 // updateSyncStatus(IOUNo, (result: any) => {
    //                 // });
    //                 if (response.data.ErrorId == 0) {
    //                     updateIDwithStatus(IOUNo, response.data.ID, (resp: any) => {
    //                         console.log(" update id after sync ====  ", resp);
    //                         if (resp === 'success') {
    //                             updateIOUDetailLineSyncStatus(IOUNo, (resp1: any) => {
    //                             });
    //                         }
    //                     });
    //                 }
    //                 // console.log("success ======= ", response.statusText);
    //                 console.log(" IOU UPLOAD response OBJECT  === ", response.data);
    //             } else {
    //                 console.log(" IOU UPLOAD ERROR response code ======= ", response.status);
    //             }
    //         }).catch((error) => {
    //             console.log("error .....   ", error);
    //             logger(" IOU Upload ERROR ", "");
    //             saveJsonObject_To_Loog(error);
    //         });
    //     } catch (error) {
    //         // console.log(error);
    //         logger(" IOU Upload ERROR ", error + "");
    //     }
    // }
    // -------------------- Upload IOU Approved Requests -------------------------------------
    const UploadIOUApproved = () => {
        try {
        } catch (error) {
        }
    }
    // -------------------- Upload IOU-SETTLEMENTS Requests -------------------------------------
    const UploadIOUSETTLEMENTS = () => {
    }
    // -------------------- Upload ONE-OFF Requests -------------------------------------
    const UploadOneOff = () => {
    }
    // -------------------- Download IOU Types --------------------------------------
    const Download_IOU_Types = async () => {
        const URL = BASE_URL + '/Mob_GetIOUType.xsjs?dbName=' + DB_LIVE;
        console.log(" iou types ===  ", URL);
        await axios.get(URL, { headers })
            .then(response => {
                if (response.status === 200) {
                    if (response.data.length > 0) {
                        saveIOUType(response.data, (resp: any) => {
                            setOnRefresh(false);
                            // console.log("save get response ------------>>>>>  ", resp);
                            if (resp == 1) {
                                arrayindex++;
                                SyncArray1.push({
                                    name: 'IOU Type Downloading...',
                                    id: arrayindex,
                                });
                                setSyncArray(SyncArray1);
                                setOnRefresh(true);
                            } else if (resp == 2) {
                                arrayindex++;
                                SyncArray1.push({
                                    name: 'IOU Type Download Failed...',
                                    id: arrayindex,
                                });
                                setSyncArray(SyncArray1);
                                setOnRefresh(true);
                                Download_Expense_Types();
                            } else if (resp == 3) {
                                arrayindex++;
                                SyncArray1.push({
                                    name: 'IOU Type Download Successfully...',
                                    id: arrayindex,
                                });
                                setSyncArray(SyncArray1);
                                setOnRefresh(true);
                                Download_Expense_Types();
                            }
                        });
                    } else {
                        setOnRefresh(false);
                        arrayindex++;
                        SyncArray1.push({
                            name: 'No IOU Types...',
                            id: arrayindex,
                        });
                        setSyncArray(SyncArray1);
                        setOnRefresh(true);
                        Download_Expense_Types();
                    }
                } else {
                    // console.log(" response code ======= ", response.status);
                    setOnRefresh(false);
                    arrayindex++;
                    SyncArray1.push({
                        name: 'IOU Type Download Failed...',
                        id: arrayindex,
                    });
                    setSyncArray(SyncArray1);
                    setOnRefresh(true);
                    Download_Expense_Types();
                }
            })
            .catch((error) => {
                // console.log(" IOUTypes error .....   ", error);
                setOnRefresh(false);
                arrayindex++;
                SyncArray1.push({
                    name: 'IOU Type Download Failed...',
                    id: arrayindex,
                });
                setSyncArray(SyncArray1);
                setOnRefresh(true);
                Download_Expense_Types();
            });
    }
    // -------------------- Download Expence Types --------------------------------------
    const Download_Expense_Types = async () => {

        const URL = BASE_URL + '/Mob_GetExpenseTypes.xsjs?dbName=' + DB_LIVE + '&sapDbName=' + SAP_LIVE_DB;

        await axios.get(URL, { headers })
            .then(response => {

                if (response.status === 200) {

                    if (response.data.length > 0) {

                        saveExpenseType(response.data, (resp: any) => {

                            setOnRefresh(false);

                            if (resp == 1) {

                                arrayindex++;

                                SyncArray1.push({
                                    name: 'Expense Type Downloading...',
                                    id: arrayindex,
                                });

                                setSyncArray(SyncArray1);
                                setOnRefresh(true);

                            } else if (resp == 2) {

                                arrayindex++;

                                SyncArray1.push({
                                    name: 'Expense Type Download Failed...',
                                    id: arrayindex,
                                });

                                setSyncArray(SyncArray1);
                                setOnRefresh(true);
                                Download_User_Rolls();


                            } else if (resp == 3) {

                                arrayindex++;

                                SyncArray1.push({
                                    name: 'Expense Type Download Successfully...',
                                    id: arrayindex,
                                });

                                setSyncArray(SyncArray1);
                                setOnRefresh(true);

                                Download_User_Rolls();
                            }


                        });


                    } else {

                        setOnRefresh(false);

                        arrayindex++;

                        SyncArray1.push({
                            name: 'No Expense Types...',
                            id: arrayindex,
                        });

                        setSyncArray(SyncArray1);
                        setOnRefresh(true);
                        Download_User_Rolls();

                    }


                } else {

                    // console.log(" response code ======= ", response.status);

                    setOnRefresh(false);

                    arrayindex++;
                    SyncArray1.push({
                        name: 'Expense Type Download Failed...',
                        id: arrayindex,
                    });
                    setSyncArray(SyncArray1);
                    setOnRefresh(true);

                    Download_User_Rolls();

                }


            })
            .catch((error) => {

                // console.log(" Expense Types error .....   ", error);

                setOnRefresh(false);

                arrayindex++;
                SyncArray1.push({
                    name: 'Expense Type Download Failed...',
                    id: arrayindex,
                });
                setSyncArray(SyncArray1);
                setOnRefresh(true);

                Download_User_Rolls();

            });

    }
    // //----------------------Download Max Amount -------------------------------------

    const Download_MaximumAmount = async () => {
        const URL2 = BASE_URL + "/Mob_GetRequestMaxAmount.xsjs?dbName=" + DB_LIVE;

        await axios.get(URL2, { headers }
        ).then(async response => {
            if (response.status === 200) {

                await AsyncStorage.setItem(AsyncStorageConstants.ASYNC_STORAGE_JOBOWNER_APPROVAL_AMOUNT, response.data[0].JobOwnerApprovalAmount);

                await AsyncStorage.setItem(AsyncStorageConstants.ASYNC_STORAGE_MAXIMUM_REQUEST_AMOUNT, response.data[0].IOUMaxAmount);

                Download_User_Rolls();


            } else {

                Alert.alert(
                    "Bad Request!",
                    "Download Amount Failed...",
                    [
                        { text: "OK", onPress: () => console.log(response.data) }
                    ]
                );

                Download_User_Rolls();

            }
        }



        ).catch((err: any) => {
            Alert.alert(
                "Download Amount Failed!",
                "Server not Connected...",
                [
                    { text: "OK", onPress: () => console.log(err) }
                ]
            );

            Download_User_Rolls();
        });

    }
    // -------------------- Download User Rolls --------------------------------------
    const Download_User_Rolls = async () => {

        const URL = BASE_URL + '/Mob_GetUserRoleMaster.xsjs?dbName=' + DB_LIVE;

        await axios.get(URL, { headers })
            .then(response => {

                if (response.status === 200) {

                    if (response.data.length > 0) {

                        saveUserRolls(response.data, (resp: any) => {

                            setOnRefresh(false);

                            if (resp == 1) {

                                arrayindex++;

                                SyncArray1.push({
                                    name: 'User Roles Downloading...',
                                    id: arrayindex,
                                });

                                setSyncArray(SyncArray1);
                                setOnRefresh(true);

                            } else if (resp == 2) {

                                arrayindex++;

                                SyncArray1.push({
                                    name: 'User Roles Download Failed...',
                                    id: arrayindex,
                                });

                                setSyncArray(SyncArray1);
                                setOnRefresh(true);
                                Download_Users();


                            } else if (resp == 3) {

                                arrayindex++;

                                SyncArray1.push({
                                    name: 'User Roles Download Successfully...',
                                    id: arrayindex,
                                });

                                setSyncArray(SyncArray1);
                                setOnRefresh(true);

                                Download_Users();
                            }


                        });


                    } else {

                        setOnRefresh(false);

                        arrayindex++;

                        SyncArray1.push({
                            name: 'No User Roles...',
                            id: arrayindex,
                        });

                        setSyncArray(SyncArray1);
                        setOnRefresh(true);
                        Download_Users();

                    }


                } else {

                    //console.log(" response code ======= ", response.status);

                    setOnRefresh(false);

                    arrayindex++;
                    SyncArray1.push({
                        name: 'User Roles Download Failed...',
                        id: arrayindex,
                    });
                    setSyncArray(SyncArray1);
                    setOnRefresh(true);

                    Download_Users();

                }


            })
            .catch((error) => {

                // console.log(" User Roles error .....   ", error);

                setOnRefresh(false);

                arrayindex++;
                SyncArray1.push({
                    name: 'User Roles Download Failed...',
                    id: arrayindex,
                });
                setSyncArray(SyncArray1);
                setOnRefresh(true);

                Download_Users();

            });

    }
    // -------------------- Download Users --------------------------------------
    const Download_Users = async () => {

        const URL = BASE_URL + '/Mob_GetUserMaster.xsjs?dbName=' + DB_LIVE;

        await axios.get(URL, { headers })
            .then(response => {

                if (response.status === 200) {

                    if (response.data.length > 0) {

                        saveUser(response.data, (resp: any) => {


                            setOnRefresh(false);

                            if (resp == 1) {

                                arrayindex++;

                                SyncArray1.push({
                                    name: 'User Downloading...',
                                    id: arrayindex,
                                });

                                setSyncArray(SyncArray1);
                                setOnRefresh(true);

                            } else if (resp == 2) {

                                arrayindex++;

                                SyncArray1.push({
                                    name: 'User Download Failed...',
                                    id: arrayindex,
                                });

                                setSyncArray(SyncArray1);
                                setOnRefresh(true);
                                Download_VehicleNo();


                            } else if (resp == 3) {

                                arrayindex++;

                                SyncArray1.push({
                                    name: 'User Download Successfully...',
                                    id: arrayindex,
                                });

                                setSyncArray(SyncArray1);
                                setOnRefresh(true);

                                Download_VehicleNo();
                            }



                        });

                    } else {

                        setOnRefresh(false);

                        arrayindex++;
                        SyncArray1.push({
                            name: 'No available Users...',
                            id: arrayindex,
                        });
                        setSyncArray(SyncArray1);
                        setOnRefresh(true);

                        Download_VehicleNo();

                    }

                } else {

                    // console.log(" response code ======= ", response.status);

                    setOnRefresh(false);

                    arrayindex++;
                    SyncArray1.push({
                        name: 'User Download Failed...',
                        id: arrayindex,
                    });
                    setSyncArray(SyncArray1);
                    setOnRefresh(true);

                    Download_VehicleNo();
                }


            })
            .catch((error) => {

                // console.log(" IOUTypes error .....   ", error);

                setOnRefresh(false);

                arrayindex++;
                SyncArray1.push({
                    name: 'User Download Failed...',
                    id: arrayindex,
                });
                setSyncArray(SyncArray1);
                setOnRefresh(true);
                Download_VehicleNo();
            });

    }
    // -------------------- Download Vehicle No --------------------------------------
    const Download_VehicleNo = async () => {

        const URL = BASE_URL + '/Mob_GetAllVehicleNumbers.xsjs?dbName=' + DB_LIVE + '&sapDbName=' + SAP_LIVE_DB + '&ResType=VEHICLE';


        await axios.get(URL, { headers })
            .then(response => {

                if (response.status === 200) {

                    if (response.data.length > 0) {

                        saveVehicleNo(response.data, (resp: any) => {

                            // console.log(" Vehicle No ======= ", resp);

                            setOnRefresh(false);

                            if (resp == 1) {

                                arrayindex++;

                                SyncArray1.push({
                                    name: 'Vehicle No Downloading...',
                                    id: arrayindex,
                                });

                                setSyncArray(SyncArray1);
                                setOnRefresh(true);

                            } else if (resp == 2) {

                                arrayindex++;

                                SyncArray1.push({
                                    name: 'Vehicle No Download Failed...',
                                    id: arrayindex,
                                });

                                setSyncArray(SyncArray1);
                                setOnRefresh(true);
                                Download_Departments();

                            } else if (resp == 3) {

                                arrayindex++;

                                SyncArray1.push({
                                    name: 'Vehicle No Download Successfully...',
                                    id: arrayindex,
                                });

                                setSyncArray(SyncArray1);
                                setOnRefresh(true);

                                Download_Departments();
                            }

                        });

                    } else {

                        setOnRefresh(false);

                        arrayindex++;
                        SyncArray1.push({
                            name: 'No available Vehicle No for download...',
                            id: arrayindex,
                        });
                        setSyncArray(SyncArray1);
                        setOnRefresh(true);

                        Download_Departments();

                    }

                } else {

                    // console.log(" response code ======= ", response.status);

                    setOnRefresh(false);

                    arrayindex++;
                    SyncArray1.push({
                        name: 'Vehicle Download Failed...',
                        id: arrayindex,
                    });
                    setSyncArray(SyncArray1);
                    setOnRefresh(true);

                    Download_Departments();

                }


            })
            .catch((error) => {

                console.log(" VehicleNo error .....   ", error);

                setOnRefresh(false);

                arrayindex++;
                SyncArray1.push({
                    name: 'Vehicle Download Failed...',
                    id: arrayindex,
                });
                setSyncArray(SyncArray1);
                setOnRefresh(true);

                Download_Departments();


            });

    }
    // -------------------- Download Departments --------------------------------------
    const Download_Departments = async () => {

        const URL = BASE_URL + '/Mob_GetAllDepartment.xsjs?dbName=' + DB_LIVE;

        console.log("DOWNLOAD DEPARTMENTS ==============  ", URL);


        try {

            await axios.get(URL, { headers })
                .then(response => {

                    if (response.status === 200) {

                        if (response.data.length > 0) {

                            saveDepartment(response.data, (resp: any) => {

                                // console.log(" Vehicle No ======= ", resp);

                                setOnRefresh(false);

                                if (resp == 1) {

                                    arrayindex++;

                                    SyncArray1.push({
                                        name: 'Departments Downloading...',
                                        id: arrayindex,
                                    });

                                    setSyncArray(SyncArray1);
                                    setOnRefresh(true);

                                } else if (resp == 2) {

                                    arrayindex++;

                                    SyncArray1.push({
                                        name: 'Departments Download Failed...',
                                        id: arrayindex,
                                    });

                                    setSyncArray(SyncArray1);
                                    setOnRefresh(true);
                                    Download_Employee();


                                } else if (resp == 3) {

                                    arrayindex++;

                                    SyncArray1.push({
                                        name: 'Departments Download Successfully...',
                                        id: arrayindex,
                                    });

                                    setSyncArray(SyncArray1);
                                    setOnRefresh(true);

                                    Download_Employee();
                                }

                            });

                        } else {

                            setOnRefresh(false);

                            arrayindex++;
                            SyncArray1.push({
                                name: 'No available Departments for download...',
                                id: arrayindex,
                            });
                            setSyncArray(SyncArray1);
                            setOnRefresh(true);

                            Download_Employee();

                        }

                    } else {

                        // console.log(" response code ======= ", response.status);

                        setOnRefresh(false);

                        arrayindex++;
                        SyncArray1.push({
                            name: 'Departments Download Failed...',
                            id: arrayindex,
                        });
                        setSyncArray(SyncArray1);
                        setOnRefresh(true);

                        Download_Employee();
                    }


                })
                .catch((error) => {

                    // console.log(" Departments error .....   ", error);

                    setOnRefresh(false);

                    arrayindex++;
                    SyncArray1.push({
                        name: 'Departments Download Failed...',
                        id: arrayindex,
                    });
                    setSyncArray(SyncArray1);
                    setOnRefresh(true);

                    Download_Employee();


                });

        } catch (error) {

            console.log("error === ", error);


            setOnRefresh(false);

            arrayindex++;
            SyncArray1.push({
                name: 'Departments Download Failed...',
                id: arrayindex,
            });
            setSyncArray(SyncArray1);
            setOnRefresh(true);

            Download_Employee();

        }


    }
    // -------------------------- Download Employees -------------------------------------
    const Download_Employee = async () => {

        const URL = BASE_URL + '/Mob_GetAllEmployee.xsjs?dbName=' + DB_LIVE;


        await axios.get(URL, { headers })
            .then(response => {

                if (response.status === 200) {

                    if (response.data.data.length > 0) {

                        saveEmployee(response.data.data, (resp: any) => {

                            // console.log(" Vehicle No ======= ", resp);

                            setOnRefresh(false);

                            if (resp == 1) {

                                arrayindex++;

                                SyncArray1.push({
                                    name: 'Employees Downloading...',
                                    id: arrayindex,
                                });

                                setSyncArray(SyncArray1);
                                setOnRefresh(true);

                            } else if (resp == 2) {

                                arrayindex++;

                                SyncArray1.push({
                                    name: 'Employees Download Failed...',
                                    id: arrayindex,
                                });

                                setSyncArray(SyncArray1);
                                setOnRefresh(true);
                                Download_JobOwners();

                            } else if (resp == 3) {

                                arrayindex++;

                                SyncArray1.push({
                                    name: 'Employees Download Successfully...',
                                    id: arrayindex,
                                });

                                setSyncArray(SyncArray1);
                                setOnRefresh(true);

                                Download_JobOwners();
                            }

                        });

                    } else {

                        setOnRefresh(false);

                        arrayindex++;
                        SyncArray1.push({
                            name: 'No available Employees for download...',
                            id: arrayindex,
                        });
                        setSyncArray(SyncArray1);
                        setOnRefresh(true);

                        Download_JobOwners();

                    }

                } else {

                    // console.log(" response code ======= ", response.status);

                    setOnRefresh(false);

                    arrayindex++;
                    SyncArray1.push({
                        name: 'Employees Download Failed...',
                        id: arrayindex,
                    });
                    setSyncArray(SyncArray1);
                    setOnRefresh(true);

                    Download_JobOwners();

                }


            })
            .catch((error) => {

                // console.log(" Departments error .....   ", error);

                setOnRefresh(false);

                arrayindex++;
                SyncArray1.push({
                    name: 'Employees Download Failed...',
                    id: arrayindex,
                });
                setSyncArray(SyncArray1);
                setOnRefresh(true);

                Download_JobOwners();


            });

    }
    // -------------------- Download Job Owners --------------------------------------
    const Download_JobOwners = async () => {

        const URL = BASE_URL + '/Mob_GetJobOwners.xsjs?dbName=' + DB_LIVE + '&sapDbName=' + SAP_LIVE_DB;

        try {

            getAllJobOwners((response: any) => {

                if (response.length > 0) {


                    saveJobOwners(response, (resp: any) => {

                        setOnRefresh(false);

                        if (resp == 1) {

                            arrayindex++;

                            SyncArray1.push({
                                name: 'Job Owner Downloading...',
                                id: arrayindex,
                            });

                            setSyncArray(SyncArray1);
                            setOnRefresh(true);

                        } else if (resp == 2) {

                            arrayindex++;

                            SyncArray1.push({
                                name: 'Job Owner Download Failed...',
                                id: arrayindex,
                            });

                            setSyncArray(SyncArray1);
                            setOnRefresh(true);
                            Download_JobNo();

                        } else if (resp == 3) {

                            arrayindex++;

                            SyncArray1.push({
                                name: 'Job Owner Download Successfully...',
                                id: arrayindex,
                            });

                            setSyncArray(SyncArray1);
                            setOnRefresh(true);

                            Download_JobNo();
                        }


                    });



                } else {

                    Download_JobNo();

                }

            });


        } catch (error) {

            Download_JobNo();

        }


        // await axios.get(URL, { headers })
        //     .then(response => {

        //         if (response.status === 200) {

        //             if (response.data.length > 0) {

        //                 saveJobOwners(response.data, (resp: any) => {

        //                     setOnRefresh(false);

        //                     if (resp == 1) {

        //                         arrayindex++;

        //                         SyncArray1.push({
        //                             name: 'Job Owner Downloading...',
        //                             id: arrayindex,
        //                         });

        //                         setSyncArray(SyncArray1);
        //                         setOnRefresh(true);

        //                     } else if (resp == 2) {

        //                         arrayindex++;

        //                         SyncArray1.push({
        //                             name: 'Job Owner Download Failed...',
        //                             id: arrayindex,
        //                         });

        //                         setSyncArray(SyncArray1);
        //                         setOnRefresh(true);
        //                         Download_JobNo();

        //                     } else if (resp == 3) {

        //                         arrayindex++;

        //                         SyncArray1.push({
        //                             name: 'Job Owner Download Successfully...',
        //                             id: arrayindex,
        //                         });

        //                         setSyncArray(SyncArray1);
        //                         setOnRefresh(true);

        //                         Download_JobNo();
        //                     }


        //                 });


        //             } else {

        //                 setOnRefresh(false);

        //                 arrayindex++;
        //                 SyncArray1.push({
        //                     name: 'No available Job Owners for Download...',
        //                     id: arrayindex,
        //                 });
        //                 setSyncArray(SyncArray1);
        //                 setOnRefresh(true);

        //                 Download_JobNo();


        //             }



        //         } else {

        //             // console.log(" response code ======= ", response.status);

        //             setOnRefresh(false);

        //             arrayindex++;
        //             SyncArray1.push({
        //                 name: 'Job Owner Download Failed...',
        //                 id: arrayindex,
        //             });
        //             setSyncArray(SyncArray1);
        //             setOnRefresh(true);

        //             Download_JobNo();

        //         }


        //     })
        //     .catch((error) => {

        //         // console.log(" Vehicle No error .....   ", error);

        //         setOnRefresh(false);

        //         arrayindex++;
        //         SyncArray1.push({
        //             name: 'Job Owner Download Failed...',
        //             id: arrayindex,
        //         });
        //         setSyncArray(SyncArray1);
        //         setOnRefresh(true);


        //         Download_JobNo();

        //     });

    }
    // -------------------- Download Job No -------------------------------------------
    const Download_JobNo = async () => {

        const URL = BASE_URL + '/Mob_GetJobOwnerDetails.xsjs?dbName=' + DB_LIVE;

        console.log(" DOWNLOAD JOB NO ======  ", URL);


        await axios.get(URL, { headers })
            .then(response => {

                if (response.status === 200) {

                    if (response.data.length > 0) {

                        saveJobNo(response.data, (resp: any) => {

                            setOnRefresh(false);

                            if (resp == 1) {

                                arrayindex++;

                                SyncArray1.push({
                                    name: 'Job No Downloading...',
                                    id: arrayindex,
                                });

                                setSyncArray(SyncArray1);
                                setOnRefresh(true);

                            } else if (resp == 2) {

                                arrayindex++;

                                SyncArray1.push({
                                    name: 'Job No Download Failed...',
                                    id: arrayindex,
                                });

                                setSyncArray(SyncArray1);
                                setOnRefresh(true);
                                Download_GL_ACCOUNT();

                            } else if (resp == 3) {

                                arrayindex++;

                                SyncArray1.push({
                                    name: 'Job No Download Successfully...',
                                    id: arrayindex,
                                });

                                setSyncArray(SyncArray1);
                                setOnRefresh(true);

                                Download_GL_ACCOUNT();
                            }


                        });


                    } else {

                        setOnRefresh(false);

                        arrayindex++;

                        SyncArray1.push({
                            name: 'No available Job No for Download...',
                            id: arrayindex,
                        });

                        setSyncArray(SyncArray1);
                        setOnRefresh(true);

                        Download_GL_ACCOUNT();

                    }



                } else {

                    // console.log(" response code ======= ", response.status);
                    setOnRefresh(false);

                    arrayindex++;

                    SyncArray1.push({
                        name: 'Job No Download Failed...',
                        id: arrayindex,
                    });

                    setSyncArray(SyncArray1);
                    setOnRefresh(true);

                    Download_GL_ACCOUNT();
                }


            })
            .catch((error) => {

                // console.log(" JobNo error .....   ", error);
                setOnRefresh(false);

                arrayindex++;

                SyncArray1.push({
                    name: 'Job No Download Failed...',
                    id: arrayindex,
                });

                setSyncArray(SyncArray1);
                setOnRefresh(true);


                Download_GL_ACCOUNT();

            });

    }
    // -------------------- Download GL Accounts -------------------------------------------
    const Download_GL_ACCOUNT = async () => {
        const URL = COMMON_BASE_URL + '/GetAllGLAccounts.xsjs?dbName=' + DB_LIVE;
        // console.log("DOWNLOAD GL ACCOUNT =====  " , URL);
        await axios.get(URL, { headers })
            .then(response => {
                if (response.status === 200) {
                    // console.log(" GL Accounts ===    " , response.data);
                    if (response.data.length > 0) {
                        saveGLAccount(response.data, (resp: any) => {
                            setOnRefresh(false);
                            if (resp == 1) {
                                arrayindex++;
                                SyncArray1.push({
                                    name: 'GL Accounts Downloading...',
                                    id: arrayindex,
                                });
                                setSyncArray(SyncArray1);
                                setOnRefresh(true);
                            } else if (resp == 2) {
                                arrayindex++;
                                SyncArray1.push({
                                    name: 'GL Accounts Download Failed...',
                                    id: arrayindex,
                                });
                                setSyncArray(SyncArray1);
                                setOnRefresh(true);
                                Download_IOURequest();
                            } else if (resp == 3) {
                                arrayindex++;
                                SyncArray1.push({
                                    name: 'GL Accounts Download Successfully...',
                                    id: arrayindex,
                                });
                                setSyncArray(SyncArray1);
                                setOnRefresh(true);
                                Download_IOURequest();
                            }
                        });
                    } else {
                        setOnRefresh(false);
                        arrayindex++;
                        SyncArray1.push({
                            name: 'No available GL Accounts for Download...',
                            id: arrayindex,
                        });
                        setSyncArray(SyncArray1);
                        setOnRefresh(true);
                        Download_IOURequest();
                    }
                } else {
                    // console.log(" response code ======= ", response.status);
                    setOnRefresh(false);
                    arrayindex++;
                    SyncArray1.push({
                        name: 'GL Accounts Download Failed...',
                        id: arrayindex,
                    });
                    setSyncArray(SyncArray1);
                    setOnRefresh(true);
                    Download_IOURequest();
                }
            })
            .catch((error) => {
                console.log(" GL ACCOUNT  .....   ", error);
                setOnRefresh(false);
                arrayindex++;
                SyncArray1.push({
                    name: 'GL Accounts Download Failed...',
                    id: arrayindex,
                });
                setSyncArray(SyncArray1);
                setOnRefresh(true);
                Download_IOURequest();
            });
    }
    // -------------------- Download IOU Request --------------------------------------
    const Download_IOURequest = async () => {
        console.log(" user ID ==== ", userID);
        const URL = BASE_URL + '/Mob_GetAllIOURequest.xsjs?dbName=' + DB_LIVE + '&emp=' + userID;
        await axios.get(URL, { headers })
            .then(response => {
                if (response.status === 200) {
                    //console.log(response.data.header,'=====================');
                    if (response.data.header.length > 0) {
                        saveIOU(response.data.header, 1, (resp: any) => {
                            // console.log("save IOU ------------>>>>>  ", resp);
                            setOnRefresh(false);
                            if (resp == 1) {
                                arrayindex++;
                                SyncArray1.push({
                                    name: 'IOU Request Downloading...',
                                    id: arrayindex,
                                });
                                setSyncArray(SyncArray1);
                                setOnRefresh(true);
                            } else if (resp == 2) {
                                arrayindex++;
                                SyncArray1.push({
                                    name: 'IOU Request Download Failed...',
                                    id: arrayindex,
                                });
                                setSyncArray(SyncArray1);
                                setOnRefresh(true);
                                Download_IOUSETRequest();
                            } else if (resp == 3) {
                                arrayindex++;
                                SyncArray1.push({
                                    name: 'IOU Request Download Successfully...',
                                    id: arrayindex,
                                });
                                setSyncArray(SyncArray1);
                                setOnRefresh(true);
                                Download_IOUSETRequest();
                            }
                        });


                    } else {

                        setOnRefresh(false);

                        arrayindex++;

                        SyncArray1.push({
                            name: 'No available IOU Request for Download...',
                            id: arrayindex,
                        });

                        setSyncArray(SyncArray1);
                        setOnRefresh(true);

                        Download_IOUSETRequest();

                    }



                } else {

                    // console.log(" response code ======= ", response.status);

                    setOnRefresh(false);

                    arrayindex++;

                    SyncArray1.push({
                        name: 'IOU Request Download Failed...',
                        id: arrayindex,
                    });

                    setSyncArray(SyncArray1);
                    setOnRefresh(true);

                    Download_IOUSETRequest();

                }


            })
            .catch((error) => {

                // console.log(" IOUTypes error .....   ", error);

                setOnRefresh(false);

                arrayindex++;

                SyncArray1.push({
                    name: 'IOU Request Download Failed...',
                    id: arrayindex,
                });

                setSyncArray(SyncArray1);
                setOnRefresh(true);

                Download_IOUSETRequest();
            });

    }
    // -------------------- Download IOU Settlement Request --------------------------------------
    const Download_IOUSETRequest = async () => {

        const URL = BASE_URL + '/Mob_GetAllIOUSettlements.xsjs?dbName=' + DB_LIVE + '&emp=' + userID;

        await axios.get(URL, { headers })
            .then(response => {

                if (response.status === 200) {

                    if (response.data.header.length > 0) {

                        saveIOUSettlement(response.data.header, 1, (resp: any) => {

                            // console.log("save IOU SET ------------>>>>>  ", resp);

                            setOnRefresh(false);

                            if (resp == 1) {

                                arrayindex++;

                                SyncArray1.push({
                                    name: 'IOU Settlment Request Downloading...',
                                    id: arrayindex,
                                });

                                setSyncArray(SyncArray1);
                                setOnRefresh(true);

                            } else if (resp == 2) {

                                arrayindex++;

                                SyncArray1.push({
                                    name: 'IOU Settlment Request Download Failed...',
                                    id: arrayindex,
                                });

                                setSyncArray(SyncArray1);
                                setOnRefresh(true);

                                Download_ONE_OFF_SETRequest();

                            } else if (resp == 3) {

                                arrayindex++;

                                SyncArray1.push({
                                    name: 'IOU Settlment Request Download Successfully...',
                                    id: arrayindex,
                                });

                                setSyncArray(SyncArray1);
                                setOnRefresh(true);

                                Download_ONE_OFF_SETRequest();
                            }

                        });


                    } else {

                        setOnRefresh(false);

                        arrayindex++;

                        SyncArray1.push({
                            name: 'No available IOU Settlment Requests for Download...',
                            id: arrayindex,
                        });

                        setSyncArray(SyncArray1);
                        setOnRefresh(true);

                        Download_ONE_OFF_SETRequest();

                    }



                } else {

                    // console.log(" response code ======= ", response.status);

                    setOnRefresh(false);

                    arrayindex++;

                    SyncArray1.push({
                        name: 'IOU Settlment Request Download Failed...',
                        id: arrayindex,
                    });

                    setSyncArray(SyncArray1);
                    setOnRefresh(true);

                    Download_ONE_OFF_SETRequest();

                }


            })
            .catch((error) => {

                // console.log(" IOUTypes error .....   ", error);

                setOnRefresh(false);

                arrayindex++;

                SyncArray1.push({
                    name: 'IOU Settlment Request Download Failed...',
                    id: arrayindex,
                });

                setSyncArray(SyncArray1);
                setOnRefresh(true);

                Download_ONE_OFF_SETRequest();

            });

    }
    // -------------------- Download One-Off Settlement Request --------------------------------------
    const Download_ONE_OFF_SETRequest = async () => {

        const URL = BASE_URL + '/Mob_GetAllOneOffSettlements.xsjs?dbName=' + DB_LIVE + '&emp=' + userID;

        await axios.get(URL, { headers })
            .then(response => {

                if (response.status === 200) {

                    if (response.data.header.length > 0) {

                        saveOneOffSettlement(response.data.header, 1, (resp: any) => {

                            // console.log("save ONE OFF ------------>>>>>  ", resp);


                            setOnRefresh(false);

                            if (resp == 1) {

                                arrayindex++;

                                SyncArray1.push({
                                    name: 'One-Off Settlment Request Downloading...',
                                    id: arrayindex,
                                });

                                setSyncArray(SyncArray1);
                                setOnRefresh(true);

                            } else if (resp == 2) {

                                arrayindex++;

                                SyncArray1.push({
                                    name: 'One-Off Settlment Request Download Failed...',
                                    id: arrayindex,
                                });

                                setSyncArray(SyncArray1);
                                setOnRefresh(true);
                                Download_IOUSETJOBS();


                            } else if (resp == 3) {

                                arrayindex++;

                                SyncArray1.push({
                                    name: 'One-Off Settlment Request Download Successfully...',
                                    id: arrayindex,
                                });

                                setSyncArray(SyncArray1);
                                setOnRefresh(true);
                                Download_IOUSETJOBS();

                            }



                        });

                    } else {

                        setOnRefresh(false);

                        arrayindex++;

                        SyncArray1.push({
                            name: 'No available One-Off Settlment Requests for Download...',
                            id: arrayindex,
                        });

                        setSyncArray(SyncArray1);
                        setOnRefresh(true);
                        Download_IOUSETJOBS();

                    }



                } else {

                    // console.log(" response code ======= ", response.status);

                    setOnRefresh(false);

                    arrayindex++;

                    SyncArray1.push({
                        name: 'One-Off Settlment Request Download Failed...',
                        id: arrayindex,
                    });

                    setSyncArray(SyncArray1);
                    setOnRefresh(true);

                    Download_IOUSETJOBS();

                }


            })
            .catch((error) => {

                // console.log(" One-Off download  error .....   ", error);

                setOnRefresh(false);

                arrayindex++;

                SyncArray1.push({
                    name: 'One-Off Settlment Request Download Failed...',
                    id: arrayindex,
                });

                setSyncArray(SyncArray1);
                setOnRefresh(true);
                Download_IOUSETJOBS();

            });

    }
    // -------------------- Download IOU Settlement JOBS Request --------------------------------------
    const Download_IOUSETJOBS = async () => {

        DeleteSETSyncedDetailLine(async (resp: any) => {
            console.log("delete set jobs =============   ", resp);

            if (resp === 'success') {

                const URL = BASE_URL + '/Mob_GetAllIOUSettlements.xsjs?dbName=' + DB_LIVE + '&emp=' + userID;

                await axios.get(URL, { headers })
                    .then(response => {

                        if (response.status === 200) {

                            if (response.data.detail.length > 0) {

                                saveIOUSETJOB(response.data.detail, 1, (resp: any) => {

                                    // console.log("save IOUSET JOBS ------------>>>>>  ", resp);


                                    setOnRefresh(false);

                                    if (resp == 1) {

                                        arrayindex++;

                                        SyncArray1.push({
                                            name: 'IOU Set Jobs Downloading...',
                                            id: arrayindex,
                                        });

                                        setSyncArray(SyncArray1);
                                        setOnRefresh(true);

                                    } else if (resp == 2) {

                                        arrayindex++;

                                        SyncArray1.push({
                                            name: 'IOU Set Jobs Download Failed...',
                                            id: arrayindex,
                                        });

                                        setSyncArray(SyncArray1);
                                        setOnRefresh(true);
                                        Download_ONEOFFJOBS();


                                    } else if (resp == 3) {

                                        arrayindex++;

                                        SyncArray1.push({
                                            name: 'IOU Set Jobs Download Successfully...',
                                            id: arrayindex,
                                        });

                                        setSyncArray(SyncArray1);
                                        setOnRefresh(true);
                                        Download_ONEOFFJOBS();

                                    }



                                });

                            } else {

                                setOnRefresh(false);

                                arrayindex++;

                                SyncArray1.push({
                                    name: 'No available IOU Set Jobs for Download...',
                                    id: arrayindex,
                                });

                                setSyncArray(SyncArray1);
                                setOnRefresh(true);
                                Download_ONEOFFJOBS();

                            }



                        } else {

                            // console.log(" response code ======= ", response.status);

                            setOnRefresh(false);

                            arrayindex++;

                            SyncArray1.push({
                                name: 'IOU Set Jobs Download Failed...',
                                id: arrayindex,
                            });

                            setSyncArray(SyncArray1);
                            setOnRefresh(true);

                            Download_ONEOFFJOBS();

                        }


                    })
                    .catch((error) => {

                        // console.log(" IOUSET JOBS download  error .....   ", error);

                        setOnRefresh(false);

                        arrayindex++;

                        SyncArray1.push({
                            name: 'IOU Set Jobs Download Failed...',
                            id: arrayindex,
                        });

                        setSyncArray(SyncArray1);
                        setOnRefresh(true);
                        Download_ONEOFFJOBS();

                    });


            }

        });


    }
    // -------------------- Download OneOff JOBS Request --------------------------------------
    const Download_ONEOFFJOBS = async () => {

        DeleteOneOffSyncedDetailLine(async (resp: any) => {
            console.log("delete one-off jobs =============   ", resp);
            if (resp === 'success') {

                const URL = BASE_URL + '/Mob_GetAllOneOffSettlements.xsjs?dbName=' + DB_LIVE + '&emp=' + userID;

                await axios.get(URL, { headers })
                    .then(response => {

                        if (response.status === 200) {

                            if (response.data.detail.length > 0) {

                                saveOneOffJOB(response.data.detail, 1, (resp: any) => {

                                    // console.log("save ONEOFF JOBS ------------>>>>>  ", resp);


                                    setOnRefresh(false);

                                    if (resp == 1) {

                                        arrayindex++;

                                        SyncArray1.push({
                                            name: 'One-off Jobs Downloading...',
                                            id: arrayindex,
                                        });

                                        setSyncArray(SyncArray1);
                                        setOnRefresh(true);

                                    } else if (resp == 2) {

                                        arrayindex++;

                                        SyncArray1.push({
                                            name: 'One-off Jobs Download Failed...',
                                            id: arrayindex,
                                        });

                                        setSyncArray(SyncArray1);
                                        setOnRefresh(true);
                                        Download_IOUJobs();


                                    } else if (resp == 3) {

                                        arrayindex++;

                                        SyncArray1.push({
                                            name: 'One-off Jobs Download Successfully...',
                                            id: arrayindex,
                                        });

                                        setSyncArray(SyncArray1);
                                        setOnRefresh(true);
                                        Download_IOUJobs();

                                    }



                                });

                            } else {

                                setOnRefresh(false);

                                arrayindex++;

                                SyncArray1.push({
                                    name: 'No available One-off Jobs for Download...',
                                    id: arrayindex,
                                });

                                setSyncArray(SyncArray1);
                                setOnRefresh(true);
                                Download_IOUJobs();

                            }



                        } else {

                            // console.log(" response code ======= ", response.status);

                            setOnRefresh(false);

                            arrayindex++;

                            SyncArray1.push({
                                name: 'One-off Jobs Download Failed...',
                                id: arrayindex,
                            });

                            setSyncArray(SyncArray1);
                            setOnRefresh(true);

                            Download_IOUJobs();

                        }


                    })
                    .catch((error) => {

                        // console.log(" ONEOFF JOBS download  error .....   ", error);

                        setOnRefresh(false);

                        arrayindex++;

                        SyncArray1.push({
                            name: 'One-off Jobs Download Failed...',
                            id: arrayindex,
                        });

                        setSyncArray(SyncArray1);
                        setOnRefresh(true);
                        Download_IOUJobs();

                    });

            }
        });



    }
    // -------------------- Download IOU Job Data --------------------------------------
    const Download_IOUJobs = async () => {

        DeleteIOUSyncedDetailLine(async (resp: any) => {
            console.log("delete iou jobs =============   ", resp);
            if (resp === 'success') {

                const URL = BASE_URL + '/Mob_GetAllIOURequest.xsjs?dbName=' + DB_LIVE + '&emp=' + userID;

                console.log(" IOU JOBS URL ==== ", URL);


                await axios.get(URL, { headers })
                    .then(response => {

                        // console.log(response.status);
                        if (response.status === 200) {

                            //console.log(response.data.details, '=====================');
                            // console.log(response.status);

                            if (response.data.detail.length > 0) {

                                saveIOUJOB(response.data.detail, 1, (resp: any) => {

                                    setOnRefresh(false);

                                    if (resp == 1) {

                                        arrayindex++;

                                        SyncArray1.push({
                                            name: 'Jobs Downloading...',
                                            id: arrayindex,
                                        });

                                        setSyncArray(SyncArray1);
                                        setOnRefresh(true);

                                    } else if (resp == 2) {

                                        arrayindex++;

                                        SyncArray1.push({
                                            name: 'Jobs Download Failed...',
                                            id: arrayindex,
                                        });

                                        setSyncArray(SyncArray1);
                                        setOnRefresh(true);

                                        setOnRefresh(false);

                                        arrayindex++;

                                        SyncArray1.push({
                                            name: 'Finished...',
                                            id: arrayindex,
                                        });
                                        setSyncArray(SyncArray1);

                                        setOnRefresh(true);
                                        setOnRefresh(false);
                                        SetCloseBtnSync(true)
                                        AsyncStorage.setItem(AsyncStorageConstants.ASYNC_CHECK_SYNC, "2")
                                        OnLoadData();


                                    } else if (resp == 3) {

                                        arrayindex++;

                                        SyncArray1.push({
                                            name: 'Jobs Download Successfully...',
                                            id: arrayindex,
                                        });

                                        setSyncArray(SyncArray1);
                                        setOnRefresh(true);

                                        arrayindex++;

                                        SyncArray1.push({
                                            name: 'Finished...',
                                            id: arrayindex,
                                        });
                                        setSyncArray(SyncArray1);

                                        setOnRefresh(true);
                                        setOnRefresh(false);
                                        SetCloseBtnSync(true)
                                        AsyncStorage.setItem(AsyncStorageConstants.ASYNC_CHECK_SYNC, "2")
                                        OnLoadData();


                                    }




                                });

                            } else {

                                setOnRefresh(false);

                                arrayindex++;

                                SyncArray1.push({
                                    name: 'No available Jobs for Download...',
                                    id: arrayindex,
                                });

                                setSyncArray(SyncArray1);
                                setOnRefresh(true);

                                arrayindex++;

                                SyncArray1.push({
                                    name: 'Finished...',
                                    id: arrayindex,
                                });
                                setSyncArray(SyncArray1);

                                setOnRefresh(true);
                                setOnRefresh(false);
                                SetCloseBtnSync(true)
                                AsyncStorage.setItem(AsyncStorageConstants.ASYNC_CHECK_SYNC, "2")
                                OnLoadData();

                            }



                        } else {

                            // console.log(" response code ======= ", response.status);

                            setOnRefresh(false);

                            arrayindex++;

                            SyncArray1.push({
                                name: 'Jobs Download Failed...',
                                id: arrayindex,
                            });

                            setSyncArray(SyncArray1);
                            setOnRefresh(true);

                            arrayindex++;

                            SyncArray1.push({
                                name: 'Finished...',
                                id: arrayindex,
                            });
                            setSyncArray(SyncArray1);

                            setOnRefresh(true);
                            setOnRefresh(false);
                            SetCloseBtnSync(true)
                            AsyncStorage.setItem(AsyncStorageConstants.ASYNC_CHECK_SYNC, "2")
                            OnLoadData();

                        }


                    })
                    .catch((error) => {

                        // console.log(" IOUTypes error .....   ", error);

                        setOnRefresh(false);

                        arrayindex++;

                        SyncArray1.push({
                            name: 'Jobs Download Failed...',
                            id: arrayindex,
                        });

                        setSyncArray(SyncArray1);
                        setOnRefresh(true);

                        arrayindex++;

                        SyncArray1.push({
                            name: 'Finished...',
                            id: arrayindex,
                        });
                        setSyncArray(SyncArray1);

                        setOnRefresh(true);
                        setOnRefresh(false);
                        SetCloseBtnSync(true)
                        AsyncStorage.setItem(AsyncStorageConstants.ASYNC_CHECK_SYNC, "2")
                        OnLoadData();


                    });

            }
        });



    }
    const sync = () => {
        Conection_Checking((resp: any) => {
            if (resp != false) {
                SyncArray1 = [];
                setSyncArray([]);
                SetCloseBtnSync(false)
                toggleModal();
                Download_IOU_Types();
            } else {
                Alert.alert('No Internet Connection', 'Please check your internet connection! ', [

                    { text: 'Ok', onPress: () => console.log('ok pressed') },
                ]);
            }
        });


    }
    const shareLogFiles = () => {

        console.log(" pressed log file btn");
        setviewLogFileList(false);

        getIsLogFileView().then(async res => {

            console.log(" sync result ===   ", res);

            setviewLogFileList(true);
            if (res === "false") {

                await AsyncStorage.setItem(AsyncStorageConstants.VIEW_LOG_FILE_BOX, "true");

            }



        });



    }
    //Sync Functions end --------------------------------------------------------------------------------------
    useEffect(() => {
        setviewLogFileList(false);
        checkCurrentTime();
    }, [HeaderText]);
    useFocusEffect(
        React.useCallback(() => {
            const backHandler = BackHandler.addEventListener(
                'hardwareBackPress',
                handleBackButton
            );
            getLoginUserID().then(res => {
                userID = res;
                // setUserID(res);
                // console.log( ,"logged user id ==== " , res);
                SetCloseBtnSync(false)
                SyncArray1 = [];
                setSyncArray([]);
                OnLoadData();
                checkCurrentTime();
            })
            getLoginUserRoll().then(res1 => {
                setRoll(res1 + "");
                UserRoleID = res1;
                console.log("User Role: ", res1);
            })
            //createChannels();
            setviewLogFileList(false);
        }, [navigation])
    );
    return (

        <SafeAreaView style={ComponentsStyles.CONTAINER}>
            <Header title={`${HeaderText}\n${uName}`} image={true} isIcon={true} iconOnPress={() => sync()} ShareLog={() => shareLogFiles()} />
            < DropdownAlert alert={func => (alert = func)} alertPosition="top" />
            {/* // --------------- Sync Modal ---------------------------------- */}
            <Modal isVisible={isModalVisible} style={{ backgroundColor: ComponentsStyles.COLORS.WHITE, borderRadius: 10 }}>
                <View style={{ flex: 1 }}>
                    <View style={{ flex: 1.5, marginBottom: 5 }}>
                        <FlatList
                            showsHorizontalScrollIndicator={false}
                            // data={Arrays.SelectPackage.Wash.filter(ob => ob.extras == true)}
                            data={SyncArray}
                            style={{ marginTop: 10, }}
                            renderItem={({ item }) => {
                                return (
                                    <View style={{ height: 25, flexDirection: 'row' }}>
                                        <Text
                                            style={{
                                                marginLeft: 10,
                                                color: ComponentsStyles.COLORS.DASH_COLOR,
                                                fontSize: 16,
                                            }}>
                                            {item.name}
                                        </Text>
                                    </View>
                                );
                            }}
                            onRefresh={() => null}
                            refreshing={onRefresh}
                            keyExtractor={item => `${item.id}`}
                        />

                        <View style={{ margin: 10, marginRight: 15 }}>

                            {CloseBtnSync ?
                                <ActionButton title="Close" onPress={() => toggleModal()} />
                                : null}


                        </View>
                    </View>
                </View>
            </Modal>

            {/* // ------------------------------------------------------------- */}
            <View style={{ padding: 10 }} />
            <ScrollView style={ComponentsStyles.CONTENT} showsVerticalScrollIndicator={true}>
                {/* <View style={homeStyle.container}>
                    <View style={homeStyle.MainCard}>
                        <Text style={homeStyle.callText}>Total Payable</Text>
                        <Text style={homeStyle.amountText}>{TotalPayableAmount}</Text>
                    </View>
                </View> */}
                <View style={homeStyle.cardContainer}>
                    <CardView
                        iconName='file-invoice-dollar'
                        iconColor={ComponentsStyles.COLORS.SUB_COLOR}
                        Title='Total Payable'
                        Count={TotalPayableAmount + ""}
                        cardContainer={homeStyle.SelectedcardStyle}
                        numberStyle={homeStyle.SelectednumberStyle}
                        titleStyle={homeStyle.SelectedtitleStyle}
                        //cardOnPressed={() => setPendingListType("IOU")}
                        isViewAll={false}
                    />
                    <View style={{ padding: 5 }} />
                    <CardView
                        iconName='file-invoice-dollar'
                        iconColor={ComponentsStyles.COLORS.MAIN_COLOR}
                        Title='IOU'
                        Count={IOUTotalAmount + ""}
                        cardOnPressed={() => setPendingListType("IOU")}
                        isViewAll={true}
                    />
                </View>
                <View style={homeStyle.cardContainer}>
                    <CardView
                        iconName='file-invoice-dollar'
                        iconColor={ComponentsStyles.COLORS.MAIN_COLOR}
                        Title={`IOU\nSettlements`}
                        Count={IOUSETTotalAmount + ""}
                        cardOnPressed={() => setPendingListType("SETTLEMENT")}
                        isViewAll={true}
                    />
                    <View style={{ padding: 5 }} />
                    <CardView
                        iconName='file-invoice-dollar'
                        iconColor={ComponentsStyles.COLORS.MAIN_COLOR}
                        Title={`One-Off\nSettlements`}
                        Count={ONEOFFTotalAmount + ""}
                        cardOnPressed={() => setPendingListType("ONEOFF")}
                        isViewAll={true}
                    />
                </View>
                {/* <View style={homeStyle.list}>
                    <View style={homeStyle.MainCard}>
                        <View style={{ flexDirection: 'row', alignContent: "center", backgroundColor: '#CEF1E8', }}>
                            <Text style={homeStyle.callText}>IOU</Text>
                            <View style={{ flex: 1 }} />
                            <Text style={homeStyle.callText}>{IOUTotalAmount}</Text>
                        </View>
                    </View>
                </View> */}
                {/* <View style={homeStyle.list2}>
                    <View style={homeStyle.MainCard}>
                        <View style={{ flexDirection: 'row', alignContent: "center", backgroundColor: '#F1CED4' }}>
                            <Text style={homeStyle.callText}>Settlement</Text>
                            <View style={{ flex: 1 }} />
                            <Text style={homeStyle.callText}>{IOUSETTotalAmount}</Text>
                        </View>
                    </View>
                </View> */}
                {/* <View style={homeStyle.list3}>
                    <View style={homeStyle.MainCard}>

                        <View style={{ flexDirection: 'row', alignContent: "center", backgroundColor: '#F7F5AA', }}>

                            <Text style={homeStyle.callText}>One-Off Settlement</Text>
                            <View style={{ flex: 1 }} />
                            <Text style={homeStyle.callText}>{ONEOFFTotalAmount}</Text>


                        </View>
                    </View>
                </View> */}
                {/* <View style={homeStyle.container}>
                    <View style={homeStyle.MainCard}>

                        <View style={{ flexDirection: 'row', marginTop: 15, justifyContent: "space-around" }}>

                            <ActionButton
                                title="Add New IOU "
                                style={homeStyle.ActionButton}
                                is_icon={true}
                                iconColor={ComponentsStyles.COLORS.WHITE}
                                icon_name="plus"
                                styletouchable={{ width: '40%' }}
                                //onPress={() => navigation.navigate('NewIOU')}
                                onPress={() => createRequest('IOU')}
                            //disabled={roll == 'Requester' ? false : true}
                            />

                            <ActionButton
                                title="Add New Settlement"
                                style={homeStyle.ActionButton}
                                is_icon={true}
                                iconColor={ComponentsStyles.COLORS.WHITE}
                                icon_name="plus"
                                styletouchable={{ width: '60%' }}
                                //onPress={() => navigation.navigate('NewIOUSettlement')}
                                onPress={() => createRequest('SETTLEMENT')}
                            //disabled={roll == 'Requester' ? false : true}
                            />

                        </View>
                        <View style={{ marginTop: 5, justifyContent: "center", alignItems: "center" }}>
                            <ActionButton
                                title="Add New One-Off Settlement "
                                style={homeStyle.ActionButton}
                                is_icon={true}
                                iconColor={ComponentsStyles.COLORS.WHITE}
                                icon_name="plus"
                                styletouchable={{ width: '80%' }}
                                //onPress={() => navigation.navigate('NewOneOffSettlement')}
                                onPress={() => createRequest('ONEOFF')}
                            //disabled={roll == 'Requester' ? false : true}
                            />
                        </View>
                        <View><Text></Text></View>

                    </View>
                </View> */}

                <View style={{ flexDirection: 'row', marginTop: 20 }}>
                    <Text style={homeStyle.callText}>Pending IOU</Text>
                    <View style={{ flex: 1 }} />
                    <TouchableOpacity onPress={() => setPendingListType("IOU")}>
                        <Text style={homeStyle.seeAllText}>
                            See All{' '}
                            <IconA
                                name="angle-double-right"
                                size={20}
                                color={ComponentsStyles.COLORS.MAIN_COLOR}
                            />
                        </Text>
                    </TouchableOpacity>
                </View>
                {
                    IOUList.length == 0 ?
                        <View style={{ justifyContent: "center", alignContent: "center", alignItems: "center", marginTop: 10 }}>

                            <Text style={{ fontFamily: ComponentsStyles.FONT_FAMILY.REGULAR, alignItems: "center", color: ComponentsStyles.COLORS.DASH_COLOR }}>No Pending IOU Requests</Text>

                        </View>
                        :
                        <FlatList
                            showsHorizontalScrollIndicator={false}
                            // data={Arrays.SelectPackage.Wash.filter(ob => ob.extras == true)}
                            data={IOUList}
                            style={{ marginTop: 5 }}
                            horizontal={true}
                            renderItem={({ item }) => {
                                return (
                                    <View style={{ width: width - 210, padding: 5 }}>
                                        <ListBox
                                            IOUNo={item.ID}
                                            nameAddress={true}
                                            date={moment.utc(item.RequestDate).format('YYYY-MM-DD - h:mm A')}
                                            // price={item.Amount + "  LKR"}
                                            price={item.Amount == null || '' ? "0.00 LKR" : item.Amount.toLocaleString("en-LK", {
                                                style: "currency",
                                                currency: "LKR",
                                                minimumFractionDigits: 2,
                                            })}
                                            status="New"
                                            isIcon={true}
                                            onPressIcon={() => console.log(item.ID)}
                                        />
                                    </View>
                                );
                            }}
                            keyExtractor={item => `${item.Id}`}
                        />
                }


                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                    <Text style={homeStyle.callText}>Pending Settlements</Text>
                    <View style={{ flex: 1 }} />
                    <TouchableOpacity onPress={() => setPendingListType("SETTLEMENT")}>
                        <Text style={homeStyle.seeAllText}>
                            See All{' '}
                            <IconA
                                name="angle-double-right"
                                size={20}
                                color={ComponentsStyles.COLORS.MAIN_COLOR}
                            />
                        </Text>
                    </TouchableOpacity>
                </View>

                {

                    IOUSettlementList.length == 0 ?

                        <View style={{ justifyContent: "center", alignContent: "center", alignItems: "center", marginTop: 10 }}>

                            <Text style={{ fontFamily: ComponentsStyles.FONT_FAMILY.REGULAR, alignItems: "center", color: ComponentsStyles.COLORS.DASH_COLOR }}>No Pending Settlements</Text>

                        </View>
                        :

                        <FlatList
                            showsHorizontalScrollIndicator={false}
                            // data={Arrays.SelectPackage.Wash.filter(ob => ob.extras == true)}
                            data={IOUSettlementList}
                            style={{ marginTop: 5 }}
                            horizontal={true}
                            renderItem={({ item }) => {
                                return (
                                    <View style={{ width: width - 210, padding: 5 }}>
                                        <ListBox
                                            IOUNo={item.ID}
                                            nameAddress={true}
                                            date={moment.utc(item.RequestDate).format('YYYY-MM-DD - h:mm A')}
                                            price={item.Amount == null || '' ? "0.00 LKR" : item.Amount.toLocaleString("en-LK", {
                                                style: "currency",
                                                currency: "LKR",
                                                minimumFractionDigits: 2,
                                            })}
                                            status="New"
                                            isIcon={true}
                                            onPressIcon={() => console.log(item.ID)}
                                        />

                                    </View>
                                );
                            }}
                            keyExtractor={item => `${item.Id}`}
                        />
                }

                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                    <Text style={homeStyle.callText}>Pending One-Off Settlements</Text>
                    <View style={{ flex: 1 }} />
                    <TouchableOpacity onPress={() => setPendingListType("ONEOFF")}>
                        <Text style={homeStyle.seeAllText}>
                            See All{' '}
                            <IconA
                                name="angle-double-right"
                                size={20}
                                color={ComponentsStyles.COLORS.MAIN_COLOR}
                            />
                        </Text>
                    </TouchableOpacity>
                </View>
                {
                    OneOFfSettlementList.length == 0 ?
                        <View style={{ justifyContent: "center", alignContent: "center", alignItems: "center", marginTop: 10 }}>
                            <Text style={{ fontFamily: ComponentsStyles.FONT_FAMILY.REGULAR, alignItems: "center", color: ComponentsStyles.COLORS.DASH_COLOR }}>No Pending One-Off Settlements</Text>
                        </View>
                        :
                        <FlatList
                            showsHorizontalScrollIndicator={false}
                            // data={Arrays.SelectPackage.Wash.filter(ob => ob.extras == true)}
                            data={OneOFfSettlementList}
                            style={{ marginTop: 5 }}
                            horizontal={true}
                            renderItem={({item}) => {
                                return (
                                    <View style={{ width: width - 210, padding: 5 }}>
                                        <ListBox
                                            IOUNo={item.ID}
                                            nameAddress={true}
                                            date={moment.utc(item.RequestDate).format('YYYY-MM-DD - h:mm A')}
                                            price={item.Amount == null || '' ? "0.00 LKR" : item.Amount.toLocaleString("en-LK", {
                                                style: "currency",
                                                currency: "LKR",
                                                minimumFractionDigits: 2,
                                            })}
                                            status="New"
                                            isIcon={true}
                                            onPressIcon={() => console.log(item.ID)}
                                        />

                                    </View>
                                );
                            }}
                            keyExtractor={item => `${item.Id}`}
                        />
                }
                <View style={{ marginBottom: 70 }}></View>
            </ScrollView>
            {
                viewLogFileList ?
                    <LogFileDialogBox />
                    :
                    <></>
            }
        </SafeAreaView>
    );
}
const homeStyle = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        width: '100%',
        shadowColor: "#000",
        padding: 7,
        flexDirection: 'row',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    callText: {
        fontFamily: ComponentsStyles.FONT_FAMILY.BOLD,
        color: ComponentsStyles.COLORS.HEADER_BLACK,
        fontSize: 17
    },
    amountText: {
        fontFamily: ComponentsStyles.FONT_FAMILY.BOLD,
        color: ComponentsStyles.COLORS.MAIN_COLOR,
        fontSize: 28
    },
    seeAllText: {
        fontFamily: ComponentsStyles.FONT_FAMILY.BOLD,
        color: ComponentsStyles.COLORS.MAIN_COLOR,
        fontSize: 16
    },
    headerText: {
        color: ComponentsStyles.COLORS.SERVISE_HEADER_ASH,
        fontFamily: ComponentsStyles.FONT_FAMILY.SEMI_BOLD,
        fontSize: 14,
    },
    subText: {
        color: ComponentsStyles.COLORS.PROCEED_ASH,
        fontFamily: ComponentsStyles.FONT_FAMILY.SEMI_BOLD,
        fontSize: 14
    },
    ActionButton: {
        marginTop: 15,
        marginBottom: 5,
        width: '99%',
    },
    MainCard: {
        width: '100%',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        backgroundColor: 'white',
        flex: 4,
        justifyContent: "center",
    },
    SubCard: {
        backgroundColor: 'white',
        width: '100%',
        shadowColor: "#000",
        padding: 7,
        flexDirection: 'row',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    list: {
        backgroundColor: '#CEF1E8',
        borderColor: ComponentsStyles.COLORS.LOW_BUTTON_GREEN,
        borderWidth: 3,
        borderRadius: 4,
        marginVertical: 3,
        justifyContent: "center",
        alignItems: "center",
        width: '100%',
        shadowColor: "#000",
        padding: 7,
        flexDirection: 'row',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    list2: {
        borderColor: ComponentsStyles.COLORS.ORANGE,
        borderWidth: 3,
        borderRadius: 4,
        marginVertical: 3,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#F1CED4',
        width: '100%',
        shadowColor: "#000",
        padding: 7,
        flexDirection: 'row',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    list3: {
        borderColor: ComponentsStyles.COLORS.YELLOW,
        borderWidth: 3,
        borderRadius: 4,
        marginVertical: 3,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#F7F5AA',
        width: '100%',
        shadowColor: "#000",
        padding: 7,
        flexDirection: 'row',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    cardContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 15
    },
    SelectedcardStyle: {
        backgroundColor: ComponentsStyles.COLORS.MAIN_COLOR,
        color: ComponentsStyles.COLORS.SUB_COLOR,
    },
    SelectednumberStyle: {
        color: ComponentsStyles.COLORS.SUB_COLOR,
    },
    SelectedtitleStyle: {
        color: ComponentsStyles.COLORS.SUB_COLOR,
    },
});
export default HomeScreen;


