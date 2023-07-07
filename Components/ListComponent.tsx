import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import ComponentsStyles from "../Constant/Components.styles";
import { Double } from "react-native/Libraries/Types/CodegenTypes";

type ParamTypes = {
    first_name?: string;
    amount?: Double;
    currency_type?: string;
    user_id?: any;
    request_type?: string;
}

const ListComponent = ({first_name,amount,currency_type,user_id,request_type}:ParamTypes) => {


    return (

        <View>
            <TouchableOpacity style={styles.mainContainer}>


                <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={{ color: ComponentsStyles.COLORS.SERVISE_HEADER_ASH, fontFamily: ComponentsStyles.FONT_FAMILY.SEMI_BOLD, fontSize: 15, fontWeight: "bold" }}>
                        {first_name}
                    </Text>
                    <Text style={{ color: ComponentsStyles.COLORS.SERVICE_DETAILS_BLACK, fontFamily: ComponentsStyles.FONT_FAMILY.REGULAR, fontSize: 15 }}>{user_id}</Text>
                </View>
                <View style={styles.verticleLine}></View>
                <View style={{ flex: 1, marginLeft: 25 }}>
                    <Text style={{ color: ComponentsStyles.COLORS.ICON_BLUE, fontFamily: ComponentsStyles.FONT_FAMILY.REGULAR, fontSize: 15, fontWeight: "bold" }}>{request_type}</Text>
                    <Text style={{ color: ComponentsStyles.COLORS.SERVICE_DETAILS_BLACK, fontFamily: ComponentsStyles.FONT_FAMILY.MEDIUM, fontSize: 15 }}>{amount} {currency_type}</Text>
                    {/* <Text style={{ color: amount >= maxAmount ? ComponentsStyles.COLORS.RED_COLOR : ComponentsStyles.COLORS.SERVICE_DETAILS_BLACK, fontFamily: ComponentsStyles.FONT_FAMILY.MEDIUM, fontSize: 12 }}>{amount} {currency_type}</Text> */}
                </View>


            </TouchableOpacity>
        </View>

    );

}
export default ListComponent;

const styles = StyleSheet.create({

    mainContainer: {

        backgroundColor: "#fff",
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        borderColor: ComponentsStyles.COLORS.BORDER_COLOR,
        padding:5

    },

    verticleLine: {
        height: '100%',
        width: 1,
        backgroundColor: '#BDCDD6',
        marginLeft: 10,
    },

});