import { Dimensions, Platform } from "react-native";
import { getStatusBarHeight } from 'react-native-status-bar-height';
const { width, height } = Dimensions.get('window');
// const BACKGROUND_COLOR = '#FFFFFF';
const BACKGROUND_COLOR = '#f5f0f0';
var date = new Date().getDate(); //Current Date
var month = new Date().getMonth() + 1; //Current Month
var year = new Date().getFullYear(); //Current Year

const CurrentDate = year + "-" + month + "-" + date;
export default ({
    WIDTH: width,
    HEIGHT: height,
    FONT_FAMILY: {

        BOLD: 'Montserrat-Bold',
        BLACK: 'Montserrat-Black',
        BLACK_ITALIC: 'Montserrat-BlackItalic',
        BOLD_ITALIC: 'Montserrat-BoldItalic',
        BOLD_EXTRA: 'Montserrat-ExtraBold',
        BOLD_Extra_ITALIC: 'Montserrat-ExtraBoldItalic',
        Extra_ITALIC: 'Montserrat-ExtraLight',
        SEMI_BOLD: 'Montserrat-SemiBold',
        SEMI_BOLD_ITALIC: 'Montserrat-SemiBoldItalic',
        REGULAR: 'Montserrat-Regular',
        MEDIUM: 'Montserrat-Medium',
        MEDIUM_ITALIC: 'Montserrat-MediumItalic',
        LIGHT: 'Montserrat-Light',
        LIGHT_EXTRA: 'Montserrat-ExtraLight',
        LIGHT_EXTRA_ITALIC: 'Montserrat-ExtraLightItalic',
        LIGHT_ITALIC: 'Montserrat-LightItalic',
        THIN: 'Montserrat-Thin',
        THIN_ITALIC: 'Montserrat-ThinItalic',
        ITALIC: 'Montserrat-Italic',
    },

    COLORS: {
        BACKGROUND_COLOR: '#ffffff',
        WHITE: '#ffffff',
        PINK: '#d52471',
        BLACK: '#000000',
        HEADER_BLUE: '#2C4F77',
        LOGIN_HEADER_BLUE: '#A5D8DD',
        // ICON_BLUE: '#0091D5',
        ICON_BLUE: '#270DCB',
        HEADER_BLACK: '#0D0D0D',
        SERVISE_HEADER_ASH: '#383838',
        SERVICE_DETAILS_BLACK: '#2B2B2B',
        REQUEST_DETAILS_ASH: '#525252',
        HIGH_BUTTON_RED: '#E74C4C',
        MEDIUM_BUTTON_YELLOW: '#F4E137',
        LOW_BUTTON_GREEN: '#48C346',
        NOTIFICATION_RED: '#DD2530',
        PROCEED_ASH: '#D1D1D1',
        TICKET_HEADER_ASH: '#dedede',
        ORANGE: '#F98B4D',
        DASH_COLOR: '#445C77',
        Accent_900: '#7AD4DD',
        BORDER_COLOR2: '#727272',
        BORDER_COLOR: '#cfcccc',
        RED_COLOR: '#FF0000',
        NEW_LABEL: '#E1E51B',
        PRIMARY_COLOR: '#11074E',
        OPEN_COLOR: '#1E57AD',
        YELLOW: '#FCEA4E',
        BROWN: '#810017',
        DETAIL_ASH: '#626566',

    },
    CONTENTLOG: {
        marginBottom: 0,
        marginLeft: 0,
        marginRight: 0,
    },
    CONTAINER: {
        backgroundColor: BACKGROUND_COLOR,
        paddingTop: getStatusBarHeight(true),
        flex: 1
    },
    CONTENT: {
        marginBottom: 0,
        marginLeft: 13,
        marginRight: 13,
        flex: 1,
    },
    SEPARATE_LINE: {
        backgroundColor: '#D0CFCF',
        width: '100%',
        height: 0.9,
        marginTop: 15,
        marginBottom: 20,
    },
    contentBox: {
        WHITE: 'white',
        BLUE: '#22517C',
        BACKGROUND_COLOR: '#F2F2F2',
        TEXT_INPUT_BORDER_GRAY: "#E0E0E0",
    },
    TEXT: {
        LARGE_BLUE: {
            color: '#22517C',
            fontFamily: 'Montserrat-Bold',
            fontSize: 16,
            lineHeight: 22
        },
    },

    IOUInput: {
        borderColor: "#cfcccc",
        paddingLeft: 10,
        fontSize: 12,
        backgroundColor: "#ffffff",
        marginBottom: 20,
    },
    dropdownBox: {
        borderColor: "#cfcccc",
        marginBottom: 10,
    },
    CONTENT_SHADOW_BOX: {
        width: '90%',
        // flex: 1,
        borderRadius: 10,
        backgroundColor: 'white',
        alignSelf: 'center',
        marginTop: -35,
        padding: 20,
        ...Platform.select({
            ios: {
                shadowColor: '#A5A5A5',
                shadowOffset: { height: 4, width: 0 },
                shadowOpacity: 0.7,
                shadowRadius: 5
            },
            android: {
                shadowOpacity: 0.2,
                elevation: 10,
                shadowColor: '#A5A5A5',
            }
        }),
    },
    infoBox: {
        flexDirection: 'row',
        borderRadius: 6,
        marginBottom: 17,
        backgroundColor: 'white',
        ...Platform.select({
            ios: {
                shadowColor: '#D3D3D3',
                shadowOffset: { height: 4, width: 0 },
                shadowOpacity: 0.7,
                shadowRadius: 5
            },
            android: {
                shadowOpacity: 0.7,
                elevation: 3,
                shadowColor: '#D3D3D3',
            }
        }),
    },
    contentBoxWithoutShade: {
        width: '90%',
        flex: 1,
        borderRadius: 10,
        backgroundColor: 'transparent',
        alignSelf: 'center',
        marginTop: -35,
    },
    contentBoxTitle: {
        fontFamily: 'Montserrat-SemiBold',
        color: '#22517C',
        fontSize: 18,
        margin: 15,
        marginLeft: 5,
        marginBottom: 5,
    },
    inlineContent: {
        flexDirection: 'row',
        alignItems: 'center',
        // justifyContent: "center",
    },
    separateLine: {
        backgroundColor: '#DADADA',
        width: '100%',
        height: 2,
        marginTop: 20,
        marginBottom: 10,
    },
    leftText: {
        fontFamily: 'Montserrat-Medium',
        fontSize: 14,
        color: 'white',
    },
    rightText: {
        fontFamily: 'Montserrat-Medium',
        fontSize: 13,
        color: 'white',
    },
    midText: {
        fontFamily: 'Montserrat-Medium',
        fontSize: 13,
        color: 'white',
        paddingLeft: 5,
        paddingRight: 5,
    },
    boldText: {
        fontFamily: 'Montserrat-Bold',
        fontSize: 27,
        color: 'white'
    },
    smallBold: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 13,
        color: 'white',
    },
    mediumText: {
        fontFamily: 'Montserrat-Light',
        fontSize: 13,
        color: 'white',
        alignItems: 'center',
        justifyContent: "center",
    },
    addressText: {
        fontFamily: 'Montserrat-Medium',
        fontSize: 15,
        color: 'white',
        alignItems: 'center',
        justifyContent: "center",
    },

    cancelText: {
        padding: 10,
        alignSelf: "center",
        color: '#EC4F53',
        fontSize: 18,
        fontFamily: 'Montserrat-Regular',
        textDecorationLine: 'underline'
    },
    titleText: {
        fontFamily: 'Montserrat-Medium',
        fontSize: 22,
        color: 'white'
    },
    blackSemiBold: {
        fontFamily: 'Montserrat-Medium',
        fontSize: 15,
        color: '#000000',
    },

})