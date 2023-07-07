import React from "react";
import RootNavigator from "./Screens/Navigation/RootNavigator";
import { SafeAreaProvider } from 'react-native-safe-area-context';



const componentName = () => {
  return (
    <SafeAreaProvider>
      <RootNavigator />
    </SafeAreaProvider>

  );

};
export default componentName;

// Alert.alert('Log Out !', 'Are you sure you want to log out ?', [
//   {
//     text: 'No',
//     onPress: () => console.log('Cancel Pressed'),
//     style: 'cancel',
//   },
//   {text: 'Yes', onPress: (Handlelogout)},
// ]);