import RBSheet from "react-native-raw-bottom-sheet";
import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import comStyles from '../Constant/Components.styles'
import Icon from 'react-native-vector-icons/MaterialIcons';
import Modal from 'react-native-modal';
import ActionButton from "./ActionButton";
import { getLoginUserID, getLoginUserRoll } from "../Constant/AsynStorageFuntion";
import { checkOpenRequests } from "../SQLiteDBAction/Controllers/IOUController";
import { checkOpenRequestsOneOff } from "../SQLiteDBAction/Controllers/OneOffSettlementController";
import DropdownAlert, { DropdownAlertData, DropdownAlertType } from "react-native-dropdownalert";
let alert = (_data: DropdownAlertData) => new Promise<DropdownAlertData>(res => res);
const ButtonSheetComponent = () => {

    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);
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

    const newIOU = () => {
        // ====================================================
        // getLoginUserID().then(result => {
        //     checkOpenRequests(parseInt(result + ""), async (resp: any) => {
        //         if (resp.length > 0) {
        //             Alert.alert('Can not create a new Request', 'You already have an open status request', [
        //                 {
        //                     text: 'Ok',
        //                     onPress: () => console.log('Cancel Pressed'),
        //                     style: 'cancel',
        //                 },
        //                 // { text: 'Yes', onPress: (back) },
        //             ]);
        //             setModalVisible(false);
        //         } else {
        //             setModalVisible(false);
        //             // navigation.navigate('NewIOU');
        //             navigation.navigate('CreateNewIOUScreen');
        //         }
        //     });
        // })
        navigation.navigate('CreateNewIOUScreen');
        // ================================================
    }
    const NewIOUSettlement = () => {

        setModalVisible(false);
        // navigation.navigate('NewIOUSettlement');
        navigation.navigate('CreateNewIOUSettlementScreen');

    }

    const NewOneOffSettlement = () => {
        // getLoginUserID().then(result => {

        //     checkOpenRequestsOneOff(parseInt(result + ""), (resp: any) => {

        //         if (resp.length > 0) {

        //             Alert.alert('Can not create a new Request', 'You already have an open status request', [
        //                 {
        //                     text: 'Ok',
        //                     onPress: () => console.log('Cancel Pressed'),
        //                     style: 'cancel',
        //                 },
        //                 // { text: 'Yes', onPress: (back) },
        //             ]);

        //             setModalVisible(false);

        //         } else {

        //             setModalVisible(false);
        //             navigation.navigate('NewOneOffSettlement');

        //         }

        //     });

        // })
        setModalVisible(false);
        // navigation.navigate('NewOneOffSettlement');
        navigation.navigate('NewOneOffScreen');
    }

    useFocusEffect(
        React.useCallback(() => {

            getLoginUserRoll().then(resp => {
                setRoll(resp);
                // console.log("User Roll: ", resp);
            })

        }, [])
    );


    return (

        <View style={styles.headerContainer}>
            <TouchableOpacity style={{ alignSelf: 'center' }} onPress={() => { setModalVisible(true) }}>
                <Icon name={"add-box"} size={30} color={"white"} style={{}} />
            </TouchableOpacity>
            <View style={styles.container}>
                <Modal
                    backdropOpacity={0.3}
                    isVisible={modalVisible}
                    onBackdropPress={() => modalClose()}
                    style={styles.contentView}
                >
                    <View style={styles.modalMainContainer}>

                        <TouchableOpacity style={styles.dashStyle} onPress={() => modalClose()} />

                        <View style={{ width: '100%', }}>

                            <ActionButton
                                title="Add New IOU"
                                style={styles.loginBtn}
                                textStyle={styles.txtStyle}
                                is_icon={true}
                                iconColor={comStyles.COLORS.MAIN_COLOR}
                                icon_name='square'
                                onPress={() => newIOU()}

                            />
                            <ActionButton
                                title="Add New IOU Settlement"
                                style={styles.loginBtn}
                                textStyle={styles.txtStyle}
                                is_icon={true}
                                iconColor={comStyles.COLORS.MAIN_COLOR}
                                icon_name='square'
                                onPress={() => NewIOUSettlement()}
                            />
                            <ActionButton
                                title="Add New One-Off Settlement"
                                style={styles.loginBtn}
                                textStyle={styles.txtStyle}
                                is_icon={true}
                                iconColor={comStyles.COLORS.MAIN_COLOR}
                                icon_name='square'
                                onPress={() => NewOneOffSettlement()}
                            //disabled={roll=='Requester' ? false : true}
                            />

                            <ActionButton title="Cancel" style={styles.ActionButton} onPress={() => modalClose()} />
                        </View>

                    </View>

                </Modal>
            </View>
        </View>


    );

}
const styles = StyleSheet.create({
    headerContainer: {
        justifyContent: 'center'
    },
    container: {
        width: 100,
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
        borderColor: comStyles.COLORS.MAIN_COLOR,
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
        color: comStyles.COLORS.MAIN_COLOR
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
export default ButtonSheetComponent;