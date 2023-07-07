import React, { useEffect, useState } from "react";
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
import { getIOUToatalAmount, getPendingIOU, getPendingIOUHome, saveIOU } from "../SQLiteDBAction/Controllers/IOUController";
import { getIOUSETToatalAmount, getPendingIOUSettlement, getPendingIOUSettlementHome, saveIOUSettlement } from "../SQLiteDBAction/Controllers/IouSettlementController";
import { getONEOFFToatalAmount, getPendingOneOffSettlement, getPendingOneOffSettlementHome, saveOneOffSettlement } from "../SQLiteDBAction/Controllers/OneOffSettlementController";
import AsyncStorageConstants from "../Constant/AsyncStorageConstants";
import * as DB from '../SQLiteDBAction/DBService';
import { getLoginUserName, getLoginUserRoll, get_ASYNC_CHECKSYNC, get_ASYNC_JOBOWNER_APPROVAL_AMOUNT, get_ASYNC_LOGIN_ROUND } from "../Constant/AsynStorageFuntion";
import Modal from "react-native-modal";
import { BASE_URL, headers } from "../Constant/ApiConstants";
import axios from "axios";
import { saveIOUType } from "../SQLiteDBAction/Controllers/IOUTypeController";
import { saveExpenseType } from "../SQLiteDBAction/Controllers/ExpenseTypeController";
import { saveUser } from "../SQLiteDBAction/Controllers/UserController";
import { saveVehicleNo } from "../SQLiteDBAction/Controllers/VehicleNoController";
import { saveJobOwners } from "../SQLiteDBAction/Controllers/JobOwnerController";
import { saveJobNo } from "../SQLiteDBAction/Controllers/JobNoController";
import { saveIOUJOB } from "../SQLiteDBAction/Controllers/IOUJobController";
import { saveIOUSETJOB } from "../SQLiteDBAction/Controllers/IOUSettlementJobController";
import { saveOneOffJOB } from "../SQLiteDBAction/Controllers/OneOffJobController";
import { saveUserRolls } from "../SQLiteDBAction/Controllers/UserRollController";
import { saveDepartment } from "../SQLiteDBAction/Controllers/DepartmentController";
import { Conection_Checking } from "../Constant/InternetConection_Checking";
import AsyncStorage from "@react-native-async-storage/async-storage";

let SyncArray1: any[] = [];
let arrayindex = 0;

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

    //Sync Modal
    const [isModalVisible, setModalVisible] = useState(false);
    const [CloseBtnSync, SetCloseBtnSync] = useState(false);
    const [SyncArray, setSyncArray]: any[] = useState([]);
    const [onRefresh, setOnRefresh] = useState(false);

    const [TotalIOUAmount, setTotalIOUAmount] = useState(0);
    const [TotalIOUSETAmount, setTotalIOUSETAmount] = useState(0);
    const [TotalONEOFFAmount, setTotalONEOFFAmount] = useState(0);
    const [TotalPayableAmount, setTotalPayableAmount] = useState(0);

    //let TotalIOUAmount = 0.00;
    //let TotalIOUSETAmount = 0.00;
    //let TotalONEOFFAmount = 0.00;

    const navigation = useNavigation();



    const setFlatListData = () => {

        getPendingIOUHome((result: any) => {
            setIOUList(result);
        });

        getPendingIOUSettlementHome((response: any) => {
            setIOUSettlementList(response);
        });

        getPendingOneOffSettlementHome((res: any) => {
            setOneOffettlementList(res);
        });

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




    // console.log("getTotalIOUAmount-----", TotalIOUAmount);

    // console.log(formattedTotal);

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

    }

    // const createChannels = () => {
    //     PushNotification.createChannel(
    //         {
    //             channelId: "test-channel",
    //             channelName: "Test Channel"
    //         }
    //     )
    // }
    const createRequest = (type: any) => {

        if (type == 'IOU') {
            navigation.navigate('NewIOU');
            AsyncStorage.setItem(AsyncStorageConstants.ASYNC_STORAGE_IS_COPY, "False");
        } else if (type == 'SETTLEMENT') {
            navigation.navigate('NewIOUSettlement');
            AsyncStorage.setItem(AsyncStorageConstants.ASYNC_STORAGE_IS_COPY, "False");
        } else if (type == 'ONEOFF') {
            navigation.navigate('NewOneOffSettlement');
            AsyncStorage.setItem(AsyncStorageConstants.ASYNC_STORAGE_IS_COPY, "False");
        }
    }

    useFocusEffect(
        React.useCallback(() => {
            const backHandler = BackHandler.addEventListener(
                'hardwareBackPress',
                handleBackButton
              );
          
              

            // BackHandler.addEventListener('hardwareBackPress', HandleBackButton);

            SetCloseBtnSync(false)
            SyncArray1 = [];
            setSyncArray([]);
            OnLoadData();
            //createChannels();

        }, [navigation])
    );

    const OnLoadData = () => {

        setFlatListData();
        getTotalAmount();

        getLoginUserRoll().then(res => {
            setRoll(res);
            // console.log("User Roll: ", res);
        })

        getLoginUserName().then(res => {
            setUname(res);
            // console.log(" user name ....... ", res);

        });

        // get_ASYNC_LOGIN_ROUND().then(resp => {
        //     // console.log(" login round ---- " , resp);

        // })

        // get_ASYNC_JOBOWNER_APPROVAL_AMOUNT().then(rest => {
        //     // console.log("JobOwner_Maximum_Aomunt----", rest)
        // })


        get_ASYNC_CHECKSYNC().then(result => {

            // console.log(" sync statu --- " , result);


            if (result === "1") {

                // console.log(" first sync --- ");

                toggleModal();
                Conection_Checking((res: any) => {
                    if (res != false) {
                        console.log("conection is tru");
                        Download_IOU_Types();

                    }else{
                        console.log("no connection");

                    }
                })

                

            }

        })


    }

    // const HandleBackButton = () => {

    //     Alert.alert(
    //         'Exit App',
    //         'Exiting the application?', [{
    //             text: 'Cancel',
    //             onPress: () => console.log('Cancel Pressed'),
    //             style: 'cancel'
    //         }, {
    //             text: 'OK',
    //             onPress: () => BackHandler.exitApp()
    //         },], {
    //         cancelable: false
    //     }
    //     )
    //     return true;


    // }
    const handleBackButton = () => {
        // Disable the default back button behavior
        console.log("Hardware back button is pressed");
        
        return true;

      };

    // Sync Modal Functions ------

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    // -------------------- Download IOU Types --------------------------------------

    const Download_IOU_Types = async () => {

        const URL = BASE_URL + '/Mob_GetIOUType.xsjs?dbName=TPL_REPORT_TEST'

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

        const URL = BASE_URL + '/Mob_GetExpenseTypes.xsjs?dbName=TPL_REPORT_TEST'

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
                                Download_MaximumAmount();


                            } else if (resp == 3) {

                                arrayindex++;

                                SyncArray1.push({
                                    name: 'Expense Type Download Successfully...',
                                    id: arrayindex,
                                });

                                setSyncArray(SyncArray1);
                                setOnRefresh(true);

                                Download_MaximumAmount();
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
                        Download_MaximumAmount();

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

                    Download_MaximumAmount();

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

                Download_MaximumAmount();

            });

    }
    // //----------------------Download Max Amount -------------------------------------

    const Download_MaximumAmount = async () => {
        const URL2 = BASE_URL + "/Mob_GetRequestMaxAmount.xsjs?dbName=TPL_REPORT_TEST";

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

        const URL = BASE_URL + '/Mob_GetUserRoleMaster.xsjs?dbName=TPL_REPORT_TEST'

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

        const URL = BASE_URL + '/Mob_GetUserMaster.xsjs?dbName=TPL_REPORT_TEST'

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

        const URL = BASE_URL + '/Mob_GetAllVehicleNumbers.xsjs?dbName=TPL_REPORT_TEST&sapDbName=TPL_LIVE_SL&ResType=VEHICLE'


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

        const URL = 'http://10.10.0.100:8000/TPL_JOB_A8_SAP_SITHIRA/api/lookups/getSalesUnit.xsjs?dbName=TPL_REPORT_TEST&sapDbName=TPL_LIVE_SL'


        await axios.get(URL, { headers })
            .then(response => {

                if (response.status === 200) {

                    if (response.data.data.length > 0) {

                        saveDepartment(response.data.data, (resp: any) => {

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
                                Download_JobOwners();

                            } else if (resp == 3) {

                                arrayindex++;

                                SyncArray1.push({
                                    name: 'Departments Download Successfully...',
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
                            name: 'No available Departments for download...',
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
                        name: 'Departments Download Failed...',
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
                    name: 'Departments Download Failed...',
                    id: arrayindex,
                });
                setSyncArray(SyncArray1);
                setOnRefresh(true);

                Download_JobOwners();


            });

    }

    // -------------------- Download Job Owners --------------------------------------

    const Download_JobOwners = async () => {

        const URL = BASE_URL + '/Mob_GetJobOwners.xsjs?dbName=TPL_REPORT_TEST&sapDbName=TPL_LIVE_SL'


        await axios.get(URL, { headers })
            .then(response => {

                if (response.status === 200) {

                    if (response.data.length > 0) {

                        saveJobOwners(response.data, (resp: any) => {

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

                        setOnRefresh(false);

                        arrayindex++;
                        SyncArray1.push({
                            name: 'No available Job Owners for Download...',
                            id: arrayindex,
                        });
                        setSyncArray(SyncArray1);
                        setOnRefresh(true);

                        Download_JobNo();


                    }



                } else {

                    // console.log(" response code ======= ", response.status);

                    setOnRefresh(false);

                    arrayindex++;
                    SyncArray1.push({
                        name: 'Job Owner Download Failed...',
                        id: arrayindex,
                    });
                    setSyncArray(SyncArray1);
                    setOnRefresh(true);

                    Download_JobNo();

                }


            })
            .catch((error) => {

                // console.log(" Vehicle No error .....   ", error);

                setOnRefresh(false);

                arrayindex++;
                SyncArray1.push({
                    name: 'Job Owner Download Failed...',
                    id: arrayindex,
                });
                setSyncArray(SyncArray1);
                setOnRefresh(true);


                Download_JobNo();

            });

    }


    // -------------------- Download Job No -------------------------------------------

    const Download_JobNo = async () => {

        const URL = BASE_URL + '/Mob_GetJobOwnerDetails.xsjs?dbName=TPL_REPORT_TEST'

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
                                Download_IOURequest();

                            } else if (resp == 3) {

                                arrayindex++;

                                SyncArray1.push({
                                    name: 'Job No Download Successfully...',
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
                            name: 'No available Job No for Download...',
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
                        name: 'Job No Download Failed...',
                        id: arrayindex,
                    });

                    setSyncArray(SyncArray1);
                    setOnRefresh(true);

                    Download_IOURequest();
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


                Download_IOURequest();

            });

    }


    // -------------------- Download IOU Request --------------------------------------

    const Download_IOURequest = async () => {

        const URL = BASE_URL + '/Mob_GetAllIOURequest.xsjs?dbName=TPL_REPORT_TEST'

        await axios.get(URL, { headers })
            .then(response => {

                if (response.status === 200) {

                    //console.log(response.data.header,'=====================');

                    if (response.data.header.length > 0) {

                        saveIOU(response.data.header, (resp: any) => {

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

        const URL = BASE_URL + '/Mob_GetAllIOUSettlements.xsjs?dbName=TPL_REPORT_TEST'

        await axios.get(URL, { headers })
            .then(response => {

                if (response.status === 200) {

                    if (response.data.header.length > 0) {

                        saveIOUSettlement(response.data.header, (resp: any) => {

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

        const URL = BASE_URL + '/Mob_GetAllOneOffSettlements.xsjs?dbName=TPL_REPORT_TEST'

        await axios.get(URL, { headers })
            .then(response => {

                if (response.status === 200) {

                    if (response.data.header.length > 0) {

                        saveOneOffSettlement(response.data.header, (resp: any) => {

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

        const URL = BASE_URL + '/Mob_GetAllIOUSettlements.xsjs?dbName=TPL_REPORT_TEST'

        await axios.get(URL, { headers })
            .then(response => {

                if (response.status === 200) {

                    if (response.data.detail.length > 0) {

                        saveIOUSETJOB(response.data.detail, (resp: any) => {

                            // console.log("save IOUSET JOBS ------------>>>>>  ", resp);


                            setOnRefresh(false);

                            if (resp == 1) {

                                arrayindex++;

                                SyncArray1.push({
                                    name: 'IOUSET JOBS Downloading...',
                                    id: arrayindex,
                                });

                                setSyncArray(SyncArray1);
                                setOnRefresh(true);

                            } else if (resp == 2) {

                                arrayindex++;

                                SyncArray1.push({
                                    name: 'IOUSET JOBS Download Failed...',
                                    id: arrayindex,
                                });

                                setSyncArray(SyncArray1);
                                setOnRefresh(true);
                                Download_ONEOFFJOBS();


                            } else if (resp == 3) {

                                arrayindex++;

                                SyncArray1.push({
                                    name: 'IOUSET JOBS Download Successfully...',
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
                            name: 'No available IOUSET JOBS for Download...',
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
                        name: 'IOUSET JOBS Download Failed...',
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
                    name: 'IOUSET JOBS Download Failed...',
                    id: arrayindex,
                });

                setSyncArray(SyncArray1);
                setOnRefresh(true);
                Download_ONEOFFJOBS();

            });

    }

    // -------------------- Download OneOff JOBS Request --------------------------------------
    const Download_ONEOFFJOBS = async () => {

        const URL = BASE_URL + '/Mob_GetAllOneOffSettlements.xsjs?dbName=TPL_REPORT_TEST'

        await axios.get(URL, { headers })
            .then(response => {

                if (response.status === 200) {

                    if (response.data.detail.length > 0) {

                        saveOneOffJOB(response.data.detail, (resp: any) => {

                            // console.log("save ONEOFF JOBS ------------>>>>>  ", resp);


                            setOnRefresh(false);

                            if (resp == 1) {

                                arrayindex++;

                                SyncArray1.push({
                                    name: 'ONEOFF JOBS Downloading...',
                                    id: arrayindex,
                                });

                                setSyncArray(SyncArray1);
                                setOnRefresh(true);

                            } else if (resp == 2) {

                                arrayindex++;

                                SyncArray1.push({
                                    name: 'ONEOFF JOBS Download Failed...',
                                    id: arrayindex,
                                });

                                setSyncArray(SyncArray1);
                                setOnRefresh(true);
                                Download_IOUJobs();


                            } else if (resp == 3) {

                                arrayindex++;

                                SyncArray1.push({
                                    name: 'ONEOFF JOBS Download Successfully...',
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
                            name: 'No available ONEOFF JOBS for Download...',
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
                        name: 'ONEOFF JOBS Download Failed...',
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
                    name: 'ONEOFF JOBS Download Failed...',
                    id: arrayindex,
                });

                setSyncArray(SyncArray1);
                setOnRefresh(true);
                Download_IOUJobs();

            });

    }


    // -------------------- Download IOU Job Data --------------------------------------
    const Download_IOUJobs = async () => {

        const URL = BASE_URL + '/Mob_GetAllIOURequest.xsjs?dbName=TPL_REPORT_TEST'

        await axios.get(URL, { headers })
            .then(response => {

                // console.log(response.status);
                if (response.status === 200) {

                    //console.log(response.data.details, '=====================');
                    // console.log(response.status);

                    if (response.data.detail.length > 0) {

                        saveIOUJOB(response.data.detail, (resp: any) => {

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

    const sync = () => {

        SyncArray1 = [];
        setSyncArray([]);
        SetCloseBtnSync(false)
        toggleModal();

        Download_IOU_Types();
    }

    //Sync Functions end --------------------------------------------------------------------------------------

    return (

        <SafeAreaView style={ComponentsStyles.CONTAINER}>
            <Header title={`Good Morningg\n${uName}!`} image={true} isIcon={true} iconOnPress={() => sync()} />

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


                <View style={homeStyle.container}>


                    <View style={homeStyle.MainCard}>

                        <Text style={homeStyle.callText}>Total Payable</Text>

                        <Text style={homeStyle.amountText}>{TotalPayableAmount}</Text>
                    </View>

                </View>



                <View style={homeStyle.list}>
                    <View style={homeStyle.MainCard}>
                        <View style={{ flexDirection: 'row', alignContent: "center", backgroundColor: '#CEF1E8', }}>

                            <Text style={homeStyle.callText}>IOU</Text>
                            <View style={{ flex: 1 }} />
                            <Text style={homeStyle.callText}>{IOUTotalAmount}</Text>

                        </View>
                    </View>
                </View>


                {/* <View style={{ justifyContent: "center", marginTop: 10 }}>
                            {/* <ProgressBar
                                progress={IOUProgressBar}
                                color={ComponentsStyles.COLORS.LOW_BUTTON_GREEN}

                            /> 
                        </View> */}
                <View style={homeStyle.list2}>
                    <View style={homeStyle.MainCard}>

                        <View style={{ flexDirection: 'row', alignContent: "center", backgroundColor: '#F1CED4' }}>

                            <Text style={homeStyle.callText}>Settlement</Text>
                            <View style={{ flex: 1 }} />
                            <Text style={homeStyle.callText}>{IOUSETTotalAmount}</Text>


                        </View>
                    </View>
                </View>

                {/* <View style={{ justifyContent: "center", marginTop: 10 }}>
                            {/* <ProgressBar
                                progress={IOUSETProgressBar}
                                color={ComponentsStyles.COLORS.ORANGE}

                            /> 
                        </View> */}
                <View style={homeStyle.list3}>
                    <View style={homeStyle.MainCard}>

                        <View style={{ flexDirection: 'row', alignContent: "center", backgroundColor: '#F7F5AA', }}>

                            <Text style={homeStyle.callText}>One-Off Settlement</Text>
                            <View style={{ flex: 1 }} />
                            <Text style={homeStyle.callText}>{ONEOFFTotalAmount}</Text>


                        </View>
                    </View>
                </View>

                {/* <View style={{ justifyContent: "center", marginTop: 10 }}>
                            {/* <ProgressBar
                                progress={ONEOFFProgressBar}
                                color={ComponentsStyles.COLORS.YELLOW}

                            /> 
                        </View> */}
                {/* {
                            roll == 'Requester' ?
                                <View>
                                    
                                </View>


                                :
                                <></>
                        } */}
                <View style={homeStyle.container}>
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
                </View>


                {/* <View style={{ marginTop: 5, justifyContent: "center", alignItems: "center" }}>
                            <ActionButton
                                title="Add New One-Off Settlement "
                                style={homeStyle.ActionButton}
                                is_icon={true}
                                iconColor={ComponentsStyles.COLORS.WHITE}
                                icon_name="plus"
                                styletouchable={{ width: '80%' }}
                                onPress={() => navigation.navigate('NewOneOffSettlement')}
                            />
                        </View>
                        <View><Text></Text></View> */}





                <View style={{ flexDirection: 'row', marginTop: 15 }}>
                    <Text style={homeStyle.callText}>Pending IOU</Text>
                    <View style={{ flex: 1 }} />
                    <TouchableOpacity onPress={() => setPendingListType("IOU")}>
                        <Text style={homeStyle.seeAllText}>
                            See All{' '}
                            <IconA
                                name="angle-double-right"
                                size={20}
                                color={ComponentsStyles.COLORS.ICON_BLUE}
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
                                            IOUNo={item.IOU_ID}
                                            nameAddress={true}
                                            date={item.RequestDate}
                                            price={item.Amount + "  LKR"}
                                            status="New"
                                            isIcon={true}
                                            onPressIcon={() => console.log(item.IOU_ID)}
                                        />
                                    </View>
                                );
                            }}
                            keyExtractor={item => `${item._Id}`}
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
                                color={ComponentsStyles.COLORS.ICON_BLUE}
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
                                            IOUNo={item.IOUSettlement_ID}
                                            nameAddress={true}
                                            date={item.RequestDate}
                                            price={item.Amount + "  LKR"}
                                            status="New"
                                            isIcon={true}
                                            onPressIcon={() => console.log(item.IOUSettlement_ID)}
                                        />

                                    </View>
                                );
                            }}
                            keyExtractor={item => `${item._Id}`}
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
                                color={ComponentsStyles.COLORS.ICON_BLUE}
                            />
                        </Text>
                    </TouchableOpacity>
                </View>

                {

                    IOUList.length == 0 ?

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
                            renderItem={({ item }) => {
                                return (
                                    <View style={{ width: width - 210, padding: 5 }}>
                                        <ListBox
                                            IOUNo={item.ONEOFFSettlement_ID}
                                            nameAddress={true}
                                            date={item.RequestDate}
                                            price={item.Amount + "  LKR"}
                                            status="New"
                                            isIcon={true}
                                            onPressIcon={() => console.log(item.ONEOFFSettlement_ID)}
                                        />

                                    </View>
                                );
                            }}
                            keyExtractor={item => `${item._Id}`}
                        />

                }

                <View style={{ marginBottom: 70 }}></View>

            </ScrollView>


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
        color: ComponentsStyles.COLORS.ICON_BLUE,
        fontSize: 28
    },

    seeAllText: {
        fontFamily: ComponentsStyles.FONT_FAMILY.BOLD,
        color: ComponentsStyles.COLORS.ICON_BLUE,
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
        // flex: 1,
        // padding: 7,
        backgroundColor: '#CEF1E8',
        borderColor: ComponentsStyles.COLORS.LOW_BUTTON_GREEN,
        borderWidth: 3,
        borderRadius: 4,
        marginVertical: 3,

        // marginHorizontal: 6,
        justifyContent: "center",
        alignItems: "center",
        // flexDirection: "row",

        // shadowColor: "#000",
        // shadowOffset: {
        //     width: 0,
        //     height: 2,
        // },
        // shadowOpacity: 0.25,
        // shadowRadius: 3.84,
        // elevation: 5,
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
        // flex: 1,
        // padding: 7,
        // backgroundColor: ComponentsStyles.COLORS.WHITE,
        borderColor: ComponentsStyles.COLORS.ORANGE,
        borderWidth: 3,
        borderRadius: 4,
        marginVertical: 3,
        // marginHorizontal: 6,
        justifyContent: "center",
        alignItems: "center",
        // flexDirection: "row",

        // shadowColor: "#000",
        // shadowOffset: {
        //     width: 0,
        //     height: 2,
        // },
        // shadowOpacity: 0.25,
        // shadowRadius: 3.84,
        // elevation: 5,

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
        // flex: 1,
        // padding: 7,
        // backgroundColor: ComponentsStyles.COLORS.WHITE,
        borderColor: ComponentsStyles.COLORS.YELLOW,
        borderWidth: 3,
        borderRadius: 4,
        marginVertical: 3,
        // marginHorizontal: 6,
        justifyContent: "center",
        alignItems: "center",
        // flexDirection: "row",


        // shadowColor: "#000",
        // shadowOffset: {
        //     width: 0,
        //     height: 2,
        // },
        // shadowOpacity: 0.25,
        // shadowRadius: 3.84,
        // elevation: 5,

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


});

export default HomeScreen;
