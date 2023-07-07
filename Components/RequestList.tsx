import { useFocusEffect } from "@react-navigation/native";
import React from "react";
import { Image, StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import { Button, Checkbox } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { Double } from "react-native/Libraries/Types/CodegenTypes";
import ComponentsStyles from "../Constant/Components.styles";
import { pendingRequestList } from "../Constant/DummyData";
import { BottomPopup } from "../Screens/PendingRequest/BottomPopup";
import { getIOUJobsListByID } from "../SQLiteDBAction/Controllers/IOUController";
import { getIOUSETJobsListByID } from "../SQLiteDBAction/Controllers/IouSettlementController";
import { getOneOffJobsListByID } from "../SQLiteDBAction/Controllers/OneOffSettlementController";
import ButtonSheetComponent from "./ButtonSheetComponent";
import { getIOUAttachmentListByID } from "../SQLiteDBAction/Controllers/AttachmentController";
import { get_ASYNC_JOBOWNER_APPROVAL_AMOUNT, get_ASYNC_MAX_AMOUNT } from "../Constant/AsynStorageFuntion";



type ParamTypes = {
  first_name?: string;
  last_name?: string;
  user_id?: any;
  amount?: any;
  currency_type?: string;
  status?: string;
  approved_status?: string;
  request_type?: string;
  user_avatar?: any;
  request_channel?: string;
  employee_no?: string;
  date?: any;
  requestDate?: any;
  job_no?: string;
  expense_type?: string;
  remarks?: string;
  employee_name?: string;
  right?: any;
  selectedItems?: any;
  isCheckBoxVisible?: boolean;
  ap_status?: any;
  RequestID?: any;
  jobremarks?: any;
  iou_type?: any,
}

const RequestList = ({ jobremarks,RequestID,isCheckBoxVisible, ap_status, first_name, last_name, user_id, status, date,iou_type, approved_status, amount, user_avatar, request_type, currency_type, request_channel, employee_no, job_no, expense_type, remarks, employee_name, right, selectedItems, requestDate }: ParamTypes) => {
  let popupRef = React.createRef()

  const onShowPopup = () => {
    popupRef.show()
  }

  const onClosePopup = () => {
    popupRef.close()
  }

  

  //   const getType = () => {
  //     if (request_type == "1") {


  //         setIouTypeJob("Job No");


  //     } else if (request_type == "2") {


  //         setIouTypeJob("Vehicle No");


  //     } else {



  //     }
  // }
  const [checked, setChecked] = React.useState(false);
  const [Request_ID, setRequest_ID] = React.useState(RequestID);
  const [DetailsList, setDetailList] = React.useState([]);
  const [attachList, setAttachList] = React.useState([]);
  const [maxAmount,setMaxAmount] = React.useState(0.0);

  // const onToggleCheckbox = () => {
  //   // const index = checked.indexOf(id);
  //   // if (index > -1) {
  //   //   const newSelectedItems = [...checked];
  //   //   newSelectedItems.splice(index, 1);
  //   //   setChecked(newSelectedItems);
  //   // } else {
  //   //   setChecked([...checked, id]);
  //   // }
  //   setChecked(!checked);


  // };
  //const [selectedItems, setSelectedItems] = React.useState([]);
  // const handleItemPress = (itemId) => {
  //   if (selectedItems.includes(itemId)) {
  //     setSelectedItems(selectedItems.filter((user_id) => user_id !== itemId));
  //   } else {
  //     setSelectedItems([...selectedItems, itemId]);
  //   }
  // };

  useFocusEffect(
    React.useCallback(() => {

      getJobList();
      getAttachmentList();

      get_ASYNC_JOBOWNER_APPROVAL_AMOUNT().then(resp => {
        setMaxAmount(resp);
        // console.log("Maximum Amount: ", resp);
      })

    },[])
  );

  const getAttachmentList = () => {
    getIOUAttachmentListByID(Request_ID, (resp:any) => {
      setAttachList(resp);
      //console.log(attachList);
    })
  }

  const getJobList = () => {
    if(request_type == "IOU Request"){
      getIOUJobsListByID(Request_ID,(response:any) => {

        setDetailList(response);
        //console.log(response);

      });

      // getIOUAttachmentListByID(Request_ID, (resp:any) => {
      //   setAttachList(resp);
      //   console.log(attachList);
      // })
  
    }else if(request_type == "IOU Settlement Request"){
      getIOUSETJobsListByID(Request_ID,(response:any) => {

        setDetailList(response);
  
      });
    }else if(request_type == "One-Off Settlement Request"){
      getOneOffJobsListByID(Request_ID,(response:any) => {

        setDetailList(response);
  
      });
    }

    
  }

  return (

    <SafeAreaView>
      <TouchableWithoutFeedback onPress={onShowPopup}>
        <View style={styles.list}>
          <Image
            source={{ uri: user_avatar }}
            style={styles.avatar}
            resizeMode="center"
          />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={{ color: ComponentsStyles.COLORS.SERVISE_HEADER_ASH, fontFamily: ComponentsStyles.FONT_FAMILY.SEMI_BOLD, fontSize: 12, fontWeight: "bold"}}>
              {first_name}
            </Text>
            <Text style={{ color: ComponentsStyles.COLORS.SERVICE_DETAILS_BLACK, fontFamily: ComponentsStyles.FONT_FAMILY.REGULAR, fontSize: 12 }}>{user_id}</Text>
          </View>
          <View style={styles.verticleLine}></View>
          <View style={{ flex: 1, marginLeft: 25 }}>
            <Text style={{ color: ComponentsStyles.COLORS.ICON_BLUE, fontFamily: ComponentsStyles.FONT_FAMILY.REGULAR, fontSize: 12, fontWeight: "bold" }}>{request_type}</Text>
            <Text style={{ color: amount >= maxAmount ? ComponentsStyles.COLORS.RED_COLOR : ComponentsStyles.COLORS.SERVICE_DETAILS_BLACK, fontFamily: ComponentsStyles.FONT_FAMILY.MEDIUM, fontSize: 12 }}>{amount = null || '' ? "0.00 LKR" : amount.toLocaleString("en-LK", {
                    style: "currency",
                    currency: "LKR",
                    minimumFractionDigits: 2,
                  })}</Text>
          </View>

          {
            isCheckBoxVisible ?


              <View style={{ borderColor: '#270DCB' }}>
                <Checkbox

                  color="#270DCB"
                  uncheckedColor="#270DCB"
                  status={selectedItems.includes(user_id) ? 'checked' : 'unchecked'}
                  onPress={() => right(user_id)}

                />

              </View>

              :
              <></>
          }


        </View>
      </TouchableWithoutFeedback>
      <BottomPopup
        
        ref={(target) => popupRef = target}
        onTouchOutside={onClosePopup}
        first_name={first_name}
        last_name={last_name}
        user_id={user_id}
        request_type={request_type}
        amount={amount}
        currency_type={currency_type}
        status={status}
        user_avatar={user_avatar}
        request_channel={request_channel}
        employee_name={employee_name}
        employee_no={employee_no}
        job_no={job_no}
        expense_type={expense_type}
        remarks={remarks}
        approved_status={approved_status}
        jobList={DetailsList}
        attachList={attachList}
        jobremarks={jobremarks}
        isCopyRequest={approved_status=="3"? true : false}
        iou_type={iou_type}
      />
      
    </SafeAreaView>
    



  )
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    padding: 7,
    backgroundColor: "#fff",
    borderRadius: 5,
    marginVertical: 5,
    marginHorizontal: 6,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verticleLine: {
    height: '100%',
    width: 1,
    backgroundColor: '#BDCDD6',
    marginLeft: 10,
  },
})

export default RequestList;