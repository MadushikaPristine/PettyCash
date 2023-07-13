import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { StyleSheet, Text, View, Dimensions, FlatList, Image, SafeAreaView, TouchableOpacity } from "react-native";
import Header from "../../Components/Header";
import RequestList from "../../Components/RequestList";
import ComponentsStyles from "../../Constant/Components.styles";
import { getApprovedIOUSET, getCancelledIOUSET, getDateFilterIOUSETApproveList, getDateFilterIOUSETCancelList, getDateFilterIOUSETRejectList, getRejectIOUSET } from "../../SQLiteDBAction/Controllers/IouSettlementController";
import { getDateFilterIOUApproveList, getDateFilterIOUCancelList, getDateFilterIOURejectList } from "../../SQLiteDBAction/Controllers/IOUController";
import DateRangePopup from "../../Components/DateRangePopup";
import Spinner from "react-native-loading-spinner-overlay";
import IconA from 'react-native-vector-icons/FontAwesome';

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


const SettlementScreen = () => {

    const navigation = useNavigation();
    const [selectedItems, setSelectedItems] = useState([]);

    const [status, setStatus] = useState('Approved')
    //const [datalist, setdatalist] = useState(pendingRequestList)
    const [IOUSETList, setIOUSETList] = useState([]);
    const [loandingspinner, setloandingspinner] = useState(false);

    const handleItemPress = (itemId) => {
        if (selectedItems.includes(itemId)) {
            setSelectedItems(selectedItems.filter((user_id) => user_id !== itemId));
        } else {
            setSelectedItems([...selectedItems, itemId]);
        }
    };

    useFocusEffect(
        React.useCallback(() => {

            setStatusFilter(status);

        }, [])
    );


    const setStatusFilter = (status: any) => {
        if (status === 'Approved') {// purple and green
            setStatus('Approved');
            getApprovedIOUSET((result: any) => {
                setIOUSETList(result);
            })
            //setdatalist([...pendingRequestList.filter(e => e.status === status)])
        } else if (status === 'Rejected') {
            setStatus('Rejected');
            getRejectIOUSET((result: any) => {
                setIOUSETList(result)
            })
            //setdatalist([...pendingRequestList.filter(e => e.status === status)])
        } else if (status === 'Cancelled') {
            setStatus('Cancelled');
            getCancelledIOUSET((result: any) => {
                setIOUSETList(result)
            })
            //setdatalist([...pendingRequestList.filter(e => e.status === status)])
        } else {
            setIOUSETList(status)
        }

    }

    const getDatesFromRange = (range: any) => {
        console.log("range.firstDate", range.firstDate, "--------------", range.secondDate, "range.secondDate---------------");
        const start = "T00:00:00.000Z";
        const end = "T59:59:59.000Z";
        console.log("range.firstDate", range.firstDate + start, "--------------", range.secondDate + end, "range.secondDate---------------");
        console.log("");

        if (status === 'Approved') {
            getDateFilterIOUSETApproveList(range.firstDate + start, range.secondDate + end, (result: any) => {
                setIOUSETList(result);
                console.log(result, "Approved");
            })
        } else if (status === 'Rejected') {
            getDateFilterIOUSETRejectList(range.firstDate + start, range.secondDate + end, (result: any) => {
                setIOUSETList(result);
                console.log(result, "Rejected");
            })
        } else if (status === 'Cancelled') {
            getDateFilterIOUSETCancelList(range.firstDate + start, range.secondDate + end, (result: any) => {
                setIOUSETList(result);
                console.log(result, "Cancelled");
            })
        }
    }


    return (
        <SafeAreaView style={ComponentsStyles.CONTAINER}>
            <View style={styles.screen}>
                <Header title="Petty Cash Requests" isBtn={true} btnOnPress={() => navigation.navigate('Home')} />

                <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.listHeadling}>IOU Settlements</Text>
                    <View style={styles.filter}><DateRangePopup filter={getDatesFromRange} /></View>
                </View>

                <View style={styles.listTab}>
                    {
                        listTab.map((e, i) => (
                            <TouchableOpacity
                                key={i}
                                style={[styles.btnTab, status === e.status && styles.btnTabActive]}
                                onPress={() => setStatusFilter(e.status)}
                            >
                                <Text style={[styles.textTab, status === e.status && styles.textTabActive]} key={i}>
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
                    data={IOUSETList}
                    renderItem={({ item }) => {
                        return (
                            <View>
                                <RequestList
                                    first_name={item.employee}
                                    //last_name='name'
                                    user_id={item.ID}
                                    request_type='IOU Settlement Request'
                                    amount={item.Amount}
                                    status={item.Approve_Status == 2 ? "Approve" : (item.Approve_Status == 3 ? "Rejected" : item.Approve_Status == 4 ? "Cancelled" : "HOD Approved")}
                                    currency_type={item.currency_type}
                                    user_avatar='https://reqres.in/img/faces/9-image.jpg'
                                    request_channel="Mobile App"
                                    employee_name={item.employee}
                                    employee_no={item.USER_ID}
                                    job_no={item.Job_NO}
                                    expense_type={item.Expences_Type}
                                    jobremarks={item.Remark}
                                    remarks={item.Approve_Remark}
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
        padding: 10,
        alignItems: 'center',
        justifyContent: "center",
        fontSize: 25,
        fontWeight: 'bold',
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
        fontFamily: ComponentsStyles.FONT_FAMILY.BOLD
    },
    btnTabActive: {
        backgroundColor: ComponentsStyles.COLORS.ICON_BLUE
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
        color: ComponentsStyles.COLORS.ICON_BLUE,
        fontSize: 14,
        fontFamily: ComponentsStyles.FONT_FAMILY.SEMI_BOLD,
        padding: 17,
        marginLeft: 130,
        flex: 1,
    }
})

export default SettlementScreen;

/*const renderItem = ({item, index}) => {
        return(
            <View key={index} style={styles.itemContainer}>
                <View style={styles.itemLogo}>
                    <Image
                        style={styles.itemImage}
                        source={{uri: 'https://static-01.daraz.lk/p/93adc0157d8fb9eec866b01c9c8c5a05.png'}}
                    />
                </View>
                <View style={styles.itemBody}>
                    <Text style={styles.itemName}>{item.name}</Text>
                </View>

                <View style={[
                    styles.itemStatus,
                    {backgroundColor: item.status === 'Rejected'? '#e5848e': '#69c080'}]}
                    >
                    <Text>{item.status}</Text>
                </View>
            </View>
        )
    }

    const separator = () => {
        return <View style={{height: 1, backgroundColor: '#000'}}/>
    }*/
