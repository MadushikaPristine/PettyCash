import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import NavigationScreen from '../BottomNavigation/NavigationScreen';
import LoginScreen from '../Login/LoginScreen';
import SyncScreen from "../SyncData/SyncScreen";
import NewOneOffScreen from '../NewOneOffRequest/CreateNewOneOffScreen';
import AddOneOffDetailScreen from '../NewOneOffRequest/AddOneOffDetailScreen';
import AddAttatchmentOneOffScreen from '../NewOneOffRequest/AddAttatchmentOneOffScreen';
import CreateNewIOUScreen from '../newIOURequest/CreateNewIOUScreen';
import AddIOUDetailScreen from '../newIOURequest/AddIOUDetailScreen';
import AddAttatchmentIOUScreen from '../newIOURequest/AddAttatchmentIOUScreen';
import CreateNewIOUSettlementScreen from '../NewIOUSettlementRequest/CreateNewIOUSettlementScreen';
import AddAttatchmmentSettlement from '../NewIOUSettlementRequest/AddAttatchmmentSettlement';
import AddIOUSETDetailScreen from '../NewIOUSettlementRequest/AddIOUSETDetailScreen';


const stack = createNativeStackNavigator();

const RootNavigator = () => {

    return (

        <NavigationContainer independent={true}>

            <stack.Navigator initialRouteName='Login'>

                <stack.Screen name='BottomNavi' component={NavigationScreen} options={{headerShown:false}} />
                <stack.Screen name='Login' component={LoginScreen} options={{headerShown:false}} />
                <stack.Screen name="Sync" component={SyncScreen} options={{ headerShown: false }} />
                <stack.Screen name="NewOneOffScreen" component={NewOneOffScreen} options={{ headerShown: false }} />
                <stack.Screen name="AddOneOffDetailScreen" component={AddOneOffDetailScreen} options={{ headerShown: false }} />
                <stack.Screen name="AddAttatchmentOneOffScreen" component={AddAttatchmentOneOffScreen} options={{ headerShown: false }} />
                <stack.Screen name="CreateNewIOUScreen" component={CreateNewIOUScreen} options={{ headerShown: false }} />
                <stack.Screen name="AddIOUDetailScreen" component={AddIOUDetailScreen} options={{ headerShown: false }} />
                <stack.Screen name="AddAttatchmentIOUScreen" component={AddAttatchmentIOUScreen} options={{ headerShown: false }} />
                <stack.Screen name="CreateNewIOUSettlementScreen" component={CreateNewIOUSettlementScreen} options={{ headerShown: false }} />
                <stack.Screen name="AddIOUSETDetailScreen" component={AddIOUSETDetailScreen} options={{ headerShown: false }} />
                <stack.Screen name="AddAttatchmmentSettlement" component={AddAttatchmmentSettlement} options={{ headerShown: false }} />

            </stack.Navigator>

        </NavigationContainer>

    );

}

export default RootNavigator;