import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { StyleSheet, Text, View, Dimensions, FlatList, Image, SafeAreaView, TouchableOpacity, Animated, Keyboard, Platform } from "react-native";
import Header from "../../Components/Header";
import RequestList from "../../Components/RequestList";
import ComponentsStyles from "../../Constant/Components.styles";
import { getApprovedIOU, getCancelledIOU, getDateFilterIOUApproveList, getDateFilterIOUCancelList, getDateFilterIOUList, getDateFilterIOURejectList, getRejectIOU } from "../../SQLiteDBAction/Controllers/IOUController";
import DateRangePopup from "../../Components/DateRangePopup";
import Spinner from "react-native-loading-spinner-overlay";
import IconA from 'react-native-vector-icons/FontAwesome';
import DateRangePicker from "rn-select-date-range";

const listTab = [
    {
        status: 'Approved'
    },
    {
        status: 'Rejected'
    },
    {
        status: 'Cancelled'
    }
]

let width = Dimensions.get("screen").width;
const height = Dimensions.get('screen').height;


const IOUScreen = () => {

    const navigation = useNavigation();
    const [IOUList, setIOUList] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);

    const [status, setStatus] = useState('Approved')
    const [apStatus, setApStatus] = useState('');
    // const [datalist, setdatalist] = useState(IOUList)

    const [loandingspinner, setloandingspinner] = useState(false);
    const [modalStyle, setModalStyle] = useState(new Animated.Value(height));
    const [isShowSweep, setIsShowSweep] = useState(true);
    const [selectedRange, setRange] = useState({});

    const handleItemPress = (itemId: any) => {
        if (selectedItems.includes(itemId)) {
            setSelectedItems(selectedItems.filter((user_id) => user_id !== itemId));
        } else {
            setSelectedItems([...selectedItems, itemId]);
        }
    };

    const getIOUList = (status: any) => {
        setIOUList([]);
        setloandingspinner(true);

        if (status === 'Approved') {
            getApprovedIOU((result: any) => {
                setIOUList(result);
                setloandingspinner(false);
            });
        } else if (status === 'Rejected') {
            getRejectIOU((result: any) => {
                setIOUList(result);
                setloandingspinner(false);
            })
        } else if (status === 'Cancelled') {
            getCancelledIOU((result: any) => {
                setIOUList(result);
                setloandingspinner(false);
            })
        }
    }

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

    const selectDateRange = () => {

        setRange('');
        slideInModal();


    }


    useFocusEffect(
        React.useCallback(() => {



            if (status === 'Approved') {// purple and green
                setStatus('Approved');
                getIOUList('Approved')
                //setdatalist([...pendingRequestList.filter(e => e.status === status)])
            } else if (status === 'Rejected') {
                setStatus('Rejected');
                getIOUList('Rejected')
                //setdatalist([...pendingRequestList.filter(e => e.status === status)])
            } else if (status === 'Cancelled') {
                setStatus('Cancelled');
                getIOUList('Cancelled')
                //setdatalist([...pendingRequestList.filter(e => e.status === status)])
            }

        }, [])
    );



    const setStatusFilter = (status: any) => {
        if (status === 'Approved') {// purple and green
            setStatus('Approved');
            getIOUList('Approved')
            //setdatalist([...pendingRequestList.filter(e => e.status === status)])
        } else if (status === 'Rejected') {
            setStatus('Rejected');
            getIOUList('Rejected')
            //setdatalist([...pendingRequestList.filter(e => e.status === status)])
        } else if (status === 'Cancelled') {
            setStatus('Cancelled');
            getIOUList('Cancelled')
            //setdatalist([...pendingRequestList.filter(e => e.status === status)])
        }

    }

    const getDatesFromRange = (range: any) => {
        const start = "T00:00:00.000Z";
        const end = "T59:59:59.000Z";
        console.log("range.firstDate", range.firstDate, "--------------", range.secondDate, "range.secondDate---------------");

        setloandingspinner(true);
        if (status === 'Approved') {
            getDateFilterIOUApproveList(range.firstDate + start, range.secondDate + end, (result: any) => {
                setIOUList(result);
                setloandingspinner(false);
                slideOutModal();
                // console.log(result, "Approved");
            })
        } else if (status === 'Rejected') {
            getDateFilterIOURejectList(range.firstDate + start, range.secondDate + end, (result: any) => {
                setIOUList(result);
                setloandingspinner(false);
                slideOutModal();
                // console.log(result, "Rejected");
            })
        } else if (status === 'Cancelled') {
            getDateFilterIOUCancelList(range.firstDate + start, range.secondDate + end, (result: any) => {
                setIOUList(result);
                setloandingspinner(false);
                slideOutModal();
                // console.log(result, "Cancelled");
            })
        }
    }


    return (
        <SafeAreaView style={ComponentsStyles.CONTAINER}>
            <View style={styles.screen}>

                <Header title="IOU Requests11111" isBtn={true} btnOnPress={() => navigation.navigate('Home')} />


                {/* <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.listHeadling}>IOU Requests</Text>
                    <View style={styles.filter}><DateRangePopup filter={getDatesFromRange} /></View>

                </View> */}


                <View style={{ flexDirection: 'row', marginTop: 8, marginBottom: 8, marginLeft: 15, marginRight: 15 }}>
                    <View style={{ flex: 1 }} />
                    {/* <Text style={{ fontFamily: ComponentsStyles.FONT_FAMILY.BOLD, color: ComponentsStyles.COLORS.HEADER_BLACK, fontSize: 16,marginRight:15 }}>Filter</Text> */}
                    <TouchableOpacity onPress={() => selectDateRange()}>
                        <IconA name='calendar' size={20} color={ComponentsStyles.COLORS.BLACK} />
                    </TouchableOpacity>

                </View>


                <View style={styles.listTab}>
                    {
                        listTab.map((e, m) => (
                            <TouchableOpacity
                                key={m}
                                style={[styles.btnTab, status === e.status && styles.btnTabActive]}
                                onPress={() => setStatusFilter(e.status)}
                            >
                                <Text style={[styles.textTab, status === e.status && styles.textTabActive]} key={m}>
                                    {e.status}
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
                    data={IOUList}
                    ListEmptyComponent={<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text style={styles.EmptyMassage}>No data found</Text></View>}
                    horizontal={false}
                    renderItem={({ item }) => {
                        return (
                            <View>
                                <RequestList
                                    first_name={item.employee}
                                    //last_name='name'
                                    user_id={item.ID}
                                    request_type='IOU Request'
                                    amount={item.Amount}
                                    status={item.Approve_Status == 2 ? "Approve" : (item.Approve_Status == 3 ? "Rejected" : item.Approve_Status == 4 ? "Cancelled" : "HOD Approved")}
                                    currency_type={item.currency_type}
                                    user_avatar='https://reqres.in/img/faces/9-image.jpg'
                                    request_channel="Mobile App"
                                    employee_name={item.employee}
                                    employee_no={item.USER_ID}
                                    remarks={item.Approve_Remark}
                                    job_no={item.Job_NO}
                                    expense_type={item.Expences_Type}
                                    jobremarks={item.Remark}
                                    //right = {() => console.log(item.IOU_ID)} 
                                    right={handleItemPress}
                                    selectedItems={selectedItems}
                                    isCheckBoxVisible={false}
                                    approved_status={item.Approve_Status}
                                    RequestID={item.ID}
                                />
                            </View>
                        )
                    }
                    }
                    keyExtractor={item => `${item.Id}`}
                />

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


        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: "#e9e9e9",

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
        padding: 8,
        alignContent: 'center',
        justifyContent: 'center',
        fontSize: 25,
        fontWeight: 'bold',
        marginVertical: 5,
        marginHorizontal: 5,
        flexDirection: "row"
    },
    container: {
        flex: 1,
        paddingHorizontal: 10,
        justifyContent: 'center'
    },
    listTab: {
        flexDirection: 'row',
        alignSelf: 'center',
        marginBottom: 20
    },
    btnTab: {
        width: Dimensions.get('window').width / 3.5,
        flexDirection: 'row',
        borderWidth: 0.5,
        borderColor: '#EBEBEB',
        padding: 10,
        justifyContent: 'center'

    },
    textTab: {
        fontSize: 12,
        fontFamily: ComponentsStyles.FONT_FAMILY.BOLD,
        color: ComponentsStyles.COLORS.BLACK

    },
    btnTabActive: {

        backgroundColor: ComponentsStyles.COLORS.ICON_BLUE,


    },
    textTabActive: {

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
    filter: {
        color: ComponentsStyles.COLORS.Accent_900,
        fontSize: 14,
        fontWeight: 'bold',
        padding: 13,
        marginLeft: 150,
        flex: 1,
    },
    modalCont: {
        flex: 1,
        flexGrow: 1,
        width: width,
        paddingHorizontal: 10,

    },
    EmptyMassage: {
        color: ComponentsStyles.COLORS.BLACK,
        marginLeft: 10,
        fontFamily: ComponentsStyles.FONT_FAMILY.SEMI_BOLD,
        fontSize: 16,
        fontStyle: 'normal',
      },
});

export default IOUScreen;


