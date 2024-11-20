import { StyleSheet } from "react-native";
import ComponentsStyles from "../../Constant/Components.styles";

export default StyleSheet.create({
    bodyTextLeft: {
        color: ComponentsStyles.COLORS.SERVISE_HEADER_ASH,
        fontFamily: ComponentsStyles.FONT_FAMILY.REGULAR,
        fontSize: 14,
        flex: 1
    },
    dropdown: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
        marginBottom: 10,
        color: ComponentsStyles.COLORS.BLACK,
        backgroundColor: ComponentsStyles.COLORS.WHITE
    },
    placeholderStyle: {
        fontFamily: ComponentsStyles.FONT_FAMILY.SEMI_BOLD,
        fontSize: 12,
        color: ComponentsStyles.COLORS.PROCEED_ASH,
    },
    selectedTextStyle: {
        fontFamily: ComponentsStyles.FONT_FAMILY.SEMI_BOLD,
        fontSize: 12,
        color: ComponentsStyles.COLORS.MAIN_COLOR,
    },
    selectedTextStyle2: {
        fontFamily: ComponentsStyles.FONT_FAMILY.BOLD,
        fontSize: 20,
        color: ComponentsStyles.COLORS.MAIN_COLOR,
        marginTop: 5
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 14,
        color: ComponentsStyles.COLORS.BLACK,
    },
    icon: {
        marginRight: 5,
        color: ComponentsStyles.COLORS.HEADER_BLACK,
    },
    fabicon: {
        marginRight: 5,
        color: ComponentsStyles.COLORS.WHITE,
    },
    image: { width: '90%', height: 160, },
    flatListContent: {
        width: "100%",
        height: 170,
        borderRadius: 10,
        borderWidth: 0.5,
        padding: 5,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        alignContent: "center",
        alignItems: "center",
        marginBottom: 5,
        flexDirection: "row"
    },
    iconView: {
        alignItems: "flex-end",
        justifyContent: 'flex-end',
    },
});