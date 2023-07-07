import React from "react";
import { Image, StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ComponentsStyles from "../Constant/Components.styles";
import NotificationPopup from "./NotificationPopup";

type ParamTypes = {
    title?: string;
    date?: string;
    time?: string;
    description?: string;
    ID?: any;
    approvedBy?: any;
}

const NotificationList = ({title, date, time, description,ID, approvedBy}: ParamTypes) => {
    return(
        <SafeAreaView>
            <View style={styles.list}>
                <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.text}>{ID} has been {approvedBy}</Text>
                    <Text style={styles.textDate}>{date}</Text>
                </View>
                <NotificationPopup />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    list: {
      flex: 1,
      padding: 8,
      backgroundColor: "#fff",
      borderRadius: 5,
      marginVertical: 5,
      marginHorizontal: 5,
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "row"
    },
    text: {
        fontFamily: ComponentsStyles.FONT_FAMILY.SEMI_BOLD,
        color: ComponentsStyles.COLORS.BLACK,
        fontSize: 14
    },
    textDate: {
        fontFamily: ComponentsStyles.FONT_FAMILY.REGULAR,
        color: ComponentsStyles.COLORS.BLACK,
        fontSize: 12
    }
})

export default NotificationList;