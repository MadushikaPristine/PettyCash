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
import { getLastOneOffSettlement, getOneOffJobsListByID, getOneOffReOpenRequest, saveOneOffSettlement, updateOneOffSyncStatus } from "../../SQLiteDBAction/Controllers/OneOffSettlementController";
import moment from "moment";
import { CopyRequest, getLoginUserID, getLoginUserName, getRejectedId, get_ASYNC_COST_CENTER } from "../../Constant/AsynStorageFuntion";
import { getAllEmployee, getTypeWiseUsers } from "../../SQLiteDBAction/Controllers/EmployeeController";
import { getIOUTypes } from "../../SQLiteDBAction/Controllers/IOUTypeController";
import RNFS from 'react-native-fs';
import { getLastJobID, saveJOB } from "../../SQLiteDBAction/Controllers/JOBController";
import { getExpenseTypeAll } from "../../SQLiteDBAction/Controllers/ExpenseTypeController";
import InputText from "../../Components/InputText";
import AsyncStorageConstants from "../../Constant/AsyncStorageConstants";
import NewJobsView from "../../Components/NewJobView";
import { getLastOneOffJobID, getOneOffJOBDataBYRequestID, saveOneOffJOB } from "../../SQLiteDBAction/Controllers/OneOffJobController";
import { getAllTransportOfficers, getAllUsers, getJobOwners } from "../../SQLiteDBAction/Controllers/UserController";
import { getCostCenterByJobNo, getJobNOByOwners, getJobNoAll } from "../../SQLiteDBAction/Controllers/JobNoController";
import { getVehicleNoAll } from "../../SQLiteDBAction/Controllers/VehicleNoController";
import { getAllJobOwners, getAllJobOwnersBYDep } from "../../SQLiteDBAction/Controllers/JobOwnerController";
import { BASE_URL, headers } from "../../Constant/ApiConstants";
import axios from "axios";
import { updateSyncStatus } from "../../SQLiteDBAction/Controllers/IOUController";
import { getLastAttachment, saveAttachments } from "../../SQLiteDBAction/Controllers/AttachmentController";
import { getDepartments, getLoggedUserHOD } from "../../SQLiteDBAction/Controllers/DepartmentController";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAccNoByExpenseType, getAccNoForJobNo } from "../../SQLiteDBAction/Controllers/GLAccountController";
let width = Dimensions.get("screen").width;
const height = Dimensions.get('screen').height;

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


    var currentDate = moment().utcOffset('+05:30').format('YYYY-MM-DDTHH:mm:ss');
    var currentDate1 = moment().utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss');

    const navigation = useNavigation();

    const options = {
        saveToPhotos: true,
        mediaType: 'photo',
        quality: 0.5,
        includeBase64: true,
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
                // console.log('Picture saved successfully.');
                // console.log(newFilePath);

            } catch (error) {
                // console.log(error);
            }


            const newCaptureImages = [...cameraPhoto, imageURI];
            setCameraPhoto(newCaptureImages);
            // console.log("Cache URI: ", result.assets[0].uri);

            // console.log("NEW Image URI: ", imageURI)

            const fileData = await RNFS.readFile(imageURI, 'base64');

            // console.log(fileData);

            attachmentSave();
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
            // console.log('Picture saved successfully.');
            // console.log(newGalleryPath);

        } catch (error) {
            // console.log(error);
        }



        // if (imageURI == galleryPhoto) {
        //     Alert.alert("Cann't upload Dupliacte Images");
        //     slideOutModal()
        // } else {
        const newSelectedImages = [...galleryPhoto, galleryImageURI];

        setGalleryPhoto(newSelectedImages);
        // console.log("Cache URI: ", result.assets[0].uri);

        // console.log("NEW Image URI: ", galleryImageURI)

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
            toValue: height / 2.5,
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


        if (JobOwner === '') {
            loginError.field = 'JobOwner';
            loginError.message = 'Please select Job Owner to procced'
            setError(loginError);
        } else if (IOUTypeID === '') {
            loginError.field = 'IOUTypeID';
            loginError.message = 'Please fill in fields to procced'
            setError(loginError);
            // } else if (EmpID === '') {
            //     loginError.field = 'EmpName';
            //     loginError.message = 'Please select Employee to procced'
            //     setError(loginError);
        } else if (cameraPhoto.length == 0) {
            Alert.alert("Please Add Attachments");
        }
        else {
            if (amount == 0.0) {


                Alert.alert("Please Add Job");
                // SweetAlert.showAlertWithOptions({
                //     title: 'Please Add Job',
                //     subTitle: '',
                //     confirmButtonTitle: 'OK',
                //     confirmButtonColor: '#000',
                //     otherButtonTitle: 'Cancel',
                //     otherButtonColor: '#dedede',
                //     style: 'success',
                //     cancellable: true
                // },
                //     //callback => console.log('callback')
                // );

            } else {

                setError({ field: '', message: '' });
                setIsSubmit(true);
                slideInModal();


            }
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

    const clearData = () => {
        setExpenseTypeList([]);
        setJobList([]);
        setJobOwnerlist([]);
        setCameraPhoto('');
        setIOUTypeList([]);
      
    }

    const saveSubmit = () => {

        let OneOffData: any;
        let HODID: any;
        let IsLimit: any;

        getLoggedUserHOD((res: any) => {
            console.log(" hod ===  ", OneOffSettlementNo);

            setHODID(res[0].ID);
            HODID = res[0].ID;

            console.log("iou type ==== " , IOUTypeID);
            


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
                        HOD: parseInt(res[0].ID),
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

                saveOneOffSettlement(OneOffData, async (Response: any) => {
                    // console.log("Save One-Off Settlement...",Response);
                    // slideOutModal();
                    // Alert.alert("Successfully Submitted!")
                    if (Response == 3) {
                        getDetailsData(parseInt(res[0].ID), IsLimit);
                        slideOutModal();
                        Alert.alert("Successfully Submitted!")
                        // SweetAlert.showAlertWithOptions({
                        //     title: 'Successfully Submitted!',
                        //     subTitle: '',
                        //     confirmButtonTitle: 'OK',
                        //     confirmButtonColor: '#000',
                        //     otherButtonTitle: 'Cancel',
                        //     otherButtonColor: '#dedede',
                        //     style: 'success',
                        //     cancellable: true
                        // },
                        //     //callback => console.log('callback')
                        // );
                        await AsyncStorage.setItem(AsyncStorageConstants.ASYNC_CURRENT_PENDING_LIST_TYPE, "ONEOFF");
                        AsyncStorage.setItem(AsyncStorageConstants.ASYNC_STORAGE_IS_COPY, "false");
                        navigation.navigate('PendingList');


                    } else {
                        Alert.alert("IOU Request Failed!")
                        // SweetAlert.showAlertWithOptions({
                        //     title: 'IOU Request Failed!',
                        //     subTitle: '',
                        //     confirmButtonTitle: 'OK',
                        //     confirmButtonColor: '#000',
                        //     otherButtonTitle: 'Cancel',
                        //     otherButtonColor: '#dedede',
                        //     style: 'success',
                        //     cancellable: true
                        // },
                        //     //callback => console.log('callback')
                        // );
                    }
                })


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
                        HOD: parseInt(res[0].ID),
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


                saveOneOffSettlement(OneOffData, async (Response: any) => {
                    console.log("Save One-Off Settlement...", Response);
                    // slideOutModal();
                    // Alert.alert("Successfully Submitted!")
                    if (Response == 3) {
                        getDetailsData(parseInt(res[0].ID), IsLimit);
                        slideOutModal();
                        Alert.alert("Successfully Submitted!")
                        // SweetAlert.showAlertWithOptions({
                        //     title: 'Successfully Submitted!',
                        //     subTitle: '',
                        //     confirmButtonTitle: 'OK',
                        //     confirmButtonColor: '#000',
                        //     otherButtonTitle: 'Cancel',
                        //     otherButtonColor: '#dedede',
                        //     style: 'success',
                        //     cancellable: true
                        // },
                        //     //callback => console.log('callback')
                        // );
                        await AsyncStorage.setItem(AsyncStorageConstants.ASYNC_CURRENT_PENDING_LIST_TYPE, "ONEOFF");
                        AsyncStorage.setItem(AsyncStorageConstants.ASYNC_STORAGE_IS_COPY, "false");
                        navigation.navigate('PendingList');


                    } else {
                        Alert.alert("IOU Request Failed!")
                        // SweetAlert.showAlertWithOptions({
                        //     title: 'IOU Request Failed!',
                        //     subTitle: '',
                        //     confirmButtonTitle: 'OK',
                        //     confirmButtonColor: '#000',
                        //     otherButtonTitle: 'Cancel',
                        //     otherButtonColor: '#dedede',
                        //     style: 'success',
                        //     cancellable: true
                        // },
                        //     //callback => console.log('callback')
                        // );
                    }
                })
            } else {


                if (IOUTypeID === '3') {
                    //other type


                    console.log("Other type ----  ", HODID);

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
                            HOD: parseInt(res[0].ID),
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

                    saveOneOffSettlement(OneOffData, async (Response: any) => {
                        // console.log("Save One-Off Settlement...",Response);
                        // slideOutModal();
                        // Alert.alert("Successfully Submitted!")
                        if (Response == 3) {
                            getDetailsData(parseInt(res[0].ID), IsLimit);
                            slideOutModal();
                            Alert.alert("Successfully Submitted!")
                            // SweetAlert.showAlertWithOptions({
                            //     title: 'Successfully Submitted!',
                            //     subTitle: '',
                            //     confirmButtonTitle: 'OK',
                            //     confirmButtonColor: '#000',
                            //     otherButtonTitle: 'Cancel',
                            //     otherButtonColor: '#dedede',
                            //     style: 'success',
                            //     cancellable: true
                            // },
                            //     //callback => console.log('callback')
                            // );
                            await AsyncStorage.setItem(AsyncStorageConstants.ASYNC_CURRENT_PENDING_LIST_TYPE, "ONEOFF");
                            AsyncStorage.setItem(AsyncStorageConstants.ASYNC_STORAGE_IS_COPY, "false");

                            navigation.navigate('PendingList');


                        } else {
                            Alert.alert("IOU Request Failed!")
                            // SweetAlert.showAlertWithOptions({
                            //     title: 'IOU Request Failed!',
                            //     subTitle: '',
                            //     confirmButtonTitle: 'OK',
                            //     confirmButtonColor: '#000',
                            //     otherButtonTitle: 'Cancel',
                            //     otherButtonColor: '#dedede',
                            //     style: 'success',
                            //     cancellable: true
                            // },
                            //     //callback => console.log('callback')
                            // );
                        }
                    })

                } else {


                    console.log("job no or vehicle");

                    IsLimit = "NO";

                    HODID = '';
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
                            HOD: parseInt(res[0].ID),
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

                    saveOneOffSettlement(OneOffData, async (Response: any) => {
                        // console.log("Save One-Off Settlement...",Response);
                        // slideOutModal();
                        // Alert.alert("Successfully Submitted!")
                        if (Response == 3) {
                            getDetailsData(HODID, IsLimit);
                            slideOutModal();
                            Alert.alert("Successfully Submitted!")
                            // SweetAlert.showAlertWithOptions({
                            //     title: 'Successfully Submitted!',
                            //     subTitle: '',
                            //     confirmButtonTitle: 'OK',
                            //     confirmButtonColor: '#000',
                            //     otherButtonTitle: 'Cancel',
                            //     otherButtonColor: '#dedede',
                            //     style: 'success',
                            //     cancellable: true
                            // },
                            //     //callback => console.log('callback')
                            // );
                            await AsyncStorage.setItem(AsyncStorageConstants.ASYNC_CURRENT_PENDING_LIST_TYPE, "ONEOFF");
                            AsyncStorage.setItem(AsyncStorageConstants.ASYNC_STORAGE_IS_COPY, "false");

                            navigation.navigate('PendingList');


                        } else {
                            Alert.alert("IOU Request Failed!")
                            // SweetAlert.showAlertWithOptions({
                            //     title: 'IOU Request Failed!',
                            //     subTitle: '',
                            //     confirmButtonTitle: 'OK',
                            //     confirmButtonColor: '#000',
                            //     otherButtonTitle: 'Cancel',
                            //     otherButtonColor: '#dedede',
                            //     style: 'success',
                            //     cancellable: true
                            // },
                            //     //callback => console.log('callback')
                            // );
                        }
                    })

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

                slideOutModal();
                Alert.alert("Attachment Successfully Submitted!");
                // SweetAlert.showAlertWithOptions({
                //     title: 'Attachment Successfully Submitted!',
                //     subTitle: '',
                //     confirmButtonTitle: 'OK',
                //     confirmButtonColor: '#000',
                //     otherButtonTitle: 'Cancel',
                //     otherButtonColor: '#dedede',
                //     style: 'success',
                //     cancellable: true
                // },
                //     //callback => console.log('callback')
                // );

                // await AsyncStorage.setItem(AsyncStorageConstants.ASYNC_CURRENT_PENDING_LIST_TYPE, "IOU");

                // navigation.navigate('PendingList');

            } else {
                Alert.alert("Attachmnet Not Saved!")
                // SweetAlert.showAlertWithOptions({
                //     title: 'Attachmnet Not Saved!',
                //     subTitle: '',
                //     confirmButtonTitle: 'OK',
                //     confirmButtonColor: '#000',
                //     otherButtonTitle: 'Cancel',
                //     otherButtonColor: '#dedede',
                //     style: 'success',
                //     cancellable: true
                // },
                //     //callback => console.log('callback')
                // );
            }
        })
    }

    const getSpinnerData = () => {

        setJobOwnerlist([]);
        setIOUTypeList([]);
        setEmployeeList([]);


        //Job Owner typeID=2
        // getTypeWiseUsers(2, (result: any) => {
        //     // console.log(" Job owner ...........  ", result);

        //     setJobOwnerlist(result);
        // });
        // getJobOwners(4, (result: any) => {
        //     console.log(" Job owner ...........  ", result);

        //     setJobOwnerlist(result);
        // });
        getAllJobOwners((result: any) => {
            // console.log(" Job owner ...........  ", result);

            setJobOwnerlist(result);
        })


        //IOU Type
        getIOUTypes((result: any) => {
            // console.log("IOU types ......... ", result);

            setIOUTypeList(result);

        });

        // Employee
        // getAllEmployee((result: any) => {
        //     console.log("Employee ......... ", result);
        //     setEmployeeList(result);
        // });
        getAllUsers((result: any) => {
            //console.log("Employee ......... ", result);
            setEmployeeList(result);
        });

    }

    const getLastId = () => {

        getLastOneOffSettlement((result: any) => {

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
        // if (parseInt(ID) === 0) {
        //     let attachementID = 1;
        //     setAttachementNo(IOUNo + attachementID);

        // } else {
        //     let attachementID = parseInt(ID) + 1;
        //     setAttachementNo(IOUNo + attachementID);
        // }

    }

    // Add Another JOb Functions ................


    const generateJobNo = () => {

        getLastOneOffJobID((res: any) => {


            // console.log(" job last id .....  ", res[0]._Id);

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
                { text: 'Yes', onPress: (slideOutModal) },
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

        } else {
            // addbtn 

            // console.log("insert  /////////// ");
            saveJob();
        }

    }
    const jobOw = 0;



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
                    IsSync: 1


                }

                const JOBData: any = [];
                JOBData.push(saveObject);

                saveOneOffJOB(JOBData, (response: any) => {

                    // console.log(" save job .. ", response);

                    amount += parseFloat(newamount);

                    if (response == 3) {

                        jobArray.push(saveObject);
                        setJobList(jobArray);

                        // console.log(" JOB List [][][][ ", joblist);

                        Alert.alert("Successfully Added!");
                        // SweetAlert.showAlertWithOptions({
                        //     title: 'Successfully Added!',
                        //     subTitle: '',
                        //     confirmButtonTitle: 'OK',
                        //     confirmButtonColor: '#000',
                        //     otherButtonTitle: 'Cancel',
                        //     otherButtonColor: '#dedede',
                        //     style: 'success',
                        //     cancellable: true
                        // },
                        //     //callback => console.log('callback')
                        // );


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
            // console.log(data, " -----------",);

            //console.log(selectJobOwner);
        });

        getIOUTypes((result: any) => {
            // console.log("IOU types ......... ", result);

            setIOUTypeList(result);
            const ioudata = result?.filter((a: any) => a.IOUType_ID == ReOpenDetails[0][0]['IOU_Type'])[0];
            setSelectIOUType(ioudata.Description);
            setIOUTypeID(ioudata.IOUType_ID)

        });

        // // // Employee
        getAllUsers((result: any) => {
            //console.log("Employee ......... ", result);

            setEmployeeList(result);
            const empdata = result?.filter((a: any) => a.USER_ID == ReOpenDetails[0][0]['EmpId'])[0];
            setSelectEmployee(empdata.UserName);
            setEmpID(empdata.USER_ID);
        });


    }



    const saveJob = () => {

        // console.log("save job ............>>>>>>>>>>> ");

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
            Amount: requestAmount,
            Remark: remarks,
            CreateAt: currentDate,
            RequestedBy: userID,
            IsSync: 0

        }

        const JOBData: any = [];
        JOBData.push(saveObject);

        console.log("save one-off job ====  ", saveObject);


        saveOneOffJOB(JOBData, (response: any) => {

            // console.log(" save job .. ", response);

            amount += parseFloat(requestAmount);

            if (response == 3) {

                jobArray.push(saveObject);
                setJobList(jobArray);

                // console.log(" JOB List [][][][ ", joblist);

                Alert.alert("Successfully Added!");
                // SweetAlert.showAlertWithOptions({
                //     title: 'Successfully Added!',
                //     subTitle: '',
                //     confirmButtonTitle: 'OK',
                //     confirmButtonColor: '#000',
                //     otherButtonTitle: 'Cancel',
                //     otherButtonColor: '#dedede',
                //     style: 'success',
                //     cancellable: true
                // },
                //     //callback => console.log('callback')
                // );

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

                Alert.alert("Failed!");
                // SweetAlert.showAlertWithOptions({
                //     title: 'Failed!',
                //     subTitle: '',
                //     confirmButtonTitle: 'OK',
                //     confirmButtonColor: '#000',
                //     otherButtonTitle: 'Cancel',
                //     otherButtonColor: '#dedede',
                //     style: 'success',
                //     cancellable: true
                // },
                //     //callback => console.log('callback')
                // );
                setSelecteJoborVehicle('');
                setExpenseTypeID('');
                setrequestAmount('');
                setRemarks('');
                setAccountNo('');
                setCostCenter('');
                setResource('');
                setSelectExpenseType('');

                slideOutModal();
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
        setSelectExpenseType('');

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

            // console.log(" refresh One off sett ----------  > ");

            amount = 0.0;
            jobArray = [];


            getLastId();
            getLastAttachmentId();
            // console.log("OneOffSetNo:***********", OneOffSettlementNo);


            getLoginUserName().then(res => {
                setUname(res);
                // console.log(" user name ....... ", res);

            });

            getLoginUserID().then(result => {
                setUserID(result);
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

            });


        } else if (type == 2) {
            //get transport officer

            getAllTransportOfficers((resp2: any) => {

                console.log(" transport officers == [][][][]    ", resp2);

                setJobOwnerlist(resp2);
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


            for (let i = 0; i < result.length; i++) {

                // console.log(result[i]);

                JobDetails.push(result[i]);
            }

            UploadOneOff(JobDetails, HOD, IsLimit);
        })
    }

    //-----------Upload IOU Request------------------

    const UploadOneOff = async (detailsData: any, HOD: any, IsLimit: any) => {

        const URL = BASE_URL + '/Mob_PostOneOffSettlements.xsjs?dbName=TPL_JOBA8_170723';

        var obj = [];
        var Fileobj = [];
        try {
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
            for (let i = 0; i < detailsData.length; i++) {

                const arr = {
                    "IOUTypeNo": SelecteJoborVehicle,
                    "FileName": detailsData[i].Img_url,
                    "File": await RNFS.readFile(detailsData[i].Img_url, 'base64'),
                    "FileType": "jpg"
                }

                Fileobj.push(arr);
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


            console.log("ONE OFF UPLOAD JSON ====   ", prams, '=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=--');

            // await axios.get(URL, { headers })
            axios.post(URL, prams, {
                headers: headers
            }).then((response) => {
                // console.log("[s][t][a][t][u][s][]", response.status);
                // console.log("[s][t][a][t][u][s][] one off reponse METHOD   ........  ", response);
                if (response.status == 200) {

                    updateOneOffSyncStatus(OneOffSettlementNo, (result: any) => {

                    });

                    clearData();

                    // console.log("success ======= ", response.statusText);


                    console.log("success ===222==== ", response.data);


                } else {

                    // console.log(" response code ======= ", response.status);
                    clearData();

                }
            }).catch((error) => {

                // console.log("error .....   ", error);
                clearData();

            });


        } catch (error) {
            // console.log(error);
            clearData();
        }



    }

    const getJobNoByJobOwner = (ID: any) => {

        getJobNOByOwners(ID, (res: any) => {

            setJob_NoList(res);

        });

    }

    const attachement = () => {
        setIsSubmit(false);
        setIsOpen(true);
        slideInModal();
    }

    const getGL_AccForJobNo = () => {
        getAccNoForJobNo((res: any) => {
            // setAccountList(res);
            setAccountNo(res[0].GL_ACCOUNT);
        });
    }

    const getGL_AccByExpenseType = (type: any) => {
        getAccNoByExpenseType(type, (res: any) => {

            setAccountNo(res[0].GL_ACCOUNT);
        });
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

                    {
                        isSubmit ?

                            <SubmitCancelModal
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

                                        // <AddAnotherJob
                                        //     isJob={isJobOrVehicle}
                                        //     txtNo={iouTypeJob}
                                        //     cancelbtn={() => slideOutModal()} />

                                        //-------------------------------------------------------------------------------------

                                        <ScrollView
                                            style={ComStyles.CONTENTLOG}
                                            showsVerticalScrollIndicator={true}>


                                            <View style={styles.container}>

                                                <View style={{ justifyContent: 'center', alignItems: 'center', alignContent: 'center', flexDirection: 'row' }}>

                                                    <TouchableOpacity style={styles.dashStyle} onPress={slideOutModal} />

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
                                                                    getGL_AccForJobNo();
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

                                                        if (IOUTypeID != "1") {
                                                            getGL_AccByExpenseType(item.Description);
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
                                                    keyType='numeric'
                                                    stateValue={requestAmount}
                                                    editable={true}
                                                    setState={(val: any) => setrequestAmount(val)}
                                                    style={ComStyles.IOUInput}
                                                />
                                                {error.field === 'requestAmount' && (
                                                    <Text style={styles.error}>{error.message}</Text>
                                                )}

                                                <InputText
                                                    placeholderColor={ComStyles.COLORS.HEADER_BLACK}
                                                    placeholder="Remarks"
                                                    stateValue={remarks}
                                                    setState={(val: any) => setRemarks(val)}
                                                    editable={true}
                                                    style={ComStyles.IOUInput}
                                                />

                                                <InputText
                                                    placeholderColor={ComStyles.COLORS.HEADER_BLACK}
                                                    placeholder="Account No"
                                                    stateValue={accountNo}
                                                    editable={false}
                                                    setState={(val: any) => setAccountNo(val)}
                                                    style={ComStyles.IOUInput}
                                                />


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

            <Header title="Add One-Off Settlement" isBtn={true} btnOnPress={naviBack} />

            <ScrollView style={ComStyles.CONTENT} showsVerticalScrollIndicator={false}>

                <ViewField
                    title="Request ID"
                    Value={OneOffSettlementNo}
                    valustyle={{ color: ComStyles.COLORS.ICON_BLUE }}
                />

                <ViewField
                    title="Request By"
                    Value={uName}
                />

                <ViewField
                    title="Employee No"
                    Value={userID}
                />

                <ViewField
                    title="Request Channel"
                    Value="Mobile App"
                />

                <ViewField
                    title="Request Date"
                    Value={currentDate1}
                />

                <View style={ComStyles.separateLine} />

                <View>


                    <View style={{ flexDirection: 'row', }}>
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

                                getJobNoByJobOwner(item.EPFNo);
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

                    {/* <AddAnotherJob /> */}

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
                                                ExpenseType={item.ExpenseType == 1 ? "Meals" : (item.ExpenseType == 2 ? "Batta" : (item.ExpenseType == 3 ? "Labour" : (item.ExpenseType == 4 ? "Project Materials" : (item.ExpenseType == 5 ? "Travelling" : (item.ExpenseType == 6 ? "Other" : "")))))}
                                                jobremarks={item.Remark}
                                                accNo={item.AccNo}
                                                costCenter={item.CostCenter}
                                                resource={item.Resource}
                                            />






                                        </View>
                                    )
                                }

                                }
                                keyExtractor={item => `${item.Job_ID}`}
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

                    {/* <Image source={{ uri: 'https://thumbs.dreamstime.com/b/vector-paper-check-sell-receipt-bill-template-vector-paper-cash-sell-receipt-139437685.jpg' }} style={{ height: 70, width: 70 }} />
                    <Image source={{ uri: 'https://thumbs.dreamstime.com/b/vector-paper-check-sell-receipt-bill-template-vector-paper-cash-sell-receipt-139437685.jpg' }} style={{ height: 70, width: 70 }} />
                    <Image source={{ uri: 'https://thumbs.dreamstime.com/b/vector-paper-check-sell-receipt-bill-template-vector-paper-cash-sell-receipt-139437685.jpg' }} style={{ height: 70, width: 70 }} /> */}
                    {cameraPhoto.length > 0 ? (
                        <FlatList
                            data={cameraPhoto}
                            renderItem={renderCameraUri}
                            keyExtractor={(item) => item}
                            horizontal={true}
                            contentContainerStyle={{ marginTop: 10 }}
                        />
                    ) : (
                        // <Image
                        //     source={{ uri: 'https://thumbs.dreamstime.com/b/vector-paper-check-sell-receipt-bill-template-vector-paper-cash-sell-receipt-139437685.jpg' }}
                        //     style={{ height: 70, width: 70, justifyContent: 'space-between' }}
                        // />
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
                        // <Image
                        //     source={{ uri: 'https://thumbs.dreamstime.com/b/vector-paper-check-sell-receipt-bill-template-vector-paper-cash-sell-receipt-139437685.jpg' }}
                        //     style={{ height: 70, width: 70, justifyContent: 'space-between' }}
                        // />
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
        color: ComStyles.COLORS.ICON_BLUE,
    },
    selectedTextStyle2: {
        fontFamily: ComStyles.FONT_FAMILY.BOLD,
        fontSize: 20,
        color: ComStyles.COLORS.ICON_BLUE,
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
        color: ComStyles.COLORS.ICON_BLUE,
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
        color: ComStyles.COLORS.ICON_BLUE,
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