import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import ActionButton from "../../Components/ActionButton";
import ComponentsStyles from "../../Constant/Components.styles";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ImageBackground,
    Image,
    Animated,
    Keyboard,
    Dimensions,
    TouchableOpacity,
    Platform,
    Alert,
    ScrollView,
} from "react-native";
import comStyles from '../../Constant/Components.styles'
import InputText from "../../Components/InputText";
import style from "./loginStyle";
import { CreateTableIndexKey, createTables } from "../../SQLiteDBAction/DBService";
import * as  DB_ExpenseType from "../../SQLiteDBAction/Controllers/ExpenseTypeController"
import * as  DB_IOUType from "../../SQLiteDBAction/Controllers/IOUTypeController"
import * as  DB_EmpType from "../../SQLiteDBAction/Controllers/EmployeeTypeController"
import * as  DB_Emp from "../../SQLiteDBAction/Controllers/EmployeeController"
import { Employee, EmpType, ExpenseType, IOUType } from "../../Constant/DummyData";
import AsyncStorageConstants from "../../Constant/AsyncStorageConstants";
import { getLoginPassword, getLoginRound, getLoginUName, getLoginUserName, getLoginUserRoll, get_ASYNC_CHECKSYNC, get_ASYNC_LOGIN_ROUND } from "../../Constant/AsynStorageFuntion";
import { BASE_URL, DB_LIVE, LOGIN_BASE_URL, SAP_LIVE_DB, headers } from "../../Constant/ApiConstants";
import axios from "axios";
import * as CryptoJS from 'crypto-js';
import Spinner from "react-native-loading-spinner-overlay";
import { Conection_Checking } from "../../Constant/InternetConection_Checking";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RNVPNDetect from "react-native-vpn-detect";
import { getStatusBarHeight } from "react-native-status-bar-height";
import moment from "moment";
import { CreateLogFile, logger, readLogs, saveJsonObject_To_Loog } from "../../Constant/Logger";


const LoginScreen = () => {

    const navigation = useNavigation();

    const [uName, setuName] = useState('');
    const [pword, setPword] = useState('');
    const [error, setError] = useState({ field: '', message: '' });
    const [loandingspinner, setloandingspinner] = useState(false);
    const [isEditUName, setisEditUName] = useState(true);
    const [isEditPW, setisEditPW] = useState(true);


    const saveDBData = () => {


        // DB_ExpenseType.saveExpenseType(ExpenseType, (res: any, error: any) => {
        //     console.log("Add Expense Types >>>>>>>>>>>>. ", res);
        // })

        // DB_IOUType.saveIOUType(IOUType, (res: any, error: any) => {
        //     console.log("Add IOU Types >>>>>>>>>>>>. ", res);
        // })

        DB_EmpType.saveEmployeeType(EmpType, (res: any, error: any) => {
            // console.log("Add Emp Types >>>>>>>>>>>>. ", res);
        })

        DB_Emp.saveEmployee(Employee, (res: any, error: any) => {
            // console.log("Add Employee >>>>>>>>>>>>. ", res);
        })



    }



    const login = async () => {

        let loginError = { field: '', message: '' }
        if (uName === '') {
            loginError.field = 'uName';
            loginError.message = 'Username is required';
            setError(loginError);
        } else if (pword === '') {
            loginError.field = 'pword';
            loginError.message = 'Password is required';
            setError(loginError);
        } else {


            setloandingspinner(true);

            setError({ field: '', message: '' });
            createTables();
            CreateTableIndexKey();
            // saveDBData();


            var turn;

            // internet connection is available 

            let enteredPassword = pword;
            let secretKey = "0123456789123456";

            let key = CryptoJS.enc.Utf8.parse(secretKey);
            let iv = CryptoJS.enc.Utf8.parse(secretKey);


            let encrypted = CryptoJS.AES.encrypt(
                JSON.stringify(pword), key, {
                keySize: 16,
                iv: iv,
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7
            });

            var encryptedPassword = encrypted.toString();
            // console.log("Encrypted Password:", encryptedPassword);

            var u_name = "dinushkam";
            var p_word = "GdBzSuV6mAdEyA6/H4plMQ==";

            const URL = LOGIN_BASE_URL + "Mob_Login.xsjs?dbName=" + DB_LIVE + "&username=" + uName + "&password=" + encryptedPassword + "&sap=" + SAP_LIVE_DB;

            console.log("Login URL === ", URL);

            var loggerDate = "Date - "+moment().utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss')+"+++++++++++++LOGIN ++++++++++++++++";

            logger(loggerDate,"Login URL " + "   *******   " +URL );
           

            Conection_Checking(async (res: any) => {
                if (res != false) {

                    try {

                        await axios.get(URL, { headers }
                        ).then(async response => {


                            logger(response.status+"" , "Login Response Status " );
                            saveJsonObject_To_Loog(response.data);
                            

                            console.log(" login response ==== ", response.data);

                            if (response.status === 200) {

                                setloandingspinner(false);

                                if (response.data.count == 1) {

                                    await AsyncStorage.setItem(AsyncStorageConstants.ASYNC_STORAGE_LOGIN_UserRoll, response.data.roleId);

                                    await AsyncStorage.setItem(AsyncStorageConstants.ASYNC_STORAGE_LOGIN_NAME, response.data.displayName);

                                    await AsyncStorage.setItem(AsyncStorageConstants.ASYNC_STORAGE_LOGIN_UserID, response.data.userId);

                                    await AsyncStorage.setItem(AsyncStorageConstants.ASYNC_IS_Auth_Requester, response.data.isAuthUser);

                                    await AsyncStorage.setItem(AsyncStorageConstants.ASYNC_STORAGE_LOGIN_COSTCENTER, response.data.costCenter);

                                    await AsyncStorage.setItem(AsyncStorageConstants.ASYNC_STORAGE_LOGIN_EPFNO, response.data.epfno);

                                    await AsyncStorage.setItem(AsyncStorageConstants.ASYNC_STORAGE_LOGIN_USER_NAME, uName);

                                    await AsyncStorage.setItem(AsyncStorageConstants.ASYNC_STORAGE_LOGIN_PASSWORD, pword);


                                    get_ASYNC_LOGIN_ROUND().then(async res => {

                                        if (res !== null) {
                                            // close and re login

                                            if (res === "0") {

                                                turn = parseInt(res + "") + 2;

                                            } else {

                                                turn = parseInt(res + "") + 1;

                                            }


                                            if (res === "1") {
                                                //relogin after logout
                                                // console.log(" relogin after logout ---------------------------------");

                                                await AsyncStorage.setItem(AsyncStorageConstants.ASYNC_CHECK_SYNC, "1");
                                                await AsyncStorage.setItem(AsyncStorageConstants.ASYNC_STORAGE_LOGIN_ROUND, turn + "");
                                                navigation.navigate("BottomNavi");


                                            } else {
                                                //relogin

                                                // console.log(" relogin  ---------------------------------", response.data.count);

                                                await AsyncStorage.setItem(AsyncStorageConstants.ASYNC_CHECK_SYNC, "2");
                                                await AsyncStorage.setItem(AsyncStorageConstants.ASYNC_STORAGE_LOGIN_ROUND, turn + "");
                                                navigation.navigate("BottomNavi");


                                            }





                                        } else {
                                            //first time login


                                            await AsyncStorage.setItem(AsyncStorageConstants.ASYNC_CHECK_SYNC, "1");
                                            // console.log("initial login ---------------------------------");
                                            await AsyncStorage.setItem(AsyncStorageConstants.ASYNC_STORAGE_LOGIN_ROUND, "0");

                                            get_ASYNC_CHECKSYNC().then(res => {
                                                // console.log(" sync status >>>>>>>>>>>>>>>>>>>>>>>>>>     ", res);

                                            })

                                            navigation.navigate("BottomNavi");


                                        }

                                    })





                                } else {

                                    Alert.alert(
                                        "Login Failed!",
                                        "Invalid username or password.",
                                        [
                                            { text: "OK", onPress: () => console.log(response.data) }
                                        ]
                                    );


                                }



                            } else {

                                setloandingspinner(false);

                                Alert.alert(
                                    "Bad Request!",
                                    "Login Failed...",
                                    [
                                        { text: "OK", onPress: () => console.log(response.data) }
                                    ]
                                );

                            }
                        }



                        ).catch((err: any) => {

                            console.log(" response error =====  ", err);

                            logger("Login ERROR ====  " ,  err+"" );


                            setloandingspinner(false);
                            Alert.alert(
                                "Login Failed!",
                                "Server not Connected! ...",
                                [
                                    { text: "OK", onPress: () => console.log(err) }
                                ]
                            );

                        });

                    } catch (error) {

                        logger("Login ERROR ====  " ,  error+"" );

                        readLogs();

                        Alert.alert(
                            "Bad Request!",
                            "Login Failed...",
                            [
                                { text: "OK", onPress: () => console.log(error) }
                            ]
                        );

                    }

                } else {

                    setloandingspinner(false);

                    Alert.alert(
                        "No Internet Connection!",
                        "Please Connect Internet! ...",
                        [
                            { text: "OK", onPress: () => console.log("no internet") }
                        ]
                    );


                }
            })



            //-------------------------------------------------------------

            // const URL2 = BASE_URL + "/Mob_GetRequestMaxAmount.xsjs?dbName=TPL_REPORT_TEST";

            // await axios.get(URL2, { headers }
            // ).then(async response => {
            //     if (response.status === 200) {

            //         await AsyncStorage.setItem(AsyncStorageConstants.ASYNC_STORAGE_JOBOWNER_APPROVAL_AMOUNT, response.data[0].JobOwnerApprovalAmount);

            //         await AsyncStorage.setItem(AsyncStorageConstants.ASYNC_STORAGE_MAXIMUM_REQUEST_AMOUNT, response.data[0].IOUMaxAmount);


            //     } else {

            //         Alert.alert(
            //             "Bad Request!",
            //             "Download Amount Failed...",
            //             [
            //                 { text: "OK", onPress: () => console.log(response.data) }
            //             ]
            //         );

            //     }
            // }



            // ).catch((err: any) => {
            //     Alert.alert(
            //         "Download Amount Failed!",
            //         "Server not Connected...",
            //         [
            //             { text: "OK", onPress: () => console.log(err) }
            //         ]
            //     );
            // });


            //Alert.alert('Login successfully')
        }
    }

    useFocusEffect(
        React.useCallback(() => {

            setuName('');
            setPword('');

            CreateLogFile();


            getLoginUName().then(res => {
                console.log(" user name >>>>>>>>>>>>>>>>>>>>>>>>>>     ", res);

                if (res != null) {

                    getLoginPassword().then(resp => {

                        console.log(" pword >>>>>>>>>>>>>>>>>>>>>>>>>>     ", resp);

                        if (resp != null) {

                            setisEditUName(false);
                            setisEditPW(false);

                            setuName(res + "");
                            setPword(resp + "");



                            console.log(" un and pw already added ====  ");


                        } else {

                            setisEditUName(true);
                            setisEditPW(true);


                            setuName('');
                            setPword('');

                        }

                    });


                } else {


                    
                    setisEditUName(true);
                    setisEditPW(true);



                    setuName('');
                    setPword('');


                }

            })


        }, [navigation])
    )

    return (
        <SafeAreaView style={ComponentsStyles.CONTAINER}>

            {/* <View style={{ backgroundColor: comStyles.COLORS.WHITE, paddingTop: getStatusBarHeight(true), flex: 1 }}> */}

            {/* <ImageBackground source={require('../../assets/images/background.png')} style={comStyles.CONTAINER}> */}
            <Image source={require('../../assets/images/background.png')} style={{ position: 'absolute', width: '100%', height: '100%', }} resizeMode='stretch' />

                <Spinner
                    visible={loandingspinner}
                    textContent={'Sending Request...'}
                    textStyle={{
                        color: ComponentsStyles.COLORS.DASH_COLOR,
                        fontFamily: ComponentsStyles.FONT_FAMILY.SEMI_BOLD,
                        fontSize: 15
                    }}
                />

                <ScrollView
                    style={comStyles.CONTENTLOG}
                    showsVerticalScrollIndicator={true}
                    keyboardShouldPersistTaps='handled'
                    contentContainerStyle={{
                        flexGrow: 1,
                        justifyContent: 'space-between'
                    }}>

                    <View style={comStyles.CONTENT}>

                        <View style={style.box1}>
                            <Image source={require('../../assets/images/CompanyName.png')} style={style.name} />
                        </View>

                        <View style={{ alignItems: "center", justifyContent: "center", flex: 0.5 }}>
                            {/* <View style={style.box2}> */}
                            <Text style={style.welcometxt}>Welcome Back</Text>
                            <Text style={style.subtxt1}>Please enter user name and password
                                to log in to the application</Text>

                        </View>


                        <View style={style.box2}>
                            <InputText
                                is_clr_icon={true}
                                iconClr={comStyles.COLORS.WHITE}
                                icon_name1="user"
                                editable={isEditUName}
                                placeholder="ENTER USER NAME"
                                stateValue={uName}
                                setState={(val: any) => setuName(val)}
                                placeholderColor={comStyles.COLORS.WHITE}
                                style={style.inputTextStyles}

                            />
                            {error.field === 'uName' && (
                                <Text style={style.error}>{error.message}</Text>
                            )}
                            <InputText
                                is_clr_icon={true}
                                iconClr={comStyles.COLORS.WHITE}
                                icon_name1="lock"
                                editable={isEditPW}
                                stateValue={pword}
                                setState={(val: any) => setPword(val)}
                                placeholder="ENTER PASSWORD"
                                secureTextEntry={true}
                                placeholderColor={comStyles.COLORS.WHITE}
                                style={style.inputTextStyles}
                            />
                            {error.field === 'pword' && (
                                <Text style={style.error}>{error.message}</Text>
                            )}

                            <ActionButton
                                title="LOGIN"
                                onPress={() => login()}
                                style={style.ActionButton} />

                                <View style={{padding:10}}/>


                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 0  }}>


                                <Text style={style.footer}>Powered by</Text>
                                <Image source={require('../../assets/images/newlogo.png')} style={style.logo} />


                            </View>
                        </View>




                    </View>



                </ScrollView>

                {/* </View> */}

            {/* </ImageBackground> */}
            

        </SafeAreaView>
    );
}

export default LoginScreen;
