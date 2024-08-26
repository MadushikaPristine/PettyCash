import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useRef, useState } from "react";
import HomeScreen from "../HomeScreen";
import comStyles from "../../Constant/Components.styles";
import IconA from 'react-native-vector-icons/MaterialIcons';
import RequestScreen from "./Request/RequestScreen";
import NotificationScreen from "./Notification/NotificationScreen";
import ProfileScreen from "./Profile/ProfileScreen";
import ButtonSheetComponent from "../../Components/ButtonSheetComponent";
import RBSheet from "react-native-raw-bottom-sheet";
import { StyleSheet, Text, TouchableOpacity, View, TouchableWithoutFeedback, Dimensions, Animated, Platform, Keyboard, Alert } from "react-native";
import RequestButtonSheet from "../../Components/RequestButtonSheet";
import OneOffScreen from "../PendingRequest/One-Off Settlements";
import PendingList from "../PendingRequest/PendingList";
import SettlementScreen from "../PendingRequest/IOUSettlements";
import IOUScreen from "../PendingRequest/IOUScreen";
import NewIOUScreen from "../Add/NewIOUScreen";
import NewIOUSettlement from "../Add/NewIOUSettlment";
import NewOneOffSettlement from "../Add/NewOneOffSettlement";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import AsyncStorageConstants from "../../Constant/AsyncStorageConstants";
import { getLoginUserRoll } from "../../Constant/AsynStorageFuntion";
import SyncScreen from "../SyncData/SyncScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PendingRequestList from "../PendingRequest/PendingRequestList";

let width = Dimensions.get("screen").width;
const height = Dimensions.get('screen').height;

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack() {



    return (

        <Stack.Navigator initialRouteName="Home">

            <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="OneOffScreen" component={OneOffScreen} options={{ headerShown: false }} />
            <Stack.Screen name="PendingList" component={PendingList} options={{ headerShown: false }} />
            <Stack.Screen name="SettlementScreen" component={SettlementScreen} options={{ headerShown: false }} />
            <Stack.Screen name="IOU" component={IOUScreen} options={{ headerShown: false }} />
            <Stack.Screen name="NewIOU" component={NewIOUScreen} options={{ headerShown: false }} />
            <Stack.Screen name="NewIOUSettlement" component={NewIOUSettlement} options={{ headerShown: false }} />
            <Stack.Screen name="NewOneOffSettlement" component={NewOneOffSettlement} options={{ headerShown: false }} />
            <Stack.Screen name="Sync" component={SyncScreen} options={{ headerShown: false }} />
            <Stack.Screen name="PendingRequestList" component={PendingRequestList} options={{ headerShown: false }} />

        </Stack.Navigator>

    );
}

const PayScreenComponent = () => {
    return null
}

const ScreenComponent = () => {
    return null
}



const NavigationScreen = () => {

    const navigation = useNavigation();
    const [roll, setRoll] = useState('');

    const [modalStyle, setModalStyle] = useState(new Animated.Value(height));

    const refRBSheet = useRef<RBSheet>(null);

    const slideInModal = () => {
        // setIsShowSweep(false);
        // console.log('sampleIn');

        Animated.timing(modalStyle, {
            toValue: height / 2.2,
            duration: 500,
            useNativeDriver: false,
        }).start();
    };

    const slideOutModal = () => {
        // setIsShowSweep(true);
        Keyboard.dismiss();
        Animated.timing(modalStyle, {
            toValue: height,
            duration: 500,
            useNativeDriver: false,
        }).start();
    };


    const IOU = () => {
        
            slideOutModal();
            navigation.navigate("IOU")
        

    }

    const PendingList = async () => {
        slideOutModal();

        await AsyncStorage.setItem(AsyncStorageConstants.ASYNC_CURRENT_PENDING_LIST_TYPE, "all");
        navigation.navigate('PendingList')
    }

    const SettlementScreen = () => {
        
            slideOutModal();
            navigation.navigate("SettlementScreen")
        

    }

    const OneOffScreen = () => {
        
            slideOutModal();
            navigation.navigate("OneOffScreen")
        

    }


    useFocusEffect(
        React.useCallback(() => {

            getLoginUserRoll().then(res => {
                setRoll(res);
                // console.log("User Roll: ", res);
            })

        }, [])
    );


    return (

        <>
            <Animated.View
                style={{
                    ...StyleSheet.absoluteFillObject,
                    top: modalStyle,
                    backgroundColor: '#fff',
                    zIndex: 20,
                    borderRadius: 10,
                    elevation: 20,
                    paddingTop: 10,
                    paddingBottom: 10,
                    marginLeft: 0,
                    ...Platform.select({
                        ios: {
                            paddingTop: 10,
                        },
                    }),
                }}>
                <View style={styles.modalCont}>

                    <RequestButtonSheet
                        modalclose={() => slideOutModal()}
                        OneOffScreen={() => OneOffScreen()}
                        SettlementScreen={() => SettlementScreen()}
                        PendingList={() => PendingList()}
                        IOU={() => IOU()}
                    />


                </View>

            </Animated.View>

            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarShowLabel: false,
                    tabBarHideOnKeyboard: true,
                    tabBarStyle: {
                        position: "absolute",
                        elevation: 0,
                        backgroundColor: comStyles.COLORS.ICON_BLUE,
                        borderTopLeftRadius: 15,
                        borderTopRightRadius: 15,
                        height: 65,
                    },
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName;


                        if (route.name === 'HomeManager') {
                            iconName = focused ? 'home' : 'home';
                        } else if (route.name === 'Notification') {
                            iconName = focused ? 'notifications' : 'notifications';
                        } else if (route.name === 'Request') {
                            iconName = focused ? 'work' : 'work';
                        } else if (route.name === 'Profile') {
                            iconName = focused ? 'person' : 'person';
                        } else if (route.name === 'Add') {
                            iconName = focused ? 'add-box' : 'add-box';
                        }

                        return <IconA name={iconName} size={size} color={color} />;
                    },

                    tabBarActiveTintColor: comStyles.COLORS.DASH_COLOR,
                    tabBarInactiveTintColor: comStyles.COLORS.WHITE,
                })}
            >

                <Tab.Screen name="HomeManager" component={HomeStack} options={{ headerShown: false }} />
                <Tab.Screen name="Request"
                    component={PayScreenComponent}
                    options={{
                        headerShown: false,
                        //  tabBarButton: () => (<RequestButtonSheet/>),
                        // tabBarButton: () => {
                        //     return <RequestButtonSheet />
                        // },
                        // tabBarIcon: ({ focused }) => (<IconA name='work' focused={focused} />),
                    }}
                    listeners={{
                        tabPress: (e) => {

                            e.preventDefault();
                            slideInModal();


                        }
                    }} />
                <Tab.Screen name="Add"
                    component={ScreenComponent}
                    options={{
                        headerShown: false,
                        //tabBarButton: () => (roll=='Requester' ? <ButtonSheetComponent /> : <></>),
                        tabBarButton : () => <ButtonSheetComponent />
                    }} />
                <Tab.Screen name="Notification" component={NotificationScreen} options={{ headerShown: false }} />
                <Tab.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />

            </Tab.Navigator></>


    );

}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        padding: 24,
        backgroundColor: 'grey',
    },
    contentContainer: {
        flex: 1,
        paddingLeft: 50
    },
    bottomSheetTitle: {
        fontSize: 24,
        fontWeight: '500'
    },
    modalCont: {
        flex: 1,
        flexGrow: 1,
        width: width,
        paddingHorizontal: 10,

    },


});
export default NavigationScreen;