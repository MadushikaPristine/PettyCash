import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { Dimensions, FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { Button, Checkbox } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { Double } from "react-native/Libraries/Types/CodegenTypes";
import ComponentsStyles from "../Constant/Components.styles";
import { pendingRequestList } from "../Constant/DummyData";
import { BottomPopup } from "../Screens/PendingRequest/BottomPopup";
import { getIOUJobsListByID, getIOUJobsListDetailsByID } from "../SQLiteDBAction/Controllers/IOUController";
import { getIOUSETJobsListByID } from "../SQLiteDBAction/Controllers/IouSettlementController";
import { getOneOffJobsListByID } from "../SQLiteDBAction/Controllers/OneOffSettlementController";
import ButtonSheetComponent from "./ButtonSheetComponent";
import { getIOUAttachmentListByID } from "../SQLiteDBAction/Controllers/AttachmentController";
import { get_ASYNC_JOBOWNER_APPROVAL_AMOUNT, get_ASYNC_MAX_AMOUNT } from "../Constant/AsynStorageFuntion";
import Modal from "react-native-modal";
import ActionButton from "./ActionButton";
import IconA from 'react-native-vector-icons/FontAwesome';
import AttachmentView from "./AttachmentView";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AsyncStorageConstants from "../Constant/AsyncStorageConstants";
import JobsView from "./JobsView";

let width = Dimensions.get("screen").width;
const height = Dimensions.get('screen').height;


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

const RequestList = ({ jobremarks, RequestID, isCheckBoxVisible, ap_status, first_name, last_name, user_id, status, date, iou_type, approved_status, amount, user_avatar, request_type, currency_type, request_channel, employee_no, job_no, expense_type, remarks, employee_name, right, selectedItems, requestDate }: ParamTypes) => {
  let popupRef = React.createRef()

  const navigation = useNavigation();
  const onShowPopup = () => {

    setisModalVisible(true);
    // popupRef.show()
  }

  const onClosePopup = () => {

    setisModalVisible(false);
    // popupRef.close()
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
  const [maxAmount, setMaxAmount] = React.useState(0.0);
  const [isModalVisible, setisModalVisible] = useState(false);

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

     
      

    }, [])
  );

  const getAttachmentList = () => {
    getIOUAttachmentListByID(Request_ID, (resp: any) => {
      setAttachList(resp);
      //console.log(attachList);
    })
  }

  const getJobList = () => {

    // console.log("status [][][][] ==  " , status);


    if (request_type == "IOU Request") {
      getIOUJobsListDetailsByID(Request_ID, (response: any) => {

        setDetailList(response);
        //console.log(response);

      });

      // getIOUAttachmentListByID(Request_ID, (resp:any) => {
      //   setAttachList(resp);
      //   console.log(attachList);
      // })

    } else if (request_type == "IOU Settlement Request") {
      getIOUSETJobsListByID(Request_ID, (response: any) => {

        // console.log(" Request ID ==== " , Request_ID);


        setDetailList(response);

      });
    } else if (request_type == "One-Off Settlement Request") {
      getOneOffJobsListByID(Request_ID, (response: any) => {

        setDetailList(response);

      });
    }


  }

  const reOpenRequest = () => {
    AsyncStorage.setItem(AsyncStorageConstants.ASYNC_STORAGE_IS_COPY, "True");
    AsyncStorage.setItem(AsyncStorageConstants.ASYNC_STORAGE_REJECTED_ID, user_id);
    if (request_type == "IOU Request") {
      navigation.navigate('NewIOU');
      this.close();
    } else if (request_type == "IOU Settlement Request") {
      navigation.navigate('NewIOUSettlement');
      this.close();
    } else if (request_type == "One-Off Settlement Request") {
      navigation.navigate('NewOneOffSettlement');
      this.close();
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
            <Text style={{ color: ComponentsStyles.COLORS.SERVISE_HEADER_ASH, fontFamily: ComponentsStyles.FONT_FAMILY.SEMI_BOLD, fontSize: 12, fontWeight: "bold" }}>
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
        isCopyRequest={approved_status == "3" ? true : false}
        iou_type={iou_type}
      />



      <Modal isVisible={isModalVisible} style={{ backgroundColor: ComponentsStyles.COLORS.WHITE, borderRadius: 10 }}>
        {/* <View style={{ flex: 1 }}>
          <View style={{ flex: 1.5, marginBottom: 5 }}>


            <View style={{ flexDirection: 'row', marginTop: 5, marginBottom: 8, marginLeft: 5, marginRight: 5 }}>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: ComponentsStyles.COLORS.PRIMARY_COLOR,
                    fontSize: 20,
                    fontFamily: ComponentsStyles.FONT_FAMILY.BOLD,
                    textAlign: "center"
                  }}>
                  Request Details
                </Text>
              </View>
              {/* <Text style={{ fontFamily: ComponentsStyles.FONT_FAMILY.BOLD, color: ComponentsStyles.COLORS.HEADER_BLACK, fontSize: 16,marginRight:15 }}>Filter</Text>
              <TouchableOpacity onPress={() => onClosePopup()}>
                <IconA name='close' size={30} color={ComponentsStyles.COLORS.RED_COLOR} />
              </TouchableOpacity>

            </View>

            <View style={{ margin: 10, marginRight: 15 }}>

              <ScrollView >




                <View style={styles.detaillist}>
                  <Image
                    source={{ uri: user_avatar }}
                    style={styles.avatar}
                    resizeMode="center"
                  />
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={{ fontFamily: ComponentsStyles.FONT_FAMILY.SEMI_BOLD, color: ComponentsStyles.COLORS.BLACK, fontSize: 14 }}>
                      Requested By
                    </Text>
                    <Text style={{ color: ComponentsStyles.COLORS.BLACK, fontFamily: ComponentsStyles.FONT_FAMILY.MEDIUM, fontSize: 12 }}>Employee Number</Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: 50, }}>
                    <Text style={{ color: ComponentsStyles.COLORS.DETAIL_ASH, fontFamily: ComponentsStyles.FONT_FAMILY.REGULAR, fontSize: 12, textAlign: 'right' }}>{first_name} {last_name}</Text>
                    <Text style={{ color: ComponentsStyles.COLORS.DETAIL_ASH, fontFamily: ComponentsStyles.FONT_FAMILY.REGULAR, fontSize: 12, textAlign: 'right' }}>
                      {user_id}
                    </Text>
                  </View>


                  <View style={styles.list}>
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text style={styles.textHeader}>Petty cash Request ID</Text>
                    </View>
                    <View style={{ flex: 1, marginLeft: 100 }}>
                      <Text style={styles.text}>{user_id}</Text>
                    </View>
                  </View>



                </View>

              </ScrollView>

            </View>
          </View>
        </View> */}

        <View style={{ flexDirection: 'row', marginTop: 5, marginBottom: 8, marginLeft: 5, marginRight: 5 }}>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                color: ComponentsStyles.COLORS.DETAIL_ASH,
                fontSize: 20,
                fontFamily: ComponentsStyles.FONT_FAMILY.BOLD,
                textAlign: "center"
              }}>
              Request Details
            </Text>
          </View>
          <TouchableOpacity onPress={() => onClosePopup()}>
            <IconA name='close' size={30} color={ComponentsStyles.COLORS.RED_COLOR} />
          </TouchableOpacity>

        </View>


        <ScrollView>

          <View style={styles.detaillist}>
            <Image
              source={{ uri: user_avatar }}
              style={styles.avatar}
              resizeMode="center"
            />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={{ fontFamily: ComponentsStyles.FONT_FAMILY.SEMI_BOLD, color: ComponentsStyles.COLORS.DETAIL_ASH, fontSize: 14 }}>
                Requested By
              </Text>
              <Text style={{ color: ComponentsStyles.COLORS.DETAIL_ASH, fontFamily: ComponentsStyles.FONT_FAMILY.MEDIUM, fontSize: 12 }}>Employee Number</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 50, }}>
              <Text style={{ color: ComponentsStyles.COLORS.DETAIL_ASH, fontFamily: ComponentsStyles.FONT_FAMILY.REGULAR, fontSize: 12, textAlign: 'right' }}>{first_name} {last_name}</Text>
              <Text style={{ color: ComponentsStyles.COLORS.DETAIL_ASH, fontFamily: ComponentsStyles.FONT_FAMILY.REGULAR, fontSize: 12, textAlign: 'right' }}>
                {user_id}
              </Text>
            </View>
          </View>
          <View style={styles.list}>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.textHeader}>Petty cash Request ID</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 100 }}>
              <Text style={styles.text}>{user_id}</Text>
            </View>
          </View>

          <View style={styles.list}>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.textHeader}>Request Type</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 100 }}>
              <Text style={styles.text}>{request_type}</Text>
            </View>
          </View>


          {
            request_type == "IOU Request" ?

              <View style={styles.list}>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.textHeader}>IOU Type</Text>
                </View>
                <View style={{ flex: 1, marginLeft: 100 }}>
                  <Text style={styles.text}>{iou_type}</Text>
                </View>
              </View>

              :

              <></>

          }



          <View style={styles.list}>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.textHeader}>Request Channel</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 100 }}>
              <Text style={styles.text}>{request_channel}</Text>
            </View>
          </View>

          <View style={styles.list}>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.textHeader}>Status</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 100 }}>
              <Text style={{ color: status === 'Cancelled' ? ComponentsStyles.COLORS.RED_COLOR : ComponentsStyles.COLORS.OPEN_COLOR, fontFamily: ComponentsStyles.FONT_FAMILY.MEDIUM, fontSize: 12, textAlign: 'right' }}>
                {status}
              </Text>
            </View>
          </View>

          <View style={styles.list}>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.textHeader}>Covering Employee Name</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 50 }}>
              <Text style={styles.text}>{employee_name}</Text>
            </View>
          </View>

          <View style={styles.list}>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.textHeader}>Covering Employee No</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 80 }}>
              <Text style={styles.text}>{employee_no}</Text>
            </View>
          </View>

          <View style={styles.list}>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.textHeader}>Remark</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 100 }}>
              <Text style={styles.text}>{remarks}</Text>
            </View>
          </View>

          <View style={styles.line} />


          <ScrollView horizontal={true}>
            <FlatList
              showsHorizontalScrollIndicator={false}
              data={DetailsList}
              horizontal={false}
              renderItem={({ item }) => {
                return (
                  <View style={{ width: width - 50, padding: 5 }}>

                    <JobsView
                      IOU_Type={item.IOU_Type}
                      amount={item.Amount}
                      job_no={item.IOUTypeNo}
                      ExpenseType={item.ExpenseType}
                      jobremarks={item.Remark}
                      accNo={item.AccNo}
                      costCenter={item.CostCenter}
                      resource={item.Resource}
                    />



                  </View>
                )
              }

              }
              keyExtractor={item => `${item._Id}`}
            />

          </ScrollView>
          {/* <View style={styles.list}>
<View style={{flex: 1, marginLeft: 10}}>
  <Text style={styles.textHeader}>Job No</Text>
</View>
<View style={{flex: 1, marginRight: -130}}>
  <Text style={styles.text}>{job_no}</Text>
</View>
</View>

<View style={styles.list}>
<View style={{flex: 1, marginLeft: 10}}>
  <Text style={styles.textHeader}>Expense type</Text>
</View>
<View style={{flex: 1, marginRight: -130}}>
  <Text style={styles.text}>{expense_type}</Text>
</View>
</View>

<View style={styles.list}>
<View style={{flex: 1, marginLeft: 10}}>
  <Text style={styles.textHeader}>Request Amount</Text>
</View>
<View style={{flex: 1, marginRight: -130}}>
  <Text style={{color: ComponentsStyles.COLORS.PRIMARY_COLOR, fontFamily: ComponentsStyles.FONT_FAMILY.BOLD, fontSize: 12}}>{amount}{currency_type}</Text>
</View>
</View>


<View style={styles.list}>
<View style={{flex: 1, marginLeft: 10}}>
  <Text style={styles.textHeader}>Remarks</Text>
</View>
<View style={{flex: 1, marginRight: -130}}>
  <Text style={styles.text}>{remarks}</Text>
</View>
</View> */}
          {/* <View style={styles.list}>
  <View style={{ marginLeft: 10 }}>
    <Image source={{ uri: 'https://thumbs.dreamstime.com/b/vector-paper-check-sell-receipt-bill-template-vector-paper-cash-sell-receipt-139437685.jpg' }} style={{ height: 50, width: 50 }} />

  </View>
  <View style={{ flex: 1, marginLeft: 50 }}>

    <Image source={{ uri: 'https://thumbs.dreamstime.com/b/vector-paper-check-sell-receipt-bill-template-vector-paper-cash-sell-receipt-139437685.jpg' }} style={{ height: 50, width: 50 }} />
  </View>


</View> */}

          {
            attachList.length > 0 ?

              <View>

                <Text style={{ marginLeft: 10, marginTop: 15, color: ComponentsStyles.COLORS.BLACK, fontFamily: ComponentsStyles.FONT_FAMILY.SEMI_BOLD, fontSize: 12 }}>Attachments</Text>


                <ScrollView horizontal={false}
                  nestedScrollEnabled={true}>

                  <FlatList
                    showsHorizontalScrollIndicator={false}
                    data={attachList}
                    horizontal={true}
                    renderItem={({ item }) => {
                      return (
                        <View>

                          <AttachmentView
                            Img_url={item.Img_url}
                          />

                        </View>
                      )
                    }

                    }
                    keyExtractor={item => `${item._Id}`}
                  />

                </ScrollView>

              </View>

              :

              <></>
          }


          {
            approved_status == "3" ?
              <View style={{ marginLeft: 10, marginRight: 10, marginTop: 10, marginBottom: 20 }}>
                <ActionButton
                  title="Create a Copy"
                  onPress={reOpenRequest}
                  //styletouchable={{width: '100%' }}
                  style={{ flexDirection: 'row', justifyContent: "center", backgroundColor: ComponentsStyles.COLORS.ICON_BLUE }}
                //disabled={roll=='Requester' ? true : false}
                />
              </View>

              :
              <></>
          }





        </ScrollView>
      </Modal>


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

  detaillist: {

    padding: 12,
    backgroundColor: ComponentsStyles.COLORS.BACKGROUND_COLOR,
    borderRadius: 3,
    marginVertical: 2,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
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
  textHeader: {
    color: ComponentsStyles.COLORS.SERVISE_HEADER_ASH,
    fontFamily: ComponentsStyles.FONT_FAMILY.SEMI_BOLD,
    fontSize: 12,
  },
  text: {
    color: ComponentsStyles.COLORS.DETAIL_ASH,
    fontFamily: ComponentsStyles.FONT_FAMILY.MEDIUM,
    fontSize: 12,
    textAlign: 'right'
  },
  line: {
    backgroundColor: '#D0CFCF',
    width: '100%',
    height: 0.9,
    marginTop: 15,
    marginBottom: 20,
  }
})

export default RequestList;