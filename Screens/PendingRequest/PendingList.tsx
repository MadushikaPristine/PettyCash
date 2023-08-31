import React, { useEffect, useState } from "react";
import { Alert, Animated, Button, Dimensions, FlatList, Keyboard, Modal, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import Header from "../../Components/Header";
import RequestList from "../../Components/RequestList";
import ComponentsStyles from "../../Constant/Components.styles";
import ActionButton from "../../Components/ActionButton";
import ApproveRejectModal from "../../Components/ApproveRejectComponent";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { ApprovedIOU, CancelledIOU, getAllPendingIOUList, getDateFilterIOUList, getIOUDataByID, getPendingHODApprovalIOUList, getPendingIOU, getPendingIOUList, getPendingSecondApprovalIOUList, RejectedIOU, saveApproveAllData, saveApproveRemark, saveIOU, saveRemark, Update_IOU_FirstApprovel, Update_IOU_SecondApprovel, Update_IOU_ValidateAmount, UpdateFirstApprovel } from "../../SQLiteDBAction/Controllers/IOUController";
import { ApprovedIOUSET, CancelledIOUSET, getAllPendingIOUSetList, getDateFilterIOUSETList, getHODPendingIOUSetList, getIOUSettlement_Data, getPendingIOUSetList, RejectedIOUSET, saveApproveRemarkIOUSET, Update_IOUSettelment_ValidateAmount, Update_IOUSettlement_FirstApprovel, Update_IOUSettlement_SecondApprovel } from "../../SQLiteDBAction/Controllers/IouSettlementController";
import { ApprovedONEOFF, CancelledONEOFF, getAllPendingOneOffSetList, getDateFilterONEOFFList, getHODPendingOneOffSetList, getOneOffReAllData, getPendingOneOffSetList, RejectedONEOFF, saveApproveRemarkONEOFF, Update_ONE_OF_FirstApprovel, Update_ONE_OF_SecondApprovel, Update_ONE_OF_ValidateAmount } from "../../SQLiteDBAction/Controllers/OneOffSettlementController";
import DateRangePopup from "../../Components/DateRangePopup";
//import Notifications from 'react-native-notifications';
import { getCurrentPendingListType, getLoginUserID, getLoginUserRoll, get_ASYNC_JOBOWNER_APPROVAL_AMOUNT, get_ASYNC_MAX_AMOUNT } from "../../Constant/AsynStorageFuntion";
import { BASE_URL, headers } from "../../Constant/ApiConstants";
import axios from "axios";
import Spinner from "react-native-loading-spinner-overlay";
import { Dialog } from "react-native-paper";
import InputText from "../../Components/InputText";
import DateRangePicker from "rn-select-date-range";
import IconA from 'react-native-vector-icons/FontAwesome';
import { getAllLoginUserDetails } from "../../SQLiteDBAction/Controllers/UserController";
import { getHODDetailsID } from "../../SQLiteDBAction/Controllers/DepartmentController";
import moment from "moment";


let width = Dimensions.get("screen").width;
const height = Dimensions.get('screen').height;
let loggedUserID: any;
let UserRoleID: any;


const PendingList = () => {

  const listArray = [];

  const navigation = useNavigation();
  const [IOUList, setIOUList] = useState([]);

  const [type, setType] = useState('IOU')
  const [roll, setRoll] = useState('');
  const [maxAmount, setMaxAmount] = useState(0);
  const [uId, setUid] = useState('');

  const [isShowSweep, setIsShowSweep] = useState(true);
  const [isApprove, setIsApprove] = useState(false);
  const [isReject, setIsReject] = useState(false);
  const [txtRemark, setTxtRemark] = useState('');


  const [pendingType, setPendingType] = useState('');
  const [approveList, setApproveList] = useState();
  const [ApproveID, setApproveID] = useState();
  const [IOULimit, setIOULimit] = useState();

  //flatlist
  const [pendingList, setPendingList] = useState([]);


  const [modalStyle, setModalStyle] = useState(new Animated.Value(height));
  const [selectedItems, setSelectedItems]: any = useState([]);
  const [rDate, setRDate] = useState(Date());

  const [notificationMessage, setNotificationMessage] = useState('');
  const [loandingspinner, setloandingspinner] = useState(false);
  const [isDialog, setisDialog] = useState(false);

  const [selectedRange, setRange] = useState({});

  //const {selectedItems, handleItemPress} = RequestList([]);

  var remarks = '';
  let HODIOUList: any[] = [];
  let HODIOUSETList: any[] = [];
  let HODONEOFFList: any[] = [];

  const listTab = [
    {
      type: 'IOU'
    },
    {
      type: 'IOU Settlement'
    },
    {
      type: 'One-Off Settlement'
    }
  ]

  const slideInModal = () => {
    setIsShowSweep(false);
    // console.log('sampleIn');

    Animated.timing(modalStyle, {
      toValue: height / 5,
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

  const handleItemPress = (itemId: any) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter((user_id: any) => user_id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  };

  //   const handlePress = () => {
  //   Notifications.postLocalNotification({
  //     title: 'Test notification',
  //     body: 'This is a test notification',
  //     sound: 'default',
  //     category: 'TEST_CATEGORY',
  //     userInfo: { test: 'data' },
  //   });
  // };

  const approve = () => {

    setIsApprove(true);
    setIsReject(false);

    if (selectedItems.length > 0) {

      setTxtRemark('');
      setisDialog(true);
      // slideInModal();


    } else {

      console.log(" no selected items");

      Alert.alert('No Selected Requests !', 'Please Select Requests that you want to Approve. ', [
        {
          text: 'Ok',
          onPress: () => console.log('Ok Pressed'),
          style: 'default',
        },
      ]);


    }

  }

  const reject = () => {
    setIsApprove(false);
    setIsReject(true);
    // slideInModal();

    if (selectedItems.length > 0) {

      setTxtRemark('');
      setisDialog(true);
      // slideInModal();


    } else {

      console.log(" no selected items");

      Alert.alert('No Selected Requests !', 'Please Select Requests that you want to reject. ', [
        {
          text: 'Ok',
          onPress: () => console.log('Ok Pressed'),
          style: 'default',
        },
      ]);

    }

  }

  const cancel = () => {
    setIsApprove(false);
    setIsReject(false);
    // slideInModal();
    if (selectedItems.length > 0) {


      setTxtRemark('');
      setisDialog(true);
      // slideInModal();


    } else {

      console.log(" no selected items");

      Alert.alert('No Selected Requests !', 'Please Select Requests that you want to Cancel. ', [
        {
          text: 'Ok',
          onPress: () => console.log('Ok Pressed'),
          style: 'default',
        },
      ]);


    }
  }

  const closeDialog = () => {

    setTxtRemark('');
    setisDialog(false)
  }

  //------------Send Approve Notification----------

  // const onApprovedNotification = async (ID: any, type: any) => {


  //   await notifee.requestPermission()

  //   const channelId = await notifee.createChannel({
  //     id: 'default',
  //     name: 'Default Channel',
  //     sound: 'default',
  //     importance: AndroidImportance.HIGH,
  //   });


  //   const notificationId = await notifee.displayNotification({
  //     id: '123',
  //     title: 'Notification Title',
  //     body: 'Main body content of the notification',
  //     android: {
  //       channelId: 'my-channel',

  //     },
  //   });

  //   // Sometime later...
  //   await notifee.displayNotification({
  //     id: '123',
  //     title: `<b>${type} has been approved by Job Owner</b>`,
  //     body: `${type} Request ${ID} has been approved by the Job Owner and total payable has been updated`,
  //     android: {
  //       channelId,
  //       //importance: AndroidImportance.HIGH,
  //     },

  //   });

  //   // console.log(ID, type);
  //   //setNotificationMessage(notificationId);
  // }

  // //-----------Send Reject Notification-------------

  // const onRejectedNotification = async (ID: any, type: any) => {


  //   await notifee.requestPermission()

  //   const channelId = await notifee.createChannel({
  //     id: 'default',
  //     name: 'Default Channel',
  //     sound: 'default',
  //     importance: AndroidImportance.HIGH,
  //   });


  //   const notificationId = await notifee.displayNotification({
  //     id: '123',
  //     title: 'Notification Title',
  //     body: 'Main body content of the notification',
  //     android: {
  //       channelId,
  //     },
  //   });

  //   // Sometime later...
  //   await notifee.displayNotification({
  //     id: '123',
  //     title: `<b>${type} has been rejected by Job Owner</b>`,
  //     body: `${type} Request ${ID} has been rejected by the Job Owner and total payable has been updated`,
  //     android: {
  //       channelId,
  //     },
  //   });

  //   // console.log(ID, type);
  // }

  // //-----------send Cancelled Notification----------

  // const onCancelledNotification = async (ID: any, type: any) => {


  //   await notifee.requestPermission()

  //   const channelId = await notifee.createChannel({
  //     id: 'default',
  //     name: 'Default Channel',
  //     sound: 'default',
  //     importance: AndroidImportance.HIGH,
  //   });


  //   const notificationId = await notifee.displayNotification({
  //     id: '123',
  //     title: 'Notification Title',
  //     body: 'Main body content of the notification',
  //     android: {
  //       channelId,
  //     },
  //   });

  //   // Sometime later...
  //   await notifee.displayNotification({
  //     id: '123',
  //     title: `<b>${type} has been cancelled by Job Owner</b>`,
  //     body: `${type} Request ${ID} has been cancelled by the Job Owner and total payable has been updated`,
  //     android: {
  //       channelId,
  //     },
  //   });

  //   // console.log(ID, type);
  // }

  const ApproveAlert = () => {
    Alert.alert('Approved Request !', 'Are you sure you want to Approved Request ?', [
      {
        text: 'No',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      { text: 'Yes', onPress: () => approveRemark(txtRemark) },
    ]);
  }

  const RejectAlert = () => {
    Alert.alert('Reject Request !', 'Are you sure you want to Reject Request ?', [
      {
        text: 'No',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      { text: 'Yes', onPress: () => rejectRemark(txtRemark) },
    ]);
  }

  const CancelAlert = () => {
    Alert.alert('Cancel Request !', 'Are you sure you want to canceled Request ?', [
      {
        text: 'No',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      { text: 'Yes', onPress: () => cancelRemark(txtRemark) },
    ]);
  }

  //------------Apply approve remark---------------

  const approveRemark = (remark: any) => {

    // console.log("selected list >>>>>>>>>>>>>>>>>>>>>>>>>>>>>   ",selectedItems);

    setisDialog(false);

    for (let i = 0; i < selectedItems.length; ++i) {

      if (type === 'IOU') {

        getAllLoginUserDetails(loggedUserID, (resultiou: any) => {

          console.log("user id ====   ", loggedUserID);

          setIOULimit(resultiou[0].IOULimit);

          getIOUDataByID(selectedItems[i], (resultiouID: any) => {


            console.log(resultiouID[0].Amount, ' result ==========  ', resultiouID);

            if (resultiouID[0].IOU_Type == 3 && resultiouID[0].Approve_Status == 5) {

              // iouType = 3 & approvestatues = 5  (Frist Aprovel)


              //frist actionby = log wela inna user id
              //fristaction act = aprove karana datetime eka
              ///remark
              //approvestatus = 2
              const jsonData = [
                {
                  FirstActionBy: loggedUserID,
                  FirstActionAt: moment().utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss'),
                  Remark: remark,
                  Approve_Status: 2,
                  IOU_ID: selectedItems[i],
                  ActionStep: 1

                },
              ];
              Update_IOU_FirstApprovel(jsonData, (result: any) => {

                if (result == "success") {

                  const prams =
                  {
                    "PCRCode": parseInt(resultiouID[0].WebRefID),
                    "Type": "IOU Request",
                    "StatusID": 2,
                    "ModifyBy": parseInt(loggedUserID),
                    "Remark": remark,
                    "HOD": null,
                    "ActionStep": 1,
                    "FirstActionBy": parseInt(loggedUserID),
                    "SecondActionBy": null,
                    "FirstActionAt": moment().utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss'),
                    "SecondActionAt": "",
                    "AIsLimit": "",
                    "AIouLimit": "",
                  }
                  UpdateNew_API(prams);
                  navigation.navigate('IOU', { status: 'Approved', })

                } else {

                  Alert.alert('Request Approve Failed !', '', [
                    {
                      text: 'Ok', onPress: () => console.log("ok Pressed")
                    },
                  ]);

                }

              })

            } else if (resultiouID[0].IOU_Type != 3 && resultiouID[0].Approve_Status == 1) {
              // iouType != 3 & approvestatues = 1  


              // Amount Eke Condition eka enna oni
              if (resultiouID[0].Amount > resultiou[0].IOULimit) {
                // if

                // exeeed
                // hod = logwela inna userge department eke HOD
                //frist actionby = log wela inna user id
                //fristaction act = aprove karana datetime eka
                // AisLimit = YES
                //AIO LIMIT = User table eke IOUlimit eka set karanna oni
                ///remark 
                //approvestatus = 5

                getHODDetailsID(loggedUserID, (departmenthod: any) => {
                  const jsonData = [
                    {
                      HOD: departmenthod[0].HODNo,
                      FirstActionBy: loggedUserID,
                      FirstActionAt: moment().utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss'),
                      AIsLimit: "YES",
                      AIOULimit: resultiou[0].IOULimit,
                      Remark: remark,
                      Approve_Status: 5,
                      IOU_ID: selectedItems[i],
                      ActionStep: 1
                    },
                  ];


                  Update_IOU_ValidateAmount(jsonData, (result: any) => {

                    if (result == "success") {

                      const prams =
                      {
                        "PCRCode": parseInt(resultiouID[0].WebRefID),
                        "Type": "IOU Request",
                        "StatusID": 5,
                        "ModifyBy": parseInt(loggedUserID),
                        "Remark": remark,
                        "HOD": parseInt(departmenthod[0].HODNo),
                        "ActionStep": 1,
                        "FirstActionBy": parseInt(loggedUserID),
                        "SecondActionBy": null,
                        "FirstActionAt": moment().utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss'),
                        "SecondActionAt": "",
                        "AIsLimit": "YES",
                        "AIouLimit": resultiou[0].IOULimit,
                      }
                      UpdateNew_API(prams);
                      navigation.navigate('IOU', { status: 'Approved', })

                    } else {

                      Alert.alert('Request Approve Failed !', '', [
                        {
                          text: 'Ok', onPress: () => console.log("ok Pressed")
                        },
                      ]);

                    }

                  })
                })

              } else {
                // else

                // is not exceed
                //frist actionby = log wela inna user id
                //fristaction act = aprove karana datetime eka
                // AisLimit = NO
                //AIO LIMIT = User table eke IOUlimit eka set karanna oni
                ///remark 
                //approvestatus = 2
                //     // saveApproveAllData(departmenthod[0].HODNo, loggedUserID, moment().utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss'), "YES", resultiou[0].IOULimit, remark, selectedItems[i], (result: any) => {

                console.log("1111111111111111111111111111111");

                const jsonData = [
                  {
                    FirstActionBy: loggedUserID,
                    FirstActionAt: moment().utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss'),
                    AIsLimit: "NO",
                    AIOULimit: resultiou[0].IOULimit,
                    Remark: remark,
                    Approve_Status: 2,
                    IOU_ID: selectedItems[i],
                    ActionStep: 1
                  },
                ];

                Update_IOU_ValidateAmount(jsonData, (result: any) => {


                  if (result == "success") {

                    const prams =
                    {
                      "PCRCode": parseInt(resultiouID[0].WebRefID),
                      "Type": "IOU Request",
                      "StatusID": 2,
                      "ModifyBy": parseInt(loggedUserID),
                      "Remark": remark,
                      "HOD": null,
                      "ActionStep": 1,
                      "FirstActionBy": parseInt(loggedUserID),
                      "SecondActionBy": null,
                      "FirstActionAt": moment().utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss'),
                      "SecondActionAt": "",
                      "AIsLimit": "NO",
                      "AIouLimit": resultiou[0].IOULimit,
                    }
                    UpdateNew_API(prams);
                    navigation.navigate('IOU', { status: 'Approved', })

                  } else {

                    Alert.alert('Request Approve Failed !', '', [
                      {
                        text: 'Ok', onPress: () => console.log("ok Pressed")
                      },
                    ]);

                  }

                })

              }
              // UpdateFirstApprovel



            } else if (resultiouID[0].IOU_Type != 3 && resultiouID[0].Approve_Status == 5) {
              // iouType != 3 & approvestatues = 5 (second Action)


              //Second actionby = log wela inna user id
              //SecondAction act = aprove karana datetime eka
              ///remark 
              //approvestatus = 2

              const jsonData = [
                {
                  SecondActionBy: loggedUserID,
                  SecondActionAt: moment().utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss'),
                  Remark: remark,
                  Approve_Status: 2,
                  IOU_ID: selectedItems[i],
                  ActionStep: 2
                },
              ];

              Update_IOU_SecondApprovel(jsonData, (result: any) => {

                if (result == "success") {

                  const prams =
                  {
                    "PCRCode": parseInt(resultiouID[0].WebRefID),
                    "Type": "IOU Request",
                    "StatusID": 2,
                    "ModifyBy": parseInt(loggedUserID),
                    "Remark": remark,
                    "HOD": null,
                    "ActionStep": 2,
                    "FirstActionBy": null,
                    "SecondActionBy": parseInt(loggedUserID),
                    "FirstActionAt": "",
                    "SecondActionAt": moment().utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss'),
                    "AIsLimit": "",
                    "AIouLimit": "",
                  }
                  UpdateNew_API(prams);
                  navigation.navigate('IOU', { status: 'Approved', })

                } else {

                  Alert.alert('Request Approve Failed !', '', [
                    {
                      text: 'Ok', onPress: () => console.log("ok Pressed")
                    },
                  ]);

                }

              })
            }

          })


        })

      } else if (type === 'IOU Settlement') {

        getAllLoginUserDetails(loggedUserID, (resultiou: any) => {


          // setIOULimit(resultiou[0].IOULimit);

          getIOUSettlement_Data(selectedItems[i], (resultiouID: any) => {



            if (resultiouID[0].IOU_Type == 3 && resultiouID[0].Approve_Status == 5) {

              // iouType = 3 & approvestatues = 5  (Frist Aprovel)


              //frist actionby = log wela inna user id
              //fristaction act = aprove karana datetime eka
              ///remark
              //approvestatus = 2


              const jsonData = [
                {
                  FirstActionBy: loggedUserID,
                  FirstActionAt: moment().utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss'),
                  Remark: remark,
                  Approve_Status: 2,
                  IOU_ID: selectedItems[i],
                  ActionStep: 1
                },
              ];
              Update_IOUSettlement_FirstApprovel(jsonData, (result: any) => {

                if (result == "success") {

                  const prams =
                  {
                    "PCRCode": parseInt(resultiouID[0].WebRefID),
                    "Type": "IOU Settlement",
                    "StatusID": 2,
                    "ModifyBy": parseInt(loggedUserID),
                    "Remark": remark,
                    "HOD": null,
                    "ActionStep": 1,
                    "FirstActionBy": parseInt(loggedUserID),
                    "SecondActionBy": null,
                    "FirstActionAt": moment().utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss'),
                    "SecondActionAt": "",
                    "AIsLimit": "",
                    "AIouLimit": "",
                  }
                  UpdateNew_API(prams);
                  navigation.navigate('SettlementScreen', { status: 'Approved', })

                } else {

                  Alert.alert('Request Approve Failed !', '', [
                    {
                      text: 'Ok', onPress: () => console.log("ok Pressed")
                    },
                  ]);

                }

              })

            } else if (resultiouID[0].IOU_Type != 3 && resultiouID[0].Approve_Status == 1) {
              // iouType != 3 & approvestatues = 1  


              // Amount Eke Condition eka enna oni
              if (resultiouID[0].Amount > resultiou[0].IOULimit) {
                // if

                // exeeed
                // hod = logwela inna userge department eke HOD
                //frist actionby = log wela inna user id
                //fristaction act = aprove karana datetime eka
                // AisLimit = YES
                //AIO LIMIT = User table eke IOUlimit eka set karanna oni
                ///remark 
                //approvestatus = 5

                getHODDetailsID(loggedUserID, (departmenthod: any) => {
                  const jsonData = [
                    {
                      HOD: departmenthod[0].HODNo,
                      FirstActionBy: loggedUserID,
                      FirstActionAt: moment().utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss'),
                      AIsLimit: "YES",
                      AIOULimit: resultiou[0].IOULimit,
                      Remark: remark,
                      Approve_Status: 5,
                      IOU_ID: selectedItems[i],
                      ActionStep: 1
                    },
                  ];


                  Update_IOUSettelment_ValidateAmount(jsonData, (result: any) => {

                    if (result == "success") {

                      const prams =
                      {
                        "PCRCode": parseInt(resultiouID[0].WebRefID),
                        "Type": "IOU Settlement",
                        "StatusID": 5,
                        "ModifyBy": parseInt(loggedUserID),
                        "Remark": remark,
                        "HOD": parseInt(departmenthod[0].HODNo),
                        "ActionStep": 1,
                        "FirstActionBy": parseInt(loggedUserID),
                        "SecondActionBy": null,
                        "FirstActionAt": moment().utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss'),
                        "SecondActionAt": "",
                        "AIsLimit": "YES",
                        "AIouLimit": resultiou[0].IOULimit,
                      }
                      UpdateNew_API(prams);
                      navigation.navigate('SettlementScreen', { status: 'Approved', })

                    } else {

                      Alert.alert('Request Approve Failed !', '', [
                        {
                          text: 'Ok', onPress: () => console.log("ok Pressed")
                        },
                      ]);

                    }

                  })
                })


              } else {
                // else

                // is not exied
                //frist actionby = log wela inna user id
                //fristaction act = aprove karana datetime eka
                // AisLimit = NO
                //AIO LIMIT = User table eke IOUlimit eka set karanna oni
                ///remark 
                //approvestatus = 2
                //     // saveApproveAllData(departmenthod[0].HODNo, loggedUserID, moment().utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss'), "YES", resultiou[0].IOULimit, remark, selectedItems[i], (result: any) => {

                console.log("1111111111111111111111111111111");

                const jsonData = [
                  {
                    FirstActionBy: loggedUserID,
                    FirstActionAt: moment().utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss'),
                    AIsLimit: "NO",
                    AIOULimit: resultiou[0].IOULimit,
                    Remark: remark,
                    Approve_Status: 2,
                    IOU_ID: selectedItems[i],
                    ActionStep: 1
                  },
                ];

                Update_IOUSettelment_ValidateAmount(jsonData, (result: any) => {


                  if (result == "success") {

                    const prams =
                    {
                      "PCRCode": parseInt(resultiouID[0].WebRefID),
                      "Type": "IOU Settlement",
                      "StatusID": 2,
                      "ModifyBy": parseInt(loggedUserID),
                      "Remark": remark,
                      "HOD": null,
                      "ActionStep": 1,
                      "FirstActionBy": parseInt(loggedUserID),
                      "SecondActionBy": null,
                      "FirstActionAt": moment().utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss'),
                      "SecondActionAt": "",
                      "AIsLimit": "NO",
                      "AIouLimit": resultiou[0].IOULimit,
                    }
                    UpdateNew_API(prams);
                    navigation.navigate('SettlementScreen', { status: 'Approved', })

                  } else {

                    Alert.alert('Request Approve Failed !', '', [
                      {
                        text: 'Ok', onPress: () => console.log("ok Pressed")
                      },
                    ]);

                  }

                })

              }
              // UpdateFirstApprovel



            } else if (resultiouID[0].IOU_Type != 3 && resultiouID[0].Approve_Status == 5) {
              // iouType != 3 & approvestatues = 5 (second Action)


              //Second actionby = log wela inna user id
              //SecondAction act = aprove karana datetime eka
              ///remark 
              //approvestatus = 2

              const jsonData = [
                {
                  SecondActionBy: loggedUserID,
                  SecondActionAt: moment().utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss'),
                  Remark: remark,
                  Approve_Status: 2,
                  IOU_ID: selectedItems[i],
                  ActionStep: 2
                },
              ];

              Update_IOUSettlement_SecondApprovel(jsonData, (result: any) => {

                if (result == "success") {

                  const prams =
                  {
                    "PCRCode": parseInt(resultiouID[0].WebRefID),
                    "Type": "IOU Settlement",
                    "StatusID": 2,
                    "ModifyBy": parseInt(loggedUserID),
                    "Remark": remark,
                    "HOD": null,
                    "ActionStep": 2,
                    "FirstActionBy": null,
                    "SecondActionBy": parseInt(loggedUserID),
                    "FirstActionAt": "",
                    "SecondActionAt": moment().utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss'),
                    "AIsLimit": "",
                    "AIouLimit": "",
                  }
                  UpdateNew_API(prams);
                  navigation.navigate('SettlementScreen', { status: 'Approved', })

                } else {

                  Alert.alert('Request Approve Failed !', '', [
                    {
                      text: 'Ok', onPress: () => console.log("ok Pressed")
                    },
                  ]);

                }

              })
            }

          })


        })


      } else if (type === 'One-Off Settlement') {
        getAllLoginUserDetails(loggedUserID, (resultiou: any) => {


          setIOULimit(resultiou[0].IOULimit);

          getOneOffReAllData(selectedItems[i], (resultiouID: any) => {


            console.log(resultiouID[0].Amount, '==========', IOULimit);

            if (resultiouID[0].IOU_Type == 3 && resultiouID[0].Approve_Status == 5) {

              // iouType = 3 & approvestatues = 5  (Frist Aprovel)


              //frist actionby = log wela inna user id
              //fristaction act = aprove karana datetime eka
              ///remark
              //approvestatus = 2
              const jsonData = [
                {
                  FirstActionBy: loggedUserID,
                  FirstActionAt: moment().utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss'),
                  Remark: remark,
                  Approve_Status: 2,
                  IOU_ID: selectedItems[i],
                  ActionStep: 1
                },
              ];
              Update_ONE_OF_FirstApprovel(jsonData, (result: any) => {

                if (result == "success") {

                  const prams =
                  {
                    "PCRCode": parseInt(resultiouID[0].WebRefID),
                    "Type": "OneOff Settlement",
                    "StatusID": 2,
                    "ModifyBy": parseInt(loggedUserID),
                    "Remark": remark,
                    "HOD": null,
                    "ActionStep": 1,
                    "FirstActionBy": parseInt(loggedUserID),
                    "SecondActionBy": null,
                    "FirstActionAt": moment().utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss'),
                    "SecondActionAt": "",
                    "AIsLimit": "",
                    "AIouLimit": "",
                  }
                  UpdateNew_API(prams);
                  navigation.navigate('OneOffScreen', { status: 'Approved', })

                } else {

                  Alert.alert('Request Approve Failed !', '', [
                    {
                      text: 'Ok', onPress: () => console.log("ok Pressed")
                    },
                  ]);

                }

              })

            } else if (resultiouID[0].IOU_Type != 3 && resultiouID[0].Approve_Status == 1) {
              // iouType != 3 & approvestatues = 1  


              // Amount Eke Condition eka enna oni
              if (resultiouID[0].Amount > resultiou[0].IOULimit) {
                // if

                // exeeed
                // hod = logwela inna userge department eke HOD
                //frist actionby = log wela inna user id
                //fristaction act = aprove karana datetime eka
                // AisLimit = YES
                //AIO LIMIT = User table eke IOUlimit eka set karanna oni
                ///remark 
                //approvestatus = 5

                getHODDetailsID(loggedUserID, (departmenthod: any) => {
                  const jsonData = [
                    {
                      HOD: departmenthod[0].HODNo,
                      FirstActionBy: loggedUserID,
                      FirstActionAt: moment().utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss'),
                      AIsLimit: "YES",
                      AIOULimit: resultiou[0].IOULimit,
                      Remark: remark,
                      Approve_Status: 5,
                      IOU_ID: selectedItems[i],
                      ActionStep: 1
                    },
                  ];


                  Update_ONE_OF_ValidateAmount(jsonData, (result: any) => {

                    if (result == "success") {

                      const prams =
                      {
                        "PCRCode": parseInt(resultiouID[0].WebRefID),
                        "Type": "OneOff Settlement",
                        "StatusID": 5,
                        "ModifyBy": parseInt(loggedUserID),
                        "Remark": remark,
                        "HOD": parseInt(resultiouID[0].HOD),
                        "ActionStep": 1,
                        "FirstActionBy": parseInt(loggedUserID),
                        "SecondActionBy": null,
                        "FirstActionAt": moment().utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss'),
                        "SecondActionAt": "",
                        "AIsLimit": "YES",
                        "AIouLimit": resultiou[0].IOULimit,
                      }
                      UpdateNew_API(prams);
                      navigation.navigate('OneOffScreen', { status: 'Approved', })

                    } else {

                      Alert.alert('Request Approve Failed !', '', [
                        {
                          text: 'Ok', onPress: () => console.log("ok Pressed")
                        },
                      ]);

                    }

                  })
                })

              } else {
                // else

                // is not exied
                //frist actionby = log wela inna user id
                //fristaction act = aprove karana datetime eka
                // AisLimit = NO
                //AIO LIMIT = User table eke IOUlimit eka set karanna oni
                ///remark 
                //approvestatus = 2
                //     // saveApproveAllData(departmenthod[0].HODNo, loggedUserID, moment().utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss'), "YES", resultiou[0].IOULimit, remark, selectedItems[i], (result: any) => {

                console.log("1111111111111111111111111111111");

                const jsonData = [
                  {
                    FirstActionBy: loggedUserID,
                    FirstActionAt: moment().utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss'),
                    AIsLimit: "NO",
                    AIOULimit: resultiou[0].IOULimit,
                    Remark: remark,
                    Approve_Status: 2,
                    IOU_ID: selectedItems[i],
                    ActionStep: 1
                  },
                ];

                Update_ONE_OF_ValidateAmount(jsonData, (result: any) => {


                  if (result == "success") {

                    const prams =
                    {
                      "PCRCode": parseInt(resultiouID[0].WebRefID),
                      "Type": "OneOff Settlement",
                      "StatusID": 2,
                      "ModifyBy": parseInt(loggedUserID),
                      "Remark": remark,
                      "HOD": null,
                      "ActionStep": 1,
                      "FirstActionBy": parseInt(loggedUserID),
                      "SecondActionBy": null,
                      "FirstActionAt": moment().utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss'),
                      "SecondActionAt": "",
                      "AIsLimit": "NO",
                      "AIouLimit": resultiou[0].IOULimit,
                    }
                    UpdateNew_API(prams);
                    navigation.navigate('OneOffScreen', { status: 'Approved', })

                  } else {

                    Alert.alert('Request Approve Failed !', '', [
                      {
                        text: 'Ok', onPress: () => console.log("ok Pressed")
                      },
                    ]);

                  }

                })

              }
              // UpdateFirstApprovel



            } else if (resultiouID[0].IOU_Type != 3 && resultiouID[0].Approve_Status == 5) {
              // iouType != 3 & approvestatues = 5 (second Action)


              //Second actionby = log wela inna user id
              //SecondAction act = aprove karana datetime eka
              ///remark 
              //approvestatus = 2

              const jsonData = [
                {
                  SecondActionBy: loggedUserID,
                  SecondActionAt: moment().utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss'),
                  Remark: remark,
                  Approve_Status: 2,
                  IOU_ID: selectedItems[i],
                  ActionStep: 2
                },
              ];

              Update_ONE_OF_SecondApprovel(jsonData, (result: any) => {

                if (result == "success") {

                  const prams =
                  {
                    "PCRCode": parseInt(resultiouID[0].WebRefID),
                    "Type": "OneOff Settlement",
                    "StatusID": 2,
                    "ModifyBy": parseInt(loggedUserID),
                    "Remark": remark,
                    "HOD": null,
                    "ActionStep": 2,
                    "FirstActionBy": null,
                    "SecondActionBy": parseInt(loggedUserID),
                    "FirstActionAt": "",
                    "SecondActionAt": moment().utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss'),
                    "AIsLimit": "",
                    "AIouLimit": "",
                  }
                  UpdateNew_API(prams);
                  navigation.navigate('OneOffScreen', { status: 'Approved', })

                } else {

                  Alert.alert('Request Approve Failed !', '', [
                    {
                      text: 'Ok', onPress: () => console.log("ok Pressed")
                    },
                  ]);

                }

              })
            }

          })


        })


      }




    }

  }

  //------------Apply reject remark---------------

  const rejectRemark = (remark: any) => {

    setisDialog(false);

    for (let i = 0; i < selectedItems.length; ++i) {
      if (type === 'IOU') {

        getIOUDataByID(selectedItems[i], (resultiouID: any) => {

          if (resultiouID[0].IOU_Type == 3 && resultiouID[0].Approve_Status == 5) {

            // First Action


            const jsonData = [
              {
                FirstActionBy: loggedUserID,
                FirstActionAt: moment().utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss'),
                Remark: remark,
                Approve_Status: 3,
                IOU_ID: selectedItems[i],
                ActionStep: 1

              },
            ];


            Update_IOU_FirstApprovel(jsonData, (resp: any) => {

              if (resp == "success") {


                const prams =
                {
                  "PCRCode": parseInt(resultiouID[0].WebRefID),
                  "Type": "IOU Request",
                  "StatusID": 3,
                  "ModifyBy": parseInt(loggedUserID),
                  "Remark": remark,
                  "HOD": null,
                  "ActionStep": 1,
                  "FirstActionBy": parseInt(loggedUserID),
                  "SecondActionBy": null,
                  "FirstActionAt": moment().utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss'),
                  "SecondActionAt": "",
                  "AIsLimit": "",
                  "AIouLimit": "",
                }
                UpdateNew_API(prams);

                navigation.navigate('IOU', {
                  status: 'Rejected',
                })

              } else {

                Alert.alert('Request Reject Failed !', '', [
                  {
                    text: 'Ok', onPress: () => console.log("ok Pressed")
                  },
                ]);

              }


            });




          } else if (resultiouID[0].IOU_Type != 3 && resultiouID[0].Approve_Status == 1) {

            // First Action

            const jsonData = [
              {
                FirstActionBy: loggedUserID,
                FirstActionAt: moment().utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss'),
                Remark: remark,
                Approve_Status: 3,
                IOU_ID: selectedItems[i],
                ActionStep: 1

              },
            ];

            Update_IOU_FirstApprovel(jsonData, (resp: any) => {

              if (resp == "success") {


                const prams =
                {
                  "PCRCode": parseInt(resultiouID[0].WebRefID),
                  "Type": "IOU Request",
                  "StatusID": 3,
                  "ModifyBy": parseInt(loggedUserID),
                  "Remark": remark,
                  "HOD": null,
                  "ActionStep": 1,
                  "FirstActionBy": parseInt(loggedUserID),
                  "SecondActionBy": null,
                  "FirstActionAt": moment().utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss'),
                  "SecondActionAt": "",
                  "AIsLimit": "",
                  "AIouLimit": "",
                }
                UpdateNew_API(prams);

                navigation.navigate('IOU', {
                  status: 'Rejected',
                })

              } else {

                Alert.alert('Request Reject Failed !', '', [
                  {
                    text: 'Ok', onPress: () => console.log("ok Pressed")
                  },
                ]);

              }


            });



          } else if (resultiouID[0].IOU_Type != 3 && resultiouID[0].Approve_Status == 5) {

            //Second Action


            const jsonData = [
              {
                SecondActionBy: loggedUserID,
                SecondActionAt: moment().utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss'),
                Remark: remark,
                Approve_Status: 3,
                IOU_ID: selectedItems[i],
                ActionStep: 2

              },
            ];

            Update_IOU_SecondApprovel(jsonData, (resp: any) => {

              if (resp == "success") {


                const prams =
                {
                  "PCRCode": parseInt(resultiouID[0].WebRefID),
                  "Type": "IOU Request",
                  "StatusID": 3,
                  "ModifyBy": parseInt(loggedUserID),
                  "Remark": remark,
                  "HOD": null,
                  "ActionStep": 2,
                  "FirstActionBy": null,
                  "SecondActionBy": parseInt(loggedUserID),
                  "FirstActionAt": "",
                  "SecondActionAt": moment().utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss'),
                  "AIsLimit": "",
                  "AIouLimit": "",
                }
                UpdateNew_API(prams);

                navigation.navigate('IOU', {
                  status: 'Rejected',
                })

              } else {

                Alert.alert('Request Reject Failed !', '', [
                  {
                    text: 'Ok', onPress: () => console.log("ok Pressed")
                  },
                ]);

              }


            });



          }





        });


      } else if (type === 'IOU Settlement') {


        getIOUSettlement_Data(selectedItems[i], (resultiouID: any) => {

          if (resultiouID[0].IOU_Type == 3 && resultiouID[0].Approve_Status == 5) {
            //first

            const jsonData = [
              {
                FirstActionBy: loggedUserID,
                FirstActionAt: moment().utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss'),
                Remark: remark,
                Approve_Status: 3,
                IOU_ID: selectedItems[i],
                ActionStep: 1

              },
            ];

            Update_IOUSettlement_FirstApprovel(jsonData, (result: any) => {

              if (result == "success") {

                const prams =
                {
                  "PCRCode": parseInt(resultiouID[0].WebRefID),
                  "Type": "IOU Settlement",
                  "StatusID": 3,
                  "ModifyBy": parseInt(loggedUserID),
                  "Remark": remark,
                  "HOD": null,
                  "ActionStep": 1,
                  "FirstActionBy": parseInt(loggedUserID),
                  "SecondActionBy": null,
                  "FirstActionAt": moment().utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss'),
                  "SecondActionAt": "",
                  "AIsLimit": "",
                  "AIouLimit": "",
                }
                UpdateNew_API(prams);
                navigation.navigate('SettlementScreen', { status: 'Rejected', })

              } else {

                Alert.alert('Request Approve Failed !', '', [
                  {
                    text: 'Ok', onPress: () => console.log("ok Pressed")
                  },
                ]);

              }

            })


          } else if (resultiouID[0].IOU_Type != 3 && resultiouID[0].Approve_Status == 1) {
            //first

            const jsonData = [
              {
                FirstActionBy: loggedUserID,
                FirstActionAt: moment().utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss'),
                Remark: remark,
                Approve_Status: 3,
                IOU_ID: selectedItems[i],
                ActionStep: 1

              },
            ];

            Update_IOUSettlement_FirstApprovel(jsonData, (result: any) => {

              if (result == "success") {

                const prams =
                {
                  "PCRCode": parseInt(resultiouID[0].WebRefID),
                  "Type": "IOU Settlement",
                  "StatusID": 3,
                  "ModifyBy": parseInt(loggedUserID),
                  "Remark": remark,
                  "HOD": null,
                  "ActionStep": 1,
                  "FirstActionBy": parseInt(loggedUserID),
                  "SecondActionBy": null,
                  "FirstActionAt": moment().utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss'),
                  "SecondActionAt": "",
                  "AIsLimit": "",
                  "AIouLimit": "",
                }
                UpdateNew_API(prams);
                navigation.navigate('SettlementScreen', { status: 'Rejected', })


              }
            });

          } else if (resultiouID[0].IOU_Type != 3 && resultiouID[0].Approve_Status == 5) {
            //second

            const jsonData = [
              {
                SecondActionBy: loggedUserID,
                SecondActionAt: moment().utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss'),
                Remark: remark,
                Approve_Status: 3,
                IOU_ID: selectedItems[i],
                ActionStep: 2

              },
            ];

            Update_IOUSettlement_SecondApprovel(jsonData, (result: any) => {

              if (result == "success") {

                const prams =
                {
                  "PCRCode": parseInt(resultiouID[0].WebRefID),
                  "Type": "IOU Settlement",
                  "StatusID": 3,
                  "ModifyBy": parseInt(loggedUserID),
                  "Remark": remark,
                  "HOD": null,
                  "ActionStep": 2,
                  "FirstActionBy": null,
                  "SecondActionBy": parseInt(loggedUserID),
                  "FirstActionAt": "",
                  "SecondActionAt": moment().utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss'),
                  "AIsLimit": "",
                  "AIouLimit": "",
                }
                UpdateNew_API(prams);
                navigation.navigate('SettlementScreen', { status: 'Rejected', })


              }

            });

          }

        });


      } else if (type === 'One-Off Settlement') {


        getOneOffReAllData(selectedItems[i], (resultiouID: any) => {

          if (resultiouID[0].IOU_Type == 3 && resultiouID[0].Approve_Status == 5) {
            //first


            const jsonData = [
              {
                FirstActionBy: loggedUserID,
                FirstActionAt: moment().utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss'),
                Remark: remark,
                Approve_Status: 3,
                IOU_ID: selectedItems[i],
                ActionStep: 1

              },
            ];

            Update_ONE_OF_FirstApprovel(jsonData, (result: any) => {

              if (result == "success") {

                const prams =
                {
                  "PCRCode": parseInt(resultiouID[0].WebRefID),
                  "Type": "OneOff Settlement",
                  "StatusID": 3,
                  "ModifyBy": parseInt(loggedUserID),
                  "Remark": remark,
                  "HOD": null,
                  "ActionStep": 1,
                  "FirstActionBy": parseInt(loggedUserID),
                  "SecondActionBy": null,
                  "FirstActionAt": moment().utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss'),
                  "SecondActionAt": "",
                  "AIsLimit": "",
                  "AIouLimit": "",
                }
                UpdateNew_API(prams);
                navigation.navigate('OneOffScreen', {
                  status: 'Rejected',
                })



              }
            });


          } else if (resultiouID[0].IOU_Type != 3 && resultiouID[0].Approve_Status == 1) {
            // first

            const jsonData = [
              {
                FirstActionBy: loggedUserID,
                FirstActionAt: moment().utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss'),
                Remark: remark,
                Approve_Status: 3,
                IOU_ID: selectedItems[i],
                ActionStep: 1

              },
            ];

            Update_ONE_OF_FirstApprovel(jsonData, (result: any) => {

              if (result == "success") {

                const prams =
                {
                  "PCRCode": parseInt(resultiouID[0].WebRefID),
                  "Type": "OneOff Settlement",
                  "StatusID": 3,
                  "ModifyBy": parseInt(loggedUserID),
                  "Remark": remark,
                  "HOD": null,
                  "ActionStep": 1,
                  "FirstActionBy": parseInt(loggedUserID),
                  "SecondActionBy": null,
                  "FirstActionAt": moment().utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss'),
                  "SecondActionAt": "",
                  "AIsLimit": "",
                  "AIouLimit": "",
                }
                UpdateNew_API(prams);
                navigation.navigate('OneOffScreen', {
                  status: 'Rejected',
                })



              }
            });


          } else if (resultiouID[0].IOU_Type != 3 && resultiouID[0].Approve_Status == 5) {
            //second

            const jsonData = [
              {
                FirstActionBy: loggedUserID,
                FirstActionAt: moment().utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss'),
                Remark: remark,
                Approve_Status: 3,
                IOU_ID: selectedItems[i],
                ActionStep: 1

              },
            ];

            Update_ONE_OF_SecondApprovel(jsonData, (result: any) => {

              if (result == "success") {

                const prams =
                {
                  "PCRCode": parseInt(resultiouID[0].WebRefID),
                  "Type": "OneOff Settlement",
                  "StatusID": 3,
                  "ModifyBy": parseInt(loggedUserID),
                  "Remark": remark,
                  "HOD": null,
                  "ActionStep": 1,
                  "FirstActionBy": parseInt(loggedUserID),
                  "SecondActionBy": null,
                  "FirstActionAt": moment().utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss'),
                  "SecondActionAt": "",
                  "AIsLimit": "",
                  "AIouLimit": "",
                }
                UpdateNew_API(prams);
                navigation.navigate('OneOffScreen', {
                  status: 'Rejected',
                })


              }
            });



          }

        });

      }


    }

  }

  //------------Apply cancel remark---------------

  const cancelRemark = (remark: any) => {

    setisDialog(false);

    for (let i = 0; i < selectedItems.length; ++i) {
      if (type === 'IOU') {

        getIOUDataByID(selectedItems[i], (resultiouID: any) => {

          if (resultiouID[0].IOU_Type == 3 && resultiouID[0].Approve_Status == 5) {

            // First Action


            const jsonData = [
              {
                FirstActionBy: loggedUserID,
                FirstActionAt: moment().utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss'),
                Remark: remark,
                Approve_Status: 4,
                IOU_ID: selectedItems[i],
                ActionStep: 1

              },
            ];


            Update_IOU_FirstApprovel(jsonData, (resp: any) => {

              if (resp == "success") {


                const prams =
                {
                  "PCRCode": parseInt(resultiouID[0].WebRefID),
                  "Type": "IOU Request",
                  "StatusID": 4,
                  "ModifyBy": parseInt(loggedUserID),
                  "Remark": remark,
                  "HOD": null,
                  "ActionStep": 1,
                  "FirstActionBy": parseInt(loggedUserID),
                  "SecondActionBy": null,
                  "FirstActionAt": moment().utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss'),
                  "SecondActionAt": "",
                  "AIsLimit": "",
                  "AIouLimit": "",
                }
                UpdateNew_API(prams);

                navigation.navigate('IOU', {
                  status: 'Rejected',
                })

              } else {

                Alert.alert('Request Cancel Failed !', '', [
                  {
                    text: 'Ok', onPress: () => console.log("ok Pressed")
                  },
                ]);

              }


            });




          } else if (resultiouID[0].IOU_Type != 3 && resultiouID[0].Approve_Status == 1) {

            // First Action

            const jsonData = [
              {
                FirstActionBy: loggedUserID,
                FirstActionAt: moment().utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss'),
                Remark: remark,
                Approve_Status: 4,
                IOU_ID: selectedItems[i],
                ActionStep: 1

              },
            ];

            Update_IOU_FirstApprovel(jsonData, (resp: any) => {

              if (resp == "success") {


                const prams =
                {
                  "PCRCode": parseInt(resultiouID[0].WebRefID),
                  "Type": "IOU Request",
                  "StatusID": 4,
                  "ModifyBy": parseInt(loggedUserID),
                  "Remark": remark,
                  "HOD": null,
                  "ActionStep": 1,
                  "FirstActionBy": parseInt(loggedUserID),
                  "SecondActionBy": null,
                  "FirstActionAt": moment().utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss'),
                  "SecondActionAt": "",
                  "AIsLimit": "",
                  "AIouLimit": "",
                }
                UpdateNew_API(prams);

                navigation.navigate('IOU', {
                  status: 'Rejected',
                })

              } else {

                Alert.alert('Request Cancel Failed !', '', [
                  {
                    text: 'Ok', onPress: () => console.log("ok Pressed")
                  },
                ]);

              }


            });



          } else if (resultiouID[0].IOU_Type != 3 && resultiouID[0].Approve_Status == 5) {

            //Second Action


            const jsonData = [
              {
                SecondActionBy: loggedUserID,
                SecondActionAt: moment().utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss'),
                Remark: remark,
                Approve_Status: 4,
                IOU_ID: selectedItems[i],
                ActionStep: 2

              },
            ];

            Update_IOU_SecondApprovel(jsonData, (resp: any) => {

              if (resp == "success") {


                const prams =
                {
                  "PCRCode": parseInt(resultiouID[0].WebRefID),
                  "Type": "IOU Request",
                  "StatusID": 4,
                  "ModifyBy": parseInt(loggedUserID),
                  "Remark": remark,
                  "HOD": null,
                  "ActionStep": 2,
                  "FirstActionBy": null,
                  "SecondActionBy": parseInt(loggedUserID),
                  "FirstActionAt": "",
                  "SecondActionAt": moment().utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss'),
                  "AIsLimit": "",
                  "AIouLimit": "",
                }
                UpdateNew_API(prams);

                navigation.navigate('IOU', {
                  status: 'Rejected',
                })

              } else {

                Alert.alert('Request Cancel Failed !', '', [
                  {
                    text: 'Ok', onPress: () => console.log("ok Pressed")
                  },
                ]);

              }


            });



          }





        });


      } else if (type === 'IOU Settlement') {


        getIOUSettlement_Data(selectedItems[i], (resultiouID: any) => {

          if (resultiouID[0].IOU_Type == 3 && resultiouID[0].Approve_Status == 5) {
            //first

            const jsonData = [
              {
                FirstActionBy: loggedUserID,
                FirstActionAt: moment().utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss'),
                Remark: remark,
                Approve_Status: 4,
                IOU_ID: selectedItems[i],
                ActionStep: 1

              },
            ];

            Update_IOUSettlement_FirstApprovel(jsonData, (result: any) => {

              if (result == "success") {

                const prams =
                {
                  "PCRCode": parseInt(resultiouID[0].WebRefID),
                  "Type": "IOU Settlement",
                  "StatusID": 4,
                  "ModifyBy": parseInt(loggedUserID),
                  "Remark": remark,
                  "HOD": null,
                  "ActionStep": 1,
                  "FirstActionBy": parseInt(loggedUserID),
                  "SecondActionBy": null,
                  "FirstActionAt": moment().utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss'),
                  "SecondActionAt": "",
                  "AIsLimit": "",
                  "AIouLimit": "",
                }
                UpdateNew_API(prams);
                navigation.navigate('SettlementScreen', { status: 'Rejected', })

              } else {

                Alert.alert('Request Cancel Failed !', '', [
                  {
                    text: 'Ok', onPress: () => console.log("ok Pressed")
                  },
                ]);

              }

            })


          } else if (resultiouID[0].IOU_Type != 3 && resultiouID[0].Approve_Status == 1) {
            //first

            const jsonData = [
              {
                FirstActionBy: loggedUserID,
                FirstActionAt: moment().utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss'),
                Remark: remark,
                Approve_Status: 4,
                IOU_ID: selectedItems[i],
                ActionStep: 1

              },
            ];

            Update_IOUSettlement_FirstApprovel(jsonData, (result: any) => {

              if (result == "success") {

                const prams =
                {
                  "PCRCode": parseInt(resultiouID[0].WebRefID),
                  "Type": "IOU Settlement",
                  "StatusID": 4,
                  "ModifyBy": parseInt(loggedUserID),
                  "Remark": remark,
                  "HOD": null,
                  "ActionStep": 1,
                  "FirstActionBy": parseInt(loggedUserID),
                  "SecondActionBy": null,
                  "FirstActionAt": moment().utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss'),
                  "SecondActionAt": "",
                  "AIsLimit": "",
                  "AIouLimit": "",
                }
                UpdateNew_API(prams);
                navigation.navigate('SettlementScreen', { status: 'Rejected', })


              }
            });

          } else if (resultiouID[0].IOU_Type != 3 && resultiouID[0].Approve_Status == 5) {
            //second

            const jsonData = [
              {
                SecondActionBy: loggedUserID,
                SecondActionAt: moment().utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss'),
                Remark: remark,
                Approve_Status: 4,
                IOU_ID: selectedItems[i],
                ActionStep: 2

              },
            ];

            Update_IOUSettlement_SecondApprovel(jsonData, (result: any) => {

              if (result == "success") {

                const prams =
                {
                  "PCRCode": parseInt(resultiouID[0].WebRefID),
                  "Type": "IOU Settlement",
                  "StatusID": 4,
                  "ModifyBy": parseInt(loggedUserID),
                  "Remark": remark,
                  "HOD": null,
                  "ActionStep": 2,
                  "FirstActionBy": null,
                  "SecondActionBy": parseInt(loggedUserID),
                  "FirstActionAt": "",
                  "SecondActionAt": moment().utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss'),
                  "AIsLimit": "",
                  "AIouLimit": "",
                }
                UpdateNew_API(prams);
                navigation.navigate('SettlementScreen', { status: 'Rejected', })


              }

            });

          }

        });


      } else if (type === 'One-Off Settlement') {


        getOneOffReAllData(selectedItems[i], (resultiouID: any) => {

          if (resultiouID[0].IOU_Type == 3 && resultiouID[0].Approve_Status == 5) {
            //first


            const jsonData = [
              {
                FirstActionBy: loggedUserID,
                FirstActionAt: moment().utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss'),
                Remark: remark,
                Approve_Status: 4,
                IOU_ID: selectedItems[i],
                ActionStep: 1

              },
            ];

            Update_ONE_OF_FirstApprovel(jsonData, (result: any) => {

              if (result == "success") {

                const prams =
                {
                  "PCRCode": parseInt(resultiouID[0].WebRefID),
                  "Type": "OneOff Settlement",
                  "StatusID": 4,
                  "ModifyBy": parseInt(loggedUserID),
                  "Remark": remark,
                  "HOD": null,
                  "ActionStep": 1,
                  "FirstActionBy": parseInt(loggedUserID),
                  "SecondActionBy": null,
                  "FirstActionAt": moment().utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss'),
                  "SecondActionAt": "",
                  "AIsLimit": "",
                  "AIouLimit": "",
                }
                UpdateNew_API(prams);
                navigation.navigate('OneOffScreen', {
                  status: 'Rejected',
                })



              }
            });


          } else if (resultiouID[0].IOU_Type != 3 && resultiouID[0].Approve_Status == 1) {
            // first

            const jsonData = [
              {
                FirstActionBy: loggedUserID,
                FirstActionAt: moment().utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss'),
                Remark: remark,
                Approve_Status: 4,
                IOU_ID: selectedItems[i],
                ActionStep: 1

              },
            ];

            Update_ONE_OF_FirstApprovel(jsonData, (result: any) => {

              if (result == "success") {

                const prams =
                {
                  "PCRCode": parseInt(resultiouID[0].WebRefID),
                  "Type": "OneOff Settlement",
                  "StatusID": 4,
                  "ModifyBy": parseInt(loggedUserID),
                  "Remark": remark,
                  "HOD": null,
                  "ActionStep": 1,
                  "FirstActionBy": parseInt(loggedUserID),
                  "SecondActionBy": null,
                  "FirstActionAt": moment().utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss'),
                  "SecondActionAt": "",
                  "AIsLimit": "",
                  "AIouLimit": "",
                }
                UpdateNew_API(prams);
                navigation.navigate('OneOffScreen', {
                  status: 'Rejected',
                })



              }
            });


          } else if (resultiouID[0].IOU_Type != 3 && resultiouID[0].Approve_Status == 5) {
            //second

            const jsonData = [
              {
                FirstActionBy: loggedUserID,
                FirstActionAt: moment().utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss'),
                Remark: remark,
                Approve_Status: 4,
                IOU_ID: selectedItems[i],
                ActionStep: 1

              },
            ];

            Update_ONE_OF_SecondApprovel(jsonData, (result: any) => {

              if (result == "success") {

                const prams =
                {
                  "PCRCode": parseInt(resultiouID[0].WebRefID),
                  "Type": "OneOff Settlement",
                  "StatusID": 4,
                  "ModifyBy": parseInt(loggedUserID),
                  "Remark": remark,
                  "HOD": null,
                  "ActionStep": 1,
                  "FirstActionBy": parseInt(loggedUserID),
                  "SecondActionBy": null,
                  "FirstActionAt": moment().utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss'),
                  "SecondActionAt": "",
                  "AIsLimit": "",
                  "AIouLimit": "",
                }
                UpdateNew_API(prams);
                navigation.navigate('OneOffScreen', {
                  status: 'Rejected',
                })


              }
            });



          }

        });

      }


    }
    // slideOutModal();
    // navigation.navigate('IOU', {
    //   status: 'Cancelled',
    // })
    // //console.log(remark);
    // Alert.alert("Cancel Request");
  }




  const getPendingList = (type: any) => {

    setPendingList([]);
    setloandingspinner(true);


    if (type === 'IOU') {

      console.log("role id --- ", UserRoleID);

      if (UserRoleID == '5') {

        console.log(" HOD LOgged ");


        getPendingHODApprovalIOUList((res: any) => {
          setPendingList(res);
          setloandingspinner(false);
        })


      } else {

        if (UserRoleID == '3' || UserRoleID == '4') {
          //Job owner or transport officer

          console.log(" Job owner or transport officer ");


          getPendingIOUList((result: any) => {
            setPendingList(result);

            setloandingspinner(false);
            // console.log(result)
          });

        } else {
          //Requester

          console.log(" Requester ");


          getAllPendingIOUList((result: any) => {
            setPendingList(result);

            setloandingspinner(false);
            // console.log(result)
          });

        }

      }



    } else if (type === 'IOU Settlement') {
      if (UserRoleID == '5') {

        // console.log("roll 5--------");
        getHODPendingIOUSetList((res: any) => {


          setPendingList(res);
          setloandingspinner(false);

          //console.log("roll 5--------", res[0].Amount)
        })

      }

      else {

        if (UserRoleID == '3' || UserRoleID == '4') {
          //Job owner or transport officer

          getPendingIOUSetList((resp: any) => {

            setPendingList(resp);
            setloandingspinner(false);
          });

        } else {
          //Requester

          getAllPendingIOUSetList((resp: any) => {

            setPendingList(resp);
            setloandingspinner(false);
          });

        }


      }



    } else if (type === 'One-Off Settlement') {

      if (UserRoleID == '5') {
        //HOD
        // console.log("roll 5--------");
        getHODPendingOneOffSetList((res: any) => {
          setPendingList(res);
          setloandingspinner(false);
        })

      } else {

        if (UserRoleID == '3' || UserRoleID == '4') {
          //Job owner or transport officer

          getPendingOneOffSetList((res: any) => {
            setPendingList(res);
            setloandingspinner(false);
          });

        } else {

          getAllPendingOneOffSetList((res: any) => {
            setPendingList(res);
            setloandingspinner(false);
          });


        }



      }


    }


  }

  //------Filter by Type---------------

  const setTypeFilter = (type: any) => {

    if (type === 'IOU') {
      setType('IOU');
      getPendingList('IOU');

    } else if (type === 'IOU Settlement') {
      setType('IOU Settlement');
      getPendingList('IOU Settlement');

    } else if (type === 'One-Off Settlement') {
      setType('One-Off Settlement');
      getPendingList('One-Off Settlement');

    }

  }

  //----IOU pendings filter by Date range------

  const getDatesFromRange = (range: any) => {

    slideOutModal();

    var fdate = range.firstDate + "T00:00:00";
    var ldate = range.secondDate + "T59:59:59";

    setloandingspinner(true);
    if (type === 'IOU') {


      console.log(" range first date ----------------", fdate);

      getDateFilterIOUList(fdate, ldate, (result: any) => {
        setPendingList(result);

        setRange({});
        setloandingspinner(false);
        // console.log(range.firstDate, range.secondDate)
        // console.log(result);
      })
    } else if (type === 'IOU Settlement') {
      getDateFilterIOUSETList(fdate, ldate, (result: any) => {
        setPendingList(result);
        setRange({});
        setloandingspinner(false);
        // console.log(result);
      })
    } else if (type === 'One-Off Settlement') {
      getDateFilterONEOFFList(fdate, ldate, (result: any) => {
        setPendingList(result);
        setRange({});
        setloandingspinner(false);
        // console.log(result);
      })
    }



  }

  const NoRemark = async () => {
    if (type === 'IOU') {

      setTxtRemark('');

      slideOutModal();
      // console.log('No Remark');

      // await AsyncStorage.setItem(AsyncStorageConstants.ASYNC_CURRENT_PENDING_LIST_TYPE, type);
      // navigation.navigate('PendingList');
    }

  }


  //-------use Effect------------------
  useFocusEffect(
    React.useCallback(() => {


      getLoginUserRoll().then(res1 => {
        setRoll(res1 + "");
        UserRoleID = res1;
        console.log("User Role: ", res1);
      })

      get_ASYNC_JOBOWNER_APPROVAL_AMOUNT().then(resp => {
        setMaxAmount(parseFloat(resp + ""));
        // console.log("Maximum Amount: ", resp);
      })

      getLoginUserID().then(result => {
        setUid(result + "");
        loggedUserID = result;
        // console.log("User ID: ", result);

      })

      getCurrentPendingListType().then(res => {

        // console.log(" more info  ........  ", res);

        if (res == 'IOU') {

          // console.log(" IOU tab [][][] ");


          setType('IOU');
          getPendingList('IOU');

        } else if (res == 'SETTLEMENT') {

          // console.log(" SETT tab [][][] ");

          setType('IOU Settlement');
          getPendingList('IOU Settlement');

        } else if (res == 'ONEOFF') {

          // console.log(" ONE OFF tab [][][] ");

          setType('One-Off Settlement');
          getPendingList('One-Off Settlement');

        } else if (res == 'all') {

          // console.log(" IOU tab 2 [][][] ");

          setType('IOU');
          getPendingList('IOU');
        }


      })




      setSelectedItems([]);
      // approveRemark(remarks);

    }, [navigation])


  );

  const UpdateNew_API = async (prams: any) => {

    const URL = BASE_URL + '/Mob_UpdateStatus.xsjs?dbName=PC_UAT_WM';



    try {

      console.log("APPROVE JSON UPLOAD [][][][][]    ", prams, '=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=--');

      // await axios.get(URL, { headers })
      axios.put(URL, prams, {
        headers: headers
      }).then((response) => {
        // console.log("[s][t][a][t][u][s][]", response);
        if (response.status == 200) {

          // updateSyncStatus(IOUNo, (result: any) => {

          // });

          // console.log("success ======= ", response.status);


          console.log("success ===222==== ", response.data);


        } else {

          console.log(" response code ======= ", response.status);

        }
      }).catch((error) => {

        console.log("error .....   ", error);

      });


    } catch (error) {
      console.log(error);

    }
  }
  //--------Update status and remark--------------
  const UpdateRequest = async (ID: any, Rtype: any, status: any, remark: string) => {

    // console.log(" status ====  " , status);


    const URL = BASE_URL + '/Mob_UpdateStatus.xsjs?dbName=PC_UAT_WM';

    const prams =
    {
      "PCRCode": ID,
      "Type": Rtype,
      "StatusID": status,
      "ModifyBy": loggedUserID,
      "Remark": remark,
    }

    try {

      console.log("Reject JSON UPLOAD ====  ", prams, '=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=--');

      // await axios.get(URL, { headers })
      axios.put(URL, prams, {
        headers: headers
      }).then((response) => {
        // console.log("[s][t][a][t][u][s][]", response.status);
        if (response.status == 200) {

          // updateSyncStatus(IOUNo, (result: any) => {

          // });

          // console.log("success ======= ", response.status);


          console.log("success ===222==== ", response.data);


        } else {

          console.log(" response code ======= ", response.status);

        }
      }).catch((error) => {

        console.log("error .....   ", error);

      });


    } catch (error) {
      console.log(error);

    }



  }

  const selectDateRange = () => {

    setRange('');
    slideInModal();


  }



  return (
    <SafeAreaView style={ComponentsStyles.CONTAINER}>
      <View style={styles.screen}>

        <Header title="Pending Requests" isBtn={true} btnOnPress={() => navigation.navigate('Home')} />

        <View style={{ flexDirection: 'row', marginTop: 8, marginBottom: 8, marginLeft: 15, marginRight: 15 }}>
          <View style={{ flex: 1 }} />
          {/* <Text style={{ fontFamily: ComponentsStyles.FONT_FAMILY.BOLD, color: ComponentsStyles.COLORS.HEADER_BLACK, fontSize: 16,marginRight:15 }}>Filter</Text> */}
          <TouchableOpacity onPress={() => selectDateRange()}>
            <IconA name='calendar' size={20} color={ComponentsStyles.COLORS.BLACK} />
          </TouchableOpacity>

        </View>
        <View style={styles.listTab}>
          {
            listTab.map((e, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.btnTab, type === e.type && styles.btnTabActive]}
                onPress={() => setTypeFilter(e.type)}
              >
                <Text style={[styles.textTab, type === e.type && styles.textTabActive]} key={i}>
                  {e.type}
                </Text>
              </TouchableOpacity>
            ))
          }

        </View>

        <Spinner
          visible={loandingspinner}
          textContent={'Loading...'}
          textStyle={{
            color: ComponentsStyles.COLORS.DASH_COLOR,
            fontFamily: ComponentsStyles.FONT_FAMILY.SEMI_BOLD,
            fontSize: 15
          }}
        />


        <FlatList
          showsHorizontalScrollIndicator={false}
          data={pendingList}
          horizontal={false}
          ListEmptyComponent={<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text style={styles.EmptyMassage}>No data found</Text></View>}
          renderItem={({ item }) => {
            return (
              <View>

                <RequestList
                  first_name={item.employee}
                  // last_name={item.last_name}
                  user_id={item.ID}
                  request_type={type + " Request"}
                  // amount={item.Amount}
                  amount={item.Amount}
                  status={item.Approve_Status == '1' ? "Open" : item.Approve_Status == '5' ? "HOD Pending" : ''}
                  currency_type="LKR"
                  user_avatar='https://reqres.in/img/faces/9-image.jpg'
                  request_channel="Mobile App"
                  employee_name={item.employee}
                  employee_no={item.USER_ID}
                  iou_type={item.IOUType}
                  job_no={item.Job_NO}
                  expense_type={item.Expences_Type}
                  jobremarks={item.Remark}
                  approved_status={approveList}
                  right={handleItemPress}
                  selectedItems={selectedItems}
                  remarks={item.Approve_Remark}
                  //requestDate = {requestDate}
                  date={item.RequestDate}
                  isCheckBoxVisible={UserRoleID == '1' ? false : true}
                  // isCheckBoxVisible={true}
                  RequestID={item.ID}
                />



              </View>
            )
          }

          }
          keyExtractor={item => `${item.Id}`}
        />

        <View style={{ marginBottom: 10 }} />

        {
          UserRoleID == '1' ?

            <></>

            :

            <View>

              <View style={{ marginLeft: 10, marginRight: 10, marginTop: 10, marginBottom: 5 }}>

                <ActionButton
                  title="Approve Request"
                  onPress={() => approve()}
                  style={{ flexDirection: 'row', justifyContent: "center" }}
                //disabled={roll=='Requester' ? true : false}
                />

              </View>


              <View style={{ flexDirection: "row", marginLeft: 5, marginRight: 5 }}>


                <ActionButton
                  title="Reject Request"
                  onPress={() => reject()}
                  styletouchable={{ width: '48%', marginLeft: 5 }}
                  style={{ flexDirection: 'row', justifyContent: "center", backgroundColor: "#FF3055" }}
                //disabled={roll=='Requester' ? true : false}
                />

                <ActionButton
                  title="Cancel Request"
                  styletouchable={{ width: '48%', marginLeft: 5 }}
                  onPress={() => cancel()}
                  //styletouchable={{ marginLeft: 5, width: '100%' }}
                  style={{ flexDirection: 'row', justifyContent: "center", backgroundColor: ComponentsStyles.COLORS.BROWN }}
                //disabled={roll=='Requester' ? true : false}
                />

              </View>



              <View style={{ marginBottom: 70 }} />
            </View>




        }




      </View>


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
        <View style={styles.modalCont}>

          {/* {
            isApprove ?

              <ApproveRejectModal
                approvebtn={ApproveAlert}
                cancelbtn={NoRemark}
                approverejecttxt="Approve"
                headertxt="Add Approval Remark"
                subtxt="Do you want to add a remark and approve?"
                placeholder="Add approval remark here(optional)"
                reamrkState={(val: any) => setTxtRemark(val)}
                txtremark={txtRemark}
              />

              :

              <>
                {
                  isReject ?

                    <ApproveRejectModal
                      approvebtn={RejectAlert}
                      approverejecttxt="Reject"
                      cancelbtn={NoRemark}
                      headertxt="Add Reject Remark"
                      subtxt="Do you want to add a remark and reject?"
                      placeholder="Add reject remark here*"
                      reamrkState={(val: any) => setTxtRemark(val)}
                      txtremark={txtRemark}
                    />

                    :
                    <ApproveRejectModal
                      approvebtn={CancelAlert}
                      approverejecttxt="Cancel"
                      cancelbtn={NoRemark}
                      headertxt="Add Cancel Remark"
                      subtxt="Do you want to add a remark and cancel?"
                      placeholder="Add cancel remark here*"
                      reamrkState={(val: any) => setTxtRemark(val)}
                      txtremark={txtRemark}
                    />


                }
              </>



          } */}

          <DateRangePicker
            onSelectDateRange={(range) => {
              setRange(range);
              // changeRange(range);
              // getDatesFromRange(range);
            }}
            blockSingleDateSelection={true}
            responseFormat="YYYY-MM-DD"
            onConfirm={() => getDatesFromRange(selectedRange)}
            onClear={slideOutModal}
            font={ComponentsStyles.FONT_FAMILY.SEMI_BOLD}
            confirmBtnTitle="Search"
            clearBtnTitle="Cancel"

          // maxDate={moment()}
          // minDate={moment().subtract(100, "days")}
          />

        </View>

        <View style={{ padding: 100 }} />

      </Animated.View>


      <Dialog
        visible={isDialog}
        onDismiss={() => closeDialog()}
      >

        {
          isApprove ?
            <Dialog.Title style={{ color: ComponentsStyles.COLORS.BLACK, fontFamily: ComponentsStyles.FONT_FAMILY.SEMI_BOLD }}>Please Enter Approve Remark</Dialog.Title>
            :

            <>
              {
                isReject ?

                  <Dialog.Title style={{ color: ComponentsStyles.COLORS.BLACK, fontFamily: ComponentsStyles.FONT_FAMILY.SEMI_BOLD }}>Please Enter Reject Remark</Dialog.Title>


                  :

                  <Dialog.Title style={{ color: ComponentsStyles.COLORS.BLACK, fontFamily: ComponentsStyles.FONT_FAMILY.SEMI_BOLD }}>Please Enter Cancel Remark</Dialog.Title>


              }

            </>

        }

        <Dialog.Content style={{ alignContent: "center", alignItems: "center" }}>

          <InputText
            style={{ paddingLeft: 10, }}
            placeholder="Enter Remark Here"
            placeholderColor={ComponentsStyles.COLORS.PROCEED_ASH}
            stateValue={txtRemark}
            setState={setTxtRemark}
            multiline={true}
            max={200}
          />

          <ActionButton
            title={isApprove ? "Approve" : isReject ? "Reject" : "Yes"}
            onPress={() => isApprove ? ApproveAlert() : isReject ? RejectAlert() : CancelAlert()} />

          <View style={{ padding: 10 }} />

          <ActionButton
            title="Cancel"
            onPress={() => closeDialog()}
            style={{ backgroundColor: ComponentsStyles.COLORS.RED_COLOR }}
          />
          <View style={{ padding: 5 }} />

        </Dialog.Content>

      </Dialog>

    </SafeAreaView>

  );

}
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F5F5F5",

  },
  listHeadling: {
    color: ComponentsStyles.COLORS.HEADER_BLACK,
    fontSize: 16,
    fontFamily: ComponentsStyles.FONT_FAMILY.BOLD,
    padding: 15
  },
  heading: {
    color: '#000',
    backgroundColor: "#fff",
    padding: 10,
    alignItems: 'center',
    justifyContent: "center",
    fontSize: 25,
    fontWeight: 'bold',
  },
  modalCont: {
    flex: 1,
    flexGrow: 1,
    width: width,
    paddingHorizontal: 10,

  },
  filter: {
    color: ComponentsStyles.COLORS.ICON_BLUE,
    fontSize: 16,
    fontFamily: ComponentsStyles.FONT_FAMILY.SEMI_BOLD,
    padding: 17,
    marginLeft: 120,
    flex: 1,
  },
  listTab: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginBottom: 20,
    justifyContent: "center",
  },
  btnTab: {
    width: Dimensions.get('window').width / 3.5,
    flexDirection: 'row',
    borderWidth: 0.5,
    borderColor: '#EBEBEB',
    padding: 10,
    justifyContent: 'center',
    alignItems: "center",
    color: ComponentsStyles.COLORS.BLACK
  },
  textTab: {
    fontSize: 12,
    fontFamily: ComponentsStyles.FONT_FAMILY.BOLD,
    color: ComponentsStyles.COLORS.BLACK,
    alignItems: "center"
  },
  btnTabActive: {
    alignItems: "center",
    backgroundColor: ComponentsStyles.COLORS.ICON_BLUE
  },
  textTabActive: {
    alignItems: "center",
    justifyContent: "center",
    color: ComponentsStyles.COLORS.WHITE
  },
  itemContainer: {
    flexDirection: 'row',
    paddingVertical: 15
  },
  itemLogo: {
    padding: 10
  },
  itemImage: {
    width: 50,
    height: 50
  },
  itemBody: {
    flex: 1,
    paddingHorizontal: 10,
    justifyContent: 'center'
  },
  itemName: {
    fontWeight: 'bold',
    fontSize: 16
  },
  itemStatus: {
    backgroundColor: 'green',
    paddingHorizontal: 6,
    justifyContent: 'center',
    right: 12,
  },
  EmptyMassage: {
    color: ComponentsStyles.COLORS.BLACK,
    marginLeft: 10,
    fontFamily: ComponentsStyles.FONT_FAMILY.SEMI_BOLD,
    fontSize: 16,
    fontStyle: 'normal',
  },
})

export default PendingList;


// const onShowPopup = () => {
  //   popupRef.show()
  // }

  // const onClosePopup = () => {
  //   popupRef.close()
  // }

/*const [restaurantInfo, setRestaurantInfo] = useState([]);

useEffect(() => {
  const getRestaurantInfo = async () => {
    try {
      let res = await axios({
        method: "get",
        url: `https://reqres.in/api/users?page=2`
      });
 
      setRestaurantInfo(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };
  getRestaurantInfo();
}, []);*/