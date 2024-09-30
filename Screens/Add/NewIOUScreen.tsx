import React, { Component, useState } from "react";
import ComStyles from "../../Constant/Components.styles";
import {
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    FlatList,
    Dimensions,
    Image,
    Animated,
    Platform,
    Keyboard,
    PermissionsAndroid,
    Alert,


} from 'react-native';
//import { Portal, Dialog, Button, Paragraph } from 'react-native-paper';
//import CameraRoll from "@react-native-community/cameraroll";
import Header from "../../Components/Header";
import ActionButton from "../../Components/ActionButton";
import ViewField from "../../Components/ViewField";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from 'react-native-vector-icons/AntDesign';
import InputText from "../../Components/InputText";
import AddAnotherJob from "../../Components/AddAnotherJob";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import SubmitCancelModal from "../../Components/SubmitCancelComponent";
let width = Dimensions.get("screen").width;
const height = Dimensions.get('screen').height;
import ImagePicker, { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import ImageUpload from "../../Components/ImageUpload";
import { IOUType } from "../../Constant/DummyData";
import { getAllEmployee, getTypeWiseUsers } from "../../SQLiteDBAction/Controllers/EmployeeController";
import { getIOUTypes } from "../../SQLiteDBAction/Controllers/IOUTypeController";
import { getIOUJobsListByID, getIOUReOpenRequest, getLastIOU, updateIDwithStatus, updateSyncStatus } from "../../SQLiteDBAction/Controllers/IOUController";
import moment from "moment";
import { CopyRequest, getLoginUserID, getLoginUserName, getLoginUserRoll, getRejectedId, get_ASYNC_COST_CENTER, get_ASYNC_EPFNO, get_ASYNC_IS_Auth_Requester } from "../../Constant/AsynStorageFuntion";
import { saveIOU } from "../../SQLiteDBAction/Controllers/IOUController";
import { Double } from "react-native/Libraries/Types/CodegenTypes";
import RNFS from 'react-native-fs';
import { getExpenseTypeAll } from "../../SQLiteDBAction/Controllers/ExpenseTypeController";
import AsyncStorageConstants from "../../Constant/AsyncStorageConstants";
import JobsView from "../../Components/JobsView";
import { getIOUSETJobsListByID } from "../../SQLiteDBAction/Controllers/IouSettlementController";
import NewJobsView from "../../Components/NewJobView";
import { DeleteIOUJobByID, getIOUJOBDataBYRequestID, getIOUJobDetailsById, getIOUJobTotAmount, getIOUJobsByID, getIOUJobsList, getLastIOUJobID, saveIOUJOB, updateIOUDetailLineSyncStatus } from "../../SQLiteDBAction/Controllers/IOUJobController";
import { getOneOffJobsListByID, getOneOffReOpenRequest } from "../../SQLiteDBAction/Controllers/OneOffSettlementController";
import { getCostCenterByJobNo, getJobNOByOwners, getJobNoAll } from "../../SQLiteDBAction/Controllers/JobNoController";
import { getAllLoginUserDetails, getAllTransportOfficers, getAllUsers, getJobOwners } from "../../SQLiteDBAction/Controllers/UserController";
import { getVehicleNoAll } from "../../SQLiteDBAction/Controllers/VehicleNoController";
import axios from "axios";
import { BASE_URL, DB_LIVE, headers } from '../../Constant/ApiConstants';
import { updateData } from "../../SQLiteDBAction/DBService";
import { getAllJobOwners, getAllJobOwnersBYDep } from "../../SQLiteDBAction/Controllers/JobOwnerController";
import { getIOUAttachmentListByID, getLastAttachment, saveAttachments } from "../../SQLiteDBAction/Controllers/AttachmentController";
import { getDepartments, getLoggedUserHOD } from "../../SQLiteDBAction/Controllers/DepartmentController";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Conection_Checking } from "../../Constant/InternetConection_Checking";
import NumberFormat from 'react-number-format';
import { getAccNoByExpenseType, getAccNoForJobNo, getGLAccNo } from "../../SQLiteDBAction/Controllers/GLAccountController";
import { logger, saveJsonObject_To_Loog } from "../../Constant/Logger";
import DetailsBox from "../../Components/DetailsBox";
import { Dialog, FAB } from "react-native-paper";
import DropdownAlert, { DropdownAlertData, DropdownAlertType } from "react-native-dropdownalert";

const data = [
    { label: 'JOV1542', value: '1' },
    { label: 'JOV1543', value: '2' },
    { label: 'JOV1544', value: '3' },
    { label: 'JOV1545', value: '4' },
    { label: 'JOV1546', value: '5' },
    { label: 'JOV1547', value: '6' },
    { label: 'JOV1548', value: '7' },
    { label: 'JOV1549', value: '8' },
];

let amount = 0.0;
var jobArray: any = [];
var getJobArray: any;
let JobDetails: any[] = [];
let ReOpenData: any[] = [];
let AttchDetails: any[] = [];
let IOUID = "";
var imgArray: any = [];
let userRole: any;
let IOUJobData: any[] = [];
let epfNo: any;
let alert = (_data: DropdownAlertData) => new Promise<DropdownAlertData>(res => res);
const NewIOUScreen = () => {
    //save IOU
    const [IOUTypeID, setIOUTypeID] = useState('');
    const [EmpID, setEmpID] = useState('');
    const [isFocus, setIsFocus] = useState(false);
    const [isShowSweep, setIsShowSweep] = useState(true);
    const [modalStyle, setModalStyle] = useState(new Animated.Value(height));
    const [isSubmit, setIsSubmit] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [ShowAlert, setShowAlert] = useState(false);
    // const [cameraPhoto, setCameraPhoto] = useState('');
    const [galleryPhoto, setGalleryPhoto] = useState('');
    // const [error, setError] = useState({field: '', message: ''})
    //Job 
    const [isJobOrVehicle, setIsJobOrVehicle] = useState(true);
    const [iouTypeJob, setIouTypeJob] = useState('');
    const [searchtxt, setSearchtxt] = useState('');
    const [cameraPhoto, setCameraPhoto] = useState('');
    const [error, setError] = useState({ field: '', message: '' })
    const [imageData, setImageData] = useState('');
    const [imageUri, setImageUri] = useState(null);
    // spinner data list 
    const [jobOwnerList, setJobOwnerlist] = useState([]);
    const [IOUTypeList, setIOUTypeList] = useState([]);
    const [EmployeeList, setEmployeeList] = useState([]);
    const [Job_Owner, setJobOwner] = useState('');
    const [Job_NoList, setJob_NoList] = useState([]);
    const [Vehicle_NoList, setVehicle_NoList] = useState([]);
    const [DepartmentList, setDepartmentList] = useState([]);
    const [AccountList, setAccountList] = useState([]);
    //spinner selected
    const [selectJobOwner, setSelectJobOwner] = useState('');
    const [selectIOUType, setSelectIOUType] = useState('');
    const [selectEmployee, setSelectEmployee] = useState('');
    const [selectJOBVehicleNo, setselectJOBVehicleNo] = useState('');
    // Free fill data list
    const [copyJobOwner, setCopyJobOwner] = useState('');
    const [copyIOUType, setCopyIOUType] = useState('');
    const [copyEmployee, setCopyEmployee] = useState('');
    const [ownerType, setOwnerType] = useState('Job Owner');
    const [TransportOfficerList, setTransportOfficerList] = useState([]);
    const [HODList, setHODList] = useState([]);
    // generate ID 
    const [lastID, setLastID] = useState('');
    const [lastAttachmentID, setLastAttachmentID] = useState('');
    const [IOUNo, setIOUNo] = useState('');
    //const [lastAttachementID, setLastAttachementID] = useState('');
    const [AttachementNo, setAttachementNo] = useState('');
    // Async data
    const [uName, setUname] = useState('');
    const [userID, setUserID] = useState('');
    const [isReOpen, setIsReOpen] = useState('');
    const [uId, setUId] = useState('');
    //save Job
    const [expenseTypeID, setExpenseTypeID] = useState('');
    const [requestAmount, setrequestAmount] = useState('');
    const [remarks, setRemarks] = useState('');
    const [accountNo, setAccountNo] = useState('');
    const [costCeneter, setCostCenter] = useState('');
    const [costCeneterID, setCostCenterID] = useState('');
    const [resource, setResource] = useState('');
    //Add Job spinner select 
    const [jobNo, setjobNo] = useState('');
    const [SelecteJoborVehicle, setSelecteJoborVehicle] = useState('');
    const [selectExpenseType, setSelectExpenseType] = useState('');
    const [ExpenseTypeList, setExpenseTypeList] = useState([]);
    const [joblist, setJobList]: any = useState([]);
    const [jobIOUlist, setIOUJobList]: any = useState([]);
    const [IOUTypeDetails, setIOUTypeDetails] = useState([]);
    const [isEditable, setIsEditable] = useState(true);
    const [isEditableEmp, setIsEditableEmp] = useState(true);
    const [isDisableAcc, setIsDisableAcc] = useState(false);
    const [isDisableRes, setIsDisableRes] = useState(false);
    //Approval 
    const [IOULimit, setIOULimit] = useState(0.0);
    const [HODId, setHODID] = useState('');
    const [RequesterLimit, setRequesterLimit] = useState(0.0);
    const [CreateReqLimit, setCreateReqLimit] = useState(0.0);
    const [isEdit, setIsEdit] = useState(false);
    const [isAmount, setIsAmount] = useState(false);
    const [saveTitle, setsaveTitle] = useState("Add");
    const [isDialog, setIsDialog] = useState(false);
    const [isSubmitDialog, setIsSubmitDialog] = useState(false);
    var typeID = 0;
    var currentDate1 = moment().utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss');
    var currentDate = moment().utcOffset('+05:30').format('YYYY-MM-DDTHH:mm:ss');
    const navigation = useNavigation();
    const newFolderPath = `${RNFS.DocumentDirectoryPath}/ImageFolder`;
    let newFilePath = `${newFolderPath}/${AttachementNo}.jpg`;
    const newGalleryPath = `${newFolderPath}/${AttachementNo}.jpg`;
    let imageURI = Platform.OS === 'ios'
        ? `file://${newFilePath}`
        : `file:///android_asset/${newFilePath}`;
    const galleryImageURI = Platform.OS === 'android'
        ? `file://${newGalleryPath}`
        : `file:///android_asset/${newGalleryPath}`;
    const options = {
        saveToPhotos: true,
        mediaType: 'photo',
        quality: 0.5,
        includeBase64: true,
        maxWidth: 400,
        maxHeight: 300,
    };
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
    const back = () => {
        AsyncStorage.setItem(AsyncStorageConstants.ASYNC_STORAGE_IS_COPY, "false");
        navigation.navigate('Home');
    }
    const openCamera = async () => {
        setIsDialog(false);
        if (Platform.OS === "ios") {
            console.log(" ios camera open -----   ");
            const result = await launchCamera(options);
            try {
                let atchNo = Date.now();
                console.log("attno", atchNo);
                newFilePath = `${newFolderPath}/${atchNo}.jpg`;
                imageURI = Platform.OS === 'ios'
                    ? `file://${newFilePath}`
                    : `file:///android_asset/${newFilePath}`;
                await RNFS.mkdir(newFolderPath);
                await RNFS.moveFile(result.assets[0].uri, newFilePath);
                // console.log('Picture saved successfully.');
                // console.log(newFilePath);
            } catch (error) {
                console.log(error);
            }
            const newCaptureImages = [...cameraPhoto, imageURI];
            setCameraPhoto(newCaptureImages);
            const fileData = await RNFS.readFile(imageURI, 'base64');
            imgArray.push(
                {
                    "id": imgArray.length + 1,
                    "imageUri": imageURI
                }
            );
            attachmentSave();
        } else {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                    title: 'Petty Cash App Camera Permission',
                    message:
                        'Petty Cash  App needs access to your camera. ',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log('You can use the camera');
                const result = await launchCamera(options);
                try {
                    let atchNo = Date.now();
                    console.log("attno", atchNo);
                    newFilePath = `${newFolderPath}/${atchNo}.jpg`;
                    imageURI = Platform.OS === 'android'
                        ? `file://${newFilePath}`
                        : `file:///android_asset/${newFilePath}`;
                    await RNFS.mkdir(newFolderPath);
                    await RNFS.moveFile(result.assets[0].uri, newFilePath);
                    // console.log('Picture saved successfully.');
                    // console.log(newFilePath);
                } catch (error) {
                    console.log(error);
                }
                const newCaptureImages = [...cameraPhoto, imageURI];
                setCameraPhoto(newCaptureImages);
                const fileData = await RNFS.readFile(imageURI, 'base64');
                imgArray.push(
                    {
                        "id": imgArray.length + 1,
                        "imageUri": imageURI
                    }
                );
                attachmentSave();
            } else {
                console.log('Camera permission denied');
                const result = await launchImageLibrary(options);
                setGalleryPhoto(result.assets[0].uri);
            }
        }
    }
    const openGallery = async () => {
        const result = await launchImageLibrary(options);
        try {
            await RNFS.mkdir(newFolderPath);
            await RNFS.moveFile(result.assets[0].uri, newGalleryPath);
            // console.log('Picture saved successfully.');
            // console.log(newGalleryPath);
        } catch (error) {
            // console.log(error);
        }

        const newSelectedImages = [...galleryPhoto, galleryImageURI];
        setGalleryPhoto(newSelectedImages);
        const fileData = await RNFS.readFile(imageURI, 'base64');
        attachmentSave();
        //}
    }
    const renderGalleryUri = ({ item }) => {
        if (galleryPhoto) {
            //if(galleryPhoto != cameraPhoto)
            return (
                <View style={{ margin: 5 }}>
                    <Image
                        source={{ uri: item }}
                        style={{ height: 70, width: 70, }}
                    />
                </View>
            )
        } else {
            return (
                <View>
                </View>
            )
        }
    }

    const renderCameraUri = ({ item }) => {
        if (cameraPhoto) {
            return (
                <View style={{ margin: 5 }}>
                    <Image
                        source={{ uri: item }}
                        style={{ height: 70, width: 70, }}
                    />
                </View>
            )
        } else {
            return (
                <View>
                    {/* <Text style={{ color: ComStyles.COLORS.DETAIL_ASH, fontSize: 13, textAlign: "center", alignItems: "center" }}>No Added Attachments</Text> */}
                </View>
            )
        }
    }
    const slideInModal = () => {
        setIsShowSweep(false);
        // console.log('sampleIn');
        Animated.timing(modalStyle, {
            toValue: height / 8.5,
            duration: 500,
            useNativeDriver: false,
        }).start();
    };
    const slideOutModal = () => {
        setIsShowSweep(true);
        Keyboard.dismiss();
        Animated.timing(modalStyle, {
            toValue: height,
            duration: 500,
            useNativeDriver: false,
        }).start();
    };
    const submit = () => {
        let loginError = { field: '', message: '' }
        if (Job_Owner === '') {
            loginError.field = 'JobOwner';
            loginError.message = 'Please select Job Owner to procced'
            setError(loginError);
        } else if (IOUTypeID === '') {
            loginError.field = 'IOUTypeID';
            loginError.message = 'Please select IOU Type to procced'
            setError(loginError);
        } else if (EmpID === '') {
            loginError.field = 'EmpName';
            loginError.message = 'Please select Employee to procced'
            setError(loginError);
        }
        // else if (cameraPhoto.length == 0) {
        //     Alert.alert("Please Add Attachments");
        // }
        else {
            getIOUJobTotAmount(IOUNo, async (resp: any) => {
                amount = parseFloat(resp[0].totAmount);
                if (parseFloat(resp[0].totAmount) == 0.0) {
                    await alert({
                        type: DropdownAlertType.Error,
                        title: 'No Data',
                        message: "Please Add Job.",
                    });
                } else {

                    setError({ field: '', message: '' });
                    // setIsSubmit(true);
                    // slideInModal();
                    setIsSubmitDialog(true);
                }

            });
        }
    }
    const addjob = () => {
        generateJobNo();
        getExpenseTypeAll((res: any) => {
            setExpenseTypeList(res);
        });
        let loginError = { field: '', message: '' }
        if (IOUTypeID === '') {
            loginError.field = 'IOUTypeID';
            loginError.message = 'Please select IOU Type to Add Job'
            setError(loginError);
        } else {
            if (IOUTypeID == "1") {
                setIsJobOrVehicle(true);
                setIouTypeJob("Job No");
                setSearchtxt("Select Job");
            } else if (IOUTypeID == "2") {
                setIsJobOrVehicle(true);
                setIouTypeJob("Vehicle No");
                setSearchtxt("Search Vehicle");
            } else {
                setIsJobOrVehicle(false);
            }
            setIsSubmit(false);
            setIsOpen(false);
            slideInModal();
        }
    }
    const ClearData = () => {
        setJobOwner('');
        setJobOwnerlist([]);
        setIOUTypeID('');
        setEmpID('');
        setEmployeeList([]);
        setIOULimit(0.0);
        setCameraPhoto('');
        setjobNo('');
        setSelecteJoborVehicle('');
        setSelectExpenseType('');
        setJobList([]);
        setResource('');
        setCostCenter('');
        setAccountNo('');
        setrequestAmount('');
        setExpenseTypeID('');
        setSelectEmployee('');
        setSelectIOUType('');
        setSelectJobOwner('');
    }
    const saveSubmit = () => {
        let IOUData: any;
        let HODID: any;
        let IsLimit: any;
        closeSubmitDialog();
        getLoggedUserHOD(async (res: any) => {
            console.log(" hod ===  ", res);
            setHODID(res[0].ID);
            HODID = res[0].ID;
            console.log(" request amount ----   ", amount, '----------  limit =========== ', CreateReqLimit);
            if (amount > CreateReqLimit) {
                //Requester limit exceed
                await alert({
                    type: DropdownAlertType.Error,
                    title: 'Limit Exceed!',
                    message: "Requested amount is limit exceeded.",
                });
            } else {
                if (IOUTypeID === '3') {
                    IsLimit = "";
                    // console.log(" hod other ---  ", res[0].ID);
                    IOUData = [
                        {
                            PCRCode: IOUNo,
                            JobOwner: parseInt(Job_Owner),
                            IOUType: parseInt(IOUTypeID),
                            EmployeeNo: parseInt(EmpID),
                            RequestedDate: currentDate,
                            Amount: amount,
                            StatusID: 5,
                            RequestedBy: userID,
                            IsSync: 0,
                            Remark: "",
                            Reject_Remark: "",
                            Attachment_Status: 1,
                            HOD: parseInt(res[0].ID),
                            FirstActionBy: '',
                            FirstActionAt: '',
                            RIsLimit: null,
                            AIsLimit: null,
                            RIouLimit: '',
                            AIouLimit: '',
                            SecondActionBy: '',
                            SecondActionAt: '',
                            FStatus: 0,
                        }
                    ]
                    Conection_Checking(async (res: any) => {
                        if (res != false) {
                            saveIOU(IOUData, 0, async (response: any) => {
                                // console.log(" save iou .................... ", response);
                                if (response == 3) {
                                    Conection_Checking(async (res: any) => {
                                        if (res != false) {
                                            //internet available 
                                            getDetailsData(parseInt(res[0].ID), IsLimit);
                                            await alert({
                                                type: DropdownAlertType.Success,
                                                title: 'Success',
                                                message: "Successfully Submitted!",
                                            });
                                            // await AsyncStorage.setItem(AsyncStorageConstants.ASYNC_CURRENT_PENDING_LIST_TYPE, "IOU");
                                            // AsyncStorage.setItem(AsyncStorageConstants.ASYNC_STORAGE_IS_COPY, "false");
                                            // navigation.navigate('PendingList');
                                        } else {
                                            // ClearData();
                                            await alert({
                                                type: DropdownAlertType.Error,
                                                title: 'Sync Failed',
                                                message: "Please Check your internet connection",
                                            });
                                        }
                                    });
                                    // slideOutModal();

                                } else {
                                    await alert({
                                        type: DropdownAlertType.Error,
                                        title: 'Failed',
                                        message: "IOU Request Failed!",
                                    });
                                }
                            });

                        } else {
                            await alert({
                                type: DropdownAlertType.Error,
                                title: 'Sync Failed',
                                message: "Please Check your internet connection",
                            });
                        }

                    });

                } else if (amount > IOULimit) {
                    // limit exceed
                    // console.log("limit exceed job no or vehicle type ----  ", res[0].ID);
                    IsLimit = "YES";
                    IOUData = [
                        {
                            PCRCode: IOUNo,
                            JobOwner: parseInt(Job_Owner),
                            IOUType: parseInt(IOUTypeID),
                            EmployeeNo: parseInt(EmpID),
                            RequestedDate: currentDate,
                            Amount: amount,
                            StatusID: 1,
                            RequestedBy: userID,
                            IsSync: 0,
                            Remark: "",
                            Reject_Remark: "",
                            Attachment_Status: 1,
                            HOD: parseInt(res[0].ID),
                            FirstActionBy: '',
                            FirstActionAt: '',
                            RIsLimit: 'YES',
                            AIsLimit: null,
                            RIouLimit: IOULimit,
                            AIouLimit: '',
                            SecondActionBy: '',
                            SecondActionAt: '',
                            FStatus: 0,
                        }
                    ]
                    Conection_Checking(async (res: any) => {
                        if (res != false) {
                            saveIOU(IOUData, 0, async (response: any) => {
                                // console.log(" save iou .................... ", response);
                                if (response == 3) {
                                    getDetailsData(parseInt(res[0].ID), IsLimit);
                                    closeSubmitDialog();
                                    await alert({
                                        type: DropdownAlertType.Success,
                                        title: 'Success',
                                        message: "Successfully Submitted!",
                                    });
                                    // await AsyncStorage.setItem(AsyncStorageConstants.ASYNC_CURRENT_PENDING_LIST_TYPE, "IOU");
                                    // AsyncStorage.setItem(AsyncStorageConstants.ASYNC_STORAGE_IS_COPY, "false");
                                    // navigation.navigate('PendingList');
                                } else {
                                    await alert({
                                        type: DropdownAlertType.Error,
                                        title: 'Failed',
                                        message: "IOU Request Failed!",
                                    });
                                }
                            });

                        } else {
                            await alert({
                                type: DropdownAlertType.Error,
                                title: 'Sync Failed',
                                message: "Please Check your internet connection",
                            });
                        }
                    });

                } else {
                    // limit  not exceed
                    if (IOUTypeID === '3') {
                        //other type
                        // console.log("Other type ----  ", HODID);
                        IsLimit = "";
                        IOUData = [
                            {
                                PCRCode: IOUNo,
                                JobOwner: parseInt(Job_Owner),
                                IOUType: parseInt(IOUTypeID),
                                EmployeeNo: parseInt(EmpID),
                                RequestedDate: currentDate,
                                Amount: amount,
                                StatusID: 1,
                                RequestedBy: userID,
                                IsSync: 0,
                                Remark: "",
                                Reject_Remark: "",
                                Attachment_Status: 1,
                                HOD: parseInt(res[0].ID),
                                FirstActionBy: '',
                                FirstActionAt: '',
                                RIsLimit: null,
                                AIsLimit: null,
                                RIouLimit: IOULimit,
                                AIouLimit: '',
                                SecondActionBy: '',
                                SecondActionAt: '',
                                FStatus: 0,
                            }
                        ]
                        Conection_Checking(async (res: any) => {
                            if (res != false) {
                                saveIOU(IOUData, 0, async (response: any) => {
                                    // console.log(" save iou .................... ", response);
                                    if (response == 3) {
                                        getDetailsData(parseInt(res[0].ID), IsLimit);
                                        closeSubmitDialog();
                                        await alert({
                                            type: DropdownAlertType.Success,
                                            title: 'Success',
                                            message: "Successfully Submitted!",
                                        });
                                        // await AsyncStorage.setItem(AsyncStorageConstants.ASYNC_CURRENT_PENDING_LIST_TYPE, "IOU");
                                        // AsyncStorage.setItem(AsyncStorageConstants.ASYNC_STORAGE_IS_COPY, "false");
                                        // navigation.navigate('PendingList');
                                    } else {
                                        await alert({
                                            type: DropdownAlertType.Error,
                                            title: 'Failed',
                                            message: "IOU Request Failed!",
                                        });
                                    }
                                });
                            } else {
                                await alert({
                                    type: DropdownAlertType.Error,
                                    title: 'Sync Failed',
                                    message: "Please Check your internet connection",
                                });
                            }
                        });
                    } else {
                        // console.log("job no or vehicle");
                        IsLimit = "NO";
                        HODID = '';
                        IOUData = [
                            {
                                PCRCode: IOUNo,
                                JobOwner: parseInt(Job_Owner),
                                IOUType: parseInt(IOUTypeID),
                                EmployeeNo: parseInt(EmpID),
                                RequestedDate: currentDate,
                                Amount: amount,
                                StatusID: 1,
                                RequestedBy: userID,
                                IsSync: 0,
                                Remark: "",
                                Reject_Remark: "",
                                Attachment_Status: 1,
                                HOD: '',
                                FirstActionBy: '',
                                FirstActionAt: '',
                                RIsLimit: 'NO',
                                AIsLimit: null,
                                RIouLimit: IOULimit,
                                AIouLimit: '',
                                SecondActionBy: '',
                                SecondActionAt: '',
                                FStatus: 0,
                            }
                        ]
                        Conection_Checking(async (res: any) => {
                            if (res != false) {
                                saveIOU(IOUData, 0, async (response: any) => {
                                    // console.log(" save iou .................... ", response);
                                    if (response == 3) {
                                        getDetailsData(HODID, IsLimit);
                                        closeSubmitDialog();
                                        await alert({
                                            type: DropdownAlertType.Success,
                                            title: 'Success',
                                            message: "Successfully Submitted!",
                                        });
                                        // await AsyncStorage.setItem(AsyncStorageConstants.ASYNC_CURRENT_PENDING_LIST_TYPE, "IOU");
                                        // AsyncStorage.setItem(AsyncStorageConstants.ASYNC_STORAGE_IS_COPY, "false");
                                        // navigation.navigate('PendingList');
                                    } else {
                                        await alert({
                                            type: DropdownAlertType.Error,
                                            title: 'Failed',
                                            message: "IOU Request Failed!",
                                        });
                                    }
                                });
                            } else {
                                await alert({
                                    type: DropdownAlertType.Error,
                                    title: 'Sync Failed',
                                    message: "Please Check your internet connection",
                                });
                            }
                        });
                    }
                }
            }
        });
    }
    const attachmentSave = () => {
        const attachementData = [
            {
                PCRCode: IOUNo,
                Img_url: imageURI,
                Status: 1,
            }
        ]
        saveAttachments(attachementData, async (response: any) => {
            if (response == 3) {
                slideOutModal();
                await alert({
                    type: DropdownAlertType.Success,
                    title: 'Success',
                    message: "Attachmnet saved!",
                });
                console.log("image array ==== ", imgArray);
            } else {
                await alert({
                    type: DropdownAlertType.Error,
                    title: 'Failed',
                    message: "Attachmnet Not Saved!",
                });
            }
        })
    }
    const attachement = () => {
        setIsDialog(true);
    }
    const getAllIOUTypes = () => {
        setIOUTypeList([]);
        getIOUTypes((result: any) => {
            setIOUTypeList(result);
        });
    }
    const getJJobOwnerTransportHOD = (type: any) => {
        // type = 1 - job owner / 2 - transport officer / 3 - hod
        setJobOwnerlist([]);
        if (type == 1) {
            //get job owners
            getAllJobOwnersBYDep((resp1: any) => {
                // console.log(" job owners == [][][][]    ", resp1);
                setJobOwnerlist(resp1);
                if (userRole === '3' || userRole === '4') {
                    // console.log("job owner or transport officer==================  ", userID);
                    const empdata = resp1?.filter((a: any) => a.ID == parseInt(userID))[0];
                    // console.log(" job owner name & id ====   ", empdata.Name, " --------------    ", empdata.ID);
                    setSelectJobOwner(empdata.Name);
                    setJobOwner(empdata.ID);
                    getJobNoByJobOwner(empdata.EPFNo + "");
                    setIOULimit(parseFloat(empdata.IOULimit));
                }
            });
        } else if (type == 2) {
            //get transport officer
            getAllTransportOfficers((resp2: any) => {
                console.log(" transport officers == [][][][]    ", resp2);
                setJobOwnerlist(resp2);
                if (userRole === '3' || userRole === '4') {
                    console.log("job owner or transport officer==================  ", userID);
                    const empdata = resp2?.filter((a: any) => a.ID == parseInt(userID))[0];
                    setSelectJobOwner(empdata.Name);
                    setJobOwner(empdata.ID);
                    setIOULimit(parseFloat(empdata.IOULimit));
                    console.log(" transport officer name & id ====   ", empdata.Name, " --------------    ", empdata.ID);
                }
            });
        } else {
            //get hod
            getLoggedUserHOD((resp3: any) => {
                console.log(" hod == [][][][]    ", resp3);
                setJobOwnerlist(resp3);
                setSelectJobOwner(resp3[0].Name);
                setJobOwner(resp3[0].ID);
                setHODID(resp3[0].ID);
            });
        }
    }
    const getSpinnerData = () => {
        setJobOwnerlist([]);
        setIOUTypeList([]);
        setEmployeeList([]);
        setTransportOfficerList([]);
        getAllJobOwners((result: any) => {
            // console.log(" Job owner ...........  ", result);
            setJobOwnerlist(result);
        })
        getAllEmployee((eresult: any) => {
            setEmployeeList(eresult);
            // console.log(" employee1111111 ....  ", eresult);
            // console.log(" employee ....  ", eresult[0].EmpName);
        });
    }
    const getLastId = () => {
        getLastIOU((result: any) => {
            // console.log("... last ID length ...... ", result.length);
            if (result.length == 0) {
                setLastID("0");
                generateIOUNo(0);
            } else {
                setLastID(result[0]._Id);
                generateIOUNo(result[0]._Id)
            }
        });
    }
    const getLastAttachmentId = () => {
        getLastAttachment((result: any) => {
            // console.log("... last ID length ...... ", result.length);
            if (result.length == 0) {
                setLastAttachmentID("0");
                generateAttachementNo(0);
            } else {
                setLastAttachmentID(result[0]._Id);
                generateAttachementNo(result[0]._Id)
            }
        });
    }
    const generateIOUNo = (ID: any) => {
        //console.log(" ID GENERATE ======================   ");
        let newID = parseInt(ID) + 1;
        let randomNum = Math.floor(Math.random() * 1000) + 1;
        setIOUNo("IOU_" + randomNum + "_" + newID + "_M");
        IOUID = "IOU_" + randomNum + "_" + newID + "_M";
        // console.log("AutoGenerated No: ", IOUID);
    }
    const generateAttachementNo = (ID: any) => {
        //console.log("ATTACHMENT ID GENERATE ======================   ");
        let newAttachmentID = parseInt(ID) + 1;
        let randomNum = Math.floor(Math.random() * 1000) + 1;
        setAttachementNo("IOUAtch_" + randomNum + "_" + newAttachmentID + "_M");
    }
    // Add Another JOb Functions ................
    const generateJobNo = () => {
        getLastIOUJobID((res: any) => {
            // console.log(" job last id .....  ", res[0]._Id);
            let ID = parseInt(res[0]._Id) + 1;
            let randomNum = Math.floor(Math.random() * 1000) + 1;
            setjobNo("JOB_" + randomNum + "_" + ID);
            // console.log(" Job No [[[[[   ", jobNo);
        });
    }
    const getVehicleNo = () => {
        getVehicleNoAll((resp: any) => {
            //console.log("Vehicle No............", resp);
            setVehicle_NoList(resp);
        })
    }
    const add_one = (data: any) => {
        if (data == 1) {
            //if add is pressed
            Alert.alert('Add !', 'Are you sure you want to Add this ?', [
                {
                    text: 'No',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                { text: 'Yes', onPress: (add) },
            ]);
        } else if (data == 2) {
            //if submit is pressed
            Alert.alert('Add !', 'Are you sure you want to submit this ?', [
                {
                    text: 'No',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                { text: 'Yes', onPress: (saveSubmit) },
            ]);
        } else if (data == 3) {
            //if cancel is pressed in animated view
            Alert.alert('Cancel !', 'Are you sure you want to cancel this ?', [
                {
                    text: 'No',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                { text: 'Yes', onPress: (CancelRequest) },
            ]);
        } else {
            //if cancel is presed 
            Alert.alert('Cancel !', 'Are you sure you want to cancel this ?', [
                {
                    text: 'No',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                { text: 'Yes', onPress: (cancelJob) },
            ]);
        }
    }
    const CancelRequest = () => {
        AsyncStorage.setItem(AsyncStorageConstants.ASYNC_STORAGE_IS_COPY, "false");
        slideOutModal();
        navigation.navigate('Home');
    }
    const add = () => {
        // console.log("addddddddddd /////////// ");
        let jobError = { field: '', message: '' }
        // if (SelecteJoborVehicle === '') {
        //     jobError.field = 'JobOwner'
        //     jobError.message = 'Job No is required'
        //     setError(jobError);
        // }
        // else 
        if (expenseTypeID === '') {
            jobError.field = 'TicketID'
            jobError.message = 'Expense type is required'
            setError(jobError);
        } else if (requestAmount === '') {
            jobError.field = 'requestAmount'
            jobError.message = 'Amount  is required'
            setError(jobError);
        } else if (requestAmount === 'NaN') {
            // addbtn 
            jobError.field = 'requestAmount'
            jobError.message = 'Invalid Amount'
            setError(jobError);
        } else if (accountNo === '') {
            jobError.field = 'accNo'
            jobError.message = 'Account No is required '
            setError(jobError);
        } else {
            saveJob();
        }
    }
    const saveJob = async () => {
        //console.log(" job ID ............  ", jobNo);
        try {
            let isDecimal = requestAmount.indexOf(".");
            let decimalAmount = 0.0;
            if (isDecimal != -1) {
                const splitAmount = requestAmount.split(".");
                decimalAmount = parseFloat(splitAmount[0].replaceAll(',', '') + "." + splitAmount[1]);
            } else {
                decimalAmount = parseFloat(requestAmount.replaceAll(',', ''));
            }
            const saveObject =
            {
                Job_ID: jobNo,
                IOUTypeNo: SelecteJoborVehicle,
                JobOwner_ID: parseInt(Job_Owner),
                PCRCode: IOUNo,
                AccNo: accountNo,
                CostCenter: costCeneter,
                Resource: resource,
                ExpenseType: parseInt(expenseTypeID),
                Amount: decimalAmount,
                Remark: remarks,
                CreateAt: currentDate,
                RequestedBy: userID,
                IsSync: 0
            }
            console.log("save job ............>>>>>>>>>>> ", saveObject);
            const JOBData: any = [];
            JOBData.push(saveObject);
            try {
                saveIOUJOB(JOBData, 0, async (response: any) => {
                    // console.log(" save job .. ", response);
                    amount += decimalAmount;
                    if (response == 3) {
                        // jobArray.push(saveObject);
                        // setJobList(jobArray);
                        // console.log(" JOB List [][][][ ", joblist);
                        getIOUJobsByID(IOUNo, (res: any) => {
                            setJobList(res);
                        });
                        await alert({
                            type: DropdownAlertType.Success,
                            title: 'Success',
                            message: "Successfully Added!",
                        });
                        setSelecteJoborVehicle('');
                        setExpenseTypeID('');
                        setrequestAmount('');
                        setRemarks('');
                        setAccountNo('');
                        setCostCenter('');
                        setResource('');
                        setSelectExpenseType('');
                        setselectJOBVehicleNo('');
                        slideOutModal();
                    } else {
                        await alert({
                            type: DropdownAlertType.Error,
                            title: 'Failed',
                            message: "Save Failed!",
                        });
                        setSelecteJoborVehicle('');
                        setExpenseTypeID('');
                        setrequestAmount('');
                        setRemarks('');
                        setAccountNo('');
                        setCostCenter('');
                        setResource('');
                        setSelectExpenseType('');
                        setselectJOBVehicleNo('');
                        slideOutModal();
                    }
                });
            } catch (error) {
                await alert({
                    type: DropdownAlertType.Error,
                    title: 'Failed',
                    message: "Save Failed!",
                });
            }
        } catch (error) {
            await alert({
                type: DropdownAlertType.Error,
                title: 'Failed',
                message: "Save Failed!",
            });
        }
    }
    const cancelJob = () => {
        console.log(" cancel job");
        setSelecteJoborVehicle('');
        setExpenseTypeID('');
        setrequestAmount('');
        setRemarks('');
        setAccountNo('');
        setCostCenter('');
        setResource('');
        setSelectExpenseType('');
        setselectJOBVehicleNo('');
        slideOutModal();
    }
    const getCostCenter = (ID: any) => {
        getCostCenterByJobNo(ID, (res: any) => {
            setCostCenter(res[0].CostCenter);
        });
    }
    //----------reopen jobs data save---------------------------------
    const getIOUJobList = (IOUID: any) => {
        getIOUJobsListByID(IOUID, (response: any) => {
            setJobList(response);
            // console.log(response);
            //console.log(ioujoblist.Amount);
            for (let i = 0; i < response.length; i++) {
                // console.log(response[i].Amount);
                let newamount = response[i].Amount;
                let randomNum = Math.floor(Math.random() * 1000) + 1;
                let ID = parseInt(response[0].Id) + 1;
                const saveObject =
                {
                    Job_ID: ("JOB_" + randomNum + "_" + ID),
                    IOUTypeNo: response[i].IOUTypeNo,
                    JobOwner_ID: response[i].JobOwner_ID,
                    PCRCode: IOUNo,
                    AccNo: response[i].AccNo,
                    CostCenter: response[i].CostCenter,
                    Resource: response[i].Resource,
                    ExpenseType: response[i].ExpenseType,
                    Amount: response[i].Amount,
                    Remark: response[i].Remark,
                    CreateAt: currentDate,
                    RequestedBy: userID,
                    IsSync: 0
                }
                const JOBData: any = [];
                JOBData.push(saveObject);
                saveIOUJOB(JOBData, 0, (response: any) => {
                    // console.log(" save job .. ", response);
                    amount += parseFloat(newamount);
                    if (response == 3) {
                        jobArray.push(saveObject);
                        setJobList(jobArray);
                        // console.log(" JOB List [][][][ ", joblist);
                        //Alert.alert("Successfully Added!");
                    }
                });
            }
        });
    }
    //-------Edit Request----------------------------------------------
    const editRequest = async (id: any) => {
        try {
            getIOUReOpenRequest(id, (result: any) => {
                // console.log("-----GetIOUReOpenRequest Function Calling-------");
                ReOpenData.push(result);
                setCopyJobOwner(result[0].JobOwner_ID);
                setCopyIOUType(result[0].IOU_Type);
                setCopyEmployee(result[0].EmpId);
                // console.log("----JobOwner----", copyJobOwner);
                checkData(id, ReOpenData);
            });
        } catch (error) {
            // console.error(error);
        }
    };
    //-------Check edit Request----------------------------------------------
    const checkData = async (id: any, ReOpenDetails: any) => {
        // console.log("Check Data Function calling", ReOpenDetails);
        getIOUJobsListByID(id, (response: any) => {
            setJobList(response);
        });
        getIOUJobList(id);
        getAllJobOwners((result: any) => {
            //console.log(" Job owner ...........  ", result);
            setJobOwnerlist(result);
            const data = result?.filter((a: any) => a.JobOwner_ID == ReOpenDetails[0][0]['JobOwner_ID'])[0];
            setSelectJobOwner(data.Name);
            setJobOwner(data.JobOwner_ID);
            // console.log(data, " -----------",);
            // console.log(selectJobOwner);
        });
        getIOUTypes((result: any) => {
            // console.log("IOU types ......... ", result);
            setIOUTypeList(result);
            const ioudata = result?.filter((a: any) => a.IOUType_ID == ReOpenDetails[0][0]['IOU_Type'])[0];
            setSelectIOUType(ioudata.Description);
            setIOUTypeID(ioudata.IOUType_ID)
        });
        // // // Employee
        // getAllUsers((result: any) => {
        //     console.log("Employee .....8888888888888888888.... ", result);

        //     // setEmployeeList(result);
        //     const empdata = result?.filter((a: any) => a.USER_ID == ReOpenDetails[0][0]['EmpId'])[0];
        //     setSelectEmployee(empdata.UserName);
        //     setEmpID(empdata.USER_ID);
        // });
        getAllEmployee((eresult: any) => {
            setEmployeeList(eresult);
            const empdata = eresult?.filter((a: any) => a.Emp_ID == ReOpenDetails[0][0]['EmpId'])[0];
            setSelectEmployee(empdata.EmpName);
            setEmpID(empdata.Emp_ID);
        });
    }
    const checkIOUJobData = async (type: any, IOUJOBData: any) => {
        if (type == 1) {
            getJobNoAll(selectJobOwner, (res: any) => {
                //console.log("Job No............", res);
                setJob_NoList(res);
                const jData = res?.filter((a: any) => a.Job_No == IOUJOBData[0].IOUTypeNo)[0];
                setSelecteJoborVehicle(jData.Job_No)
            })
        } else {
            getVehicleNoAll((resp: any) => {
                //console.log("Vehicle No............", resp);
                setVehicle_NoList(resp);
                const vData = resp?.filter((a: any) => a.VEHICLE_NO == IOUJOBData[0].IOUTypeNo)[0];
                setSelecteJoborVehicle(vData.VEHICLE_NO)
            })
        }
        getExpenseTypeAll((result: any) => {
            setExpenseTypeList(result);
            // console.log(result);
            const exdata = result?.filter((a: any) => a.ExpType_ID == IOUJOBData[0].ExpenseType)[0];
            setSelectExpenseType(exdata.Description);
            setExpenseTypeID(exdata.ExpType_ID);
            // console.log(selectExpenseType);
            // console.log(exdata.Description);
        });
        // setrequestAmount(String(IOUJOBData[0].Amount));
        setFormatAmount(IOUJOBData[0].Amount);
        // console.log(editAmount);
        setRemarks(IOUJOBData[0].Remark);
        setAccountNo(IOUJOBData[0].AccNo);
        setCostCenter(IOUJOBData[0].CostCenter);
        setResource(IOUJOBData[0].Resource);
    }
    const getSpinnerEmployee = () => {
        console.log(" get employeee ");
        getAllEmployee((result: any) => {
            setEmployeeList(result);
            get_ASYNC_IS_Auth_Requester().then(async resp => {
                if (resp === '1') {
                    //auth requester
                    // console.log("auth requester -----------   ");
                    setIsEditableEmp(false);
                } else {
                    //requester
                    // console.log(" only requester -----------   ");
                    setIsEditableEmp(true);
                    get_ASYNC_EPFNO().then(async resu => {
                        const empdata = result?.filter((a: any) => a.EPFNo == parseInt(resu + ""))[0];
                        setSelectEmployee(empdata.Name);
                        setEmpID(empdata.ID);
                    });
                }
            });
        });
    }
    //--------Get IOU Types Details Data----------------------
    const getDetailsData = (HOD: any, IsLimit: any) => {
        JobDetails = [];
        var Fileobj: any[] = [];
        getIOUJOBDataBYRequestID(IOUNo, (result: any) => {
            console.log(result, '+++++++++++++++++++++++++++');
            for (let i = 0; i < result.length; i++) {
                // console.log(result[i]);
                JobDetails.push(result[i]);
            }
            getIOUAttachmentListByID(IOUNo, async (rest: any) => {
                Fileobj = [];
                if (rest.length > 0) {
                    for (let i = 0; i < rest.length; i++) {
                        const arr = {
                            "IOUTypeNo": IOUTypeID,
                            "FileName": rest[i].Img_url,
                            "File": await RNFS.readFile(rest[i].Img_url, 'base64'),
                            "FileType": "image/jpeg"
                        }
                        Fileobj.push(arr);
                        if (i + 1 == rest.length) {
                            Conection_Checking(async (res: any) => {
                                if (res != false) {
                                    UploadIOU(JobDetails, HOD, IsLimit, Fileobj);
                                }
                            })
                        }
                    }
                } else {
                    Conection_Checking(async (res: any) => {
                        if (res != false) {
                            UploadIOU(JobDetails, HOD, IsLimit, Fileobj);
                        }
                    })
                }
            })

        })
    }

    //-----------Upload IOU Request------------------

    const UploadIOU = async (detailsData: any, HOD: any, isLimit: any, Fileobj: any) => {
        console.log(" details data --------------   ", detailsData);
        const URL = BASE_URL + '/Mob_PostIOURequests.xsjs?dbName=' + DB_LIVE;
        var loggerDate = "Date - " + moment().utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss') + "+++++++++++++  Upload IOU  ++++++++++++++++";
        logger(loggerDate, "   *******   ");
        var obj = [];
        try {
            if (parseInt(IOUTypeID) == 1) {
                for (let i = 0; i < detailsData.length; i++) {
                    const arr = {
                        "IOUTypeID": detailsData[i].IOUTypeID,
                        "IOUTypeNo": detailsData[i].IOUTypeNo,
                        "ExpenseType": detailsData[i].ExpenseType,
                        "Amount": detailsData[i].Amount,
                        "Remark": detailsData[i].Remark,
                        "AccNo": detailsData[i].AccNo,
                        "CostCenter": detailsData[i].CostCenter,
                        "Resource": detailsData[i].Resource
                    }
                    obj.push(arr);
                }
            } else {
                for (let i = 0; i < detailsData.length; i++) {
                    const arr = {
                        "IOUTypeID": detailsData[i].IOUTypeID,
                        "IOUTypeNo": "",
                        "ExpenseType": detailsData[i].ExpenseType,
                        "Amount": detailsData[i].Amount,
                        "Remark": detailsData[i].Remark,
                        "AccNo": detailsData[i].AccNo,
                        "CostCenter": detailsData[i].CostCenter,
                        "Resource": detailsData[i].Resource
                    }
                    obj.push(arr);
                }

            }
            const prams = {
                "PettycashID": IOUNo,
                "RequestedBy": parseInt(userID),
                "ReqChannel": "Mobile",
                "Date": currentDate,
                "IOUtype": parseInt(IOUTypeID),
                "EmpNo": parseInt(EmpID),
                "JobOwner": parseInt(Job_Owner),
                "CreateAt": currentDate,
                "TotalAmount": amount,
                "IOUTypeDetails": obj,
                "attachments": Fileobj,
                "Hod": parseFloat(HOD),
                "RIsLimit": isLimit,
                "RIouLimit": IOULimit
            }
            saveJsonObject_To_Loog(prams);
            console.log("[][][][][] IOU UPLOAD JSON ", prams, '=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=--');
            console.log("[][][][][] IOU UPLOAD JSON job details ", obj, '=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=--');
            // console.log("[][][][][] IOU UPLOAD JSON attachments ", Fileobj, '=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=--');
            await axios.get(URL, { headers })
            axios.post(URL, prams, {
                headers: headers
            }).then(async (response) => {
                // console.log("[s][t][a][t][u][s][]", response.status);
                logger(" IOU Upload Response Status ", response.status + "");
                saveJsonObject_To_Loog(response.data);
                if (response.status == 200) {
                    // updateSyncStatus(IOUNo, (result: any) => {
                    // });
                    if (response.data.ErrorId == 0) {
                        updateIDwithStatus(IOUNo, response.data.ID, (resp: any) => {
                            console.log(" update id after sync ====  ", resp);
                            if (resp === 'success') {
                                updateIOUDetailLineSyncStatus(IOUNo, (resp1: any) => {

                                });
                            }
                        });
                        await alert({
                            type: DropdownAlertType.Success,
                            title: 'Sync Success',
                            message: response.data.Message,
                        });
                    }
                    // console.log("success ======= ", response.statusText);
                    console.log(" IOU UPLOAD response OBJECT  === ", response.data);
                } else {
                    await alert({
                        type: DropdownAlertType.Error,
                        title: 'Sync Failed',
                        message: response.data.Message,
                    });
                    console.log(" IOU UPLOAD ERROR response code ======= ", response.status);
                }
            }).catch(async (error) => {
                console.log("error .....   ", error);
                logger(" IOU Upload ERROR ", "");
                saveJsonObject_To_Loog(error);
                await alert({
                    type: DropdownAlertType.Error,
                    title: 'Sync Failed',
                    message: error,
                });
            });
        } catch (error) {
            // console.log(error);
            logger(" IOU Upload ERROR ", error + "");
            await alert({
                type: DropdownAlertType.Error,
                title: 'Sync Failed',
                message: error + "",
            });
        }
        await AsyncStorage.setItem(AsyncStorageConstants.ASYNC_CURRENT_PENDING_LIST_TYPE, "IOU");
        AsyncStorage.setItem(AsyncStorageConstants.ASYNC_STORAGE_IS_COPY, "false");
        navigation.navigate('PendingList');
        ClearData();
    }
    const getJobNoByJobOwner = (ID: any) => {
        getJobNOByOwners(ID, (res: any) => {
            setJob_NoList(res);
        });
    }
    const getGL_AccNo = (typeID: any, code: any) => {
        // getAccNoForJobNo((res: any) => {
        //     setAccountList(res);
        //     setAccountNo(res[0].GL_ACCOUNT);
        // });
        setAccountList([]);
        setAccountNo('');
        getGLAccNo(typeID, code, (res: any) => {
            setAccountList(res);
            setAccountNo(res[0].GL_ACCOUNT);
        });
    }
    const getGL_AccByExpenseType = (type: any) => {
        getAccNoByExpenseType(type, (res: any) => {
            setAccountList(res);
            setAccountNo(res[0].GL_ACCOUNT);
        });
    }
    const setFormatAmount = (amount: any) => {
        //   console.log(" onchange amount ====   " , amount , " ----------    " ,amount.replace(/[^a-zA-Z0-9 ]/g, ''));
        //   setrequestAmount(amount);
        let isDecimal = amount.indexOf(".");
        if (isDecimal != -1) {
            // console.log(" decimal number =====    ");
            const split = amount.split(".");
            setrequestAmount(Intl.NumberFormat('en-US').format(split[0].replace(/[^a-zA-Z0-9 ]/g, '')) + "." + split[1].replace(/[^a-zA-Z0-9 ]/g, ''));
        } else {
            setrequestAmount(Intl.NumberFormat('en-US').format(amount.replace(/[^a-zA-Z0-9 ]/g, '')));
        }
    }
    const editJobs = (jobNo: any) => {
        setIsEdit(true);
        setIsAmount(true);
        setsaveTitle("Update");
        setIsSubmit(false);
        setIsOpen(false);
        // console.log(" selected job  ", jobNo)
        getIOUJobDetailsById(jobNo, (res: any) => {
            IOUJobData.push(res[0]);
            typeID = res[0].IOU_TYPEID;
            // setEditJobNo(res[0].IOUTypeNo)
            // setEditExpense(res[0].ExpenseType);
            // setId(res[0]._Id);
            checkIOUJobData(typeID, IOUJobData);
            if (typeID == 1) {
                setIsJobOrVehicle(true);
                setIouTypeJob("Job No");
                setSearchtxt("Select Job");
                // getJobNoAll((result: any) => {
                //     //console.log("Job No............", res);
                //     setJob_NoList(result);
                //     const jobData = result?.filter((a: any) => a.Job_No == editJobNo)[0];
                //     setSelecteJoborVehicle(jobData.Job_No)
                // })
                // const joblistarray = data?.filter((a: any) => a.value == resp[0].AssisstanceID)[0];
            } else if (typeID == 2) {
                setIsJobOrVehicle(true);
                setIouTypeJob("Vehicle No");
                setSearchtxt("Search Vehicle");
                // const jobNolistarray = data?.filter((a: any) => a.value == resp[0].AssisstanceID)[0];
            } else {
                setIsJobOrVehicle(false);
            }
            slideInModal();
        });
        // getIOUJobsListByID(IOUID, (resp: any) => {
        //     IOUJobData.push(resp[0])
        //     // console.log(" JOB Details ======= ", resp);
        //     typeID = resp[0].IOU_Type;
        //     // console.log('+++++++type id++++', typeID);
        //     // setSelecteJoborVehicle(jobNo);
        //     setEditJobNo(resp[0].IOUTypeNo)
        //     setEditExpense(resp[0].ExpenseType);
        //     setId(resp[0]._Id);
        //     checkIOUJobData(typeID, IOUJobData);
        //     if (typeID == 1) {
        //         setIsJobOrVehicle(true);
        //         setIouTypeJob("Job No");
        //         setSearchtxt("Select Job");
        //         // getJobNoAll((result: any) => {
        //         //     //console.log("Job No............", res);
        //         //     setJob_NoList(result);
        //         //     const jobData = result?.filter((a: any) => a.Job_No == editJobNo)[0];
        //         //     setSelecteJoborVehicle(jobData.Job_No)
        //         // })
        //         // const joblistarray = data?.filter((a: any) => a.value == resp[0].AssisstanceID)[0];
        //     } else if (typeID == 2) {
        //         setIsJobOrVehicle(true);
        //         setIouTypeJob("Vehicle No");
        //         setSearchtxt("Search Vehicle");
        //         // const jobNolistarray = data?.filter((a: any) => a.value == resp[0].AssisstanceID)[0];
        //     } else {
        //         setIsJobOrVehicle(false);
        //     }

        // });
    }
    const deleteNewJob = (ID: any) => {
        Alert.alert('Delete details !', 'Are you sure you want to delete detail?', [
            {
                text: 'No',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            { text: 'Yes', onPress: (() => deteleJob(ID)) },
        ]);
    }
    const deteleJob = (ID: any) => {
        DeleteIOUJobByID(ID, (resp: any) => {
            getIOUJobsByID(IOUNo, (res: any) => {
                setJobList(res);
            });
        })
    }
    const closeDialog = () => {
        setIsDialog(false);
    }
    const closeSubmitDialog = () => {
        setIsSubmitDialog(false);
    }
    //--------Use Focus Effect -----------------
    useFocusEffect(
        React.useCallback(() => {
            // console.log(" refresh IOU ----------  > ");
            amount = 0.0;
            jobArray = [];
            getLoginUserName().then(res => {
                setUname(res + "");
                // console.log(" user name ....... ", res);
            });
            getLoginUserID().then(result => {
                setUserID(result + "");
                getLastId();
                getLastAttachmentId();
                getLoginUserRoll().then(res => {
                    userRole = res;
                    getAllLoginUserDetails(result, (resp: any) => {
                        epfNo = resp[0].EPFNo;
                        setRequesterLimit(parseFloat(resp[0].IOULimit));
                        setCreateReqLimit(parseFloat(resp[0].ReqLimit));
                    });
                });
            })
            CopyRequest().then(resp => {
                console.log("Is Copy: ", resp);
                setIsReOpen(resp + "");
                if (resp == 'True') {
                    getRejectedId().then(result => {
                        // console.log("ReOpen Request Id: ", result);
                        setUId(result);
                        // console.log(result)
                        editRequest(result);
                    })
                }
            })
            getAllIOUTypes();
            getSpinnerEmployee();
        }, [])
    );
    return (
        <SafeAreaView style={ComStyles.CONTAINER}>
            <>
                <Animated.View
                    style={{
                        ...StyleSheet.absoluteFillObject,
                        top: modalStyle,
                        backgroundColor: '#fff',
                        zIndex: 20,
                        borderRadius: 10,
                        elevation: 20,
                        paddingTop: 10,
                        paddingBottom: 10,
                        marginLeft: 0,
                        ...Platform.select({
                            ios: {
                                paddingTop: 10,
                            },
                        }),
                    }}>
                    <View style={Style.modalCont}>
                        {
                            isSubmit ?
                                <SubmitCancelModal
                                    // cancelbtn={() => slideOutModal()}
                                    // approvebtn={() => saveSubmit()}
                                    cancelbtn={() => add_one(3)}
                                    approvebtn={() => add_one(2)}
                                />
                                :
                                <>
                                    {
                                        isOpen ?
                                            <ImageUpload
                                                camerabtn={() => openCamera()}
                                                gallerybtn={() => openGallery()}
                                                cancelbtn={() => slideOutModal()}
                                                headertxt="Select file"
                                                subtxt="Do you want to add a file?"
                                                closeModal={() => slideOutModal()}
                                            />
                                            :
                                            //-------------------------------------------------------------------------------------
                                            <ScrollView
                                                style={ComStyles.CONTENTLOG}
                                                showsVerticalScrollIndicator={true}>
                                                <View style={styles.container}>
                                                    <View style={{ justifyContent: 'center', alignItems: 'center', alignContent: 'center', flexDirection: 'row' }}>
                                                        <TouchableOpacity style={styles.dashStyle} onPress={() => cancelJob()} />
                                                    </View>
                                                    <View style={{ padding: 5 }} />
                                                    {
                                                        isJobOrVehicle ?
                                                            // isJob ?
                                                            <View>
                                                                <View style={{ flexDirection: 'row', }}>
                                                                    <Text style={styles.bodyTextLeft}>
                                                                        {IOUTypeID == "1" ? "Job No*" : "Vehicle No*"}
                                                                    </Text>
                                                                </View>
                                                                <Dropdown
                                                                    style={[
                                                                        styles.dropdown,
                                                                        isFocus && { borderColor: ComStyles.COLORS.BORDER_COLOR },
                                                                    ]}
                                                                    itemTextStyle={{ color: ComStyles.COLORS.BLACK, }}
                                                                    placeholderStyle={Style.placeholderStyle}
                                                                    selectedTextStyle={Style.selectedTextStyle}
                                                                    inputSearchStyle={Style.inputSearchStyle}
                                                                    iconStyle={styles.iconStyle}
                                                                    data={IOUTypeID == "1" ? Job_NoList : Vehicle_NoList}
                                                                    search
                                                                    autoScroll={false}
                                                                    maxHeight={300}
                                                                    labelField={IOUTypeID == "1" ? "Job_No" : "Vehicle_No"}
                                                                    valueField={IOUTypeID == "1" ? "Job_No" : "Vehicle_No"}
                                                                    placeholder={!isFocus ? iouTypeJob : '...'}
                                                                    searchPlaceholder={searchtxt}
                                                                    value={selectJOBVehicleNo}
                                                                    onFocus={() => setIsFocus(true)}
                                                                    onBlur={() => setIsFocus(false)}
                                                                    onChange={item => {
                                                                        if (IOUTypeID == "1") {
                                                                            const name = item.Job_No + "";
                                                                            const no = name.split("-");
                                                                            console.log(" job no === ", no[0].trim());
                                                                            setSelecteJoborVehicle(no[0].trim());
                                                                            setselectJOBVehicleNo(item.Job_No);
                                                                            getGL_AccNo(1, 0);
                                                                            setIsDisableAcc(true);
                                                                            getCostCenter(item.DocEntry);
                                                                        } else {
                                                                            setSelecteJoborVehicle(item.Vehicle_No);
                                                                            setselectJOBVehicleNo(item.Vehicle_No);
                                                                            setIsDisableAcc(true);
                                                                            get_ASYNC_COST_CENTER().then(async res => {
                                                                                setCostCenter(res);
                                                                            });
                                                                            setResource(item.Vehicle_No);
                                                                        }
                                                                        setIsFocus(false);
                                                                    }}
                                                                    renderLeftIcon={() => (
                                                                        <AntDesign
                                                                            style={styles.icon}
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
                                                    {error.field === 'JobOwner' && (
                                                        <Text style={styles.error}>{error.message}</Text>
                                                    )}
                                                    <View style={{ flexDirection: 'row', }}>
                                                        <Text style={styles.bodyTextLeft}>
                                                            Expense Type *
                                                        </Text>
                                                    </View>
                                                    <Dropdown
                                                        style={[
                                                            styles.dropdown,
                                                            isFocus && { borderColor: ComStyles.COLORS.BORDER_COLOR },
                                                        ]}
                                                        itemTextStyle={{ color: ComStyles.COLORS.BLACK, }}
                                                        placeholderStyle={Style.placeholderStyle}
                                                        selectedTextStyle={Style.selectedTextStyle}
                                                        inputSearchStyle={Style.inputSearchStyle}
                                                        iconStyle={styles.iconStyle}
                                                        data={ExpenseTypeList}
                                                        search
                                                        autoScroll={false}
                                                        maxHeight={300}
                                                        labelField="Description"
                                                        valueField="Description"
                                                        placeholder={!isFocus ? 'Expense Type* ' : '...'}
                                                        searchPlaceholder="Search Type"
                                                        value={selectExpenseType}
                                                        onFocus={() => setIsFocus(true)}
                                                        onBlur={() => setIsFocus(false)}
                                                        onChange={item => {
                                                            setSelectExpenseType(item.Description);
                                                            setExpenseTypeID(item.ExpType_ID);
                                                            if (IOUTypeID == "2") {
                                                                getGL_AccNo(2, item.ExpType_ID);
                                                                // getGL_AccByExpenseType(item.Description);
                                                            } else if (IOUTypeID == "3") {
                                                                getGL_AccNo(3, item.ExpType_ID);
                                                            }
                                                            console.log(" expense Type ID ======  ", expenseTypeID);
                                                            setIsFocus(false);
                                                        }}
                                                        renderLeftIcon={() => (
                                                            <AntDesign
                                                                style={styles.icon}
                                                                color={isFocus ? 'blue' : 'black'}
                                                                name="Safety"
                                                                size={15}
                                                            />
                                                        )}
                                                    />
                                                    {error.field === 'TicketID' && (
                                                        <Text style={styles.error}>{error.message}</Text>
                                                    )}
                                                    <View style={{ flexDirection: 'row', }}>
                                                        <Text style={styles.bodyTextLeft}>
                                                            Request Amount*
                                                        </Text>
                                                    </View>
                                                    <InputText
                                                        placeholderColor={ComStyles.COLORS.HEADER_BLACK}
                                                        placeholder="Requested amount(LKR)*"
                                                        keyType='numeric'
                                                        stateValue={requestAmount}
                                                        editable={true}
                                                        setState={(val: any) => setFormatAmount(val)}
                                                        style={ComStyles.IOUInput}
                                                    />
                                                    {error.field === 'requestAmount' && (
                                                        <Text style={styles.error}>{error.message}</Text>
                                                    )}
                                                    <View style={{ flexDirection: 'row', }}>
                                                        <Text style={styles.bodyTextLeft}>
                                                            Remark
                                                        </Text>
                                                    </View>
                                                    <InputText
                                                        placeholderColor={ComStyles.COLORS.HEADER_BLACK}
                                                        placeholder="Remarks"
                                                        max={30}
                                                        stateValue={remarks}
                                                        setState={(val: any) => setRemarks(val)}
                                                        editable={true}
                                                        style={ComStyles.IOUInput}
                                                    />
                                                    <View style={{ flexDirection: 'row', }}>
                                                        <Text style={styles.bodyTextLeft}>
                                                            Account No *
                                                        </Text>
                                                    </View>
                                                    <InputText
                                                        placeholderColor={ComStyles.COLORS.HEADER_BLACK}
                                                        placeholder="Account No*"
                                                        stateValue={accountNo}
                                                        editable={false}
                                                        setState={(val: any) => setAccountNo(val)}
                                                        style={ComStyles.IOUInput}
                                                    />
                                                    {error.field === 'accNo' && (
                                                        <Text style={styles.error}>{error.message}</Text>
                                                    )}
                                                    <View style={{ flexDirection: 'row', }}>
                                                        <Text style={styles.bodyTextLeft}>
                                                            Cost Center
                                                        </Text>
                                                    </View>
                                                    <InputText
                                                        placeholderColor={ComStyles.COLORS.HEADER_BLACK}
                                                        placeholder="Cost Center"
                                                        stateValue={costCeneter}
                                                        setState={(val: any) => setCostCenter(val)}
                                                        editable={false}
                                                        style={ComStyles.IOUInput}
                                                    />
                                                    <View style={{ flexDirection: 'row', }}>
                                                        <Text style={styles.bodyTextLeft}>
                                                            Resource
                                                        </Text>
                                                    </View>
                                                    <Dropdown
                                                        style={[
                                                            styles.dropdown,
                                                            isFocus && { borderColor: ComStyles.COLORS.BORDER_COLOR },
                                                        ]}
                                                        itemTextStyle={{ color: ComStyles.COLORS.BLACK, }}
                                                        placeholderStyle={Style.placeholderStyle}
                                                        selectedTextStyle={Style.selectedTextStyle}
                                                        inputSearchStyle={Style.inputSearchStyle}
                                                        iconStyle={styles.iconStyle}
                                                        data={Vehicle_NoList}
                                                        search
                                                        autoScroll={false}
                                                        disable={isDisableRes}
                                                        maxHeight={300}
                                                        labelField={"Vehicle_No"}
                                                        valueField={"Vehicle_No"}
                                                        placeholder={!isFocus ? "Resource" : '...'}
                                                        searchPlaceholder="Search Resource"
                                                        value={resource}
                                                        onFocus={() => setIsFocus(true)}
                                                        onBlur={() => setIsFocus(false)}
                                                        onChange={item => {
                                                            //setSelecteJoborVehicle(IOUTypeID == "1" ? item.Job_No : item.Vehicle_No);
                                                            setResource(item.Vehicle_No);
                                                            setIsFocus(false);
                                                        }}
                                                        renderLeftIcon={() => (
                                                            <AntDesign
                                                                style={styles.icon}
                                                                color={isFocus ? 'blue' : 'black'}
                                                                name="Safety"
                                                                size={15}
                                                            />
                                                        )}
                                                    />
                                                    <View style={{ flexDirection: 'row' }}>
                                                        <ActionButton
                                                            title="Add"
                                                            styletouchable={{ width: '49%' }}
                                                            onPress={() => add_one(1)}
                                                        />
                                                        <ActionButton
                                                            title="Cancel"
                                                            styletouchable={{ width: '49%', marginLeft: 5 }}
                                                            style={{ backgroundColor: ComStyles.COLORS.RED_COLOR }}
                                                            onPress={() => add_one(0)} />
                                                    </View>
                                                </View>
                                            </ScrollView>
                                        //------------------------------------------
                                    }
                                </>
                        }
                    </View>
                </Animated.View>
            </>
            <Header title="Add New IOU" isBtn={true} btnOnPress={naviBack} />
            <DropdownAlert alert={func => (alert = func)} alertPosition="top" />
            <ScrollView style={ComStyles.CONTENT} showsVerticalScrollIndicator={false}>
                <View style={{ padding: 5 }} />
                <DetailsBox
                    reqNo={IOUNo}
                    empNo={epfNo}
                    RequestBy={uName}
                    Rdate={currentDate1}
                />
                <View>
                    <View style={{ flexDirection: 'row', marginTop: 5 }}>
                        <Text style={styles.bodyTextLeft}>
                            IOU Type*
                        </Text>
                    </View>
                    <Dropdown
                        style={[
                            Style.dropdown,
                            isFocus && { borderColor: ComStyles.COLORS.BORDER_COLOR },
                        ]}
                        itemTextStyle={{ color: ComStyles.COLORS.BLACK, }}
                        placeholderStyle={Style.placeholderStyle}
                        selectedTextStyle={Style.selectedTextStyle}
                        inputSearchStyle={Style.inputSearchStyle}
                        iconStyle={Style.iconStyle}
                        data={IOUTypeList}
                        search
                        maxHeight={300}
                        labelField="Description"
                        valueField="Description"
                        placeholder={!isFocus ? 'Select IOU Type ' : '...'}
                        searchPlaceholder="Search Type"
                        value={selectIOUType}
                        onFocus={() => setIsFocus(true)}
                        onBlur={() => setIsFocus(false)}
                        onChange={item => {
                            setIOUTypeID(item.IOUType_ID);
                            setSelectIOUType(item.Description);
                            getVehicleNo();
                            if (item.IOUType_ID == 1) {
                                setOwnerType("Job Owner");
                                setIsEditable(false);
                                setIsDisableRes(false);
                                getJJobOwnerTransportHOD(1);
                            } else if (item.IOUType_ID == 2) {
                                setOwnerType("Transport Officer");
                                setIsEditable(false);
                                setIsDisableRes(true);
                                getJJobOwnerTransportHOD(2);
                            } else {
                                setOwnerType("HOD");
                                setIsEditable(true);
                                setIsDisableRes(false);
                                getJJobOwnerTransportHOD(3);
                                get_ASYNC_COST_CENTER().then(async res => {
                                    setCostCenter(res);
                                });
                            }
                            setError({ field: '', message: '' });
                            setIsFocus(false);
                        }}
                        renderLeftIcon={() => (
                            <AntDesign
                                style={Style.icon}
                                color={isFocus ? 'blue' : 'black'}
                                name="Safety"
                                size={15}
                            />
                        )}
                    />
                    {error.field === 'IOUTypeID' && (
                        <Text style={Style.error}>{error.message}</Text>
                    )}
                    <View style={{ flexDirection: 'row', }}>
                        <Text style={styles.bodyTextLeft}>
                            {ownerType}*
                        </Text>
                    </View>
                    <Dropdown
                        style={[
                            Style.dropdown,
                            isFocus && { borderColor: ComStyles.COLORS.BORDER_COLOR },
                        ]}
                        itemTextStyle={{ color: ComStyles.COLORS.BLACK, }}
                        placeholderStyle={Style.placeholderStyle}
                        selectedTextStyle={Style.selectedTextStyle}
                        inputSearchStyle={Style.inputSearchStyle}
                        iconStyle={Style.iconStyle}
                        data={jobOwnerList}
                        search
                        autoScroll={false}
                        maxHeight={300}
                        labelField="Name"
                        valueField="Name"
                        disable={isEditable}
                        placeholder={!isFocus ? ownerType : '...'}
                        searchPlaceholder="Search Owner"
                        value={selectJobOwner}
                        onFocus={() => setIsFocus(true)}
                        onBlur={() => setIsFocus(false)}
                        onChange={item => {

                            setSelectJobOwner(item.Name);
                            setJobOwner(item.ID);

                            console.log(" iou type == [][][]  ", IOUTypeID);

                            if (IOUTypeID == '1') {

                                getJobNoByJobOwner(item.EPFNo + "");
                                setIOULimit(parseFloat(item.IOULimit));

                            } else if (IOUTypeID == '2') {
                                setIOULimit(parseFloat(item.IOULimit));
                            }

                            setError({ field: '', message: '' });
                            setIsFocus(false);

                        }}
                        renderLeftIcon={() => (
                            <AntDesign
                                style={Style.icon}
                                color={isFocus ? 'blue' : 'black'}
                                name="Safety"
                                size={15}
                            />
                        )}
                    />
                    {error.field === 'JobOwner' && (
                        <Text style={Style.error}>{error.message}</Text>
                    )}

                    <View style={{ flexDirection: 'row', }}>
                        <Text style={styles.bodyTextLeft}>
                            Employee*
                        </Text>
                    </View>
                    <Dropdown
                        style={[
                            Style.dropdown,
                            isFocus && { borderColor: ComStyles.COLORS.BORDER_COLOR },
                        ]}
                        itemTextStyle={{ color: ComStyles.COLORS.BLACK, }}
                        placeholderStyle={Style.placeholderStyle}
                        selectedTextStyle={Style.selectedTextStyle}
                        inputSearchStyle={Style.inputSearchStyle}
                        iconStyle={Style.iconStyle}
                        data={EmployeeList}
                        search
                        autoScroll={false}
                        maxHeight={300}
                        labelField="Name"
                        valueField="Name"
                        disable={isEditableEmp}
                        placeholder={!isFocus ? 'Select Employee ' : '...'}
                        searchPlaceholder="Search Employee"
                        value={selectEmployee}
                        onFocus={() => setIsFocus(true)}
                        onBlur={() => setIsFocus(false)}
                        onChange={item => {

                            setEmpID(item.ID);
                            setSelectEmployee(item.Name);

                            setError({ field: '', message: '' });
                            setIsFocus(false);


                        }}
                        renderLeftIcon={() => (
                            <AntDesign
                                style={Style.icon}
                                color={isFocus ? 'blue' : 'black'}
                                name="Safety"
                                size={15}
                            />
                        )}
                    />
                    {error.field === 'EmpName' && (
                        <Text style={Style.error}>{error.message}</Text>
                    )}
                    <View>
                        <ScrollView horizontal={true}>
                            <FlatList
                                //nestedScrollEnabled={true}
                                data={joblist}
                                //horizontal={false}
                                renderItem={({ item }) => {
                                    return (
                                        <View style={{ width: width - 50, padding: 5 }}>
                                            <NewJobsView
                                                IOU_Type={IOUTypeID}
                                                amount={item.Amount}
                                                IOUTypeNo={item.Job_NO}
                                                ExpenseType={item.Description}
                                                jobremarks={item.Remark}
                                                accNo={item.AccNo}
                                                costCenter={item.CostCenter}
                                                resource={item.Resource}
                                                isDelete={true}
                                                onPressDeleteIcon={() => deleteNewJob(item._Id)}
                                            />
                                        </View>
                                    )
                                }
                                }
                                keyExtractor={item => `${item._Id}`}
                            />
                        </ScrollView>
                    </View>
                </View>
                <ActionButton
                    is_icon={true}
                    iconColor={ComStyles.COLORS.WHITE}
                    icon_name="plus"
                    title="Add Details"
                    onPress={() => addjob()} />
                <TouchableOpacity onPress={() => attachement()}>
                    <View style={Style.container}>
                        <AntDesign
                            name='cloudupload'
                            size={35}
                            style={Style.iconStyle1}
                        />
                        <Text style={Style.selectedTextStyle2}>Upload Attachments</Text>
                    </View>
                </TouchableOpacity>
                <View style={Style.container}>
                    {cameraPhoto.length > 0 ? (
                        <FlatList
                            data={cameraPhoto}
                            renderItem={renderCameraUri}
                            keyExtractor={(item) => item}
                            horizontal={true}
                            contentContainerStyle={{ marginTop: 10 }}
                        />
                    ) : (
                        <>
                            <Text style={{ color: ComStyles.COLORS.DETAIL_ASH, fontSize: 13, textAlign: "center", alignItems: "center" }}>No Added Attachments</Text>
                        </>
                    )
                    }
                    {galleryPhoto.length > 0 ? (
                        <FlatList
                            data={galleryPhoto}
                            renderItem={renderGalleryUri}
                            keyExtractor={(item) => item}
                            horizontal={true}
                            contentContainerStyle={{ marginTop: 10 }}
                        />
                    ) : (
                        <>
                        </>
                    )}

                </View>

            </ScrollView>
            <View style={{ marginLeft: 13, marginRight: 13 }}>
                <ActionButton
                    title="Submit Request"
                    onPress={() => submit()} />
            </View>
            <View style={{ marginBottom: 70 }} />
            {/* -----   Attatchment Dialog box -------------- */}
            <Dialog
                visible={isDialog}
                onDismiss={() => closeDialog()}
                style={{ backgroundColor: ComStyles.COLORS.WHITE }}>
                <Dialog.Content>
                    <ImageUpload
                        camerabtn={() => openCamera()}
                        gallerybtn={() => openGallery()}
                        cancelbtn={() => closeDialog()}
                        headertxt="Select file"
                        subtxt="Do you want to add a file?"
                        closeModal={() => closeDialog()}
                    />
                    <View style={{ padding: 5 }} />
                </Dialog.Content>
            </Dialog>
            {/* -----   Submit Dialog box -------------- */}
            <Dialog
                visible={isSubmitDialog}
                onDismiss={() => closeSubmitDialog()}
                style={{ backgroundColor: ComStyles.COLORS.WHITE }}>
                <Dialog.Content>
                    <SubmitCancelModal
                        cancelbtn={() => add_one(3)}
                        approvebtn={() => add_one(2)}
                    />
                    <View style={{ padding: 5 }} />
                </Dialog.Content>
            </Dialog>
        </SafeAreaView >
    );

}
export default NewIOUScreen;

const Style = StyleSheet.create({
    dropdown: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
        marginBottom: 10
    },
    placeholderStyle: {
        fontFamily: ComStyles.FONT_FAMILY.SEMI_BOLD,
        fontSize: 12,
        color: ComStyles.COLORS.BLACK,
    },
    selectedTextStyle: {
        fontFamily: ComStyles.FONT_FAMILY.SEMI_BOLD,
        fontSize: 12,
        color: ComStyles.COLORS.MAIN_COLOR,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 14,
        color: ComStyles.COLORS.BLACK,
    },
    icon: {
        marginRight: 5,
        color: ComStyles.COLORS.HEADER_BLACK,
    },
    container: {
        width: '100%',
        flexDirection: 'row',
        padding: 10,
    },

    textStyle: {
        fontFamily: ComStyles.FONT_FAMILY.BOLD,
        color: 'black',
        fontSize: 18,
        alignSelf: 'center'

    },
    iconStyle1: {
        marginRight: 5,
        color: ComStyles.COLORS.MAIN_COLOR,
    },
    selectedTextStyle2: {
        fontFamily: ComStyles.FONT_FAMILY.BOLD,
        fontSize: 20,
        color: ComStyles.COLORS.MAIN_COLOR,
        marginTop: 5
    },
    modalCont: {
        flex: 1,
        flexGrow: 1,
        width: width,
        paddingHorizontal: 10,
        marginBottom: 60,

    },
    error: {
        color: 'red'
    },
    fab: {
        position: 'absolute',
        margin: 10,
        right: 0,
        bottom: 0,
        backgroundColor: ComStyles.COLORS.MAIN_COLOR, // Custom background color
        borderRadius: 28, // Ensure it's rounded
        width: 56, // Width to maintain circular shape
        height: 56, // Height to maintain circular shape
        top: 0.5
    },
    iconFab: {
        borderRadius: 12,
        padding: 1,
    },

});


const styles = StyleSheet.create({
    dropdown: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
        marginBottom: 10
    },
    container: {
        padding: 10,
        backgroundColor: ComStyles.COLORS.WHITE,
    },
    inputsContainer: {
        marginBottom: 20
    },
    inputContainer: {

        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 8,
        backgroundColor: "#fff",
        borderRadius: 5,
        marginVertical: 5,
        marginHorizontal: 5,
    },
    list: {
        flex: 1,
        padding: 8,
        backgroundColor: "#fff",
        borderRadius: 5,
        marginVertical: 5,
        marginHorizontal: 5,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row"
    },
    placeholderStyle: {
        fontFamily: ComStyles.FONT_FAMILY.SEMI_BOLD,
        fontSize: 12,
        color: ComStyles.COLORS.BLACK,
    },
    selectedTextStyle: {
        fontFamily: ComStyles.FONT_FAMILY.SEMI_BOLD,
        fontSize: 12,
        color: ComStyles.COLORS.MAIN_COLOR,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 14,
        color: ComStyles.COLORS.BLACK,
    },
    icon: {
        marginRight: 5,
        color: ComStyles.COLORS.HEADER_BLACK,
    },
    error: {
        color: 'red'
    },
    dashStyle: {
        width: 50,
        height: 5,
        backgroundColor: ComStyles.COLORS.DASH_COLOR,
        borderRadius: 20,
        marginTop: 5,
        marginBottom: 10,
    },
    jobData: {

        height: 100,
        width: 250,
        //borderColor: 'gray',
        //borderWidth: 0.5,
        //borderRadius: 8,
        paddingHorizontal: 8,
        marginBottom: 10,

        padding: 8,
        //backgroundColor: "#fff",
        borderRadius: 5,
        marginVertical: 5,
        marginHorizontal: 5,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row"

    },
    bodyTextLeft: {
        color: ComStyles.COLORS.SERVISE_HEADER_ASH,
        fontFamily: ComStyles.FONT_FAMILY.REGULAR,
        fontSize: 14,
        flex: 1
    },
})