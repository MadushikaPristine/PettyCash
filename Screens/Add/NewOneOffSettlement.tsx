import React, { useId, useState } from "react";
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
    Keyboard,
    Platform,
    Alert,
    PermissionsAndroid
} from 'react-native';
import Header from "../../Components/Header";
import ActionButton from "../../Components/ActionButton";
import ViewField from "../../Components/ViewField";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from 'react-native-vector-icons/AntDesign';
import AddAnotherJob from "../../Components/AddAnotherJob";
import SubmitCancelModal from "../../Components/SubmitCancelComponent";
import ImagePicker, { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import ImageUpload from "../../Components/ImageUpload";
import { IOUType } from "../../Constant/DummyData";
import { getLastOneOffSettlement, getOneOffJobsListByID, getOneOffReOpenRequest, saveOneOffSettlement, updateIDwithStatusOneOff, updateOneOffSyncStatus } from "../../SQLiteDBAction/Controllers/OneOffSettlementController";
import moment from "moment";
import { CopyRequest, getLoginUserID, getLoginUserName, getLoginUserRoll, getRejectedId, get_ASYNC_COST_CENTER } from "../../Constant/AsynStorageFuntion";
import { getAllEmployee, getTypeWiseUsers } from "../../SQLiteDBAction/Controllers/EmployeeController";
import { getIOUTypes } from "../../SQLiteDBAction/Controllers/IOUTypeController";
import RNFS from 'react-native-fs';
import { getLastJobID, saveJOB } from "../../SQLiteDBAction/Controllers/JOBController";
import { getExpenseTypeAll } from "../../SQLiteDBAction/Controllers/ExpenseTypeController";
import InputText from "../../Components/InputText";
import AsyncStorageConstants from "../../Constant/AsyncStorageConstants";
import NewJobsView from "../../Components/NewJobView";
import { DeleteOneOffJobByID, getLastOneOffJobID, getOneOFFJobTotAmount, getOneOffJOBDataBYRequestID, getOneOffJobsByID, saveOneOffJOB, updateDetailLineSyncStatus } from "../../SQLiteDBAction/Controllers/OneOffJobController";
import { getAllLoginUserDetails, getAllTransportOfficers, getAllUsers, getJobOwners } from "../../SQLiteDBAction/Controllers/UserController";
import { getCostCenterByJobNo, getJobNOByOwners, getJobNoAll } from "../../SQLiteDBAction/Controllers/JobNoController";
import { getVehicleNoAll } from "../../SQLiteDBAction/Controllers/VehicleNoController";
import { getAllJobOwners, getAllJobOwnersBYDep } from "../../SQLiteDBAction/Controllers/JobOwnerController";
import { BASE_URL, DB_LIVE, headers } from "../../Constant/ApiConstants";
import axios from "axios";
import { updateSyncStatus } from "../../SQLiteDBAction/Controllers/IOUController";
import { getIOUAttachmentListByID, getLastAttachment, saveAttachments } from "../../SQLiteDBAction/Controllers/AttachmentController";
import { getDepartments, getLoggedUserHOD } from "../../SQLiteDBAction/Controllers/DepartmentController";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAccNoByExpenseType, getAccNoForJobNo, getGLAccNo } from "../../SQLiteDBAction/Controllers/GLAccountController";
import { Conection_Checking } from "../../Constant/InternetConection_Checking";
import { logger, saveJsonObject_To_Loog } from "../../Constant/Logger";
import DropdownAlert, { DropdownAlertData, DropdownAlertType } from "react-native-dropdownalert";
import DetailsBox from "../../Components/DetailsBox";
import { Dialog } from "react-native-paper";
let width = Dimensions.get("screen").width;
const height = Dimensions.get('screen').height;
let alert = (_data: DropdownAlertData) => new Promise<DropdownAlertData>(res => res);
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
let JobDetails: any[] = [];
let ReOpenData: any[] = [];
let ONEOFFID = "";
let epfNo: any;

let userRole: any;

const NewOneOffSettlement = () => {
    //save IOU
    const [TicketID, setTicketID] = useState('');
    const [IOUTypeID, setIOUTypeID] = useState('');
    const [EmpID, setEmpID] = useState('');
    const [ticketList, setTicketList] = useState([]);
    const [isFocus, setIsFocus] = useState(false);
    const [isShowSweep, setIsShowSweep] = useState(true);
    const [isSubmit, setIsSubmit] = useState(false);
    const [modalStyle, setModalStyle] = useState(new Animated.Value(height));
    const [cameraPhoto, setCameraPhoto] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [galleryPhoto, setGalleryPhoto] = useState('');
    const [error, setError] = useState({ field: '', message: '' })
    const [isJobOrVehicle, setIsJobOrVehicle] = useState(true);
    const [iouTypeJob, setIouTypeJob] = useState('');
    const [searchtxt, setSearchtxt] = useState('');
    // spinner data list 
    const [jobOwnerList, setJobOwnerlist] = useState([]);
    const [IOUTypeList, setIOUTypeList] = useState([]);
    const [EmployeeList, setEmployeeList] = useState([]);
    const [JobOwner, setJobOwner] = useState('');
    const [Job_NoList, setJob_NoList] = useState([]);
    const [Vehicle_NoList, setVehicle_NoList] = useState([]);
    const [DepartmentList, setDepartmentList] = useState([]);
    const [selectJOBVehicleNo, setselectJOBVehicleNo] = useState('');
    //spinner selected
    const [selectJobOwner, setSelectJobOwner] = useState('');
    const [selectIOUType, setSelectIOUType] = useState('');
    const [selectEmployee, setSelectEmployee] = useState('');
    // generate ID 
    const [lastID, setLastID] = useState('');
    const [OneOffSettlementNo, setOneOffSettlementNo] = useState('');
    const [lastAttachmentID, setLastAttachmentID] = useState('');
    const [AttachementNo, setAttachementNo] = useState('');
    // Free fill data list
    const [copyJobOwner, setCopyJobOwner] = useState('');
    const [copyIOUType, setCopyIOUType] = useState('');
    const [copyEmployee, setCopyEmployee] = useState('');
    // Async data
    const [uName, setUname] = useState('');
    const [userID, setUserID] = useState('');
    const [isReOpen, setIsReOpen] = useState('');
    const [uId, setUId] = useState('');
    //save Job
    const [expenseTypeID, setExpenseTypeID] = useState('');
    const [requestAmount, setrequestAmount] = useState('');
    const [remarks, setRemarks] = useState('')
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
    const [isEditable, setIsEditable] = useState(true);
    const [isEditableEmp, setIsEditableEmp] = useState(true);
    const [isDisableAcc, setIsDisableAcc] = useState(false);
    const [isDisableRes, setIsDisableRes] = useState(false);
    const [ownerType, setOwnerType] = useState('Job Owner');
    const [IOULimit, setIOULimit] = useState(0.0);
    const [HODId, setHODID] = useState('');
    const [RequesterLimit, setRequesterLimit] = useState(0.0);
    const [CreateReqLimit, setCreateReqLimit] = useState(0.0);
    const [isDialog, setIsDialog] = useState(false);
    const [isSubmitDialog, setIsSubmitDialog] = useState(false);
    var currentDate = moment().utcOffset('+05:30').format('YYYY-MM-DDTHH:mm:ss');
    var currentDate1 = moment().utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss');
    const navigation = useNavigation();
    const options = {
        saveToPhotos: true,
        mediaType: 'photo',
        quality: 0.5,
        includeBase64: true,
        maxWidth: 400,
        maxHeight: 300,
    };
    const newFolderPath = `${RNFS.DocumentDirectoryPath}/ImageFolder`;
    let newFilePath = `${newFolderPath}/${AttachementNo}.jpg`;
    const newGalleryPath = `${newFolderPath}/${AttachementNo}.jpg`;
    let imageURI = Platform.OS === 'android'
        ? `file://${newFilePath}`
        : `file:///android_asset/${newFilePath}`;

    const galleryImageURI = Platform.OS === 'android'
        ? `file://${newGalleryPath}`
        : `file:///android_asset/${newGalleryPath}`;
    const openCamera = async () => {
        if (Platform.OS === "ios") {
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
            } catch (error) {
                console.log(error);
            }
            const newCaptureImages = [...cameraPhoto, imageURI];
            setCameraPhoto(newCaptureImages);
            const fileData = await RNFS.readFile(imageURI, 'base64');
            attachmentSave();
        } else {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
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

                } catch (error) {
                    // console.log(error);
                }
                const newCaptureImages = [...cameraPhoto, imageURI];
                setCameraPhoto(newCaptureImages);
                const fileData = await RNFS.readFile(imageURI, 'base64');
                attachmentSave();
            }
        }
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
    const back = () => {
        navigation.navigate('Home');
    }
    const openGallery = async () => {
        const result = await launchImageLibrary(options);
        try {
            await RNFS.mkdir(newFolderPath);
            await RNFS.moveFile(result.assets[0].uri, newGalleryPath);
        } catch (error) {
            // console.log(error);
        }
        const newSelectedImages = [...galleryPhoto, galleryImageURI];
        setGalleryPhoto(newSelectedImages);
        const fileData = await RNFS.readFile(imageURI, 'base64');
        attachmentSave();
    }
    const renderGalleryUri = (item: any) => {
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
                    <Image
                        source={{ uri: 'https://thumbs.dreamstime.com/b/vector-paper-check-sell-receipt-bill-template-vector-paper-cash-sell-receipt-139437685.jpg' }}
                        style={{ height: 70, width: 70, justifyContent: 'space-between' }}
                    />
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
                <Image
                    source={{ uri: 'https://thumbs.dreamstime.com/b/vector-paper-check-sell-receipt-bill-template-vector-paper-cash-sell-receipt-139437685.jpg' }}
                    style={{ height: 70, width: 70, justifyContent: 'space-between' }}
                />
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
    const submit = async () => {
        let loginError = { field: '', message: '' }
        if (JobOwner === '') {
            loginError.field = 'JobOwner';
            loginError.message = 'Please select Job Owner to procced'
            setError(loginError);
        } else if (IOUTypeID === '') {
            loginError.field = 'IOUTypeID';
            loginError.message = 'Please fill in fields to procced'
            setError(loginError);
        } else if (cameraPhoto.length == 0) {
            await alert({
                type: DropdownAlertType.Error,
                title: 'No Attachments',
                message: "Please Add Attachments.",
            });
        }
        else {
            getOneOFFJobTotAmount(OneOffSettlementNo, async (resp: any) => {
                amount = parseFloat(resp[0].totAmount);
                if (parseFloat(resp[0].totAmount) == 0.0) {
                    await alert({
                        type: DropdownAlertType.Error,
                        title: 'No Job Details',
                        message: "Please Add Job Details",
                    });
                } else {
                    setError({ field: '', message: '' });
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
            setIsDialog(false);
            setIsSubmitDialog(false);
            slideInModal();
        }
    }
    const clearData = () => {
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
        let OneOffData: any;
        let HODID: any;
        let IsLimit: any;
        getLoggedUserHOD(async (res: any) => {
            console.log(" hod ===  ", parseInt(res[0].ID) ,  " ----  ",OneOffSettlementNo , " req Limit ------  " , CreateReqLimit , " ---- amount --------  " , amount);
            setHODID(res[0].ID);
            HODID = res[0].ID;
            console.log("iou type ==== ", IOUTypeID);
            if (amount > CreateReqLimit) {
                //Requester limit exceed
                await alert({
                    type: DropdownAlertType.Error,
                    title: 'Limit Exceed!',
                    message: "Requested amount is limit exceeded.",
                });
            } else {

                if (IOUTypeID === '3') {
                    console.log("other type == ");
                    IsLimit = "";
                    OneOffData = [
                        {
                            PCRCode: OneOffSettlementNo,
                            JobOwner: parseInt(JobOwner),
                            IOUType: parseInt(IOUTypeID),
                            EmpId: '',
                            RequestedDate: currentDate,
                            Amount: amount,
                            StatusID: 1,
                            RequestedBy: userID,
                            IsSync: 0,
                            REMARK: "",
                            Reject_Remark: "",
                            Attachment_Status: 1,
                            // HOD: parseInt(res[0].ID),
                            HOD: parseInt(HODId),
                            FirstActionBy: '',
                            FirstActionAt: '',
                            RIsLimit: null,
                            AIsLimit: null,
                            RIouLimit: '',
                            AIouLimit: '',
                            SecondActionBy: '',
                            SecondActionAt: ''
                        }
                    ]
                    Conection_Checking(async (res: any) => {
                        if (res != false) {
                            saveOneOffSettlement(OneOffData, 0, async (Response: any) => {
                                if (Response == 3) {
                                    // getDetailsData(parseInt(res[0].ID), IsLimit);
                                    getDetailsData(parseInt(HODId), IsLimit);
                                    setIsSubmitDialog(false);
                                    await alert({
                                        type: DropdownAlertType.Success,
                                        title: 'Success',
                                        message: "Successfully Submitted!",
                                    });
                                    await AsyncStorage.setItem(AsyncStorageConstants.ASYNC_CURRENT_PENDING_LIST_TYPE, "ONEOFF");
                                    AsyncStorage.setItem(AsyncStorageConstants.ASYNC_STORAGE_IS_COPY, "false");
                                    navigation.navigate('PendingList');
                                } else {
                                    await alert({
                                        type: DropdownAlertType.Error,
                                        title: 'Failed',
                                        message: "One-Off Settlement Request Failed!",
                                    });
                                }
                            })
                        } else {
                            await alert({
                                type: DropdownAlertType.Error,
                                title: 'Sync Failed',
                                message: "Please Check your internet connection",
                            });
                        }
                    });
                } else if (amount > IOULimit) {
                    console.log("limit exceed == ", IOULimit);
                    IsLimit = "YES";
                    OneOffData = [
                        {
                            PCRCode: OneOffSettlementNo,
                            JobOwner: parseInt(JobOwner),
                            IOUType: parseInt(IOUTypeID),
                            EmpId: '',
                            RequestedDate: currentDate,
                            Amount: amount,
                            StatusID: 1,
                            RequestedBy: userID,
                            IsSync: 0,
                            REMARK: "",
                            Reject_Remark: "",
                            Attachment_Status: 1,
                            HOD: parseInt(HODId),
                            FirstActionBy: '',
                            FirstActionAt: '',
                            RIsLimit: 'YES',
                            AIsLimit: null,
                            RIouLimit: IOULimit,
                            AIouLimit: '',
                            SecondActionBy: '',
                            SecondActionAt: ''
                        }
                    ]
                    console.log(" json [][][]  ", OneOffData);
                    Conection_Checking(async (res: any) => {
                        if (res != false) {
                            saveOneOffSettlement(OneOffData, 0, async (Response: any) => {
                                console.log("Save One-Off Settlement...", Response);
                                if (Response == 3) {
                                    getDetailsData(parseInt(HODId), IsLimit);
                                    slideOutModal();
                                    setIsSubmitDialog(false);
                                    await alert({
                                        type: DropdownAlertType.Success,
                                        title: 'Success',
                                        message: "Successfully Submitted!",
                                    });
                                    await AsyncStorage.setItem(AsyncStorageConstants.ASYNC_CURRENT_PENDING_LIST_TYPE, "ONEOFF");
                                    AsyncStorage.setItem(AsyncStorageConstants.ASYNC_STORAGE_IS_COPY, "false");
                                    navigation.navigate('PendingList');
                                } else {
                                    await alert({
                                        type: DropdownAlertType.Error,
                                        title: 'Failed',
                                        message: "One-Off Settlement Request Failed!",
                                    });
                                }
                            })
                        } else {
                            await alert({
                                type: DropdownAlertType.Error,
                                title: 'Sync Failed',
                                message: "Please Check your internet connection", 
                            });
                        }
                    });
                } else {
                    if (IOUTypeID === '3') {
                        //other type
                        console.log("Other type ----  ", HODID , " state v ........ " , HODId);
                        IsLimit = "";
                        OneOffData = [
                            {
                                PCRCode: OneOffSettlementNo,
                                JobOwner: parseInt(JobOwner),
                                IOUType: parseInt(IOUTypeID),
                                EmpId: '',
                                RequestedDate: currentDate,
                                Amount: amount,
                                StatusID: 1,
                                RequestedBy: userID,
                                IsSync: 0,
                                REMARK: "",
                                Reject_Remark: "",
                                Attachment_Status: 1,
                                HOD: parseInt(HODId),
                                FirstActionBy: '',
                                FirstActionAt: '',
                                RIsLimit: null,
                                AIsLimit: null,
                                RIouLimit: '',
                                AIouLimit: '',
                                SecondActionBy: '',
                                SecondActionAt: ''
                            }
                        ]
                        Conection_Checking(async (res: any) => {
                            if (res != false) {
                                saveOneOffSettlement(OneOffData, 0, async (Response: any) => {
                                    if (Response == 3) {
                                        getDetailsData(parseInt(HODID), IsLimit);
                                        setIsSubmitDialog(false);
                                        await alert({
                                            type: DropdownAlertType.Success,
                                            title: 'Success',
                                            message: "Successfully Submitted!",
                                        });
                                        await AsyncStorage.setItem(AsyncStorageConstants.ASYNC_CURRENT_PENDING_LIST_TYPE, "ONEOFF");
                                        AsyncStorage.setItem(AsyncStorageConstants.ASYNC_STORAGE_IS_COPY, "false");
                                        navigation.navigate('PendingList');
                                    } else {
                                        await alert({
                                            type: DropdownAlertType.Error,
                                            title: 'Failed',
                                            message: "One-Off Settlement Request Failed!",
                                        });
                                    }
                                })
                            } else {
                                await alert({
                                    type: DropdownAlertType.Error,
                                    title: 'Sync Failed',
                                    message: "Please Check your internet connection",
                                });
                            }
                        });
                    } else {
                        console.log("job no or vehicle");
                        IsLimit = "NO";
                        HODID = '';
                        setHODID('');
                        OneOffData = [
                            {
                                PCRCode: OneOffSettlementNo,
                                JobOwner: parseInt(JobOwner),
                                IOUType: parseInt(IOUTypeID),
                                EmpId: '',
                                RequestedDate: currentDate,
                                Amount: amount,
                                StatusID: 1,
                                RequestedBy: userID,
                                IsSync: 0,
                                REMARK: "",
                                Reject_Remark: "",
                                Attachment_Status: 1,
                                HOD: parseInt(HODId),
                                FirstActionBy: '',
                                FirstActionAt: '',
                                RIsLimit: 'NO',
                                AIsLimit: null,
                                RIouLimit: IOULimit,
                                AIouLimit: '',
                                SecondActionBy: '',
                                SecondActionAt: ''
                            }
                        ]
                        Conection_Checking(async (res: any) => {
                            if (res != false) {
                                saveOneOffSettlement(OneOffData, 0, async (Response: any) => {
                                    if (Response == 3) {
                                        // getDetailsData(HODID, IsLimit);
                                        getDetailsData(HODId, IsLimit);
                                        setIsSubmitDialog(false);
                                        await alert({
                                            type: DropdownAlertType.Success,
                                            title: 'Success',
                                            message: "Successfully Submitted!",
                                        });
                                        await AsyncStorage.setItem(AsyncStorageConstants.ASYNC_CURRENT_PENDING_LIST_TYPE, "ONEOFF");
                                        AsyncStorage.setItem(AsyncStorageConstants.ASYNC_STORAGE_IS_COPY, "false");
                                        navigation.navigate('PendingList');
                                    } else {
                                        await alert({
                                            type: DropdownAlertType.Error,
                                            title: 'Failed',
                                            message: "One-Off Settlement Request Failed!",
                                        });
                                    }
                                })
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
                PCRCode: OneOffSettlementNo,
                Img_url: imageURI,
                Status: 1,
            }
        ]
        saveAttachments(attachementData, async (response: any) => {
            if (response == 3) {
                setIsDialog(false);
                await alert({
                    type: DropdownAlertType.Success,
                    title: 'Success',
                    message: "Attachment Successfully Submitted!",
                });
            } else {
                await alert({
                    type: DropdownAlertType.Error,
                    title: 'Failed',
                    message: "Attachmnet Save Failed!",
                });
            }
        })
    }
    const getSpinnerData = () => {
        setJobOwnerlist([]);
        setIOUTypeList([]);
        setEmployeeList([]);
        getAllJobOwners((result: any) => {
            setJobOwnerlist(result);
        })
        //IOU Type
        getIOUTypes((result: any) => {
            setIOUTypeList(result);
        });
        getAllUsers((result: any) => {
            //console.log("Employee ......... ", result);
            setEmployeeList(result);
        });
    }
    const getLastId = () => {
        getLastOneOffSettlement((result: any) => {
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
        let newID = parseInt(ID) + 1;
        let randomNum = Math.floor(Math.random() * 1000) + 1;
        setOneOffSettlementNo("OFS_" + randomNum + "_" + newID + "_M");
        ONEOFFID = "OFS_" + randomNum + "_" + newID + "_M";
        // console.log("GENERATE ONEOFFId ======================   ", ONEOFFID);
    }
    const generateAttachementNo = (ID: any) => {
        // console.log("ATTACHMENT ID GENERATE ======================   ");
        let newAttachmentID = parseInt(ID) + 1;
        let randomNum = Math.floor(Math.random() * 1000) + 1;
        setAttachementNo("IOUAtch_" + randomNum + "_" + newAttachmentID + "_M");
    }
    // Add Another JOb Functions ................
    const generateJobNo = () => {
        getLastOneOffJobID((res: any) => {
            let ID = parseInt(res[0]._Id) + 1;
            let randomNum = Math.floor(Math.random() * 1000) + 1;
            setjobNo("JOB_" + randomNum + "_" + ID);
        });
    }
    const getExpenseTypes = () => {
        getExpenseTypeAll((result: any) => {
            setExpenseTypeList(result);
        });
    }
    const getJobNo = () => {
        getJobNoAll(selectJobOwner, (res: any) => {
            //console.log("Job No............", res);
            setJob_NoList(res);
        })
    }
    const getAllDepartment = () => {
        getDepartments((result: any) => {
            setDepartmentList(result);
        })
    }
    const cancelRequests = () => {
        closeDialog();
        closeSubmitDialog();
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
                { text: 'Yes', onPress: (cancelRequests) },
            ]);
        } else {
            //if cancel is pressed 
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
    const add = () => {
        let jobError = { field: '', message: '' }
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
        } else if (requestAmount == "0" || requestAmount == "0.0") {
            jobError.field = 'requestAmount'
            jobError.message = 'Enter Valid Amount'
            setError(jobError);
        } else {
            saveJob();
        }
    }
    //----------reopen jobs data save---------------------------------
    const getONEOFFJobList = (IOUID: any) => {
        getOneOffJobsListByID(IOUID, (response: any) => {
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
                    PCRCode: OneOffSettlementNo,
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
                saveOneOffJOB(JOBData, 0, async (response: any) => {
                    amount += parseFloat(newamount);
                    if (response == 3) {
                        jobArray.push(saveObject);
                        setJobList(jobArray);
                        await alert({
                            type: DropdownAlertType.Success,
                            title: 'Success',
                            message: "Successfully Submitted!",
                        });
                    }
                });
            }
        });
    }
    //-------Edit Request----------------------------------------------
    const editRequest = async (id: any) => {
        try {
            getOneOffReOpenRequest(id, (result: any) => {
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
        getOneOffJobsListByID(id, (response: any) => {
            setJobList(response);
        });
        getONEOFFJobList(id);
        getAllJobOwners((result: any) => {
            //console.log(" Job owner ...........  ", result);
            setJobOwnerlist(result);
            const data = result?.filter((a: any) => a.JobOwner_ID == ReOpenDetails[0][0]['JobOwner_ID'])[0];
            setSelectJobOwner(data.Name);
            setJobOwner(data.JobOwner_ID);
        });
        getIOUTypes((result: any) => {
            // console.log("IOU types ......... ", result);
            setIOUTypeList(result);
            const ioudata = result?.filter((a: any) => a.IOUType_ID == ReOpenDetails[0][0]['IOU_Type'])[0];
            setSelectIOUType(ioudata.Description);
            setIOUTypeID(ioudata.IOUType_ID)
        });
        getAllUsers((result: any) => {
            //console.log("Employee ......... ", result);
            setEmployeeList(result);
            const empdata = result?.filter((a: any) => a.USER_ID == ReOpenDetails[0][0]['EmpId'])[0];
            setSelectEmployee(empdata.UserName);
            setEmpID(empdata.USER_ID);
        });
    }
    const saveJob = () => {
        console.log("save job ............>>>>>>>>>>> ", requestAmount);
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
            JobOwner_ID: parseInt(JobOwner),
            PCRCode: OneOffSettlementNo,
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
        const JOBData: any = [];
        JOBData.push(saveObject);
        console.log("save one-off job ====  ", JOBData);
        slideOutModal();
        saveOneOffJOB(JOBData, 0, async (response: any) => {
            // console.log(" save job .. ", response);
            amount += decimalAmount;
            if (response == 3) {
                jobArray.push(saveObject);
                // setJobList(jobArray);
                getOneOffJobsByID(OneOffSettlementNo, (res: any) => {
                    setJobList(res);
                });
                await alert({
                    type: DropdownAlertType.Success,
                    title: 'Success',
                    message: "Job Detail Successfully Added!",
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
                cancelJob();
            } else {
                await alert({
                    type: DropdownAlertType.Error,
                    title: 'Failed',
                    message: "Job Detail Save Failed!",
                });
                setSelecteJoborVehicle('');
                setExpenseTypeID('');
                setrequestAmount('');
                setRemarks('');
                setAccountNo('');
                setCostCenter('');
                setResource('');
                setSelectExpenseType('');
                cancelJob();
            }
        });
    }
    const cancelJob = () => {
        setSelecteJoborVehicle('');
        setExpenseTypeID('');
        setrequestAmount('');
        setRemarks('');
        setAccountNo('');
        setCostCenter('');
        setResource('');
        setCostCenterID('');
        setSelectExpenseType('');
        setselectJOBVehicleNo('');
        slideOutModal();
    }
    const getCostCenter = (ID: any) => {
        getCostCenterByJobNo(ID, (res: any) => {
            setCostCenter(res[0].CostCenter);
        });
    }
    const getVehicleNo = () => {
        getVehicleNoAll((resp: any) => {
            //console.log("Vehicle No............", resp);
            setVehicle_NoList(resp);
        })
    }
    //-----------------------------------------------------
    useFocusEffect(
        React.useCallback(() => {
            amount = 0.0;
            jobArray = [];
            getLastId();
            getLastAttachmentId();
            // console.log("OneOffSetNo:***********", OneOffSettlementNo);
            getLoginUserName().then(res => {
                setUname(res + "");
                // console.log(" user name ....... ", res);
            });
            getLoginUserID().then(result => {
                setUserID(result + "");
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
                // console.log("Is Copy: ", resp);
                setIsReOpen(resp);
                if (resp == 'true') {
                    getRejectedId().then(result => {
                        // console.log("ReOpen Request Id: ", result);
                        setUId(result);
                        editRequest(result);
                    })
                }
            })
            getAllIOUTypes();
        }, [])
    );
    const getAllIOUTypes = () => {
        setIOUTypeList([]);
        getIOUTypes((result: any) => {
            setIOUTypeList(result);
        });
    }
    const getJJobOwnerTransportHOD = (type: any) => {
        // type = 1 - job owner / 2 - transport officer / 3 - hod
        if (type == 1) {
            //get job owners
            getAllJobOwnersBYDep((resp1: any) => {
                console.log(" job owners == [][][][]    ", resp1);
                setJobOwnerlist(resp1);
                if (userRole == '3' || userRole == '4') {
                    const empdata = resp1?.filter((a: any) => a.ID == parseInt(userID))[0];
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
                if (userRole == '3' || userRole == '4') {
                    const empdata = resp2?.filter((a: any) => a.ID == parseInt(userID))[0];
                    setSelectJobOwner(empdata.Name);
                    setJobOwner(empdata.ID);
                    setIOULimit(parseFloat(empdata.IOULimit));
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
    //--------Get IOU Types Details Data----------------------
    const getDetailsData = (HOD: any, IsLimit: any) => {
        getOneOffJOBDataBYRequestID(OneOffSettlementNo, (result: any) => {
            // console.log(result, '+++++++++++++++++++++++++++');
            JobDetails = [];
            var Fileobj: any = [];
            for (let i = 0; i < result.length; i++) {
                // console.log(result[i]);
                JobDetails.push(result[i]);
            }
            getIOUAttachmentListByID(OneOffSettlementNo, async (rest: any) => {
                console.log(" one off att  ===  ", rest, " ====  ", OneOffSettlementNo);
                if (rest.length > 0) {
                    for (let i = 0; i < rest.length; i++) {
                        const arr = {
                            "IOUTypeNo": IOUTypeID,
                            "FileName": rest[i].Img_url,
                            "File": await RNFS.readFile(rest[i].Img_url, 'base64'),
                            "FileType": "image/jpeg"
                        }
                        Fileobj.push(arr);
                        // console.log(" file array ==== " , Fileobj);
                        if (i + 1 == rest.length) {
                            Conection_Checking(async (res: any) => {
                                if (res != false) {
                                    UploadOneOff(JobDetails, HOD, IsLimit, Fileobj);
                                } else {

                                }
                            })
                        }
                    }
                } else {
                    Conection_Checking(async (res: any) => {
                        if (res != false) {
                            UploadOneOff(JobDetails, HOD, IsLimit, Fileobj);
                        } else {

                        }
                    })
                }
            })
        })
    }
    //-----------Upload IOU Request------------------
    const UploadOneOff = async (detailsData: any, HOD: any, IsLimit: any, Fileobj: any) => {
        // console.log(" attachments ===   ", Fileobj);
        const URL = BASE_URL + '/Mob_PostOneOffSettlements.xsjs?dbName=' + DB_LIVE;
        var loggerDate = "Date - " + moment().utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss') + "+++++++++++++  Upload One-Off Settlement  ++++++++++++++++";
        logger(loggerDate, "   *******   ");
        var obj = [];
        try {
            console.log(" detail line ====== ", detailsData);
            if (parseInt(IOUTypeID) == 1) {
                for (let i = 0; i < detailsData.length; i++) {
                    const arr = {
                        "IOUTypeID": detailsData[i].IOUTypeID,
                        "IOUTypeNo": detailsData[i].IOUTypeNo,
                        "ExpenseType": detailsData[i].ExpenseType,
                        "Amount": detailsData[i].Amount,
                        "Remark": detailsData[i].Remark,
                        "ID": 2,
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
                        "ID": 2,
                        "AccNo": detailsData[i].AccNo,
                        "CostCenter": detailsData[i].CostCenter,
                        "Resource": detailsData[i].Resource
                    }
                    obj.push(arr);
                }
            }
            const prams = {
                "OneOffID": OneOffSettlementNo,
                "RequestedBy": userID,
                "ReqChannel": "Mobile",
                "Date": currentDate,
                "IOUtype": parseInt(IOUTypeID),
                "JobOwner": parseInt(JobOwner),
                "CreateAt": currentDate,
                "TotalAmount": amount,
                "IOUTypeDetails": obj,
                "attachments": Fileobj,
                "Hod": parseFloat(HOD),
                "RIsLimit": IsLimit,
                "RIouLimit": IOULimit
            }
            saveJsonObject_To_Loog(prams);
            console.log("ONE OFF UPLOAD JSON ====   ", prams, '=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=--');
            // await axios.get(URL, { headers })
            axios.post(URL, prams, {
                headers: headers
            }).then((response) => {
                // console.log("[s][t][a][t][u][s][]", response.status);
                // console.log("[s][t][a][t][u][s][] one off reponse METHOD   ........  ", response);
                logger(" One-Off Upload Response Status ", response.status + "");
                saveJsonObject_To_Loog(response.data);
                if (response.status == 200) {
                    // console.log("success ======= ", response.statusText);
                    if (response.data.ErrorId == 0) {
                        console.log("success ===222==== ", response.data);
                        updateIDwithStatusOneOff(OneOffSettlementNo, response.data.ID, (resp: any) => {
                            console.log(" update id after sync ====  ", resp);
                            if (resp === 'success') {
                                updateDetailLineSyncStatus(OneOffSettlementNo, (resp1: any) => {
                                });
                            }
                        });
                    }
                    clearData();
                } else {
                    // console.log(" response code ======= ", response.status);
                    clearData();
                }
            }).catch((error) => {
                // console.log("error .....   ", error);
                logger(" One-Off Upload ERROR ", "");
                saveJsonObject_To_Loog(error);
                clearData();
            });
        } catch (error) {
            // console.log(error);
            logger(" One-Off Upload ERROR ", error + "");
            clearData();
        }
    }
    const getJobNoByJobOwner = (ID: any) => {
        getJobNOByOwners(ID, (res: any) => {
            setJob_NoList(res);
        });
    }
    const attachement = () => {
        setIsDialog(true);
        setIsSubmitDialog(false);
    }
    const getGL_AccNo = (typeID: any, code: any) => {
        // setAccountList([]);
        setAccountNo('');
        getGLAccNo(typeID, code, (res: any) => {
            // setAccountList(res);
            setAccountNo(res[0].GL_ACCOUNT);
        });
    }
    const getGL_AccByExpenseType = (type: any) => {
        getAccNoByExpenseType(type, (res: any) => {
            setAccountNo(res[0].GL_ACCOUNT);
        });
    }
    const setFormatAmount = (amount: any) => {
        let isDecimal = amount.indexOf(".");
        if (isDecimal != -1) {
            // console.log(" decimal number =====    ");
            const split = amount.split(".");
            setrequestAmount(Intl.NumberFormat('en-US').format(split[0].replace(/[^a-zA-Z0-9 ]/g, '')) + "." + split[1].replace(/[^a-zA-Z0-9 ]/g, ''));
        } else {
            setrequestAmount(Intl.NumberFormat('en-US').format(amount.replace(/[^a-zA-Z0-9 ]/g, '')));
        }
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
        DeleteOneOffJobByID(ID, (resp: any) => {
            getOneOffJobsByID(OneOffSettlementNo, (res: any) => {
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
    return (
        <SafeAreaView style={ComStyles.CONTAINER}>
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
                                    :
                                    <></>
                            }
                            {error.field === 'JobOwner' && (
                                <Text style={styles.error}>{error.message}</Text>
                            )}
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
                            <InputText
                                placeholderColor={ComStyles.COLORS.HEADER_BLACK}
                                placeholder="Requested amount(LKR)*"
                                keyType='decimal-pad'
                                returnKeyType='done'
                                stateValue={requestAmount}
                                editable={true}
                                setState={(val: any) => setFormatAmount(val)}
                                style={ComStyles.IOUInput}
                            />
                            {error.field === 'requestAmount' && (
                                <Text style={styles.error}>{error.message}</Text>
                            )}
                            <InputText
                                placeholderColor={ComStyles.COLORS.HEADER_BLACK}
                                placeholder="Remarks"
                                stateValue={remarks}
                                max={30}
                                setState={(val: any) => setRemarks(val)}
                                editable={true}
                                style={ComStyles.IOUInput}
                            />
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
                            <InputText
                                placeholderColor={ComStyles.COLORS.HEADER_BLACK}
                                placeholder="Cost Center"
                                stateValue={costCeneter}
                                setState={(val: any) => setCostCenter(val)}
                                editable={false}
                                style={ComStyles.IOUInput}
                            />
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
                </View>

            </Animated.View>
            <Header title="Add One-Off Settlement" isBtn={true} btnOnPress={naviBack} />
            <DropdownAlert alert={func => (alert = func)} alertPosition="top" />
            <ScrollView style={ComStyles.CONTENT} showsVerticalScrollIndicator={false}>
                <View style={{ padding: 5 }} />
                <DetailsBox
                    reqNo={OneOffSettlementNo}
                    empNo={epfNo}
                    RequestBy={uName}
                    Rdate={currentDate1}
                />
                <View>
                    <View style={{ flexDirection: 'row', marginTop: 5 }}>
                        <Text style={Style.bodyTextLeft}>
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
                            setSelectJobOwner('');
                            setJobOwner('');
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
                                    setCostCenter(res + "");
                                });
                            }
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
                        <Text style={Style.bodyTextLeft}>
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
                            if (IOUTypeID == '1') {
                                getJobNoByJobOwner(item.EPFNo + "");
                                setIOULimit(parseFloat(item.IOULimit));
                            } else if (IOUTypeID == '2') {
                                setIOULimit(parseFloat(item.IOULimit));
                            }
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
                    <View style={ComStyles.separateLine} />
                    <View>
                        <ScrollView horizontal={true}>
                            <FlatList
                                //nestedScrollEnabled={true}
                                data={joblist}
                                //horizontal={false}
                                renderItem={({ item }) => {
                                    return (
                                        <View style={{ width: width - 30, padding: 5 }}>
                                            <NewJobsView
                                                IOU_Type={IOUTypeID}
                                                amount={item.Amount}
                                                IOUTypeNo={item.IOUTypeNo}
                                                ExpenseType={item.ExpenseType}
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
                    <ActionButton
                        is_icon={true}
                        iconColor={ComStyles.COLORS.WHITE}
                        icon_name="plus"
                        title="Add Details"
                        onPress={() => addjob()} />
                </View>
                <TouchableOpacity onPress={() => attachement()}>
                    <View style={Style.container}>
                        <AntDesign
                            name='cloudupload'
                            size={35}
                            style={Style.iconStyle1} />
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
                        <></>
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
                        <></>
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
        </SafeAreaView>
    );

}
export default NewOneOffSettlement;

const Style = StyleSheet.create({
    dropdown: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
        marginBottom: 10,
        color: ComStyles.COLORS.BLACK,
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
    selectedTextStyle2: {
        fontFamily: ComStyles.FONT_FAMILY.BOLD,
        fontSize: 20,
        color: ComStyles.COLORS.MAIN_COLOR,
        marginTop: 5
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
        marginTop: 10
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
    bodyTextLeft: {
        color: ComStyles.COLORS.SERVISE_HEADER_ASH,
        fontFamily: ComStyles.FONT_FAMILY.REGULAR,
        fontSize: 14,
        flex: 1
    },

})

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
})