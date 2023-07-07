import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import NavigationScreen from '../BottomNavigation/NavigationScreen';
import LoginScreen from '../Login/LoginScreen';
import SyncScreen from "../SyncData/SyncScreen";


const stack = createNativeStackNavigator();

const RootNavigator = () => {

    return (

        <NavigationContainer independent={true}>

            <stack.Navigator initialRouteName='Login'>

                <stack.Screen name='BottomNavi' component={NavigationScreen} options={{headerShown:false}} />
                <stack.Screen name='Login' component={LoginScreen} options={{headerShown:false}} />
                <stack.Screen name="Sync" component={SyncScreen} options={{ headerShown: false }} />

            </stack.Navigator>

        </NavigationContainer>

    );

}

export default RootNavigator;