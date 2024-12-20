import React, { useState, useRef, useEffect } from "react";
import { BackHandler, Dimensions, FlatList, Image, ImageBackground } from "react-native";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    SafeAreaView,
    Alert,
    Animated,
    Easing
} from "react-native";

import IconA from 'react-native-vector-icons/Ionicons';
import ComponentsStyles from "../Constant/Components.styles";
import { useIsFocused, useNavigation } from '@react-navigation/native';
import AsyncStorageConstants from "../Constant/AsyncStorageConstants";
import { CleanDatabase } from "../SQLiteDBAction/DBService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Share from 'react-native-share';
import moment from 'moment';
import RNFS from 'react-native-fs';
import logFileDialogBox from "./LogFileDialogBox";
import { ShareDBFile } from "../Constant/ShareDB";

type ParamTypes = {
    title: string;
    isIcon?: boolean;
    isBtn?: boolean;
    image?: any;
    iconOnPress?: Function;
    btnOnPress?: Function;
    IconUserOnPress?: Function;
    ShareLog?: Function;
}


const Header = ({ title, isIcon, image, isBtn, iconOnPress, btnOnPress, IconUserOnPress, ShareLog }: ParamTypes) => {
    const [visible, setVisible] = useState(false);
    const navigation = useNavigation();
    const scale = useRef(new Animated.Value(0)).current;
    const options = [
        {
            title: 'LogOut',
            icon: 'log-out',
        },
        {
            title: 'Exit',
            icon: 'log-out',
        },
        {
            title: 'Share Log File',
            icon: 'share-social',
        },
        {
            title: 'Share DB',
            icon: 'share-social',
        },
    ];

    async function resizeBox(to: any) {
        to === 1 && setVisible(true);
        Animated.timing(scale, {
            toValue: to,
            useNativeDriver: true,
            duration: 200,
            easing: Easing.linear,
        }).start(() => to === 0 && setVisible(false));

        await AsyncStorage.setItem(AsyncStorageConstants.VIEW_LOG_FILE_BOX, "false");
    }

    useEffect(() => {
        //BackHandler.addEventListener('hardwareBackPress', HandleBackButton);
    })

    const logoutm = () => {

        // console.log('hiiiiiiiu');
    }

    const LogoutFuntion = () => {

        console.log(" pressed logout");
        
        Alert.alert('LogOut', 'Are you sure LogOut', [
            {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            { text: 'OK', onPress: () => logout() },
        ]);
    };

    const logout = async () => {

        console.log(" clear async ");


        await AsyncStorage.clear();
        deleteDB();


    };


    const deleteDB = async () => {

        console.log(" clear db 1111 ");


        await AsyncStorage.setItem(AsyncStorageConstants.ASYNC_STORAGE_LOGIN_ROUND, "1");
        await AsyncStorage.setItem(AsyncStorageConstants.ASYNC_CHECK_SYNC, "1")

        CleanDatabase();
        navigation.navigate('Login');

        // DevSettings.reload();

    }

    const exittFuntion = () => {

        Alert.alert('Exit', 'Are you sure you want to exit ', [
            {
                text: 'No',
                onPress: () => console.log('No Pressed'),
                style: 'cancel',
            },
            { text: 'Yes', onPress: () => exitmethodfunc() },
        ]);
    };

    const exitmethodfunc = () => {
        console.log("ooooooooooooooooo===============");
        BackHandler.exitApp()


    }

    // const HandleBackButton = () => {

    //     Alert.alert(
    //         'Exit App',
    //         'Exiting the application?', [{
    //             text: 'Cancel',
    //             onPress: () => console.log('Cancel Pressed'),
    //             style: 'cancel'
    //         }, {
    //             text: 'OK',
    //             onPress: () => BackHandler.exitApp()
    //         },], {
    //         cancelable: false
    //     }
    //     )
    //     return true;


    // }

    // const ShareLog = () => {
    //     console.log("share log");




    // }

    const viewLogFileList = (list: any) => {

        setFileList(list);

        console.log(" log file list [][][][]  ", list);

        setisDialog(true);

    }

    const ShareDB = () => {
        // ShareDBFile()

        let filePath = 'file:////data/user/0/com.pettycashapp/databases/TPL.db';

        RNFS.exists(filePath)
            .then(async (exists) => {
                if (exists) {
                    console.log('File exists');

                    Share.open({
                        url: filePath,
                        title: 'TPL.db',
                        message: 'Pettycash Database file',
                    });

                } else {

                    console.log('File not exists');

                }
            })
            .catch((error) => {
                console.log(error);
            });



    }



    return (


        <View style={styles.container}>
            {isIcon ?
                <TouchableOpacity
                    onPress={() => {
                        if (iconOnPress) iconOnPress();
                    }}
                >
                    <IconA name='sync' size={35} color='color' style={styles.iconStye} />
                </TouchableOpacity>
                : <></>
            }
            {isBtn ?
                <TouchableOpacity style={styles.btnStye}
                    onPress={() => {
                        if (btnOnPress) btnOnPress();
                    }}
                >
                    <IconA name='arrow-back' size={40} color='color' style={styles.iconStye} />
                </TouchableOpacity>
                :
                <></>
            }
            <View style={{ flex: 1, justifyContent: "center", alignContent: "center", alignItems: "center" }}>
                <Text style={styles.textStyle}>{title}</Text>
            </View>
            <View style={{ width: 50, height: 40, borderRadius: 100 }}>
                <TouchableOpacity onPress={() => resizeBox(1)}
                >
                    <Image source={require('../assets/images/tpl.jpg')} style={{ width: 40, height: 40, borderRadius: 100, }} />
                </TouchableOpacity>
                <Modal transparent visible={visible}>
                    <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }} onTouchStart={() => resizeBox(0)}>
                        <View style={styles.popup}>
                            {/* {options.map((op, i) => (
                                <TouchableOpacity key={i} {op.title = "LogOut" ? onPress = { LogoutFuntion } : onPress = { exitmethodfunc }} style={[styles.option]}>
                                    <Text style={{ color: '#2C4F77' }}>{op.title}</Text>
                                    <IconA name={'log-out'} size={26} color={'#2C4F77'} style={{ marginLeft: 10 }} />
                                </TouchableOpacity>



                            ))} */}

                            {options.map((op, i) => (
                                <TouchableOpacity
                                    key={i}
                                    onPress={op.title === "LogOut" ? LogoutFuntion : op.title === "Exit" ? exittFuntion : op.title === "Share Log File" ? () => { if (ShareLog) ShareLog(); } : ShareDB}
                                    style={[styles.option]}
                                >
                                    <Text style={{ color: '#2C4F77' }}>{op.title}</Text>
                                    <IconA name={op.icon} size={26} color={'#2C4F77'} style={{ marginLeft: 10 }} />
                                </TouchableOpacity>
                            ))}

                        </View>

                    </SafeAreaView>

                </Modal>

            </View>




        </View>

    );
}
export default Header;


const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 70,
        backgroundColor: ComponentsStyles.COLORS.WHITE,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        justifyContent: "center"
    },
    iconStye: {
        color: 'black',

    },
    textStyle: {
        fontFamily: ComponentsStyles.FONT_FAMILY.BOLD,
        color: '#11074E',
        fontSize: 18,
        alignSelf: 'center',
        alignContent: "center",
        alignItems: "center",
        textAlign: "center"
    },
    btnStye: {
        width: 40,
        height: 40,
        backgroundColor: ComponentsStyles.COLORS.WHITE,
        borderRadius: 10
    },
    popup: {
        borderRadius: 8,
        borderColor: '#2C4F77',
        borderWidth: 2,
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        position: 'absolute',
        top: 78,
        right: 20,
        color: '#2C4F77'
    },

    option: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 7,
        borderBottomColor: '#ccc',

    }

});