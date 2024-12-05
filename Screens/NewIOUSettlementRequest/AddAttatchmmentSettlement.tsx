import { Alert, FlatList, Image, SafeAreaView, TouchableOpacity, View } from "react-native";
import ComStyles from "../../Constant/Components.styles";
import Header from "../../Components/Header";
import DropdownAlert, { DropdownAlertData, DropdownAlertType } from "react-native-dropdownalert";
import Spinner from "react-native-loading-spinner-overlay";
import ComponentsStyles from "../../Constant/Components.styles";
import { useEffect, useState } from "react";
import ActionButton from "../../Components/ActionButton";
import { launchCamera } from "react-native-image-picker";
import IconMC from 'react-native-vector-icons/MaterialCommunityIcons';
import style from './IOUSetStyle';
import { Conection_Checking } from "../../Constant/InternetConection_Checking";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AsyncStorageConstants from "../../Constant/AsyncStorageConstants";
import moment from "moment";
import { saveIOUSettlement, updateIDwithStatusSET } from "../../SQLiteDBAction/Controllers/IouSettlementController";
import { saveIOUSETJOB, updateSettlementDetailLineSyncStatus } from "../../SQLiteDBAction/Controllers/IOUSettlementJobController";
import { saveAttachments } from "../../SQLiteDBAction/Controllers/AttachmentController";
import { logger, saveJsonObject_To_Loog } from "../../Constant/Logger";
import { BASE_URL, DB_LIVE, headers } from "../../Constant/ApiConstants";
import axios from "axios";
import { requestCameraPermission } from "../../Constant/CameraPermission";
import RNFS from 'react-native-fs';
let alert = (_data: DropdownAlertData) => new Promise<DropdownAlertData>(res => res);
const AddAttatchmmentSettlement = (props: any) => {
    const [loading, setLoading] = useState(false);
    const { navigation, route } = props;
    const [IOUSettlementData, setIOUSettlementData] = useState(route.params?.iouSetdataSet || {});
    const [IOUSettlementJobData, setIOUSettlementJobData] = useState(route.params?.IOUSetJobdataSet || []);
    const [IOUSettlementAttachments, setIOUSettlementAttachments] = useState(route.params?.IOUSetAttachmentSet || []);
    const back = () => {
        navigation.navigate('CreateNewIOUSettlementScreen', { iouSetdataSet: IOUSettlementData, IOUSetJobdataSet: IOUSettlementJobData, IOUSetAttachmentSet: IOUSettlementAttachments });
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
    const captureImage = async () => {
        const hasPermission = await requestCameraPermission();
        if (!hasPermission) {
            showErrorAlert('Permission Denied', 'Camera access is required to capture photos.');
            return;
        }
        try {
            launchCamera({ mediaType: 'photo', includeBase64: true, quality: 0.5 }, response => {
                if (response?.assets) {
                    const newImage = {
                        uri: response.assets[0].uri,
                    };
                    setIOUSettlementAttachments((prevImages: any) => [...prevImages, newImage]);
                } else {
                    showErrorAlert('No Image Captured', 'Please try again.');
                }
            });
        } catch (error) {
            console.error("Error capturing image: ", error);
            showErrorAlert('Failed', 'An unexpected error occurred.');
        }
    };
    // const captureImage = () => {
    //     try {
    //         launchCamera({ mediaType: 'photo', includeBase64: true, quality: 0.5 }, response => {
    //             if (response.assets) {
    //                 const newImage = {
    //                     uri: response.assets[0].uri,
    //                     base64: response.assets[0].base64,
    //                 };
    //                 setIOUSettlementAttachments((prevImages: any) => [...prevImages, newImage]);
    //             }
    //         });
    //     } catch (error) {
    //         showErrorAlert('Failed', 'Camera permission denied');
    //     }
    // };
    const removeImage = async (index: any) => {
        try {
            setIOUSettlementAttachments((prevImages: any[]) => prevImages.filter((_, i) => i !== index));
            showSuccessAlert('Success', 'Image Deleted Successfully...');
        } catch (error) {

        }
    };
    const handleChange = (value: any, Id: any, key: any) => {
        try {
            setIOUSettlementData((prevState: any) => ({
                ...prevState, [key]: { value, Id }
            }));
        } catch (error) {
        }
    }
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
            setIOUSettlementData([]);
            setIOUSettlementJobData([]);
            setIOUSettlementAttachments([]);
            navigation.navigate('PendingList');
        }, 1000);
    }
    const UploadRequestData = () => {
        try {
            console.log(" upload function -----------");

            const URL = BASE_URL + '/Mob_PostIOUSettlements.xsjs?dbName=' + DB_LIVE;
            var currentDate = moment(new Date()).utcOffset('+05:30').format('YYYY-MM-DDTHH:mm:ss');
            var loggerDate = "Date - " + moment().utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss') + "+++++++++++++   Upload IOU SETTLEMENT  ++++++++++++++++";
            logger(loggerDate, "   *******   ");

            var obj: any[] = [];
            var Fileobj: any = [];
            IOUSettlementJobData.forEach((element: any) => {
                const parseAmount = (amount: any) => {
                    if (!amount) return 0.0; // Default to 0.0 if the amount is empty or undefined

                    const isDecimal = amount.indexOf(".") !== -1;
                    if (isDecimal) {
                        const [integerPart, decimalPart] = amount.split(".");
                        return parseFloat(
                            (integerPart?.replaceAll(',', '') || '0') + "." + (decimalPart || '0')
                        );
                    } else {
                        return parseFloat(amount.replaceAll(',', '') || '0');
                    }
                };

                let requestAmount = element.arr?.RequestedAmount + "" || '';
                let Amount = element.arr?.Amount + "" || '';

                let decimalAmount = parseAmount(requestAmount);
                let decimalSAmount = parseAmount(Amount);
                const arr = {
                    "IOUTypeID": IOUSettlementData.IOUType?.Id,
                    "IOUTypeNo": element.arr.IOUTypeNo || '',
                    "ExpenseType": element.arr.ExpenseTypeID,
                    "Amount": decimalSAmount,
                    "Remark": element.arr.Remark || '',
                    "AccNo": element.arr.AccNo,
                    "CostCenter": element.arr.CostCenter || '',
                    "Resource": element.arr.Resource || ''
                }
                obj.push(arr);
            });

            IOUSettlementAttachments.forEach(async (elementI: any) => {
                const base64String = await RNFS.readFile(elementI.uri, 'base64');
                const arr = {
                    "IOUTypeNo": IOUSettlementData.IOUType?.Id,
                    "FileName": elementI.uri,
                    "File": base64String,
                    "FileType": "image/jpeg"
                }
                Fileobj.push(arr);
            })
            const prams = {
                "IOUSetID": IOUSettlementData.IOUSetNo?.value,
                "RequestedBy": IOUSettlementData.UserID?.value,
                "ReqChannel": "Mobile",
                "Date": currentDate,
                "IOUtype": IOUSettlementData.IOUType?.value,
                "IOUTypeID": IOUSettlementData.IOUType?.Id,
                "CreateAt": currentDate,
                "JobOwner": IOUSettlementData.JobOwner?.Id,
                "IOU": IOUSettlementData.IOUNO?.Id,
                "TotalAmount": IOUSettlementData.totAmount?.value,
                "EmployeeNo": IOUSettlementData.employee?.Id,
                "IOUTypeDetails": obj,
                "attachments": Fileobj,
                "Hod": IOUSettlementData.LoggerUserHOD?.value || '',
                "RIsLimit": IOUSettlementData.IsLimit?.value || null,
                "RIouLimit": IOUSettlementData.IOULimit?.value || null
            }
            saveJsonObject_To_Loog(prams);
            console.log("IOU SET UPLOAD JSON ====   ", prams, '=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=--');

            axios.post(URL, prams, {
                headers: headers
            }).then((response) => {
                // console.log("[s][t][a][t][u][s][]", response.status);
                console.log("[s][t][a][t][u][s][] IOU SET reponse METHOD   ........  ", response.data);
                // logger(" One-Off Upload Response Status ", response.status + "");
                saveJsonObject_To_Loog(response.data);
                if (response.status == 200) {
                    logger("  IOU SETTLEMENT Upload Response Status", "");
                    saveJsonObject_To_Loog(response.data);
                    // console.log("success ======= ", response.statusText);
                    if (response.data.ErrorId == 0) {
                        // console.log("success ===222==== ", response.data);
                        updateIDwithStatusSET(IOUSettlementData.IOUSetNo?.value, response.data.ID, (resp: any) => {
                            console.log(" update id after sync ====  ", resp);
                            if (resp === 'success') {
                                updateSettlementDetailLineSyncStatus(IOUSettlementData.IOUSetNo?.value, (resp1: any) => {
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
                    console.log(" response code ======= ", response.status);
                    logger(" IOU SET Upload ERROR ", "");
                    saveJsonObject_To_Loog(response.data);
                    showErrorAlert('Sync Failed', "IOU Settlement Request Failed!");
                    viewAlertNavigate();
                }
            }).catch((error) => {
                console.log("error .....   ", error);
                logger(" IOU SET Upload ERROR ", "");
                saveJsonObject_To_Loog(error);
                showErrorAlert('Sync Failed', "IOU Settlement Request Failed!");
                viewAlertNavigate();
            });
        } catch (error: any) {
            console.log("failed in catch --------- ", error);

            logger(" IOU SET Upload ERROR ", "");
            saveJsonObject_To_Loog(error);
            showErrorAlert('Sync Failed', "IOU Settlement Request Failed!");
            viewAlertNavigate();
        }
    }
    const saveAttachmentsDB = () => {
        try {
            IOUSettlementAttachments.forEach((element: any, index: any) => {
                const attachementData = [
                    {
                        PCRCode: IOUSettlementData.IOUSetNo?.value,
                        Img_url: element.uri,
                        Status: 1,
                    }
                ]
                saveAttachments(attachementData, async (response: any) => {
                    if (response == 3) {
                        console.log(" save attachmnets .. ", response);
                        if (index === IOUSettlementAttachments.length - 1) {
                            UploadRequestData();
                        }
                    } else {
                    }
                })
            })
        } catch (error) {
        }
    }
    const saveJobData = (date: any) => {
        try {
            IOUSettlementJobData.forEach((element: any, index: any) => {
                console.log("all jobs --------- ", element.arr?.RequestedAmount);

                const parseAmount = (amount: any) => {
                    if (!amount) return 0.0; // Default to 0.0 if the amount is empty or undefined

                    const isDecimal = amount.indexOf(".") !== -1;
                    if (isDecimal) {
                        const [integerPart, decimalPart] = amount.split(".");
                        return parseFloat(
                            (integerPart?.replaceAll(',', '') || '0') + "." + (decimalPart || '0')
                        );
                    } else {
                        return parseFloat(amount.replaceAll(',', '') || '0');
                    }
                };

                let requestAmount = element.arr?.RequestedAmount + "" || '';
                let Amount = element.arr?.Amount + "" || '';

                let decimalAmount = parseAmount(requestAmount);
                let decimalSAmount = parseAmount(Amount);

                const saveObject = [
                    {
                        Job_ID: element.arr.Job_ID,
                        IOUTypeNo: element.arr.IOUTypeNo || "",
                        JobOwner_ID: IOUSettlementData.JobOwner?.Id,
                        PCRCode: IOUSettlementData.IOUSetNo?.value,
                        AccNo: element.arr.AccNo,
                        CostCenter: element.arr.CostCenter || '',
                        Resource: element.arr.Resource || '',
                        ExpenseType: element.arr.ExpenseTypeID,
                        Amount: decimalSAmount,
                        Remark: element.arr.Remark || '',
                        CreateAt: date,
                        RequestedBy: IOUSettlementData.UserID?.value,
                        IsSync: 0,
                        RequestedAmount: decimalAmount,
                        IOU_TYPEID: IOUSettlementData.IOUType?.Id,
                        IstoEdit: 0
                    }]
                saveIOUSETJOB(saveObject, 0, async (response: any) => {
                    console.log(" save job .. ", response);
                    if (response == 3) {
                        if (index === IOUSettlementJobData.length - 1) {
                            saveAttachmentsDB();
                        }
                    } else {
                    }
                });
            });
        } catch (error) {
            console.log(" job save error -----  ", error);
        }
    }
    const saveSubmit = () => {
        try {
            setLoading(true);
            console.log(" main data - savee----------  ", IOUSettlementData);
            var currentDate = moment(new Date()).utcOffset('+05:30').format('YYYY-MM-DDTHH:mm:ss');
            let arrObj = [
                {
                    PCRCode: IOUSettlementData.IOUSetNo?.value,
                    IOU: IOUSettlementData.IOUNO?.Id,
                    JobOwner: IOUSettlementData.JobOwner?.Id,
                    IOUType: IOUSettlementData.IOUType?.Id,
                    EmpId: IOUSettlementData.employee?.Id,
                    RequestedDate: currentDate,
                    Amount: IOUSettlementData.totAmount?.value,
                    StatusID: 1,
                    RequestedBy: IOUSettlementData.UserID?.value,
                    IsSync: 0,
                    REMARK: "",
                    Reject_Remark: "",
                    Attachment_Status: 1,
                    HOD: IOUSettlementData.LoggerUserHOD?.value || '',
                    FirstActionBy: '',
                    FirstActionAt: '',
                    RIsLimit: IOUSettlementData.IsLimit?.value || null,
                    AIsLimit: null,
                    RIouLimit: IOUSettlementData.IOULimit?.value || null,
                    AIouLimit: '',
                    SecondActionBy: '',
                    SecondActionAt: ''
                }
            ]
            console.log(" save object IOU SET -----   ", arrObj);
            Conection_Checking(async (res: any) => {
                if (res != false) {
                    saveIOUSettlement(arrObj, 0, async (Response: any) => {
                        if (Response == 3) {
                            console.log(" view alert ......  ");
                            saveJobData(currentDate);
                            await AsyncStorage.setItem(AsyncStorageConstants.ASYNC_CURRENT_PENDING_LIST_TYPE, "SETTLEMENT");
                            AsyncStorage.setItem(AsyncStorageConstants.ASYNC_STORAGE_IS_COPY, "false");
                            await AsyncStorage.setItem(AsyncStorageConstants.ASYNC_STORAGE_Is_inprogressIOUSettlement, "false");
                        } else {
                            showErrorAlert('Failed', "IOU Settlement Request Failed!");
                        }
                    })
                } else {
                    showErrorAlert('Sync Failed', "Please Check your internet connection");
                }
            });
        } catch (error) {
            setLoading(false);
            console.log("failed save ======== ");

        }
    }
    const checkLimit = () => {
        try {
            console.log(" main data -----------  ", IOUSettlementData);
            if (IOUSettlementData.IOUType?.Id == 3) { // other type
                handleChange(null, null, "IsLimit")
                handleChange(IOUSettlementData.IOULimit?.value, null, "RIouLimit")
                saveSubmit();
            } else if (IOUSettlementData.totAmount?.value > IOUSettlementData.IOULimit?.value) { // limit exceed
                handleChange("YES", null, "IsLimit")
                handleChange(IOUSettlementData.IOULimit?.value, null, "RIouLimit")
                saveSubmit();
            } else { // limit not exceeded & job/vehicle type
                handleChange(null, '', "LoggerUserHOD")
                handleChange("NO", null, "IsLimit")
                handleChange(IOUSettlementData.IOULimit?.value, null, "RIouLimit")
                saveSubmit();
            }
        } catch (error) {

        }
    }
    const Save = async () => {
        try {
            if (IOUSettlementAttachments.length > 0) {
                if (IOUSettlementJobData.length > 0) {
                    Alert.alert('Submit', 'Are you sure save this iou settlement ?', [
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
            } else {
                showErrorAlert('Error', 'Please Add Attachments');
            }
        } catch (error) {
        }
    }
    useEffect(() => {
        if (route.params?.IOUSetJobdataSet) {
            console.log("job data set -------  ", route.params?.IOUSetJobdataSet);

            setIOUSettlementJobData(route.params.IOUSetJobdataSet);
        }
    }, [route.params?.IOUSetJobdataSet]);
    useEffect(() => {
        if (route.params?.iouSetdataSet) {
            console.log(" ----------  ", route.params?.iouSetdataSet);

            setIOUSettlementData(route.params.iouSetdataSet);
        }
    }, [route.params?.iouSetdataSet]);
    useEffect(() => {
        if (route.params?.IOUSetAttachmentSet) {
            setIOUSettlementAttachments(route.params.IOUSetAttachmentSet);
        }
    }, [route.params?.IOUSetAttachmentSet]);
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
                    data={IOUSettlementAttachments}
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
export default AddAttatchmmentSettlement;