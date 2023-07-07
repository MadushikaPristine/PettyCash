import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useEffect } from "react";
import {
    BackHandler
} from 'react-native';

import notifee, {AndroidImportance} from '@notifee/react-native';

const ProfileScreen = () => {
    const navigation = useNavigation();

    // const handlePress = () => {
    //     Notifications.postLocalNotification({
    //       title: 'Test notification',
    //       body: 'This is a test notification',
    //       sound: 'default',
    //       category: 'TEST_CATEGORY',
    //       userInfo: { test: 'data' },
    //     });
    //   };

    //   useEffect(() => {
    //     Notifications.events().registerNotificationReceivedForeground((notification, completion) => {
    //       console.log('Notification received in foreground:', notification.payload);
    //       completion({ alert: true, sound: true, badge: false });
    //     });
    
    //     Notifications.events().registerNotificationOpened((notification, completion) => {
    //       console.log('Notification opened:', notification.payload);
    //       completion();
    //     });
    
    //     Notifications.registerRemoteNotifications();
    //   }, []);


    useFocusEffect(
      React.useCallback(() => {

      


      },[])
    );

    // const onDisplayNotification = async () => {


    //     await notifee.requestPermission()

    //     const channelId = await notifee.createChannel({
    //         id: 'default',
    //         name: 'Default Channel',
    //         sound: 'default',
    //         importance: AndroidImportance.HIGH,
            
    //       });
      
    //       // Display a notification
    //       // await notifee.displayNotification({
    //       //   id: '123',
    //       //   title: 'Notification Title',
    //       //   body: 'Main body content of the notification',
    //       //   android: {
    //       //     channelId,
    //       //     smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
    //       //     // pressAction is needed if you want the notification to open the app when pressed
    //       //     // pressAction: {
    //       //     //   id: 'default',
    //       //     // },
    //       //   },
    //       // });

    //       const notificationId = await notifee.displayNotification({
    //         id: '123',
    //         title: 'Notification Title',
    //         body: 'Main body content of the notification',
    //         android: {
    //           channelId,
    //         },
    //       });
        
    //       // Sometime later...
    //       await notifee.displayNotification({
    //         id: '123',
    //         title: 'IOU has been approved by JobOwner',
    //         body: 'IOU Request IOU_159_1_M has been approved by the JobOwner and total payable has been updated',
    //         android: {
    //           channelId,
              
    //         },
    //       });
    // }


    const backHandletListener = () => {

      const onBackPress = () => {

          // Return true to stop default back navigaton
          // Return false to keep default back navigaton
          return true;
      };

      // Add Event Listener for hardwareBackPress
      BackHandler.addEventListener(
          'hardwareBackPress',
          onBackPress
      );

      return () => {
          // Once the Screen gets blur Remove Event Listener
          BackHandler.removeEventListener(
              'hardwareBackPress',
              onBackPress
          );
      };


  }

    
    return (

    <></>

    );
}
export default ProfileScreen; 