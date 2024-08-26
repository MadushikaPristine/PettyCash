import { Dimensions, StyleSheet } from "react-native";
import comStyles from "../../Constant/Components.styles";


let width = Dimensions.get("screen").width;
export default StyleSheet.create({
    ActionButton: {
        marginTop: 35,
        marginBottom: 5,
        color: comStyles.COLORS.ICON_BLUE,
        
    },

    box1: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 0.5
    },

    box2: {

        justifyContent: 'center',
        alignItems: 'center',
        flex: 0.5,
        color: comStyles.COLORS.WHITE,

    },
    inputTextStyles:{
        color: comStyles.COLORS.WHITE,
        borderColor: comStyles.COLORS.WHITE,
        // marginBottom:50

    },

    loginBtn: {

        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: comStyles.COLORS.ICON_BLUE,
        marginBottom: 20
    },

    loginBtndesable: {

        backgroundColor: comStyles.COLORS.PROCEED_ASH,
        borderWidth: 1,
        borderColor: comStyles.COLORS.PROCEED_ASH,
        marginBottom: 20,
       
    },

    subtxt: {
        color: comStyles.COLORS.BLACK,
        fontSize: 15,
        fontFamily: comStyles.FONT_FAMILY.SEMI_BOLD,
        marginBottom: 10,
    },

    logo: {
        width: 60,
        height: 28,
    },
    name: {
        width: 352,
        height: 32,
        position:"absolute",
        marginBottom: 20
    },

    footer: {
        fontSize: 10,
        fontFamily: comStyles.FONT_FAMILY.SEMI_BOLD,
        color: comStyles.COLORS.BLACK,
        marginRight: 5
    },

    modalCloseBTN: {
        marginTop: 5,
        marginBottom: 0,
        padding: 15,
        width: 45,
        borderRadius: 30,
        backgroundColor: "#fff",
        zIndex: 4,
        alignSelf: 'center'
    },
    modalCont: {
        flex: 1,
        flexGrow: 1,
        width: width,
        paddingHorizontal: 10,

    },
    desable_BUTTON_TEXT: {
        fontSize: 16,
    },

    welcometxt:{
        fontSize:40,
        fontFamily:comStyles.FONT_FAMILY.SEMI_BOLD,
        textAlign:"center",
        fontWeight:"500",
        color: comStyles.COLORS.WHITE,
        marginBottom: 10,
        marginTop:20,
    },

    subtxt1: {
        color: comStyles.COLORS.WHITE,
        fontSize: 16,
        fontFamily: comStyles.FONT_FAMILY.SEMI_BOLD,
        marginBottom: 10,
        textAlign:"center",
        
    },

    error: {
        color: 'white',
    }

    
})