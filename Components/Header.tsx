import React, { useState, useRef, useEffect } from "react";
import { BackHandler, Image, ImageBackground } from "react-native";
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

type ParamTypes = {
    title: string;
    isIcon?: boolean;
    isBtn?: boolean;
    image?: any;
    iconOnPress?: Function;
    btnOnPress?: Function;
    IconUserOnPress?: Function;
}


const Header = ({ title, isIcon, image, isBtn, iconOnPress, btnOnPress, IconUserOnPress }: ParamTypes) => {
    const [visible, setVisible] = useState(false);
    const navigation = useNavigation();
    const scale = useRef(new Animated.Value(0)).current;
    const options = [
        {
            title: 'LogOut',
            icon: 'menu',
        },
        {
            title: 'Exit',
            icon: 'menu',
        },
    ];

    function resizeBox(to: any) {
        to === 1 && setVisible(true);
        Animated.timing(scale, {
            toValue: to,
            useNativeDriver: true,
            duration: 200,
            easing: Easing.linear,
        }).start(() => to === 0 && setVisible(false));
    }

    useEffect(() => {
        //BackHandler.addEventListener('hardwareBackPress', HandleBackButton);
    })

    const logoutm = () => {

        // console.log('hiiiiiiiu');
    }

    const LogoutFuntion = () => {
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

        // console.log(" clear async ");


        await AsyncStorage.clear();
        deleteDB();


    };


    const deleteDB = async () => {

        // console.log(" clear db ");


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
            <View style={{ flex: 1, }}>
                <Text style={styles.textStyle}>{title}</Text>
            </View>
            <View style={{ width: 50, height: 40, borderRadius: 100 }}>
                <TouchableOpacity onPress={() => resizeBox(1)}
                >
                    <Image source={require('../assets/images/tpl_black.png')} style={{ width: 40, height: 40, borderRadius: 100, }} />
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
                                    onPress={op.title === "LogOut" ? LogoutFuntion: exittFuntion}
                                    style={[styles.option]}
                                >
                                    <Text style={{ color: '#2C4F77' }}>{op.title}</Text>
                                    <IconA name={'log-out'} size={26} color={'#2C4F77'} style={{ marginLeft: 10 }} />
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
        alignSelf: 'center'
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