import React, { useState } from 'react';
import {
  Dimensions,
  FlatList,
  GestureResponderEvent,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import JobsView from '../../Components/JobsView';
import ComponentsStyles from '../../Constant/Components.styles';
import ActionButton from '../../Components/ActionButton';
import AsyncStorageConstants from '../../Constant/AsyncStorageConstants';
import { useNavigation } from '@react-navigation/native';
import AttachmentView from '../../Components/AttachmentView';
import AsyncStorage from '@react-native-async-storage/async-storage';



let width = Dimensions.get("screen").width;
const height = 50;
const navigation = useNavigation();

type ParamTypes = {
  first_name?: string;
  last_name?: string;
  user_id?: any;
  amount?: number;
  currency_type?: string;
  status?: string;
  request_type?: string;
  user_avatar?: any;
  request_channel?: string;
  employee_no?: string;
  job_no?: string;
  expense_type?: string;
  remarks?: string;
  employee_name?: string;
  ap_status?: any;
  approved_status?: any;
  jobList?: any;
  attachList?: any;
  jobremarks?: any;
  isCopyRequest?: boolean;
  rejectedId?: any;
  iou_type?: any;

}

const deviceHeight = Dimensions.get('window').height;
export class BottomPopup extends React.Component {

  // const [jobList,setJobList] = useState([]);


  constructor(props: {} | Readonly<{}>) {
    super(props);
    this.state = {
      show: false,

    };


  }

  show = () => {
    this.setState({ show: true });
  };

  close = () => {
    this.setState({ show: false });
  };

  // getFlatListdata = () => {
  //   getIOUJobsList((result:any) => {
  //     this.setState({jobList: result})
  //   })
  // }

  renderOutsideTouchable(onTouch: ((event: GestureResponderEvent) => void) | undefined) {
    const view = <View style={{ flex: 1, width: width, height: height }} />;
    if (!onTouch) {
      return view;
    }

    return (
      <TouchableWithoutFeedback
        onPress={onTouch}
        style={{ flex: 1, width: width, height: height }}>
        {view}
      </TouchableWithoutFeedback>
    );
  }

  renderTitle = () => {


    return (
      <View style={{ alignItems: 'center' }}>
        <Text
          style={{
            color: ComponentsStyles.COLORS.PRIMARY_COLOR,
            fontSize: 20,
            fontFamily: ComponentsStyles.FONT_FAMILY.BOLD,
            marginTop: 15,
            marginBottom: 20,
          }}>
          IOU Request Details
        </Text>
      </View>
    );
  };

  renderContent = () => {
    const { attachList, rejectedId, iou_type, isCopyRequest, jobremarks, jobList, first_name, last_name, user_id, status, amount, user_avatar, request_type, currency_type, request_channel, employee_no, job_no, expense_type, remarks, employee_name, ap_status }: ParamTypes = this.props

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

      <View>
        <ScrollView>

          <View style={styles.list}>
            <Image
              source={{ uri: user_avatar }}
              style={styles.avatar}
              resizeMode="center"
            />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={{ fontFamily: ComponentsStyles.FONT_FAMILY.SEMI_BOLD, color: ComponentsStyles.COLORS.PRIMARY_COLOR, fontSize: 14 }}>
                Requested By
              </Text>
              <Text style={{ color: ComponentsStyles.COLORS.PRIMARY_COLOR, fontFamily: ComponentsStyles.FONT_FAMILY.MEDIUM, fontSize: 12 }}>Employee Number</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 50, }}>
              <Text style={{ color: ComponentsStyles.COLORS.BORDER_COLOR, fontFamily: ComponentsStyles.FONT_FAMILY.REGULAR, fontSize: 12, textAlign: 'right' }}>{first_name} {last_name}</Text>
              <Text style={{ color: ComponentsStyles.COLORS.BORDER_COLOR, fontFamily: ComponentsStyles.FONT_FAMILY.REGULAR, fontSize: 12, textAlign: 'right' }}>
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

          <View
            style={ComponentsStyles.SEPARATE_LINE}
          />

          <ScrollView horizontal={true}>
            <FlatList
              showsHorizontalScrollIndicator={false}

              data={jobList}
              horizontal={false}
              renderItem={({ item }) => {
                return (
                  <View>

                    <JobsView
                      IOU_Type={item.IOU_Type}
                      amount={item.Amount}
                      job_no={item.IOUTypeNo}
                      expense_type={item.ExpenseType == 1 ? "Meals" : (item.ExpenseType == 2 ? "Batta" : (item.ExpenseType == 3 ? "Labour" : (item.ExpenseType == 4 ? "Project Materials" : (item.ExpenseType == 5 ? "Travelling" : (item.ExpenseType == 6 ? "Other" : "")))))}
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
          <Text style={{ marginLeft: 10, color: ComponentsStyles.COLORS.BLACK, fontFamily: ComponentsStyles.FONT_FAMILY.SEMI_BOLD, fontSize: 12 }}>Attachments</Text>
          {/* <View style={styles.list}>
            <View style={{ marginLeft: 10 }}>
              <Image source={{ uri: 'https://thumbs.dreamstime.com/b/vector-paper-check-sell-receipt-bill-template-vector-paper-cash-sell-receipt-139437685.jpg' }} style={{ height: 50, width: 50 }} />

            </View>
            <View style={{ flex: 1, marginLeft: 50 }}>

              <Image source={{ uri: 'https://thumbs.dreamstime.com/b/vector-paper-check-sell-receipt-bill-template-vector-paper-cash-sell-receipt-139437685.jpg' }} style={{ height: 50, width: 50 }} />
            </View>


          </View> */}
          <ScrollView horizontal={true}
            nestedScrollEnabled={true}>
            <FlatList
              showsHorizontalScrollIndicator={false}

              data={attachList}
              horizontal={false}
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

          {
            isCopyRequest ?
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

      </View>
    );
  };

  renderSeparator = () => {
    <View
      style={{
        opacity: 0.1,
        backgroundColor: '#182E44',
        height: 1,
      }}
    />;
  };

  render() {
    let { show } = this.state;
    const { onTouchOutside } = this.props;

    return (
      <Modal
        animationType={'fade'}
        transparent={true}
        visible={show}
        onRequestClose={this.close}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: '#000000AA',
            justifyContent: 'flex-end',
            marginBottom: 60
          }}>
          {this.renderOutsideTouchable(onTouchOutside)}
          <View
            style={{
              backgroundColor: '#F5F5F5',
              width: '100%',
              borderTopRightRadius: 10,
              borderTopLeftRadius: 10,
              paddingHorizontal: 10,
              maxHeight: deviceHeight / 1.5,
              flex: 1,
              flexGrow: 1,
              marginBottom: 60,
            }}>
            {this.renderTitle()}
            {this.renderContent()}
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  textSize: {
    fontSize: 20,
  },
  textStyle: {
    fontSize: 18,
    fontWeight: 'normal',
    color: '#182E44',

    borderRadius: 5,
    marginVertical: 8,
    marginHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {

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
  text: {
    color: ComponentsStyles.COLORS.BORDER_COLOR,
    fontFamily: ComponentsStyles.FONT_FAMILY.MEDIUM,
    fontSize: 12,
    textAlign: 'right'
  },
  textHeader: {
    color: ComponentsStyles.COLORS.SERVISE_HEADER_ASH,
    fontFamily: ComponentsStyles.FONT_FAMILY.SEMI_BOLD,
    fontSize: 12,
  }
});

/*<View style={{height: 50, flex: 1, alignItems: 'flex-start', justifyContent: 'center', marginLeft: 20, }}>
                <Text style={styles.textStyle}>Employeename: {item.first_name} {item.last_name}</Text>
                <Text style={styles.textStyle}>EmployeeId: {item.id}</Text>
            </View>*/
