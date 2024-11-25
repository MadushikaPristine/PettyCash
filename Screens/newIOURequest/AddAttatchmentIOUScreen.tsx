import { useEffect, useState } from "react";
import { Alert, FlatList, Image, SafeAreaView, TouchableOpacity, View } from "react-native";
import DropdownAlert, { DropdownAlertData, DropdownAlertType } from "react-native-dropdownalert";
import { launchCamera } from "react-native-image-picker";
import ComStyles from "../../Constant/Components.styles";
import Header from "../../Components/Header";
import Spinner from "react-native-loading-spinner-overlay";
import ComponentsStyles from "../../Constant/Components.styles";
import ActionButton from "../../Components/ActionButton";
import style from './IOUStyle';
import IconMC from 'react-native-vector-icons/MaterialCommunityIcons';
import { Conection_Checking } from "../../Constant/InternetConection_Checking";
import moment from "moment";
import { saveIOU, updateIDwithStatus } from "../../SQLiteDBAction/Controllers/IOUController";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AsyncStorageConstants from "../../Constant/AsyncStorageConstants";
import { saveIOUJOB, updateIOUDetailLineSyncStatus } from "../../SQLiteDBAction/Controllers/IOUJobController";
import { saveAttachments } from "../../SQLiteDBAction/Controllers/AttachmentController";
import { BASE_URL, DB_LIVE, headers } from "../../Constant/ApiConstants";
import { logger, saveJsonObject_To_Loog } from "../../Constant/Logger";
import axios from "axios";
let alert = (_data: DropdownAlertData) => new Promise<DropdownAlertData>(res => res);
const AddAttatchmentIOUScreen = (props: any) => {
    const { navigation, route } = props;
    const [IOUData, setIOUData] = useState(route.params?.ioudataSet || {});
    const [IOUJobData, setIOUJobData] = useState(route.params?.IOUJobdataSet || []);
    const [IOUAttachments, setIOUAttachments] = useState(route.params?.IOUAttachmentSet || []);
    const [loading, setLoading] = useState(false);
    const back = () => {
        navigation.navigate('CreateNewIOUScreen', { ioudataSet: IOUData, IOUJobdataSet: IOUJobData, IOUAttachmentSet: IOUAttachments });
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
    const captureImage = () => {
        try {
            launchCamera({ mediaType: 'photo', includeBase64: true, quality: 0.5 }, response => {
                if (response.assets) {
                    const newImage = {
                        uri: response.assets[0].uri,
                        base64: response.assets[0].base64,
                    };
                    setIOUAttachments((prevImages: any) => [...prevImages, newImage]);
                }
            });
        } catch (error) {
            showErrorAlert('Failed', 'Camera permission denied');
            // console.log('Camera permission denied');
        }
    };
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
    const removeImage = async (index: any) => {
        try {
            setIOUAttachments((prevImages: any[]) => prevImages.filter((_, i) => i !== index));
            showSuccessAlert('Success', 'Image Deleted Successfully...');
        } catch (error) {

        }
    };
    const deletePermission = (key: any) => {
        Alert.alert('Delete Data !', 'Are you sure delete detail ?', [
            {
                text: 'No',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            { text: 'Yes', onPress: () => removeImage(key) },
        ]);
    }
    const viewAlertNavigate = () => {
        setTimeout(() => {
            setLoading(false);
            navigation.navigate('PendingList');
        }, 1000);
    }
    const UploadRequestData = () => {
        try {
            const URL = BASE_URL + '/Mob_PostIOURequests.xsjs?dbName=' + DB_LIVE;
            var currentDate = moment(new Date()).utcOffset('+05:30').format('YYYY-MM-DDTHH:mm:ss');
            var loggerDate = "Date - " + moment().utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss') + "+++++++++++++  Upload IOU  ++++++++++++++++";
            logger(loggerDate, "   *******   ");

            var obj: any[] = [];
            var Fileobj: any = [];
            IOUJobData.forEach((element: any) => {
                let requestAmount = element.arr.requestAmount?.value+"";
                let isDecimal = requestAmount.indexOf(".");
                let decimalAmount = 0.0;
                if (isDecimal != -1) {
                    const splitAmount = requestAmount.split(".");
                    decimalAmount = parseFloat(splitAmount[0].replaceAll(',', '') + "." + splitAmount[1]);
                } else {
                    decimalAmount = parseFloat(requestAmount.replaceAll(',', ''));
                }
                const arr = {
                    "IOUTypeID": IOUData.IOUType?.Id,
                    "IOUTypeNo": IOUData.IOUType?.Id == 1 ? element.arr.SelectJobVehicle?.value : "",
                    "ExpenseType": element.arr.ExpenseType?.Id,
                    "Amount": decimalAmount,
                    "Remark": element.arr.remark?.value || '',
                    "AccNo": element.arr.GLAccount?.value,
                    "CostCenter": element.arr.CostCenter?.value || '',
                    "Resource": element.arr.Resource?.value || ''
                }
                obj.push(arr);
            });
            if (IOUAttachments.length > 0) {
                IOUAttachments.forEach(async (elementI: any) => {
                    const arr = {
                        "IOUTypeNo": IOUData.IOUType?.Id,
                        "FileName": elementI.uri,
                        "File": elementI.base64,
                        "FileType": "image/jpeg"
                    }
                    Fileobj.push(arr);
                })
            }
            const prams = {
                "PettycashID": IOUData.IOUNo?.value,
                "RequestedBy": IOUData.UserID?.value,
                "ReqChannel": "Mobile",
                "Date": currentDate,
                "EmpNo": IOUData.employee?.Id,
                "IOUtype": IOUData.IOUType?.Id,
                "JobOwner": IOUData.JobOwner?.Id,
                "CreateAt": currentDate,
                "TotalAmount": IOUData.totAmount?.value,
                "IOUTypeDetails": obj,
                "attachments": Fileobj,
                "Hod": IOUData.LoggerUserHOD?.value || '',
                "RIsLimit": IOUData.IsLimit?.value || null,
                "RIouLimit": IOUData.IOULimit?.value || null
            }
            saveJsonObject_To_Loog(prams);
            console.log("IOU UPLOAD JSON ====   ", prams, '=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=--');

            axios.post(URL, prams, {
                headers: headers
            }).then((response) => {
                saveJsonObject_To_Loog(response.data);
                if (response.status == 200) {
                    logger(" IOU Upload Success status", "");
                    saveJsonObject_To_Loog(response.data);
                    console.log("success ======= ", response.data);
                    if (response.data.ErrorId == 0) {
                        // console.log("success ===222==== ", response.data);
                        updateIDwithStatus(IOUData.IOUNo?.value, response.data.ID, (resp: any) => {
                            console.log(" update id after sync ====  ", resp);
                            if (resp === 'success') {
                                updateIOUDetailLineSyncStatus(IOUData.IOUNo?.value, (resp1: any) => {
                                });
                            }
                        });
                        showSuccessAlert('Sync Success', response.data.Message);
                        viewAlertNavigate();

                    } else {
                        showErrorAlert('Sync Failed', response.data.Message);
                        viewAlertNavigate();
                    }
                } else {
                    // console.log(" response code ======= ", response.status);
                    logger(" IOU Upload ERROR ", "");
                    saveJsonObject_To_Loog(response.data);
                    showErrorAlert('Sync Failed', "IOU Request Failed!");
                    viewAlertNavigate();
                }
            }).catch((error) => {
                // console.log("error .....   ", error);
                logger(" IOU Upload ERROR ", "");
                saveJsonObject_To_Loog(error);
                showErrorAlert('Sync Failed', "IOU Request Failed!");
                viewAlertNavigate();
            });
        } catch (error: any) {
            logger(" IOU Upload ERROR ", "");
            saveJsonObject_To_Loog(error);
            showErrorAlert('Sync Failed', "IOU Request Failed!");
            viewAlertNavigate();
        }
    }
    const saveAttachmentsDB = () => {
        try {
            IOUAttachments.forEach((element: any) => {
                const attachementData = [
                    {
                        PCRCode: IOUData.IOUNo?.value,
                        Img_url: element.uri,
                        Status: 1,
                    }
                ]
                saveAttachments(attachementData, async (response: any) => {
                    if (response == 3) {
                        console.log(" save attachmnets .. ", response);
                        UploadRequestData();
                    } else {
                    }
                })
            })
        } catch (error) {
        }
    }
    const saveJobData = (date: any) => {
        try {
            IOUJobData.forEach((element: any) => {
                let requestAmount = element.arr.requestAmount?.value;
                let isDecimal = requestAmount.indexOf(".");
                let decimalAmount = 0.0;
                if (isDecimal != -1) {
                    const splitAmount = requestAmount.split(".");
                    decimalAmount = parseFloat(splitAmount[0].replaceAll(',', '') + "." + splitAmount[1]);
                } else {
                    decimalAmount = parseFloat(requestAmount.replaceAll(',', ''));
                }
                const saveObject = [
                    {
                        Job_ID: element.arr.jobNo?.value,
                        IOUTypeNo: element.arr.SelectJobVehicle?.value,
                        JobOwner_ID: IOUData.JobOwner?.Id,
                        PCRCode: IOUData.IOUNo?.value,
                        AccNo: element.arr.GLAccount?.value,
                        CostCenter: element.arr.CostCenter?.value || '',
                        Resource: element.arr.Resource?.value || '',
                        ExpenseType: element.arr.ExpenseType?.Id,
                        Amount: decimalAmount,
                        Remark: element.arr.remark?.value || '',
                        CreateAt: date,
                        RequestedBy: IOUData.UserID?.value,
                        IsSync: 0
                    }]
                saveIOUJOB(saveObject, 0, async (response: any) => {
                    console.log(" save job .. ", response);
                    if (response == 3) {
                        if (IOUAttachments.length > 0) {
                            saveAttachmentsDB();
                        } else {
                            UploadRequestData();
                        }
                    } else {
                    }
                });
            });
        } catch (error) {
        }
    }
    const saveSubmit = () => {
        try {
            setLoading(true);
            console.log(" main data - savee----------  ", IOUData);
            var currentDate = moment(new Date()).utcOffset('+05:30').format('YYYY-MM-DDTHH:mm:ss');
            let arrObj = [
                {
                    PCRCode: IOUData.IOUNo?.value,
                    JobOwner: IOUData.JobOwner?.Id,
                    IOUType: IOUData.IOUType?.Id,
                    EmployeeNo: IOUData.employee?.Id,
                    RequestedDate: currentDate,
                    Amount: IOUData.totAmount?.value,
                    StatusID: 1,
                    RequestedBy: IOUData.UserID?.value,
                    IsSync: 0,
                    REMARK: "",
                    Reject_Remark: "",
                    Attachment_Status: 1,
                    HOD: IOUData.LoggerUserHOD?.value || '',
                    FirstActionBy: '',
                    FirstActionAt: '',
                    RIsLimit: IOUData.IsLimit?.value || null,
                    AIsLimit: null,
                    RIouLimit: IOUData.IOULimit?.value || null,
                    AIouLimit: '',
                    SecondActionBy: '',
                    SecondActionAt: '',
                    FStatus: 0,
                }
            ]
            console.log(" save object iou -----   ", arrObj);
            Conection_Checking(async (res: any) => {
                if (res != false) {
                    saveIOU(arrObj, 0, async (Response: any) => {
                        if (Response == 3) {
                            console.log(" view alert ......  ");
                            saveJobData(currentDate);
                            await AsyncStorage.setItem(AsyncStorageConstants.ASYNC_CURRENT_PENDING_LIST_TYPE, "IOU");
                            AsyncStorage.setItem(AsyncStorageConstants.ASYNC_STORAGE_IS_COPY, "false");
                            await AsyncStorage.setItem(AsyncStorageConstants.ASYNC_STORAGE_Is_inprogressIOU, "false");
                        } else {
                            showErrorAlert('Failed', "IOU Request Failed!");
                        }
                    })
                } else {
                    showErrorAlert('Sync Failed', "Please Check your internet connection");
                }
            });
        } catch (error) {
            setLoading(false);
        }
    }
    const checkLimit = () => {
        try {
            console.log(" main data -----------  ", IOUData);
            if (IOUData.totAmount?.value < IOUData.CreateRequestLimit?.value) {
                if (IOUData.IOUType?.Id == 3) { // other type
                    handleChange(null, null, "IsLimit")
                    handleChange('', null, "RIouLimit")
                    saveSubmit();
                } else if (IOUData.totAmount?.value > IOUData.IOULimit?.value) { // limit exceed
                    handleChange("YES", null, "IsLimit")
                    handleChange(IOUData.IOULimit?.value, null, "RIouLimit")
                    saveSubmit();
                } else { // limit not exceeded & job/vehicle type
                    handleChange(null, '', "LoggerUserHOD")
                    handleChange("NO", null, "IsLimit")
                    handleChange(IOUData.IOULimit?.value, null, "RIouLimit")
                    saveSubmit();
                }
            } else {
                showErrorAlert('Error', 'The requested amount has exceeded the limit');
            }
        } catch (error) {

        }
    }
    const Save = async () => {
        try {
                if (IOUJobData.length > 0) {
                    Alert.alert('Submit', 'Are you sure save this IOU request ?', [
                        {
                            text: 'No',
                            onPress: () => console.log('Cancel Pressed'),
                            style: 'cancel',
                        },
                        { text: 'Yes', onPress: () => checkLimit() },
                    ]);
                } else {
                    showErrorAlert('Error', 'Please Add Details');
                }
        } catch (error) {
        }
    }
    useEffect(() => {
        if (route.params?.IOUJobdataSet) {
            console.log(" settlement data ==========   " , route.params?.IOUJobdataSet);
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
    return (
        <SafeAreaView style={ComStyles.CONTAINER}>
            <Header title="Add Attachments" isBtn={true} btnOnPress={naviBack} />
            <DropdownAlert alert={func => (alert = func)} alertPosition="top" />
            <Spinner
                visible={loading}
                textContent={'Saving...'}
                textStyle={{
                    color: ComponentsStyles.COLORS.DASH_COLOR,
                    fontFamily: ComponentsStyles.FONT_FAMILY.SEMI_BOLD,
                    fontSize: 15
                }}
            />
            <View style={ComStyles.CONTENT}>
                <View style={{ padding: 15 }} />
                <View style={{ padding: 10 }}>
                    <ActionButton
                        title="Capture Image"
                        onPress={() => captureImage()}
                    />
                </View>
                <FlatList
                    data={IOUAttachments}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => (
                        <View style={style.flatListContent}>
                            <Image source={{ uri: item.uri }} style={style.image} />
                            <TouchableOpacity style={style.iconView} onPress={() => deletePermission(index)} >
                                <IconMC name='delete-forever' size={35} color={ComponentsStyles.COLORS.RED_COLOR} iconStyle={style.iconStyle} />
                            </TouchableOpacity>
                        </View>
                    )}
                />
                <View style={{ padding: 5 }}>
                    <ActionButton
                        title="Submit Request"
                        onPress={() => Save()}
                    />
                </View>
            </View>
        </SafeAreaView>
    )
}
export default AddAttatchmentIOUScreen;