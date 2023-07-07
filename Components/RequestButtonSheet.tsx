import RBSheet from "react-native-raw-bottom-sheet";
import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import comStyles from '../Constant/Components.styles'
import Icon from 'react-native-vector-icons/MaterialIcons';
import Modal from 'react-native-modal';
import ActionButton from "./ActionButton";
import CancelSubmitPopup from "./CancelSubmitPopup";
import { getLoginUserRoll } from "../Constant/AsynStorageFuntion";


type params = {

    modalclose?: Function;
    PendingList?: Function;
    IOU?: Function;
    SettlementScreen?: Function;
    OneOffScreen?: Function;


}


const RequestButtonSheet = ({ modalclose,PendingList,IOU,SettlementScreen,OneOffScreen }: params) => {

    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(true);
    const [screenType, setScreenType] = useState('main');
    const [roll, setRoll] = useState('');

    const closeModal = (val: boolean) => {
        // setModalVisible(val);
        setScreenType('main');
    }

    const modalClose = () => {
        setModalVisible(false);
        navigation.navigate('Home');
    }

    // const IOU = () => {
    //     setModalVisible(false);
    //     navigation.navigate("IOU")
    // }

    // const PendingList = () => {
    //     setModalVisible(false);
    //     navigation.navigate("PendingList")
    // }

    // const SettlementScreen = () => {
    //     setModalVisible(false);
    //     navigation.navigate("SettlementScreen")
    // }

    // const OneOffScreen = () => {
    //     setModalVisible(false);
    //     navigation.navigate("OneOffScreen")
    // }

    useFocusEffect(
        React.useCallback(() => {

            getLoginUserRoll().then(resp => {
                setRoll(resp);
                // console.log("User Roll: ", resp);
            })

        }, [])
    );



    return (


        <View style={styles.container}>
            {/* <Modal
                    backdropOpacity={0.3}
                    isVisible={modalVisible}
                    onBackdropPress={() => modalClose()}
                    style={styles.contentView}
                > */}
            {/* <View style={styles.modalMainContainer}> */}

            <TouchableOpacity style={styles.dashStyle} onPress={modalclose} />

            <View style={{ width: '100%', }}>
                <ActionButton
                    title="Pending Request"
                    style={styles.loginBtn}
                    textStyle={styles.txtStyle}
                    is_icon={true}
                    iconColor={comStyles.COLORS.ICON_BLUE}
                    icon_name='square'
                    onPress={PendingList}
                    //disabled={roll=='Requester' ? false : true}
                />
                <ActionButton
                    title="IOU"
                    style={styles.loginBtn}
                    textStyle={styles.txtStyle}
                    is_icon={true}
                    iconColor={comStyles.COLORS.ICON_BLUE}
                    icon_name='square'
                    onPress={IOU}
                    //disabled={roll=='Requester' ? true : false}
                />
                <ActionButton
                    title="IOU Settlement"
                    style={styles.loginBtn}
                    textStyle={styles.txtStyle}
                    is_icon={true}
                    iconColor={comStyles.COLORS.ICON_BLUE}
                    icon_name='square'
                    onPress={SettlementScreen}
                    //disabled={roll=='Requester' ? true : false}
                />
                <ActionButton
                    title="One-Off Settlement"
                    style={styles.loginBtn}
                    textStyle={styles.txtStyle}
                    is_icon={true}
                    iconColor={comStyles.COLORS.ICON_BLUE}
                    icon_name='square'
                    onPress={OneOffScreen} 
                    //disabled={roll=='Requester' ? true : false}
                    />

                <ActionButton title="Cancel" style={styles.ActionButton} onPress={modalclose} />

            </View>

        </View>

        //      </Modal> 
        //  </View>



    );

}
const styles = StyleSheet.create({

    headerContainer: {
        justifyContent: 'center'
    },
    container: {
        width: '100%',
        backgroundColor: comStyles.COLORS.WHITE,
        alignItems: 'center',
        padding: 10,
        justifyContent: "center",
    },

    contentView: {
        justifyContent: 'flex-end',
        margin: 0,
    },

    modalMainContainer: {
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
        backgroundColor: 'white',
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
    },

    loginBtn: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: comStyles.COLORS.ICON_BLUE,
        marginBottom: 10,
        marginTop: 20,
        justifyContent: "flex-start",
        alignItems: "flex-start",
        alignContent: "flex-start",

    },

    rejectBtn: {
        backgroundColor: comStyles.COLORS.HIGH_BUTTON_RED,
        marginBottom: 30
    },

    ActionButton: {
        marginTop: 10,
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center",
    },

    txtStyle: {
        color: comStyles.COLORS.ICON_BLUE
    },
    dashStyle: {
        width: 50,
        height: 5,
        backgroundColor: comStyles.COLORS.DASH_COLOR,
        borderRadius: 20,
        marginTop: 5,
    },
    modalCont: {
        flex: 1,
        flexGrow: 1,
        paddingHorizontal: 10,

    },
});
export default RequestButtonSheet;