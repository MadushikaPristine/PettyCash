import React, { useState } from "react";
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
    Platform,
    Animated,
    Keyboard,
    Alert,
    PermissionsAndroid
} from 'react-native';
import Header from "../../Components/Header";
import ActionButton from "../../Components/ActionButton";
import ViewField from "../../Components/ViewField";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from 'react-native-vector-icons/AntDesign';
import InputText from "../../Components/InputText";
import AddAnotherJob from "../../Components/AddAnotherJob";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import SubmitCancelModal from "../../Components/SubmitCancelComponent";
import ImagePicker, { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import ImageUpload from "../../Components/ImageUpload";
import { IOUType } from "../../Constant/DummyData";
import { getIOUSETJobsListByID, getIOUSETReOpenRequest, getLastIOUSettlemnt, saveIOUSettlement, updateIDwithStatusSET, updateIOUSETSyncStatus } from "../../SQLiteDBAction/Controllers/IouSettlementController";
import moment from "moment";
import { CopyRequest, getLoginUserID, getLoginUserName, getLoginUserRoll, getRejectedId, get_ASYNC_COST_CENTER, get_ASYNC_EPFNO, get_ASYNC_IS_Auth_Requester } from "../../Constant/AsynStorageFuntion";
import { getAllEmployee, getEmployeeByID, getTypeWiseUsers } from "../../SQLiteDBAction/Controllers/EmployeeController";
import { getIOUTypes } from "../../SQLiteDBAction/Controllers/IOUTypeController";
import { getIOU, getIOUJobsListByID, getIOUReOpenRequest, getIOUdatainfo } from "../../SQLiteDBAction/Controllers/IOUController";
import RNFS from 'react-native-fs';
import { getJobDetailsByID, getLastJobID, saveJOB } from "../../SQLiteDBAction/Controllers/JOBController";
import { getExpenseTypeAll } from "../../SQLiteDBAction/Controllers/ExpenseTypeController";
import JobsView from "../../Components/JobsView";
import AsyncStorageConstants from "../../Constant/AsyncStorageConstants";
import NewJobsView from "../../Components/NewJobView";
import { getIOUJOBDataBYRequestID, getIOUJobDetailsByID } from "../../SQLiteDBAction/Controllers/IOUJobController";
import { DeleteAllDetailsIOUJobs, DeleteJobByID, UpdateSettJobbyId, getIOUSETJOBDataBYRequestID, getIOUSETJOBsBYSettlementID, getJobDetailsById, getLastIOUSETJobID, getSettlementJobAmount, saveIOUSETJOB } from "../../SQLiteDBAction/Controllers/IOUSettlementJobController";
import { getAllTransportOfficers, getAllUsers, getJobOwners, getTransportOfficerDetails } from "../../SQLiteDBAction/Controllers/UserController";
import { getCostCenterByJobNo, getJobNOByOwners, getJobNoAll } from "../../SQLiteDBAction/Controllers/JobNoController";
import { getVehicleNoAll } from "../../SQLiteDBAction/Controllers/VehicleNoController";
import { getAllJobOwners, getAllJobOwnersBYDep, getJobOWnerDetails } from "../../SQLiteDBAction/Controllers/JobOwnerController";
import axios from "axios";
import { BASE_URL, headers } from "../../Constant/ApiConstants";
import { getLastAttachment, saveAttachments } from "../../SQLiteDBAction/Controllers/AttachmentController";
import { getDepartments, getHODDetails, getLoggedUserHOD } from "../../SQLiteDBAction/Controllers/DepartmentController";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Modal from "react-native-modal";
import ComponentsStyles from "../../Constant/Components.styles";
import { getAccNoByExpenseType, getAccNoForJobNo, getGLAccNo } from "../../SQLiteDBAction/Controllers/GLAccountController";
import { Conection_Checking } from "../../Constant/InternetConection_Checking";

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
let IOUDetails: any[] = [];
let IOUJobData: any[] = [];
let ReOpenData: any[] = [];
let IOUSETNo = "";
let loggedUserID: any;

// IstoEdit status =========  1 - only edit / 0 - edit and delete

const NewIOUSettlement = () => {

    var currentDate1 = moment().utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss')
    var currentDate = moment().utcOffset('+05:30').format('YYYY-MM-DDTHH:mm:ss')
    // console.log(" date to save ==== " , currentDate);


    const [isModalVisible, setisModalVisible] = useState(false);
    const navigation = useNavigation();

    const [isFocus, setIsFocus] = useState(false);
    const [isShowSweep, setIsShowSweep] = useState(true);
    const [modalStyle, setModalStyle] = useState(new Animated.Value(height));
    const [isSubmit, setIsSubmit] = useState(false);
    const [cameraPhoto, setCameraPhoto] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [galleryPhoto, setGalleryPhoto] = useState('');
    const [error, setError] = useState({ field: '', message: '' });
    const [ownerType, setOwnerType] = useState('Job Owner');

    //Job
    const [isJobOrVehicle, setIsJobOrVehicle] = useState(true);
    const [iouTypeJob, setIouTypeJob] = useState('');
    const [searchtxt, setSearchtxt] = useState('');
    const [isEdit, setIsEdit] = useState(false);
    const [isAmount, setIsAmount] = useState(false);
    const [saveTitle, setsaveTitle] = useState("Add");

    // generate ID 
    const [lastID, setLastID] = useState('');
    const [IOUSettlementNo, setIOUSettlementNo] = useState('');
    const [lastAttachmentID, setLastAttachmentID] = useState('');
    const [AttachementNo, setAttachementNo] = useState('');

    // Async data
    const [uName, setUname] = useState('');
    const [userID, setUserID] = useState('');
    const [isReOpen, setIsReOpen] = useState('');
    const [uId, setUId] = useState('');

    // Free fill data list
    const [copyJobOwner, setCopyJobOwner] = useState('');
    const [copyIOUType, setCopyIOUType] = useState('');
    const [copyEmployee, setCopyEmployee] = useState('');
    const [copyIOU, setCopyIOU] = useState('');

    // Edit Job Data
    const [editJobNo, setEditJobNo] = useState('');
    const [editExpense, setEditExpense] = useState('');
    const [editAmount, setEditAmount] = useState('');
    const [editRemark, setEditRemark] = useState('');

    // spinner data list 
    const [jobOwnerList, setJobOwnerlist] = useState([]);
    const [IOUTypeList, setIOUTypeList] = useState([]);
    const [EmployeeList, setEmployeeList] = useState([]);
    const [IOUList, setIOUList] = useState([]);
    const [Job_NoList, setJob_NoList] = useState([]);
    const [Vehicle_NoList, setVehicle_NoList] = useState([]);
    const [DepartmentList, setDepartmentList] = useState([]);
    const [selectJOBVehicleNo, setselectJOBVehicleNo] = useState('');

    //spinner selected
    const [selectJobOwner, setSelectJobOwner] = useState('');
    const [selectIOUType, setSelectIOUType] = useState('');
    const [selectEmployee, setSelectEmployee] = useState('');
    const [selectIOU, setSelectIOU] = useState('');
    const [Id, setId] = useState('');

    //save
    const [JobOwner, setJobOwner] = useState('');
    const [IOUTypeID, setIOUTypeID] = useState('');
    const [EmpID, setEmpID] = useState('');
    const [IOUID, setIOUID] = useState('');

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
    const [ioujoblist, setiouJobList] = useState([]);

    const [isEditable, setIsEditable] = useState(true);
    const [isEditableEmp, setIsEditableEmp] = useState(true);
    const [isDisableAcc, setIsDisableAcc] = useState(false);
    const [isDisableRes, setIsDisableRes] = useState(false);

    const [AccountList, setAccountList] = useState([]);

    //Approval 
    const [IOULimit, setIOULimit] = useState(0.0);
    const [HODId, setHODID] = useState('');


    const options = {
        saveToPhotos: true,
        mediaType: 'photo',
        quality: 0.5,
        includeBase64: true,
    };

    var typeID = 0;

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
                    {/* <Image
                        source={{ uri: 'https://thumbs.dreamstime.com/b/vector-paper-check-sell-receipt-bill-template-vector-paper-cash-sell-receipt-139437685.jpg' }}
                        style={{ height: 70, width: 70, justifyContent: 'space-between' }}
                    /> */}
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
                // <Image
                //     source={{ uri: 'https://thumbs.dreamstime.com/b/vector-paper-check-sell-receipt-bill-template-vector-paper-cash-sell-receipt-139437685.jpg' }}
                //     style={{ height: 70, width: 70, justifyContent: 'space-between' }}
                // />
                <></>
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

        // console.log(" iou type --- ",);


        if (JobOwner === '') {
            loginError.field = 'JobOwner';
            loginError.message = 'Please select Job Owner to procced'
            setError(loginError);
            // } else if (IOUTypeID === '') {
            //     loginError.field = 'IOUTypeID';
            //     loginError.message = 'Please select IOU Type to procced'
            //     setError(loginError);
        } else if (EmpID === '') {
            loginError.field = 'EmpName';
            loginError.message = 'Please select Employee to procced'
            setError(loginError);
        } else if (IOUID === '') {
            loginError.field = 'IOU';
            loginError.message = 'Please select IOU to procced'
            setError(loginError);
        } else if (cameraPhoto.length == 0) {
            Alert.alert("Please Add Attachments");
        }
        else {
            if (amount == 0.0) {


                Alert.alert("Please Add Details");
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

    const getAllIOUTypes = () => {

        setIOUTypeList([]);

        getIOUTypes((result: any) => {

            setIOUTypeList(result);

        });

    }

    const getJJobOwnerTransportHOD = (ID: any, type: any) => {

        // type = 1 - job owner / 2 - transport officer / 3 - hod

        if (type == 1) {
            //get job owners

            console.log(" Owner ID ==  ", ID);


            getJobOWnerDetails(ID, (res: any) => {

                // console.log(" response === ", res);

                setSelectJobOwner(res[0].Name);
                setJobOwner(res[0].ID);

                setIOULimit(parseFloat(res[0].IOULimit));

                getJobNoByJobOwner(res[0].EPFNo);

            });



        } else if (type == 2) {
            //get transport officer


            getTransportOfficerDetails(ID, (resp: any) => {
                setSelectJobOwner(resp[0].Name);
                setJobOwner(resp[0].ID);
                setIOULimit(parseFloat(resp[0].IOULimit));
            });


        } else {

            //get hod

            getHODDetails(ID, (rest: any) => {

                setSelectJobOwner(rest[0].Name);
                setJobOwner(rest[0].ID);

            });



        }


    }


    const editJobs = (jobNo: any) => {

        setIsEdit(true);
        setIsAmount(true);

        setsaveTitle("Update");

        setIsSubmit(false);
        setIsOpen(false);

        console.log(" selected job  ", jobNo);

        getJobDetailsById(jobNo, (res: any) => {

            console.log(" job details ----- [][][][]   ", res[0]);


            IOUJobData.push(res[0]);

            typeID = res[0].IOU_TYPEID;

            setEditJobNo(res[0].IOUTypeNo)
            setEditExpense(res[0].ExpenseType);
            setId(res[0]._Id);
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
        setFormatAmount(String(IOUJOBData[0].Amount));
        // setrequestAmount(String(IOUJOBData[0].Amount));
        // console.log(editAmount);
        setRemarks(IOUJOBData[0].Remark);
        setAccountNo(IOUJOBData[0].AccNo);
        setCostCenter(IOUJOBData[0].CostCenter);
        setResource(IOUJOBData[0].Resource);

    }

    const addjob = () => {

        // if (isEdit) {

        //     //Update IOU Job

        //     console.log(" Update Job .... ");



        // } else {

        // Add new sett JOB

        setsaveTitle("Add");
        generateJobNo();
        getVehicleNo();

        getExpenseTypeAll((res: any) => {
            setExpenseTypeList(res);
        });

        let loginError = { field: '', message: '' }

        // if (IOUTypeID === '') {

        //     loginError.field = 'IOUTypeID';
        //     loginError.message = 'Please select IOU Type to Add Job'
        //     setError(loginError);

        // } else {

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



        //}



        // }


    }

    const getLastId = () => {

        try {

            getLastIOUSettlemnt((result: any) => {

                // console.log("... last ID length ...... ", result.length);


                if (result.length == 0) {

                    setLastID("0");
                    generateIOUNo(0);

                } else {

                    setLastID(result[0]._Id);
                    generateIOUNo(result[0]._Id)
                }


            });

        } catch (error) {
            // console.log(" error ..... ", error);

        }



    }

    const generateIOUNo = (ID: any) => {

        let newID = parseInt(ID) + 1;
        let randomNum = Math.floor(Math.random() * 1000) + 1;

        setIOUSettlementNo("IOUSET_" + randomNum + "_" + newID + "_M");

        IOUSETNo = "IOUSET_" + randomNum + "_" + newID + "_M";

        // console.log("AutoGenerated No: ", IOUSETNo);

    }

    const getSpinnerData = () => {

        // console.log("  ----   job array size --------  ", jobArray.length);

        setIOUList([]);



        //IOU
        getIOU((result1: any) => {
            setIOUList(result1);
        });

    }

    const saveSubmit = () => {

        let IOUSettlementData: any;
        let HODID: any;
        let IsLimit: any;


        getLoggedUserHOD((res: any) => {
            console.log(" hod ===  ", res);

            setHODID(res[0].ID);
            HODID = res[0].ID;

            getSettlementJobAmount(IOUSettlementNo, (res1: any) => {

                amount = parseFloat(res1[0].totAmount);

                if (IOUTypeID === '3') {

                    IsLimit = "";

                    // console.log(" hod other ---  ", res[0].ID);

                    IOUSettlementData = [
                        {
                            PCRCode: IOUSettlementNo,
                            IOU: IOUID,
                            JobOwner: parseInt(JobOwner),
                            IOUType: parseInt(IOUTypeID),
                            EmpId: parseInt(EmpID),
                            RequestedDate: currentDate,
                            Amount: amount,
                            StatusID: 1,
                            RequestedBy: loggedUserID,
                            IsSync: 0,
                            Approve_Remark: "",
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
                            ID: 0


                        }
                    ]


                    saveIOUSettlement(IOUSettlementData, async (response: any) => {
                        // console.log(" save iou .................... ", response);

                        if (response == 3) {

                            getDetailsData(parseInt(res[0].ID), IsLimit);

                            slideOutModal();
                            Alert.alert("Successfully Submitted!");
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


                            await AsyncStorage.setItem(AsyncStorageConstants.ASYNC_CURRENT_PENDING_LIST_TYPE, "SETTLEMENT");
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
                            //     style: 'error',
                            //     cancellable: true
                            // },
                            //     //callback => console.log('callback')
                            // );
                        }


                    });


                } else if (amount > IOULimit) {

                    // limit exceed

                    // console.log("limit exceed job no or vehicle type ----  ", res[0].ID);

                    IsLimit = "YES";

                    IOUSettlementData = [
                        {
                            PCRCode: IOUSettlementNo,
                            IOU: IOUID,
                            JobOwner: parseInt(JobOwner),
                            IOUType: parseInt(IOUTypeID),
                            EmpId: parseInt(EmpID),
                            RequestedDate: currentDate,
                            Amount: amount,
                            StatusID: 1,
                            RequestedBy: loggedUserID,
                            IsSync: 0,
                            Approve_Remark: "",
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
                            ID: 0



                        }
                    ]

                    saveIOUSettlement(IOUSettlementData, async (response: any) => {
                        // console.log(" save iou .................... ", response);

                        if (response == 3) {

                            getDetailsData(parseInt(res[0].ID), IsLimit);

                            slideOutModal();
                            Alert.alert("Successfully Submitted!");
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


                            await AsyncStorage.setItem(AsyncStorageConstants.ASYNC_CURRENT_PENDING_LIST_TYPE, "SETTLEMENT");
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
                            //     style: 'error',
                            //     cancellable: true
                            // },
                            //     //callback => console.log('callback')
                            // );
                        }


                    });


                } else {

                    // limit  not exceed

                    if (IOUTypeID === '3') {
                        //other type


                        // console.log("Other type ----  ", HODID);

                        IsLimit = "";

                        IOUSettlementData = [
                            {
                                PCRCode: IOUSettlementNo,
                                IOU: IOUID,
                                JobOwner: parseInt(JobOwner),
                                IOUType: parseInt(IOUTypeID),
                                EmpId: parseInt(EmpID),
                                RequestedDate: currentDate,
                                Amount: amount,
                                StatusID: 1,
                                RequestedBy: loggedUserID,
                                IsSync: 0,
                                Approve_Remark: "",
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
                                ID: 0


                            }
                        ]

                        saveIOUSettlement(IOUSettlementData, async (response: any) => {
                            // console.log(" save iou .................... ", response);

                            if (response == 3) {

                                getDetailsData(parseInt(res[0].ID), IsLimit);

                                slideOutModal();
                                Alert.alert("Successfully Submitted!");
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


                                await AsyncStorage.setItem(AsyncStorageConstants.ASYNC_CURRENT_PENDING_LIST_TYPE, "SETTLEMENT");
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
                                //     style: 'error',
                                //     cancellable: true
                                // },
                                //     //callback => console.log('callback')
                                // );
                            }


                        });

                    } else {


                        // console.log("job no or vehicle");

                        IsLimit = "NO";

                        HODID = '';

                        IOUSettlementData = [
                            {
                                PCRCode: IOUSettlementNo,
                                IOU: IOUID,
                                JobOwner: parseInt(JobOwner),
                                IOUType: parseInt(IOUTypeID),
                                EmpId: parseInt(EmpID),
                                RequestedDate: currentDate,
                                Amount: amount,
                                StatusID: 1,
                                RequestedBy: loggedUserID,
                                IsSync: 0,
                                Approve_Remark: "",
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
                                ID: 0


                            }
                        ]

                        saveIOUSettlement(IOUSettlementData, async (response: any) => {
                            // console.log(" save iou .................... ", response);

                            if (response == 3) {

                                getDetailsData(HODID, IsLimit);

                                slideOutModal();
                                Alert.alert("Successfully Submitted!");
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


                                await AsyncStorage.setItem(AsyncStorageConstants.ASYNC_CURRENT_PENDING_LIST_TYPE, "SETTLEMENT");
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
                                //     style: 'error',
                                //     cancellable: true
                                // },
                                //     //callback => console.log('callback')
                                // );
                            }


                        });


                    }



                }


            });



        });


    }

    const attachmentSave = () => {
        const attachementData = [
            {
                PCRCode: IOUSettlementNo,
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

    const attachement = () => {
        setIsSubmit(false);
        setIsOpen(true);
        slideInModal();
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

    const generateAttachementNo = (ID: any) => {

        // console.log("ATTACHMENT ID GENERATE ======================   ");

        let newAttachmentID = parseInt(ID) + 1;
        let randomNum = Math.floor(Math.random() * 1000) + 1;

        setAttachementNo("IOUSETAtch_" + randomNum + "_" + newAttachmentID + "_M");
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

        // getLastJobID((res: any) => {


        //     // console.log(" job last id .....  ", res[0]._Id);

        //     let ID = parseInt(res[0]._Id) + 1;

        //     setjobNo("JOB_" + ID);


        // });

        getLastIOUSETJobID((res: any) => {


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

    const getJobNo = (Owner: any) => {
        // console.log("Function: ", Owner);
        // console.log("********", selectJobOwner);



        getJobNoAll(Owner, (res: any) => {
            // console.log("Job No............", res);
            setJob_NoList(res);
        })
    }

    const getVehicleNo = () => {
        getVehicleNoAll((resp: any) => {
            //console.log("Vehicle No............", resp);
            setVehicle_NoList(resp);
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
                { text: 'Yes', onPress: () => add() },
            ]);

        } else if (data == 2) {

            //if submit is pressed
            Alert.alert('Add !', 'Are you sure you want to submit this ?', [
                {
                    text: 'No',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                { text: 'Yes', onPress: () => saveSubmit() },
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

        // if (isJobOrVehicle) {

        //     jobError.field = 'JobOwner'
        //     jobError.message = 'Job No is required'
        //     setError(jobError);

        // } else
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


    const saveJob = () => {

        console.log("save job ............>>>>>>>>>>> ");

        let job_no = Date.now();

        let isDecimal = requestAmount.indexOf(".");
        let decimalAmount = 0.0;

        if (isDecimal != -1) {

            const splitAmount = requestAmount.split(".");
            decimalAmount = parseFloat(splitAmount[0].replaceAll(',', '') + "." + splitAmount[1]);

        } else {

            decimalAmount = parseFloat(requestAmount.replaceAll(',', ''));

        }

        if (saveTitle == "Add") {

            // new job details



            const saveObject =
            {
                Job_ID: job_no,
                IOUTypeNo: SelecteJoborVehicle,
                JobOwner_ID: parseInt(JobOwner),
                PCRCode: IOUSettlementNo,
                AccNo: accountNo,
                CostCenter: costCeneter,
                Resource: resource,
                ExpenseType: parseInt(expenseTypeID),
                Amount: decimalAmount,
                Remark: remarks,
                CreateAt: currentDate,
                RequestedBy: loggedUserID,
                IsSync: 0,
                RequestedAmount: decimalAmount,
                IOU_TYPEID: parseInt(IOUTypeID),
                IstoEdit: 0,

            }


            const JOBData: any = [];
            JOBData.push(saveObject);

            console.log("job data == [][][][]  ", JOBData);


            saveIOUSETJOB(JOBData, (response: any) => {

                // console.log(" save job .. ", response);

                amount += decimalAmount;

                if (response == 3) {

                    jobArray.push(saveObject);

                    // JOBData = [];
                    // setJobList(jobArray);

                    // console.log(" JOB List [][][][ ", joblist);

                    Alert.alert("Successfully Added!");

                    cancelJob();
                    getAllJobs(IOUSettlementNo);


                } else {

                    Alert.alert("Failed!");


                    // cancelJob();
                }

            });


        } else {

            //update job details



            // amount += parseFloat(requestAmount);


            // AccNo:any,Costcenter:any,Resource:any,Amount:any,Remark:any,ID:any

            console.log(" suto id ===== ", Id);


            UpdateSettJobbyId(accountNo, costCeneter, resource, decimalAmount, remarks, Id, (result: any) => {

                console.log("result update =======  ", result);


                if (result == "success") {

                    Alert.alert("Successfully Updated!");
                    cancelJob();
                    getAllJobs(IOUSettlementNo);


                } else {

                    Alert.alert("Failed Update!")

                }

            });

        }



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
        setselectJOBVehicleNo('');

        slideOutModal();

    }

    // const getIOUJobList = (IOUID: any) => {

    //     setiouJobList([]);

    //     getIOUJobsListByID(IOUID, (response: any) => {

    //         setiouJobList(response);
    //         console.log(response);

    //     });

    // }


    const DeleteIOuJobs = () => {

        try {

            DeleteAllDetailsIOUJobs(IOUSettlementNo,(result:any) => {

            });
            
        } catch (error) {

            console.log(" error -     " , error);
            
            
        }

      

    }
  

    const getIOUJobList = (IOUID: any) => {



        console.log(IOUID);

         setiouJobList([]);

        getIOUJobsListByID(IOUID, (response: any) => {

            // setiouJobList(response);
            console.log(response);
            //console.log(ioujoblist.Amount);
            for (let i = 0; i < response.length; i++) {

                // console.log(response[i].Amount);
                let newamount = response[i].Amount;
                let randomNum = Math.floor(Math.random() * 1000) + 1;
                let ID = parseInt(response[0]._Id) + 1;

                let jobId = new Date()

                const saveObject =
                {
                    Job_ID: jobId,
                    IOUTypeNo: response[i].IOUTypeNo,
                    JobOwner_ID: response[i].JobOwner_ID,
                    PCRCode: IOUSettlementNo,
                    AccNo: response[i].AccNo,
                    CostCenter: response[i].CostCenter,
                    Resource: response[i].Resource,
                    ExpenseType: response[i].ExpenseType,
                    Amount: response[i].Amount,
                    Remark: response[i].Remark,
                    CreateAt: currentDate,
                    RequestedBy: loggedUserID,
                    IsSync: 0,
                    RequestedAmount: response[i].Amount,
                    IstoEdit: 1,
                    IOU_TYPEID: response[i].IOU_Type

                }

                console.log(" save iou job to set job ", saveObject);


                const JOBData: any = [];
                JOBData.push(saveObject);

                console.log("selected iou details list ---------    " , JOBData);
                

                saveIOUSETJOB(JOBData, (response: any) => {

                    console.log(" save job .. ", response);

                    amount += parseFloat(newamount);

                    if (response == 3) {

                        // jobArray.push(saveObject);
                        // setJobList(jobArray);

                        getAllJobs(IOUSettlementNo);

                        // console.log(" JOB List [][][][ ", joblist);

                        //Alert.alert("Successfully Added!");


                    }


                });


            }

        });


    }

    const getIOUSETJobList = (IOUID: any) => {

        setiouJobList([]);

        getIOUSETJobsListByID(IOUID, (response: any) => {

            console.log(IOUID, "============== ", response);

            setiouJobList(response);

            //console.log(ioujoblist.Amount);
            // for (let i = 0; i < response.length; i++) {

            //     // console.log(response[i].Amount);
            //     let newamount = response[i].Amount;
            //     let randomNum = Math.floor(Math.random() * 1000) + 1;
            //     let ID = parseInt(response[0]._Id) + 1;

            //     const saveObject =
            //     {
            //         Job_ID: 0,
            //         IOUTypeNo: response[i].IOUTypeNo,
            //         JobOwner_ID: response[i].JobOwner_ID,
            //         PCRCode: IOUSettlementNo,
            //         AccNo: response[i].AccNo,
            //         CostCenter: response[i].CostCenter,
            //         Resource: response[i].Resource,
            //         ExpenseType: response[i].ExpenseType,
            //         Amount: response[i].Amount,
            //         Remark: response[i].Remark,
            //         CreateAt: currentDate,
            //         RequestedBy: 2,
            //         IsSync: 1

            //     }

            //     const JOBData: any = [];
            //     JOBData.push(saveObject);

            //     saveIOUSETJOB(JOBData, (response: any) => {

            //         // console.log(" save job .. ", response);

            //         amount += parseFloat(newamount);

            //         if (response == 3) {

            //             jobArray.push(saveObject);
            //             setJobList(jobArray);

            //             // console.log(" JOB List [][][][ ", joblist);

            //             //Alert.alert("Successfully Added!");


            //         }


            //     });


            // }

        });


    }

    const getAllJobs = (IOUSETID: any) => {

        setiouJobList([]);

        getIOUSETJOBsBYSettlementID(IOUSETID, (result: any) => {

            setiouJobList(result);

            console.log(" settlemnt jobs ==== ", result);


        });

    }


    // const editRequest = (id: any) => {
    //     getIOUSETReOpenRequest(id, (result: any) => {
    //         console.log(result);
    //         setCopyJobOwner(result[0].JobOwner_ID);
    //         //setSelectJobOwner(result[0].JobOwner_ID);
    //         setCopyIOUType(result[0].IOU_Type);
    //         setCopyEmployee(result[0].EmpId);
    //         setCopyIOU(result[0].IOU_ID);

    //     })

    //     if (isReOpen == 'False') {

    //     } else {

    //         getIOUSETJobsListByID(id, (response: any) => {
    //             console.log(response);
    //             setJobList(response);
    //         })

    //         getAllJobOwners((result: any) => {
    //             console.log(" Job owner ...........  ", result);

    //             setJobOwnerlist(result);
    //             const data = result?.filter((a: any) => a.JobOwner_ID == copyJobOwner)[0];
    //             setSelectJobOwner(data.Name);
    //             console.log(selectJobOwner);
    //         });

    //         getIOUTypes((result: any) => {
    //             console.log("IOU types ......... ", result);

    //             setIOUTypeList(result);
    //             const ioudata = result?.filter((a: any) => a.IOUType_ID == copyIOUType)[0];
    //             setSelectIOUType(ioudata.Description);
    //         });

    //         // // // Employee
    //         getAllUsers((result: any) => {
    //             console.log("Employee ......... ", result);

    //             setEmployeeList(result);
    //             const empdata = result?.filter((a: any) => a.USER_ID == copyEmployee)[0];
    //             setSelectEmployee(empdata.UserName);
    //         });

    //         getIOU((result1: any) => {
    //             setIOUList(result1);
    //             const ioudata = result1?.filter((a: any) => a.IOU_ID == copyIOU)[0];
    //             setSelectIOU(ioudata.IOU_ID);
    //         });
    //     }

    // }

    // //-------Edit Request----------------------------------------------



    const editRequest = async (id: any) => {

        try {


            getIOUSETReOpenRequest(id, (result: any) => {
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

        getIOUSETJobsListByID(id, (response: any) => {

            console.log("settlement jobs ---- ", response);

            setJobList(response);
        });

        getIOUSETJobList(id);
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

        getIOU((result1: any) => {
            setIOUList(result1);
            const ioudata = result1?.filter((a: any) => a.IOU_ID == ReOpenDetails[0][0]['IOU_ID'])[0];
            setSelectIOU(ioudata.IOU_ID);
            setIOUID(ioudata.IOU_ID);
        });


    }

    //--------Edit Details Data----------------------------

    const getIOUData = async (id: any) => {
        // console.log("Call function--------", id);

        try {
            // const result = await new Promise((resolve, reject) => {
            getIOUdatainfo(id, (result: any) => {
                //resolve(result);
                console.log('await query--------', result[0]);
                IOUDetails.push(result[0]);
                setCopyJobOwner(result[0].JobOwner_ID);
                setCopyIOUType(result[0].IOU_Type);
                setCopyEmployee(result[0].EmpId);
                // console.log('JobOwnerID---', copyJobOwner, ' --IOUType----', copyIOUType, ' --Employee--', copyEmployee);
                checkIOUdata(IOUDetails);

                getEmployeeByID(result[0].EmpId, (rest: any) => {

                    console.log(result[0].EmpId, "employee details === [][][][", rest);


                });
            });
            // });



            // console.log('JobOwnerID---', copyJobOwner, ' --IOUType----', copyIOUType, ' --Employee--', copyEmployee);


        } catch (error) {
            // console.error(error);
        }
    }


    const checkIOUdata = async (Data: any) => {

        console.log("IOU details ---- ", Data);

        if (Data[0].IOU_Type == 1) {
            // Job No

            getAllJobOwners((result: any) => {
                //console.log(" Job owner ...........  ", result);

                setJobOwnerlist(result);
                const data = result?.filter((a: any) => a.ID == Data[0].JobOwner_ID)[0];
                setSelectJobOwner(data.Name);
                setJobOwner(data.ID);
                // console.log("-----------------", data.Name);
                // console.log("-----------------", Data[0].JobOwner_ID);

                // console.log(selectJobOwner);
                getJobNo(data.Name);
            });


        } else if (Data[0].IOU_Type == 2) {
            // vehicle no

            getLoginUserID().then(result1 => {

                getAllTransportOfficers((result: any) => {

                    setJobOwnerlist(result);
                    console.log(" transport officer ----  ", result);

                    const data = result?.filter((a: any) => a.ID == Data[0].JobOwner_ID)[0];
                    setSelectJobOwner(data.Name);
                    setJobOwner(data.ID);

                });

            });


        } else {
            // other

            getLoggedUserHOD((res: any) => {

                // console.log(" hod ===" , res);

                setJobOwnerlist(res);
                setSelectJobOwner(res[0].Name);
                setJobOwner(res[0].ID);

            });


        }



        getIOUTypes((result: any) => {
            // console.log("IOU types ......... ", result);

            setIOUTypeList(result);
            const ioudata = result?.filter((a: any) => a.IOUType_ID == Data[0].IOU_Type)[0];
            setSelectIOUType(ioudata.Description);
            setIOUTypeID(ioudata.IOUType_ID)
        });

        // // // Employee
        // getAllUsers((result: any) => {
        //     //console.log("Employee ......... ", result);

        //     setEmployeeList(result);
        //     const empdata = result?.filter((a: any) => a.USER_ID == Data[0].EmpId)[0];
        //     setSelectEmployee(empdata.UserName);
        //     setEmpID(empdata.USER_ID);
        // });

        getAllEmployee((eresult: any) => {

            setEmployeeList(eresult);
            const empdata = eresult?.filter((a: any) => a.Emp_ID == Data[0].EmpId)[0];
            setSelectEmployee(empdata.EmpName);
            setEmpID(empdata.Emp_ID);

        });

        // getCostCenter(JobOwner, IOUTypeID);

    }

    //-----------------------------------------------------

    useFocusEffect(
        React.useCallback(() => {

            // console.log(" refresh IOU SETT ----------  > ");

            amount = 0.0;
            jobArray = [];

            getLastId();
            getLastAttachmentId();
            getSpinnerData();

            getLoginUserName().then(res => {
                setUname(res);
                // console.log(" user name ....... ", res);

            });

            getLoginUserID().then(result => {
                setUserID(result);
                loggedUserID = result;
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
            getSpinnerEmployee();

        }, [navigation])
    );

    const getSpinnerEmployee = () => {

        console.log(" get employeee ");


        getAllEmployee((result: any) => {

            setEmployeeList(result);

            getLoginUserRoll().then(async res => {

                if (res === '1') {
                    //requester

                    console.log(" requester -----------   ");

                    get_ASYNC_IS_Auth_Requester().then(async resp => {

                        if (resp === '1') {
                            //auth requester

                            console.log("auth requester -----------   ");
                            setIsEditableEmp(false);

                        } else {
                            //requester

                            console.log(" only requester -----------   ");

                            setIsEditableEmp(true);

                            get_ASYNC_EPFNO().then(async resu => {

                                const empdata = result?.filter((a: any) => a.EPFNo == parseInt(resu + ""))[0];
                                setSelectEmployee(empdata.Name);
                                setEmpID(empdata.ID);

                            });



                        }

                    });

                } else {
                    //
                    console.log("not a requester -----------   ");
                    setIsEditableEmp(false);
                }


            });






        });

    }

    //--------Get IOU Types Details Data----------------------

    const getDetailsData = (HOD: any, IsLimit: any) => {
        getIOUSETJOBDataBYRequestID(IOUSettlementNo, (result: any) => {

            // console.log(result, '+++++++++++++++++++++++++++');


            for (let i = 0; i < result.length; i++) {

                // console.log(result[i]);

                JobDetails.push(result[i]);
            }

            Conection_Checking(async (res: any) => {
                if (res != false) {
                    UploadIOU(JobDetails, HOD, IsLimit);
                }
            })


        })
    }

    //-----------Upload IOU Request------------------

    const UploadIOU = async (detailsData: any, HOD: any, IsLimit: any) => {

        const URL = BASE_URL + '/Mob_PostIOUSettlements.xsjs?dbName=PC_UAT_WM'

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
                    "AccNo": detailsData[i].AccNo,
                    "CostCenter": detailsData[i].CostCenter,
                    "Resource": detailsData[i].Resource
                }

                obj.push(arr);
            }
            for (let i = 0; i < detailsData.length; i++) {

                const arr = {
                    "IOUTypeNo": IOUTypeID,
                    "FileName": detailsData[i].Img_url,
                    "File": await RNFS.readFile(detailsData[i].Img_url, 'base64'),
                    "FileType": "image/jepg"
                }

                Fileobj.push(arr);
            }


            const prams = {
                "CreateAt": currentDate,
                "Date": currentDate,
                "IOU": IOUID,
                "IOUSetID": IOUSettlementNo,
                "IOUTypeID": parseInt(IOUTypeID),
                "IOUtype": iouTypeJob,
                "JobOwner": parseInt(JobOwner),
                "ReqChannel": "Mobile",
                "RequestedBy": userID,
                "TotalAmount": amount,
                "EmployeeNo": EmpID,
                "IOUTypeDetails": obj,
                "attachments": Fileobj,
                "Hod": parseFloat(HOD),
                "RIsLimit": IsLimit,
                "RIouLimit": IOULimit

            }

            // console.log(" type details ---------- === ", obj);

            // console.log(" file object === ", Fileobj);


            console.log("IOU SET UPLOAD JSON ==== ", prams, '=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=--');

            // await axios.get(URL, { headers })
            axios.post(URL, prams, {
                headers: headers
            }).then((response) => {
                // console.log("[s][t][a][t][u][s][]", response.status);
                // console.log("[s][t][a][t][u][s][] IOU SET reponse METHOD   ........  ", response)
                if (response.status == 200) {

                    if (response.data.ErrorId == 0) {

                        console.log("success ===222==== ", response.data);

                        updateIDwithStatusSET(IOUSettlementNo, response.data.ID, (resp: any) => {

                        });


                    }

                    // updateIOUSETSyncStatus(IOUSettlementNo, (result: any) => {



                    // });

                    // console.log("success ======= ", response.statusText);





                } else {

                    // console.log(" response code ======= ", response.status);

                }
            }).catch((error) => {

                // console.log("error .....   ", error);


            });


        } catch (error) {
            // console.log(error);

        }
        // const prams = {
        //     "PettycashID": IOUNo,
        //     "RequestedBy": uName,
        //     "ReqChannel": "Mobile",
        //     "Date": currentDate,
        //     "IOUtype": parseInt(IOUTypeID),
        //     "EmpNo": parseInt(EmpID),
        //     "JobOwner": parseInt(Job_Owner),
        //     "CreateAt": currentDate,
        //     "TotalAmount": requestAmount,
        //     "IOUTypeDetails": IOUTypeDetails,
        //     // [
        //     //     {
        //     //         "IOUTypeID": parseInt(IOUTypeID),
        //     //         "IOUTypeNo": SelecteJoborVehicle,
        //     //         "ExpenseType": parseInt(expenseTypeID),
        //     //         "Amount": requestAmount,
        //     //         "Remark": remarks
        //     //     } 
        //     // ]

        //     "attacments": [
        //         {
        //             "IOUTypeNo": SelecteJoborVehicle,
        //             "FileName": "Guidelines - Leave Application.pdf",
        //             "File": "JVBERi0xLjcNCiW1tbW1DQoxIDAgb2JqDQo8PC9UeXBlL0NhdGFsb2cvUGFnZXMgMiAwIFIvTGFuZyhlbi1VUykgL1N0cnVjdFRyZWVSb290IDM0IDAgUi9NYXJrSW5mbzw8L01hcmtlZCB0cnVlPj4vTWV0YWRhdGEgMjAyIDAgUi9WaWV3ZXJQcmVmZXJlbmNlcyAyMDMgMCBSPj4NCmVuZG9iag0KMiAwIG9iag0KPDwvVHlwZS9QYWdlcy9Db3VudCAzL0tpZHNbIDMgMCBSIDIxIDAgUiAyOSAwIFJdID4+DQplbmRvYmoNCjMgMCBvYmoNCjw8L1R5cGUvUGFnZS9QYXJlbnQgMiAwIFIvUmVzb3VyY2VzPDwvRm9udDw8L0YxIDUgMCBSL0YyIDkgMCBSL0YzIDExIDAgUi9GNCAxMyAwIFI+Pi9FeHRHU3RhdGU8PC9HUzcgNyAwIFIvR1M4IDggMCBSPj4vWE9iamVjdDw8L0ltYWdlMTggMTggMCBSL0ltYWdlMTkgMTkgMCBSPj4vUHJvY1NldFsvUERGL1RleHQvSW1hZ2VCL0ltYWdlQy9JbWFnZUldID4+L01lZGlhQm94WyAwIDAgNjEyIDc5Ml0gL0NvbnRlbnRzIDQgMCBSL0dyb3VwPDwvVHlwZS9Hcm91cC9TL1RyYW5zcGFyZW5jeS9DUy9EZXZpY2VSR0I+Pi9UYWJzL1MvU3RydWN0UGFyZW50cyAwPj4NCmVuZG9iag0KNCAwIG9iag0KPDwvRmlsdGVyL0ZsYXRlRGVjb2RlL0xlbmd0aCA1MzM+Pg0Kc3RyZWFtDQp4nK2XTYvbMBCG7wb/hzm2hU40Gn1CMDTOZtnCwrYN9FB6KGWb07Z0+/+hIztQp5t4d4wM/pCs6H1GGktvYHUH6/Xqtr/Zguk62Gx7+N02Bk05MlkwEOQas4XH+7b5/AZ+ts1m3zarHQERGgf7H21D0s4AQbRorINoMoYE+wdpd/0pwuGP9AmHoZSOpeu2",
        //             "FileType": "jpg"
        //         }
        //     ]
        // }

        // console.log('--NEW IOU REQUEST UPLOAD JSON--', prams);

        // axios.post(URL, prams, {
        //     headers: headers
        // }).then((response) => {
        //     console.log("[s][t][a][t][u][s][]", response.status);
        //     if (response.status == 200) {


        //     } else {

        //         console.log(" response code ======= ", response.status);

        //     }
        // }).catch((error) => {

        //     console.log(" JobNo error .....   ", error);


        // });

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

    const getCostCenter = (ID: any) => {

        getCostCenterByJobNo(ID, (res: any) => {
            setCostCenter(res[0].CostCenter);
        });

    }

    const getEmpDetails = (ID: any) => {

        getEmployeeByID(ID, (res: any) => {
            setSelectEmployee(res[0].EmpName);
            setEmpID(res[0].Emp_ID);
        });
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
        setiouJobList([]);
    }

    const setFormatAmount = (amount: any) => {

        let isDecimal = amount.indexOf(".");

        if (isDecimal != -1) {

            // console.log(" decimal number =====    ");

            const split = amount.split(".");

            setrequestAmount(Intl.NumberFormat('en-US').format(split[0].replaceAll(',', '')) + "." + split[1]);


        } else {

            setrequestAmount(Intl.NumberFormat('en-US').format(amount.replaceAll(',', '')));
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

    const deteleJob = (ID:any) =>  {

        DeleteJobByID(ID,(resp:any) => {
            getAllJobs(IOUSettlementNo)
        })

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
                                                                maxHeight={300}
                                                                labelField={IOUTypeID == "1" ? "Job_No" : "Vehicle_No"}
                                                                valueField={IOUTypeID == "1" ? "Job_No" : "Vehicle_No"}
                                                                placeholder={!isFocus ? IOUTypeID == "1" ? 'Select Job No ' : 'Select Vehicle No' : ''}
                                                                searchPlaceholder={IOUTypeID == "1" ? "Search Job No" : " Search Vehicle No"}
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
                                                        Expense Type*
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
                                                    stateValue={remarks}
                                                    setState={(val: any) => setRemarks(val)}
                                                    editable={true}
                                                    style={ComStyles.IOUInput}
                                                />

                                                <View style={{ flexDirection: 'row', }}>
                                                    <Text style={styles.bodyTextLeft}>
                                                        Account No
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
                                                    data={AccountList}
                                                    search
                                                    disable={isDisableAcc}
                                                    maxHeight={300}
                                                    labelField="GL_ACCOUNT"
                                                    valueField="GL_ACCOUNT"
                                                    placeholder={!isFocus ? 'Account No* ' : '...'}
                                                    searchPlaceholder="Search Account No"
                                                    value={accountNo}
                                                    onFocus={() => setIsFocus(true)}
                                                    onBlur={() => setIsFocus(false)}
                                                    onChange={item => {

                                                        setAccountNo(item.GL_ACCOUNT);


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
                                                        title={saveTitle}
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
                                    //--------------------------------------------------------------------------
                                }
                            </>

                    }


                </View>

            </Animated.View>

            <Header title="Add New IOU Settlement" isBtn={true} btnOnPress={naviBack} />

            <ScrollView style={ComStyles.CONTENT} nestedScrollEnabled={true}>

                <ViewField
                    title="Request ID"
                    Value={IOUSettlementNo}
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
                        <Text style={styles.bodyTextLeft}>
                            IOU *
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
                        data={IOUList}
                        search
                        maxHeight={300}
                        labelField="IOU_ID"
                        valueField="IOU_ID"
                        placeholder={!isFocus ? 'Select IOU ' : '...'}
                        searchPlaceholder="Search IOU"
                        value={selectIOU}
                        onFocus={() => setIsFocus(true)}
                        onBlur={() => setIsFocus(false)}
                        onChange={item => {

                            DeleteIOuJobs();

                            setIOUTypeID(item.IOU_Type);

                            getEmpDetails(item.EmpId);

                            const iouID = item.IOU_ID + "";

                            const code = iouID.split(" - ");

                            console.log(" IOU ID === ", code[0].trim());
                            setSelectIOU(item.IOU_ID);

                            setIOUID(code[0].trim());

                            setiouJobList([]);


                            getIOUJobList(code[0].trim());

                            if (item.IOU_Type == 1) {

                                // console.log(" job");


                                setOwnerType("Job Owner");
                                setIsEditable(false);
                                setIsDisableRes(false);
                                getJJobOwnerTransportHOD(item.JobOwner_ID, 1);
                                setSelectIOUType("Job No");


                            } else if (item.IOU_Type == 2) {

                                // console.log(" vehicle");

                                setOwnerType("Transport Officer");
                                setIsEditable(false);
                                setIsDisableRes(true);
                                getJJobOwnerTransportHOD(item.JobOwner_ID, 2);
                                getVehicleNo();
                                setSelectIOUType("Vehicle No");


                            } else {

                                // console.log(" other");
                                setOwnerType("HOD");
                                setIsEditable(true);
                                setIsDisableRes(false);
                                getJJobOwnerTransportHOD(item.HOD, 3);
                                setSelectIOUType("Other");

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
                    {error.field === 'IOU' && (
                        <Text style={Style.error}>{error.message}</Text>
                    )}

                    <View style={{ flexDirection: 'row', }}>
                        <Text style={styles.bodyTextLeft}>
                            IOU Type
                        </Text>
                    </View>

                    <InputText
                        placeholderColor={ComStyles.COLORS.HEADER_BLACK}
                        placeholder="IOU Type"
                        stateValue={selectIOUType}
                        setState={(val: any) => setSelectIOUType(val)}
                        editable={false}
                        style={ComStyles.IOUInput}
                    />
                    {/* 
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
                        disable={true}
                        maxHeight={300}
                        labelField="Description"
                        valueField="Description"
                        placeholder={!isFocus ? 'IOU Type' : '...'}
                        searchPlaceholder="Search Type"
                        value={selectIOUType}
                        onFocus={() => setIsFocus(true)}
                        onBlur={() => setIsFocus(false)}
                        onChange={item => {

                            setIOUTypeID(item.IOUType_ID);
                            setSelectIOUType(item.Description);


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
                    /> */}
                    {error.field === 'IOUTypeID' && (
                        <Text style={Style.error}>{error.message}</Text>
                    )}

                    <View style={{ flexDirection: 'row', }}>
                        <Text style={styles.bodyTextLeft}>
                            {ownerType}
                        </Text>
                    </View>

                    <InputText
                        placeholderColor={ComStyles.COLORS.HEADER_BLACK}
                        placeholder={ownerType}
                        stateValue={selectJobOwner}
                        setState={(val: any) => setSelectJobOwner(val)}
                        editable={false}
                        style={ComStyles.IOUInput}
                    />

                    {/* <Dropdown
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
                        disable={true}
                        labelField="Name"
                        valueField="Name"
                        placeholder={!isFocus ? 'Job Owner' : '...'}
                        searchPlaceholder="Search Owner"
                        value={selectJobOwner}
                        onFocus={() => setIsFocus(true)}
                        onBlur={() => setIsFocus(false)}
                        onChange={item => {

                            setSelectJobOwner(item.Name);
                            setJobOwner(item.JobOwner_ID);


                            setIsFocus(false);
                            getCostCenter(item.JobOwner_ID, IOUTypeID);

                        }}
                        renderLeftIcon={() => (
                            <AntDesign
                                style={Style.icon}
                                color={isFocus ? 'blue' : 'black'}
                                name="Safety"
                                size={15}
                            />
                        )}
                    /> */}
                    {error.field === 'JobOwner' && (
                        <Text style={Style.error}>{error.message}</Text>
                    )}

                    <View style={{ flexDirection: 'row', }}>
                        <Text style={styles.bodyTextLeft}>
                            Employee
                        </Text>
                    </View>

                    <InputText
                        placeholderColor={ComStyles.COLORS.HEADER_BLACK}
                        placeholder="Employee"
                        stateValue={selectEmployee}
                        setState={(val: any) => setSelectEmployee(val)}
                        editable={false}
                        style={ComStyles.IOUInput}
                    />

                    {/* <Dropdown
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
                        maxHeight={300}
                        disable={true}
                        labelField="UserName"
                        valueField="UserName"
                        placeholder={!isFocus ? 'Employee ' : '...'}
                        searchPlaceholder="Search Employee"
                        value={selectEmployee}
                        onFocus={() => setIsFocus(true)}
                        onBlur={() => setIsFocus(false)}
                        onChange={item => {

                            setEmpID(item.USER_ID);
                            setSelectEmployee(item.UserName)

                            setIsFocus(false);
                            getJobNo(selectJobOwner);
                            getCostCenter(selectJobOwner, IOUTypeID);
                        }}
                        renderLeftIcon={() => (
                            <AntDesign
                                style={Style.icon}
                                color={isFocus ? 'blue' : 'black'}
                                name="Safety"
                                size={15}
                            />
                        )}
                    /> */}
                    {error.field === 'EmpName' && (
                        <Text style={Style.error}>{error.message}</Text>
                    )}



                    {/* <InputText
                        placeholderColor={ComStyles.COLORS.HEADER_BLACK}
                        placeholder="Employee No"
                        // stateValue={createBy}
                        editable={false}
                        style={ComStyles.IOUInput}
                    /> */}

                    {/* <AddAnotherJob /> */}
                    <View>

                        <ScrollView horizontal={true}>

                            <FlatList
                                //nestedScrollEnabled={true}
                                data={ioujoblist}
                                style={{ width: '100%' }}
                                //horizontal={false}
                                renderItem={({ item }) => {
                                    return (
                                        <View style={{ width: width - 30, padding: 5 }}>

                                            <NewJobsView
                                                IOU_Type={IOUTypeID}
                                                amount={item.Requested_Amount}
                                                IOUTypeNo={item.IOUTypeNo}
                                                ExpenseType={item.ExpenseType}
                                                jobremarks={item.Remark}
                                                accNo={item.AccNo}
                                                costCenter={item.CostCenter}
                                                resource={item.Resource}
                                                isEdit={item.IstoEdit == "1" ? true : false}
                                                onPressIcon={() => editJobs(item._Id)}
                                                settlementAmount={item.Amount}
                                                isSettlementAmount={true}
                                                isDelete={item.IstoEdit == "0" ? true : false}
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

                    <View style={ComStyles.separateLine} />



                </View>

                <ActionButton
                    is_icon={true}
                    iconColor={ComStyles.COLORS.WHITE}
                    icon_name="plus"
                    title="Add Details"
                    onPress={() => addjob()} />
                <View style={ComStyles.separateLine} />
                {/* 
                <View>

                    <ScrollView horizontal={true}>

                        <FlatList
                            //nestedScrollEnabled={true}
                            data={joblist}

                            //horizontal={false}
                            renderItem={({ item }) => {
                                return (
                                    <View>

                                        <NewJobsView
                                            IOU_Type={IOUTypeID}
                                            amount={item.Amount}
                                            IOUTypeNo={item.IOUTypeNo}
                                            ExpenseType={item.ExpenseType == 1 ? "Meals" : (item.ExpenseType == 2 ? "Batta" : (item.ExpenseType == 3 ? "Labour" : (item.ExpenseType == 4 ? "Project Materials" : (item.ExpenseType == 5 ? "Travelling" : (item.ExpenseType == 6 ? "Other" : "")))))}
                                            jobremarks={item.Remark}
                                            accNo={item.AccNo}
                                            costCenter={item.CostCenter}
                                            resource={item.Resource}
                                            isEdit={false}


                                        />






                                    </View>
                                )
                            }

                            }
                            keyExtractor={item => `${item.Job_ID}`}
                        />




                    </ScrollView>


                </View> */}


                {/* <View style={ComStyles.separateLine} /> */}

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
                    {/* <Image style={{height:70, width:70, justifyContent: 'space-between'}} source={{uri: galleryPhoto}} />
                    <Image style={{height:70, width:70, }} source={{uri: cameraPhoto}} />
                    <Image style={{height:70, width:70, }} source={{uri: cameraPhoto}} />
                     */}

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


            <Modal isVisible={isModalVisible} style={{ backgroundColor: ComponentsStyles.COLORS.WHITE, borderRadius: 10 }}>


                <View style={{ flexDirection: 'row', marginTop: 5, marginBottom: 8, marginLeft: 5, marginRight: 5 }}>

                    <ScrollView>




                    </ScrollView>
                </View>
            </Modal>

        </SafeAreaView>

    );

}
export default NewIOUSettlement;

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
        color: ComStyles.COLORS.ICON_BLUE,
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
    selectedTextStyle2: {
        fontFamily: ComStyles.FONT_FAMILY.BOLD,
        fontSize: 20,
        color: ComStyles.COLORS.ICON_BLUE,
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
    }

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
    bodyTextLeft: {
        color: ComponentsStyles.COLORS.SERVISE_HEADER_ASH,
        fontFamily: ComponentsStyles.FONT_FAMILY.REGULAR,
        fontSize: 14,
        flex: 1
    },
})