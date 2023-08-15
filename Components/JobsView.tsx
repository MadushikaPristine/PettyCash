import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
//import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import ComponentsStyles from "../Constant/Components.styles";
import IconMC from 'react-native-vector-icons/MaterialCommunityIcons';

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
    IOUTypeNo?: string;
    ExpenseType?: string;
    remarks?: string;
    employee_name?: string;
    right?: any;
    selectedItems?: any;
    isCheckBoxVisible?: boolean;
    ap_status?: any;
    jobremarks?: any;
    isEdit?: boolean;
    isSettlementAmount?: boolean;
    onPressIcon?: Function;
    IOU_Type?: any;
    accNo?: any;
    costCenter?: any;
    resource?: any;
    settlementAmount?: any;
    job_no?: any;

}
const JobsView = ({job_no ,settlementAmount, isSettlementAmount, accNo, costCenter, resource, onPressIcon, isEdit, IOU_Type, jobremarks, first_name, last_name, user_id, status, date, approved_status, amount, user_avatar, request_type, currency_type, request_channel, employee_no, IOUTypeNo, ExpenseType, remarks, employee_name, right, selectedItems, requestDate }: ParamTypes) => {
    return (
        // <SafeAreaView>

        //     <View style={styles.list}>
        //         <View style={{ flex: 1, marginLeft: 10, marginBottom: 10 }}>
        //         <Text style={styles.textHeader}>{IOU_Type==1 ? "Job no" : (IOU_Type==2 ? "Vehicle no" : "")}</Text>
        //             <Text style={styles.textHeader}>Expense type</Text>
        //             <Text style={styles.textHeader}>Request Amount</Text>
        //             <Text style={styles.textHeader}>Remarks</Text>
        //             <Text style={styles.textHeader}>Account No</Text>
        //             <Text style={styles.textHeader}>Cost Center</Text>
        //             <Text style={styles.textHeader}>Resource</Text>
        //         </View>
        //         <View style={{flex: 1,marginLeft: 100, marginBottom: 10, justifyContent: 'flex-end' }}>
        //             <Text style={styles.text}>{job_no}</Text>
        //             <Text style={styles.text}>{expense_type}</Text>
        //             <Text style={{ color: ComponentsStyles.COLORS.PRIMARY_COLOR, fontFamily: ComponentsStyles.FONT_FAMILY.BOLD, fontSize: 12, textAlign: 'right' }}>{amount}</Text>
        //             <Text style={styles.text}>{jobremarks}</Text>
        //             <Text style={styles.text}>{accNo}</Text>
        //             <Text style={styles.text}>{costCenter}</Text>
        //             <Text style={styles.text}>{resource}</Text>
        //         </View>
        //     </View>

        // </SafeAreaView>


        <View style={styles.maincontainer}>

            <View style={{ backgroundColor: 'white', flex: 4, justifyContent: "center", width: '100%' }}>

                <View style={{ flexDirection: 'row', flex: 4 }}>

                    <Text style={styles.textHeader}>{IOU_Type == 1 ? "Job no" : (IOU_Type == 2 ? "Vehicle no" : "")}</Text>
                    <View style={{ flex: 1 }} />
                    <Text style={styles.text}>{job_no}</Text>

                </View>
                {/* <View style={{ flex: 1, marginLeft: 10, marginBottom: 10 }}> */}

                <View style={{ flexDirection: 'row' }}>

                    <Text style={styles.textHeader}>Expense type</Text>
                    <View style={{ flex: 1 }} />
                    <Text style={styles.text}>{ExpenseType}</Text>

                </View>


                <View style={{ flexDirection: 'row' }}>

                    <Text style={styles.textHeader}>Request Amount</Text>
                    <View style={{ flex: 1 }} />
                    <Text style={styles.text}>{amount = null || '' ? "0.00 LKR" : amount.toLocaleString("en-LK", {
                        style: "currency",
                        currency: "LKR",
                        minimumFractionDigits: 2,
                    })}</Text>

                </View>


                <View style={{ flexDirection: 'row' }}>

                    <Text style={styles.textHeader}>Remarks</Text>
                    <View style={{ flex: 1 }} />
                    <Text style={styles.text}>{jobremarks}</Text>

                </View>

                <View style={{ flexDirection: 'row' }}>

                    <Text style={styles.textHeader}>Account No</Text>
                    <View style={{ flex: 1 }} />
                    <Text style={styles.text}>{accNo}</Text>

                </View>

                <View style={{ flexDirection: 'row' }}>

                    <Text style={styles.textHeader}>Cost Center</Text>
                    <View style={{ flex: 1 }} />
                    <Text style={styles.text}>{costCenter}</Text>

                </View>

                <View style={{ flexDirection: 'row' }}>

                    <Text style={styles.textHeader}>Resource</Text>
                    <View style={{ flex: 1 }} />
                    <Text style={[styles.text,]}>{resource}</Text>

                </View>

                {
                    isSettlementAmount ?

                        <View style={{ flexDirection: 'row' }}>

                            <Text style={styles.textHeader}>Settlement Amount</Text>
                            <View style={{ flex: 1 }} />
                            <Text style={[styles.text,]}>{settlementAmount = null || '' ? "0.00 LKR" : settlementAmount.toLocaleString("en-LK", {
                                style: "currency",
                                currency: "LKR",
                                minimumFractionDigits: 2,
                            })}</Text>

                        </View>

                        :

                        <></>


                }


                {/* <View style={{ flex: 1, marginLeft: 100, marginBottom: 10 }}> */}

                <View style={{ flexDirection: 'row', justifyContent: "flex-end" }}>

                    {
                        isEdit ?

                            <TouchableOpacity style={styles.iconView} onPress={onPressIcon}>
                                <IconMC name='playlist-edit' size={35} color={ComponentsStyles.COLORS.ICON_BLUE} iconStyle={styles.iconStyle} />
                            </TouchableOpacity>

                            :

                            <></>
                    }



                </View>

            </View>

        </View >
    )
}

export default JobsView;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    textSize: {
        fontSize: 20,
    },
    iconStyle: {
        width: 50,
        height: 70,
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
        color: ComponentsStyles.COLORS.DETAIL_ASH,
        fontFamily: ComponentsStyles.FONT_FAMILY.MEDIUM,
        fontSize: 13,
        textAlign: "right",
        marginRight: 5
    },
    textHeader: {
        color: ComponentsStyles.COLORS.SERVISE_HEADER_ASH,
        fontFamily: ComponentsStyles.FONT_FAMILY.SEMI_BOLD,
        fontSize: 14,
        flex: 1.5
    },
    iconView: {
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10
    },
    maincontainer: {
        backgroundColor: 'white',
        width: '100%',
        shadowColor: "#000",
        padding: 7,
        flexDirection: 'row',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,

    },
});
