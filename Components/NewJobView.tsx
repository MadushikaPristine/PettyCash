import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View, } from "react-native";
//import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import ComponentsStyles from "../Constant/Components.styles";
import IconMC from 'react-native-vector-icons/MaterialCommunityIcons';
import { Float } from "react-native/Libraries/Types/CodegenTypes";

type ParamTypes = {
    first_name?: string;
    last_name?: string;
    user_id?: any;
    amount?: Float;
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
    onPressIcon?: Function;
    IOU_Type?: any;
    accNo?: any;
    costCenter?: any;
    resource?: any;

}

const NewJobsView = ({ accNo, costCenter, resource, onPressIcon, isEdit,IOU_Type, jobremarks, first_name, last_name, user_id, status, date, approved_status, amount, user_avatar, request_type, currency_type, request_channel, employee_no, IOUTypeNo, ExpenseType, remarks, employee_name, right, selectedItems, requestDate }: ParamTypes) => {
    return (
        <SafeAreaView>



            <View style={styles.list}>
                <View style={{ flex: 1, marginLeft: 10, marginBottom: 10 }}>
                    <Text style={styles.textHeader}>{IOU_Type==1 ? "Job no" : (IOU_Type==2 ? "Vehicle no" : "")}</Text>
                    <Text style={styles.textHeader}>Expense type</Text>
                    <Text style={styles.textHeader}>Request Amount</Text>
                    <Text style={styles.textHeader}>Remarks</Text>
                    <Text style={styles.textHeader}>Account No</Text>
                    <Text style={styles.textHeader}>Cost Center</Text>
                    <Text style={styles.textHeader}>Resource</Text>
                </View>
                <View style={{ flex: 1, marginLeft: 100, marginBottom: 10 }}>
                    <Text style={styles.text}>{IOUTypeNo}</Text>
                    <Text style={styles.text}>{ExpenseType}</Text>
                    <Text style={styles.text}>{amount}{currency_type}</Text>
                    <Text style={styles.text}>{jobremarks}</Text>
                    <Text style={styles.text}>{accNo}</Text>
                    <Text style={styles.text}>{costCenter}</Text>
                    <Text style={styles.text}>{resource}</Text>
                </View>


            </View>

            {
                isEdit ?

                    <TouchableOpacity style={styles.iconView} onPress={onPressIcon}>
                        <IconMC name='playlist-edit' size={35} color={ComponentsStyles.COLORS.ICON_BLUE} iconStyle={styles.iconStyle} />
                    </TouchableOpacity>

                    :

                    <></>
            }


        </SafeAreaView>
    )
}

export default NewJobsView;

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
        fontSize: 12,
        lineHeight: 20
    },
    textHeader: {
        color: ComponentsStyles.COLORS.SERVISE_HEADER_ASH,
        fontFamily: ComponentsStyles.FONT_FAMILY.SEMI_BOLD,
        fontSize: 12,
        lineHeight: 20
    },
    iconView: {
        backgroundColor: 'white',
        flex: 0.5,
        alignItems: 'center',
        justifyContent: 'center'
    },
});
