import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ComponentsStyles from "../Constant/Components.styles";
import IconMC from 'react-native-vector-icons/MaterialCommunityIcons';
import IconFA from 'react-native-vector-icons/FontAwesome6';
import React from "react";

type ParamTypes = {
    cardContainer: any,
    iconName: any,
    iconColor: any
    numberStyle: any
    Count: String
    Title: String
    titleStyle: any
    cardOnPressed: Function
    isViewAll: boolean
}
const CardView = ({ cardOnPressed, titleStyle, Title, Count, numberStyle, iconColor, iconName, cardContainer,isViewAll }: ParamTypes) => {
    return (
        <View style={[styles.container, cardContainer]}>
            <TouchableOpacity onPress={cardOnPressed}>
                <View style={{ flexDirection: "row", alignContent: "space-between", alignItems: "center" }}>
                    <IconFA
                        name={iconName}
                        size={40} color={iconColor}
                        iconStyle={styles.iconStyle} />
                    <View style={{ padding: 5 }} />
                    <Text style={[styles.title, titleStyle]}>{Title}</Text>
                </View>
                <View style={{ padding: 5 }} />
                <Text style={[styles.title, numberStyle]}>{Count}</Text>
                <View style={{ padding: 5 }} />
                {isViewAll ?
                    <View style={{ flexDirection: "row" }}>
                        <Text style={[styles.subText, numberStyle]}>See All </Text>
                        <IconMC
                            name='menu-right'
                            size={20} color={iconColor}
                            iconStyle={[styles.iconStyle, { marginTop: 4 }]} />
                    </View>
                    :
                    <></>}

            </TouchableOpacity>
        </View>
    )
}
export default CardView;

const styles = StyleSheet.create({
    container: {
        width: '42%',
        height: 150,
        backgroundColor: ComponentsStyles.COLORS.SUB_COLOR,
        color: ComponentsStyles.COLORS.SUB_COLOR,
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 10,
        borderRadius: 10,
        borderColor: ComponentsStyles.COLORS.SUB_COLOR,
        borderWidth: 1,
        shadowColor: "#000",
        padding: 7,
        shadowOffset: {
            width: 0,
            height: 2,
        },
    },
    iconStyle: {
        width: 40,
        height: 40,
    },
    title: {
        color: ComponentsStyles.COLORS.MAIN_COLOR,
        fontFamily: ComponentsStyles.FONT_FAMILY.BOLD,
        fontSize: 16,
    },
    subText: {
        color: ComponentsStyles.COLORS.MAIN_COLOR,
        fontFamily: ComponentsStyles.FONT_FAMILY.SEMI_BOLD,
        fontSize: 13,
    },
})