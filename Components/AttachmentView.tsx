import React from "react";
import { Image, StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
//import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import ComponentsStyles from "../Constant/Components.styles";

type ParamTypes = {
    first_name?: string;
    last_name?: string;
    user_id?: any;
    amount?: Double;
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
    jobremarks?: any;
    iou_type?: any;
    Request_ID?: any;
    Img_url?: any;
    Status?: any;

}

const AttachmentView = ({ Request_ID, Img_url, Status, jobremarks, iou_type, first_name, last_name, user_id, status, date, approved_status, amount, user_avatar, request_type, currency_type, request_channel, employee_no, job_no, expense_type, remarks, employee_name, right, selectedItems, requestDate }: ParamTypes) => {
    return (
        <SafeAreaView>

            {/* <View style={styles.list}>
                <View style={{ flex: 1, marginLeft: 20 }}>
                    <Text style={styles.textHeader}>{iou_type==1 ? "Job no" : (iou_type==2 ? "Vehicle no" : "")}</Text>
                    <Text style={styles.textHeader}>Expense type</Text>
                    <Text style={styles.textHeader}>Request Amount</Text>
                    <Text style={styles.textHeader}>Remarks</Text>
                </View>
                <View style={{ flex: 1, marginLeft: 100}}>
                    <Text style={styles.text}>{job_no}</Text>
                    <Text style={styles.text}>{expense_type}</Text>
                    <Text style={{ color: ComponentsStyles.COLORS.PRIMARY_COLOR, fontFamily: ComponentsStyles.FONT_FAMILY.BOLD, fontSize: 12 }}>{amount}{currency_type}</Text>
                    <Text style={styles.text}>{jobremarks}</Text>
                </View>
            </View> */}

            <View style={styles.list}>
                <View style={{marginLeft: 10, flexDirection: "row" }}>
                    <Image source={{ uri: Img_url }} style={{ height: 50, width: 50 }} />

                </View>



            </View>

            

        </SafeAreaView>
    )
}

export default AttachmentView;

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
        lineHeight: 20
    },
    textHeader: {
        color: ComponentsStyles.COLORS.SERVISE_HEADER_ASH,
        fontFamily: ComponentsStyles.FONT_FAMILY.SEMI_BOLD,
        fontSize: 12,
        lineHeight: 20
    }
});
