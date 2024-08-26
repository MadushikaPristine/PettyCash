import { useNavigation } from "@react-navigation/native";
import { Animated, Dimensions, Keyboard, SafeAreaView, StyleSheet, TouchableOpacity, View } from "react-native";
import ComponentsStyles from "../../Constant/Components.styles";
import Header from "../../Components/Header";
import IconA from 'react-native-vector-icons/FontAwesome';
import { useState } from "react";
import ActionButton from "../../Components/ActionButton";

let width = Dimensions.get("screen").width;
const height = Dimensions.get('screen').height;

const PendingRequestList = () => {

    const navigation = useNavigation();


    const [selectedRange, setRange] = useState({});
    const [modalStyle, setModalStyle] = useState(new Animated.Value(height));
    const [isIOU, setIsIOU] = useState(false);
    const [isIOUSet, setIsIOUSet] = useState(false);
    const [isOneOff, setIsOneOff] = useState(false);

    const slideInModal = () => {

        Animated.timing(modalStyle, {
            toValue: height / 5,
            duration: 500,
            useNativeDriver: false,
        }).start();
    };

    const slideOutModal = () => {

        Keyboard.dismiss();
        Animated.timing(modalStyle, {
            toValue: height,
            duration: 500,
            useNativeDriver: false,
        }).start();

    };

    const selectDateRange = () => {

        setRange('');
        slideInModal();


    }

    const OnPressedIOU = () => {

    }

    const OnPressedIOUSettlement = () => {

    }

    const OnPressedOneOff = () => {

    }

    return (

        <SafeAreaView style={ComponentsStyles.CONTAINER}>

            <Header title="Pending Requests" isBtn={true} btnOnPress={() => navigation.navigate('Home')} />


            {/* <View style={{ flexDirection: 'row', marginTop: 8, marginBottom: 8, marginLeft: 15, marginRight: 15 }}>
                <View style={{ flex: 1 }} />
                {/* <Text style={{ fontFamily: ComponentsStyles.FONT_FAMILY.BOLD, color: ComponentsStyles.COLORS.HEADER_BLACK, fontSize: 16,marginRight:15 }}>Filter</Text> */}
                {/* <TouchableOpacity onPress={() => selectDateRange()}>
                    <IconA name='calendar' size={20} color={ComponentsStyles.COLORS.BLACK} />
                </TouchableOpacity> */}

            {/* </View> */} 


            {/* <View style={ComponentsStyles.CONTENT}> */}

                {/* <View style={styles.container}> */}

                <View style={styles.container}>

                    <ActionButton
                        title="IOU"
                        onPress={OnPressedIOU}
                        style={isIOU === true ? styles.selectedbutton : styles.defaultbutton}
                        textStyle={isIOU === true ? styles.selectedBUTTON_TEXT : styles.defaultBUTTON_TEXT}
                    />
                    <ActionButton
                        title="IOU Settlement"
                        onPress={OnPressedIOUSettlement}
                        style={isIOUSet === true ? styles.selectedbutton : styles.defaultbutton}
                        textStyle={isIOUSet === true ? styles.selectedBUTTON_TEXT : styles.defaultBUTTON_TEXT}
                    />
                    <ActionButton
                        title="One-Off Settlement"
                        onPress={OnPressedOneOff}
                        style={isOneOff === true ? styles.selectedbutton : styles.defaultbutton}
                        textStyle={isOneOff === true ? styles.selectedBUTTON_TEXT : styles.defaultBUTTON_TEXT}
                    />

                    {/* </View> */}

                </View>


            {/* </View> */}


        </SafeAreaView>

    );

}
export default PendingRequestList;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        margin: 10,
    },
    screen: {
        flex: 1,
        backgroundColor: "#F5F5F5",

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
    modalCont: {
        flex: 1,
        flexGrow: 1,
        width: width,
        paddingHorizontal: 10,

    },
    filter: {
        color: ComponentsStyles.COLORS.ICON_BLUE,
        fontSize: 16,
        fontFamily: ComponentsStyles.FONT_FAMILY.SEMI_BOLD,
        padding: 17,
        marginLeft: 120,
        flex: 1,
    },
    listTab: {
        flexDirection: 'row',
        alignSelf: 'center',
        marginBottom: 20,
        justifyContent: "center",
    },
    btnTab: {
        width: Dimensions.get('window').width / 3.5,
        flexDirection: 'row',
        borderWidth: 0.5,
        borderColor: '#EBEBEB',
        padding: 10,
        justifyContent: 'center',
        alignItems: "center",
        color: ComponentsStyles.COLORS.BLACK
    },
    textTab: {
        fontSize: 12,
        fontFamily: ComponentsStyles.FONT_FAMILY.BOLD,
        color: ComponentsStyles.COLORS.BLACK,
        alignItems: "center"
    },
    btnTabActive: {
        alignItems: "center",
        backgroundColor: ComponentsStyles.COLORS.ICON_BLUE
    },
    textTabActive: {
        alignItems: "center",
        justifyContent: "center",
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
    EmptyMassage: {
        color: ComponentsStyles.COLORS.BLACK,
        marginLeft: 10,
        fontFamily: ComponentsStyles.FONT_FAMILY.SEMI_BOLD,
        fontSize: 16,
        fontStyle: 'normal',
    },
    selectedbutton: {
        backgroundColor: ComponentsStyles.COLORS.ICON_BLUE,
        borderRadius: 5,
        justifyContent: 'center',
    },
    selectedBUTTON_TEXT: {
        fontSize: 13,
        color: ComponentsStyles.COLORS.WHITE,
    },
    defaultbutton: {
        backgroundColor: ComponentsStyles.COLORS.WHITE,
        borderWidth: 1,
        borderColor: ComponentsStyles.COLORS.ICON_BLUE,
        justifyContent: 'center',
        borderRadius: 5,
    },
    defaultBUTTON_TEXT: {
        fontSize: 13,
        color: ComponentsStyles.COLORS.REQUEST_DETAILS_ASH,
    },
})
