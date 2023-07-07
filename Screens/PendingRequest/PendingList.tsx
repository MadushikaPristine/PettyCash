import React, { useEffect, useState } from "react";
import { Alert, Animated, Button, Dimensions, FlatList, Keyboard, Modal, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import Header from "../../Components/Header";
import RequestList from "../../Components/RequestList";
import ComponentsStyles from "../../Constant/Components.styles";
import ActionButton from "../../Components/ActionButton";
import ApproveRejectModal from "../../Components/ApproveRejectComponent";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { ApprovedIOU, CancelledIOU, getDateFilterIOUList, getPendingHODApprovalIOUList, getPendingIOU, getPendingIOUList, getPendingSecondApprovalIOUList, RejectedIOU, saveApproveRemark, saveIOU, saveRemark } from "../../SQLiteDBAction/Controllers/IOUController";
import { ApprovedIOUSET, CancelledIOUSET, getDateFilterIOUSETList, getPendingIOUSetList, RejectedIOUSET, saveApproveRemarkIOUSET } from "../../SQLiteDBAction/Controllers/IouSettlementController";
import { ApprovedONEOFF, CancelledONEOFF, getDateFilterONEOFFList, getPendingOneOffSetList, RejectedONEOFF, saveApproveRemarkONEOFF } from "../../SQLiteDBAction/Controllers/OneOffSettlementController";
import DateRangePopup from "../../Components/DateRangePopup";
//import Notifications from 'react-native-notifications';
import { getCurrentPendingListType, getLoginUserID, getLoginUserRoll, get_ASYNC_JOBOWNER_APPROVAL_AMOUNT, get_ASYNC_MAX_AMOUNT } from "../../Constant/AsynStorageFuntion";
import { BASE_URL, headers } from "../../Constant/ApiConstants";
import axios from "axios";
import Spinner from "react-native-loading-spinner-overlay";


let width = Dimensions.get("screen").width;
const height = Dimensions.get('screen').height;


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

  //flatlist
  const [pendingList, setPendingList] = useState([]);


  const [modalStyle, setModalStyle] = useState(new Animated.Value(height));
  const [selectedItems, setSelectedItems]: any = useState([]);
  const [rDate, setRDate] = useState(Date());

  const [notificationMessage, setNotificationMessage] = useState('');
  const [loandingspinner, setloandingspinner] = useState(false);

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
      toValue: height / 2,
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


      slideInModal();


    } else {

      console.log(" no selected items");


    }

  }

  const reject = () => {
    setIsApprove(false);
    setIsReject(true);
    slideInModal();

  }

  const cancel = () => {
    setIsApprove(false);
    setIsReject(false);
    slideInModal();
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
      { text: 'Yes', onPress: (approveRemark) },
    ]);
  }

  const RejectAlert = () => {
    Alert.alert('Reject Request !', 'Are you sure you want to Reject Request ?', [
      {
        text: 'No',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      { text: 'Yes', onPress: (rejectRemark) },
    ]);
  }

  const CancelAlert = () => {
    Alert.alert('Cancel Request !', 'Are you sure you want to canceled Request ?', [
      {
        text: 'No',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      { text: 'Yes', onPress: (cancelRemark) },
    ]);
  }

  //------------Apply approve remark---------------

  const approveRemark = (remark: any) => {




    // console.log("selected list >>>>>>>>>>>>>>>>>>>>>>>>>>>>>   ",selectedItems);

    for (let i = 0; i < selectedItems.length; ++i) {
      if (type === 'IOU') {
        ApprovedIOU(selectedItems[i], (result: any) => {
          setApproveList(selectedItems[i]);
          // console.log(" item list ..............  ", selectedItems[i], " resp ,,,,,,,, ", result)

        })

        saveApproveRemark(remark, selectedItems[i], (result: any) => {
          console.log("approved status -- ", result);



        })
        slideOutModal();
        remark = '';
        //Alert.alert("Approved Request");

        // onApprovedNotification(selectedItems[i], type);
        navigation.navigate('IOU', { status: 'Approved', })

        UpdateRequest(selectedItems[i], 'IOU Request', 2, remark);
        //handlePress();
        //console.log(remark);


      } else if (type === 'IOU Settlement') {
        ApprovedIOUSET(selectedItems[i], (result: any) => {
          setApproveList(selectedItems[i]);
          // console.log(" item list ..............  ", selectedItems[i], " resp ,,,,,,,, ", result)

        })
        saveApproveRemarkIOUSET(remark, selectedItems[i], (result: any) => {
          // console.log("Remark", txtRemark);
        })
        slideOutModal();
        //Alert.alert("Approved Request");
        // onApprovedNotification(selectedItems[i], type);
        navigation.navigate('SettlementScreen', {
          status: 'Approved',
        })

        UpdateRequest(selectedItems[i], 'IOU Settlement', 2, remark);
        //console.log(remark);


      } else if (type === 'One-Off Settlement') {
        ApprovedONEOFF(selectedItems[i], (result: any) => {
          setApproveList(selectedItems[i]);
          // console.log(" item list ..............  ", selectedItems[i], " resp ,,,,,,,, ", result)

        })
        saveApproveRemarkONEOFF(remark, selectedItems[i], (result: any) => {
          // console.log("Remark", txtRemark);
        })
        slideOutModal();
        //Alert.alert("Approved Request");
        // onApprovedNotification(selectedItems[i], type);
        navigation.navigate('OneOffScreen', {
          status: 'Approved',
        })

        UpdateRequest(selectedItems[i], 'OneOff Settlement', 2, remark);
        //console.log(remark);


      }




    }


    // slideOutModal();
    // navigation.navigate('IOU', {
    //   status: 'Approved',
    // })
    // //console.log(remark);
    // Alert.alert("Approved Request");


    // if(selectedItems){
    //   ApprovedIOU((result: any) => {
    //     setApproveList(result);
    //     console.log(selectedItems);

    //   })
    //   slideOutModal();
    //   Alert.alert("Approved Request");
    // }

    // ApprovedIOU((result: any) => {
    //   setApproveList(result);
    //   {selectedItems}

    // })

    // approved_status="1"
    // slideOutModal();
    // Alert.alert("Approved Request");
  }

  //------------Apply reject remark---------------

  const rejectRemark = (remark: any) => {

    for (let i = 0; i < selectedItems.length; ++i) {
      if (type === 'IOU') {

        RejectedIOU(selectedItems[i], (result: any) => {
          setApproveList(selectedItems[i]);
          // console.log(" item list ..............  ", selectedItems[i], " resp ,,,,,,,, ", result)
        })
        saveApproveRemark(remark, selectedItems[i], (result: any) => {
          // console.log("Remark", remark);
        })
        slideOutModal();
        //Alert.alert("Reject Request");
        // onRejectedNotification(selectedItems[i], type);
        navigation.navigate('IOU', {
          status: 'Rejected',
        })
        UpdateRequest(selectedItems[i], 'IOU Request', 3, remark);
        //console.log(remark);


      } else if (type === 'IOU Settlement') {
        RejectedIOUSET(selectedItems[i], (result: any) => {
          setApproveList(selectedItems[i]);
          // console.log(" item list ..............  ", selectedItems[i], " resp ,,,,,,,, ", result)

        })
        saveApproveRemarkIOUSET(remark, selectedItems[i], (result: any) => {
          // console.log("Remark", remark);
        })

        slideOutModal();
        //Alert.alert("Reject Request");
        // onRejectedNotification(selectedItems[i], type);
        navigation.navigate('SettlementScreen', {
          status: 'Rejected',
        })
        UpdateRequest(selectedItems[i], 'IOU Settlement', 3, remark);
        //console.log(remark);


      } else if (type === 'One-Off Settlement') {
        RejectedONEOFF(selectedItems[i], (result: any) => {
          setApproveList(selectedItems[i]);
          // console.log(" item list ..............  ", selectedItems[i], " resp ,,,,,,,, ", result)

        })
        saveApproveRemarkONEOFF(remark, selectedItems[i], (result: any) => {
          // console.log("Remark", remark);
        })

        slideOutModal();
        //Alert.alert("Reject Request");
        // onRejectedNotification(selectedItems[i], type);
        navigation.navigate('OneOffScreen', {
          status: 'Rejected',
        })
        UpdateRequest(selectedItems[i], 'OneOff Settlement', 3, remark);
        //console.log(remark);

      }


    }

  }

  //------------Apply cancel remark---------------

  const cancelRemark = (remark: any) => {

    for (let i = 0; i < selectedItems.length; ++i) {
      if (type === 'IOU') {

        CancelledIOU(selectedItems[i], (result: any) => {
          setApproveList(selectedItems[i]);
          // console.log(" item list ..............  ", selectedItems[i], " resp ,,,,,,,, ", result)
        })
        saveApproveRemark(remark, selectedItems[i], (result: any) => {
          // console.log("Remark", remark);
        })
        slideOutModal();
        //Alert.alert("Cancel Request");
        // onCancelledNotification(selectedItems[i], type);
        navigation.navigate('IOU', {
          status: 'Cancelled',
        })

        UpdateRequest(selectedItems[i], 'IOU Request', 4, remark);
        //console.log(remark);


      } else if (type === 'IOU Settlement') {
        CancelledIOUSET(selectedItems[i], (result: any) => {
          setApproveList(selectedItems[i]);
          // console.log(" item list ..............  ", selectedItems[i], " resp ,,,,,,,, ", result)

        })
        saveApproveRemarkIOUSET(remark, selectedItems[i], (result: any) => {
          // console.log("Remark", remark);
        })
        slideOutModal();
        //Alert.alert("Cancel Request");
        // onCancelledNotification(selectedItems[i], type);
        navigation.navigate('SettlementScreen', {
          status: 'Cancelled',
        })
        UpdateRequest(selectedItems[i], 'IOU Settlement', 4, remark);
        //console.log(remark);


      } else if (type === 'One-Off Settlement') {
        CancelledONEOFF(selectedItems[i], (result: any) => {
          setApproveList(selectedItems[i]);
          // console.log(" item list ..............  ", selectedItems[i], " resp ,,,,,,,, ", result)

        })
        saveApproveRemarkONEOFF(remark, selectedItems[i], (result: any) => {
          // console.log("Remark", remark);
        })
        slideOutModal();
        //console.log(remark);
        //Alert.alert("Cancel Request");
        // onCancelledNotification(selectedItems[i], type);
        navigation.navigate('OneOffScreen', {
          status: 'Cancelled',
        })

        UpdateRequest(selectedItems[i], 'OneOff Settlement', 4, remark);
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
      if (roll == '5') {

        // console.log("roll 5--------");
        // getPendingIOUList((res: any) => {
        //   for (let i = 0; i < res.length; i++) {
        //     if (res[i].Amount >= maxAmount) {
        //       HODIOUList.push(res[i]);

        //     }
        //   }

        //   setPendingList(HODIOUList);
        //   setloandingspinner(false);

        //   //console.log("roll 5--------", res[0].Amount)
        // })
        getPendingHODApprovalIOUList(maxAmount, (res: any) => {
          setPendingList(res);
          setloandingspinner(false);
        })

        // } else if (roll == '3') {
        //   // console.log("roll 3--------");
        //   getPendingIOUList((res: any) => {
        //     for (let i = 0; i < res.length; i++) {
        //       if (res[i].CreatedBy == uId) {
        //         HODIOUList.push(res[i]);

        //       }
        //     }

        //     setPendingList(HODIOUList);
        //     setloandingspinner(false);

        //     //console.log("roll 5--------", res[0].Amount)
        //   })
      } else {
        getPendingIOUList((result: any) => {
          setPendingList(result);

          setloandingspinner(false);
          // console.log(result)
        });
      }



    } else if (type === 'IOU Settlement') {
      if (roll == '5') {

        // console.log("roll 5--------");
        getPendingIOUSetList((res: any) => {
          for (let i = 0; i < res.length; i++) {
            if (res[i].Amount >= maxAmount) {
              HODIOUSETList.push(res[i]);

            }
          }

          setPendingList(HODIOUSETList);
          setloandingspinner(false);

          //console.log("roll 5--------", res[0].Amount)
        })

      } else if (roll == '3') {
        // console.log("roll 3--------");
        getPendingIOUSetList((res: any) => {
          for (let i = 0; i < res.length; i++) {
            if (res[i].CreatedBy == uId) {
              HODIOUSETList.push(res[i]);

            }
          }

          setPendingList(HODIOUSETList);
          setloandingspinner(false);

          //console.log("roll 5--------", res[0].Amount)
        })
      } else {
        getPendingIOUSetList((resp: any) => {

          setPendingList(resp);
          setloandingspinner(false);
        });
      }



    } else if (type === 'One-Off Settlement') {

      if (roll == '5') {

        // console.log("roll 5--------");
        getPendingOneOffSetList((res: any) => {
          for (let i = 0; i < res.length; i++) {
            if (res[i].Amount >= maxAmount) {
              HODONEOFFList.push(res[i]);

            }
          }

          setPendingList(HODONEOFFList);
          setloandingspinner(false);

          //console.log("roll 5--------", res[0].Amount)
        })

      } else if (roll == '3') {
        // console.log("roll 3--------");
        getPendingOneOffSetList((res: any) => {
          for (let i = 0; i < res.length; i++) {
            if (res[i].CreatedBy == uId) {
              HODONEOFFList.push(res[i]);

            }
          }

          setPendingList(HODONEOFFList);
          setloandingspinner(false);

          //console.log("roll 5--------", res[0].Amount)
        })
      }
      else {

        getPendingOneOffSetList((res: any) => {
          setPendingList(res);
          setloandingspinner(false);
        });

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
    if (type === 'IOU') {

      var fdate = range.firstDate + " 00:00:00";
      var ldate = range.secondDate + " 23:59:59";

      // console.log(" range first date ----------------" ,fdate);

      getDateFilterIOUList(fdate, ldate, (result: any) => {
        setPendingList(result);

        // console.log(range.firstDate, range.secondDate)
        // console.log(result);
      })
    } else if (type === 'IOU Settlement') {
      getDateFilterIOUSETList(range.firstDate, range.secondDate, (result: any) => {
        setPendingList(result);
        // console.log(result);
      })
    } else if (type === 'One-Off Settlement') {
      getDateFilterONEOFFList(range.firstDate, range.secondDate, (result: any) => {
        setPendingList(result);
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

      getLoginUserRoll().then(res1 => {
        setRoll(res1 + "");
        // console.log("User Roll: ", res);
      })

      get_ASYNC_JOBOWNER_APPROVAL_AMOUNT().then(resp => {
        setMaxAmount(parseFloat(resp + ""));
        // console.log("Maximum Amount: ", resp);
      })

      getLoginUserID().then(result => {
        setUid(result + "");
        // console.log("User ID: ", result);

      })

      setSelectedItems([]);
      approveRemark(remarks);

    }, [navigation])


  );

  //--------Update status and remark--------------
  const UpdateRequest = async (ID: any, Rtype: any, status: any, remark: string) => {

    const URL = BASE_URL + 'Mob_UpdateStatus.xsjs?dbName=TPL_REPORT_TEST'

    try {

      const prams = {
        "PCRCode": ID,
        "Type": Rtype,
        "StatusID": status,
        "ModifyBy": 158,
        "Remark": remark,

      }


      // console.log(prams, '=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=--');

      // await axios.get(URL, { headers })
      axios.put(URL, prams, {
        headers: headers
      }).then((response) => {
        // console.log("[s][t][a][t][u][s][]", response.status);
        if (response.status == 200) {

          // updateSyncStatus(IOUNo, (result: any) => {

          // });

          // console.log("success ======= ", response.status);


          //console.log("success ===222==== ", response.data);


        } else {

          // console.log(" response code ======= ", response.status);

        }
      }).catch((error) => {

        // console.log("error .....   ", error);


      });


    } catch (error) {
      // console.log(error);

    }



  }




  return (
    <SafeAreaView style={ComponentsStyles.CONTAINER}>
      <View style={styles.screen}>

        <Header title="Pending Requests" isBtn={true} btnOnPress={() => navigation.navigate('Home')} />

        <View style={{ flexDirection: 'row', }}>
          <Text style={styles.listHeadling}>Pending Requests</Text>
          <View style={styles.filter}><DateRangePopup filter={getDatesFromRange} /></View>
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
                  status={approved_status = 1 ? "Open" : " "}
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
                  //isCheckBoxVisible={roll == 'Requester' ? false : true}
                  isCheckBoxVisible={true}
                  RequestID={item.ID}
                />



              </View>
            )
          }

          }
          keyExtractor={item => `${item.Id}`}
        />

        <View style={{ marginBottom: 10 }} />

        <View>
          <View style={{ flexDirection: "row" }}>
            <ActionButton
              title="Approve Request"
              styletouchable={{ width: '49%' }}
              onPress={() => approve()}
              style={{ flexDirection: 'row', justifyContent: "center" }}
            //disabled={roll=='Requester' ? true : false}
            />

            <ActionButton
              title="Reject Request"
              onPress={() => reject()}
              styletouchable={{ width: '49%', marginLeft: 5 }}
              style={{ flexDirection: 'row', justifyContent: "center", backgroundColor: "#FF3055" }}
            //disabled={roll=='Requester' ? true : false}
            />

          </View>

          <View style={{ marginLeft: 10, marginRight: 10, marginTop: 10 }}>
            <ActionButton
              title="Cancel Request"
              onPress={() => cancel()}
              //styletouchable={{ marginLeft: 5, width: '100%' }}
              style={{ flexDirection: 'row', justifyContent: "center", backgroundColor: ComponentsStyles.COLORS.BROWN }}
            //disabled={roll=='Requester' ? true : false}
            />
          </View>

          <View style={{ marginBottom: 70 }} />
        </View>



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

          {
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



          }

        </View>

      </Animated.View>

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