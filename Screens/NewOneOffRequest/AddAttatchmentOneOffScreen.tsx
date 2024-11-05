import { Alert, FlatList, Image, SafeAreaView, ScrollView, TouchableOpacity, View } from "react-native";
import DropdownAlert, { DropdownAlertData, DropdownAlertType } from "react-native-dropdownalert";
import ComStyles from "../../Constant/Components.styles";
import { useEffect, useState } from "react";
import ActionButton from "../../Components/ActionButton";
import Header from "../../Components/Header";
import { launchCamera } from "react-native-image-picker";
import style from './OneOffStyle';
import ComponentsStyles from "../../Constant/Components.styles";
import IconMC from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from "moment";
import { Conection_Checking } from "../../Constant/InternetConection_Checking";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AsyncStorageConstants from "../../Constant/AsyncStorageConstants";
import { saveOneOffSettlement, updateIDwithStatusOneOff } from "../../SQLiteDBAction/Controllers/OneOffSettlementController";
import { saveOneOffJOB, updateDetailLineSyncStatus } from "../../SQLiteDBAction/Controllers/OneOffJobController";
import { saveAttachments } from "../../SQLiteDBAction/Controllers/AttachmentController";
import { BASE_URL, DB_LIVE, headers } from "../../Constant/ApiConstants";
import { logger, saveJsonObject_To_Loog } from "../../Constant/Logger";
import Spinner from "react-native-loading-spinner-overlay";
import RNFS from 'react-native-fs';
import axios from "axios";
let alert = (_data: DropdownAlertData) => new Promise<DropdownAlertData>(res => res);
const AddAttatchmentOneOffScreen = (props: any) => {
    const { navigation, route } = props;
    const [OneOffData, setOneOffData] = useState(route.params?.OneOffdataSet || []);
    const [OneOffJobData, setOneOffJobData] = useState(route.params?.OneOffJobdataSet || []);
    const [OneOffAttachments, setOneOffAttachments] = useState(route.params?.OneOffAttachmentSet || []);
    const [loading, setLoading] = useState(false);
    const back = () => {
        navigation.navigate('NewOneOffScreen', { OneOffdataSet: OneOffData, OneOffJobdataSet: OneOffJobData, OneOffAttachmentSet: OneOffAttachments });
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
    const captureImage = () => {
        try {
            launchCamera({ mediaType: 'photo', includeBase64: true, quality: 0.5 }, response => {
                if (response.assets) {
                    const newImage = {
                        uri: response.assets[0].uri,
                        base64: response.assets[0].base64,
                    };
                    setOneOffAttachments((prevImages: any) => [...prevImages, newImage]);
                }
            });
        } catch (error) {

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
    const handleChange = (value: any, Id: any, key: any) => {
        try {
            setOneOffData((prevState: any) => ({
                ...prevState, [key]: { value, Id }
            }));
        } catch (error) {
        }
    }
    const UploadRequestData = () => {
        try {
            const URL = BASE_URL + '/Mob_PostOneOffSettlements.xsjs?dbName=' + DB_LIVE;
            var currentDate = moment(new Date()).utcOffset('+05:30').format('YYYY-MM-DDTHH:mm:ss');
            var loggerDate = "Date - " + moment().utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss') + "+++++++++++++  Upload One-Off Settlement  ++++++++++++++++";
            logger(loggerDate, "   *******   ");

            var obj: any[] = [];
            var Fileobj: any = [];
            OneOffJobData.forEach((element: any) => {
                let requestAmount = element.arr.requestAmount?.value;
                let isDecimal = requestAmount.indexOf(".");
                let decimalAmount = 0.0;
                if (isDecimal != -1) {
                    const splitAmount = requestAmount.split(".");
                    decimalAmount = parseFloat(splitAmount[0].replaceAll(',', '') + "." + splitAmount[1]);
                } else {
                    decimalAmount = parseFloat(requestAmount.replaceAll(',', ''));
                }
                const arr = {
                    "IOUTypeID": OneOffData.IOUType?.Id,
                    "IOUTypeNo": OneOffData.IOUType?.Id == 1 ? element.arr.SelectJobVehicle?.value : "",
                    "ExpenseType": element.arr.ExpenseType?.Id,
                    "Amount": decimalAmount,
                    "Remark": element.arr.remark?.value || '',
                    "ID": 2,
                    "AccNo": element.arr.GLAccount?.value,
                    "CostCenter": element.arr.CostCenter?.value || '',
                    "Resource": element.arr.Resource?.value || ''
                }
                obj.push(arr);
            });

            OneOffAttachments.forEach(async (elementI: any) => {
                const arr = {
                    "IOUTypeNo": OneOffData.IOUType?.Id,
                    "FileName": elementI.uri,
                    "File": elementI.base64,
                    "FileType": "image/jpeg"
                }
                Fileobj.push(arr);
            })

            const prams = {
                "OneOffID": OneOffData.OneOffNo?.value,
                "RequestedBy": OneOffData.UserID?.value,
                "ReqChannel": "Mobile",
                "Date": currentDate,
                "IOUtype": OneOffData.IOUType?.Id,
                "JobOwner": OneOffData.JobOwner?.Id,
                "CreateAt": currentDate,
                "TotalAmount": OneOffData.totAmount?.value,
                "IOUTypeDetails": obj,
                "attachments": Fileobj,
                "Hod": OneOffData.LoggerUserHOD?.value || '',
                "RIsLimit": OneOffData.IsLimit?.value || null,
                "RIouLimit": OneOffData.IOULimit?.value || null
            }
            saveJsonObject_To_Loog(prams);
            console.log("ONE OFF UPLOAD JSON ====   ", prams, '=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=--');

            axios.post(URL, prams, {
                headers: headers
            }).then((response) => {
                // console.log("[s][t][a][t][u][s][]", response.status);
                // console.log("[s][t][a][t][u][s][] one off reponse METHOD   ........  ", response.data);
                // logger(" One-Off Upload Response Status ", response.status + "");
                saveJsonObject_To_Loog(response.data);
                if (response.status == 200) {
                    logger(" One-Off Upload Success status", "");
                    saveJsonObject_To_Loog(response.data);
                    // console.log("success ======= ", response.statusText);
                    if (response.data.ErrorId == 0) {
                        // console.log("success ===222==== ", response.data);
                        updateIDwithStatusOneOff(OneOffData.OneOffNo?.value, response.data.ID, (resp: any) => {
                            console.log(" update id after sync ====  ", resp);
                            if (resp === 'success') {
                                updateDetailLineSyncStatus(OneOffData.OneOffNo?.value, (resp1: any) => {
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
                    logger(" One-Off Upload ERROR ", "");
                    saveJsonObject_To_Loog(response.data);
                    showErrorAlert('Sync Failed', "One-Off Settlement Request Failed!");
                    viewAlertNavigate();
                }
            }).catch((error) => {
                // console.log("error .....   ", error);
                logger(" One-Off Upload ERROR ", "");
                saveJsonObject_To_Loog(error);
                showErrorAlert('Sync Failed', "One-Off Settlement Request Failed!");
                viewAlertNavigate();
            });
        } catch (error: any) {
            logger(" One-Off Upload ERROR ", "");
            saveJsonObject_To_Loog(error);
            showErrorAlert('Sync Failed', "One-Off Settlement Request Failed!");
            viewAlertNavigate();
        }
    }
    const saveAttachmentsDB = () => {
        try {
            OneOffAttachments.forEach((element: any) => {
                const attachementData = [
                    {
                        PCRCode: OneOffData.OneOffNo?.value,
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
    const viewAlertNavigate = () => {
        setTimeout(() => {
            setLoading(false);
            navigation.navigate('PendingList');
        }, 1000);
    }
    const saveJobData = (date: any) => {
        try {
            OneOffJobData.forEach((element: any) => {
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
                        JobOwner_ID: OneOffData.JobOwner?.Id,
                        PCRCode: OneOffData.OneOffNo?.value,
                        AccNo: element.arr.GLAccount?.value,
                        CostCenter: element.arr.CostCenter?.value || '',
                        Resource: element.arr.Resource?.value || '',
                        ExpenseType: element.arr.ExpenseType?.Id,
                        Amount: decimalAmount,
                        Remark: element.arr.remark?.value || '',
                        CreateAt: date,
                        RequestedBy: OneOffData.UserID?.value,
                        IsSync: 0
                    }]
                saveOneOffJOB(saveObject, 0, async (response: any) => {
                    console.log(" save job .. ", response);
                    if (response == 3) {
                        saveAttachmentsDB();
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
            console.log(" main data - savee----------  ", OneOffData);
            var currentDate = moment(new Date()).utcOffset('+05:30').format('YYYY-MM-DDTHH:mm:ss');
            let arrObj = [
                {
                    PCRCode: OneOffData.OneOffNo?.value,
                    JobOwner: OneOffData.JobOwner?.Id,
                    IOUType: OneOffData.IOUType?.Id,
                    EmpId: '',
                    RequestedDate: currentDate,
                    Amount: OneOffData.totAmount?.value,
                    StatusID: 1,
                    RequestedBy: OneOffData.UserID?.value,
                    IsSync: 0,
                    REMARK: "",
                    Reject_Remark: "",
                    Attachment_Status: 1,
                    HOD: OneOffData.LoggerUserHOD?.value || '',
                    FirstActionBy: '',
                    FirstActionAt: '',
                    RIsLimit: OneOffData.IsLimit?.value || null,
                    AIsLimit: null,
                    RIouLimit: OneOffData.IOULimit?.value || null,
                    AIouLimit: '',
                    SecondActionBy: '',
                    SecondActionAt: ''
                }
            ]
            console.log(" save object on-off -----   ", arrObj);
            Conection_Checking(async (res: any) => {
                if (res != false) {
                    saveOneOffSettlement(arrObj, 0, async (Response: any) => {
                        if (Response == 3) {
                            console.log(" view alert ......  ");
                            saveJobData(currentDate);
                            await AsyncStorage.setItem(AsyncStorageConstants.ASYNC_CURRENT_PENDING_LIST_TYPE, "ONEOFF");
                            AsyncStorage.setItem(AsyncStorageConstants.ASYNC_STORAGE_IS_COPY, "false");
                            await AsyncStorage.setItem(AsyncStorageConstants.ASYNC_STORAGE_Is_inprogressOneOff, "false");
                        } else {
                            showErrorAlert('Failed', "One-Off Settlement Request Failed!");
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
            console.log(" main data -----------  ", OneOffData);
            if (OneOffData.totAmount?.value < OneOffData.CreateRequestLimit?.value) {
                if (OneOffData.IOUType?.Id == 3) { // other type
                    handleChange(null, null, "IsLimit")
                    handleChange('', null, "RIouLimit")
                    saveSubmit();
                } else if (OneOffData.totAmount?.value > OneOffData.IOULimit?.value) { // limit exceed
                    handleChange("YES", null, "IsLimit")
                    handleChange(OneOffData.IOULimit?.value, null, "RIouLimit")
                    saveSubmit();
                } else { // limit not exceeded & job/vehicle type
                    handleChange(null, '', "LoggerUserHOD")
                    handleChange("NO", null, "IsLimit")
                    handleChange(OneOffData.IOULimit?.value, null, "RIouLimit")
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
            if (OneOffAttachments.length > 0) {
                if (OneOffJobData.length > 0) {
                    Alert.alert('Submit', 'Are you sure save this one-off settlement ?', [
                        {
                            text: 'No',
                            onPress: () => console.log('Cancel Pressed'),
                            style: 'cancel',
                        },
                        { text: 'Yes', onPress: () => checkLimit() },
                    ]);
                } else {
                    await alert({
                        type: DropdownAlertType.Error,
                        title: 'Error',
                        message: 'Please Add Details',
                    });
                }
            } else {
                await alert({
                    type: DropdownAlertType.Error,
                    title: 'Error',
                    message: 'Please Add Attachments',
                });
            }
        } catch (error) {
        }
    }
    const removeImage = async (index: any) => {
        try {
            setOneOffAttachments((prevImages: any[]) => prevImages.filter((_, i) => i !== index));
            await alert({
                type: DropdownAlertType.Error,
                title: 'Success',
                message: 'Image Deleted Successfully...',
            });
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
    useEffect(() => {
        if (route.params?.OneOffAttachmentSet) {
            // console.log("attachments -----------  ", route.params?.OneOffAttachmentSet);
            setOneOffAttachments(route.params.OneOffAttachmentSet);
        }
    }, [route.params?.OneOffAttachmentSet]);
    useEffect(() => {
        if (route.params?.OneOffJobdataSet) {
            setOneOffJobData(route.params.OneOffJobdataSet);
        }
    }, [route.params?.OneOffdataSet]);
    useEffect(() => {
        if (route.params?.OneOffdataSet) {
            setOneOffData(route.params.OneOffdataSet);
        }
    }, [route.params?.OneOffdataSet]);
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
                    data={OneOffAttachments}
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
    );
}
export default AddAttatchmentOneOffScreen;