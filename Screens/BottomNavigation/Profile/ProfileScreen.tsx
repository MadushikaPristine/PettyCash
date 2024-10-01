import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
  Dimensions,
  Button,
  BackHandler
} from 'react-native';
// import { Notifications } from 'react-native-notifications';
import notifee, { AndroidImportance } from '@notifee/react-native';
import { getLoginUserID, getLoginUserName } from "../../../Constant/AsynStorageFuntion";
import { getLoginUserDetails } from "../../../SQLiteDBAction/Controllers/UserController";
import ViewField from "../../../Components/ViewField";
import Header from "../../../Components/Header";
import { version } from "./../../../package.json";
import ComponentsStyles from "../../../Constant/Components.styles";

const ProfileScreen = () => {
  const navigation = useNavigation();

  const [username, setusername] = useState('');
  const [name, setname] = useState('');
  const [email, setemail] = useState('');
  const [AppVersion, setAppVersion] = useState('');


  useFocusEffect(
    React.useCallback(() => {

      getAppVesion();
      getLoginUserID().then(resid => {
        // console.log(resid, " user name ....... ", resid);
        getLoginUserDetails(resid, (result: any) => {
          // console.log(result, "-----------------");
          setusername(result[0].UserName);
          setname(result[0].DisplayName);
          setemail(result[0].Email);


        })

      })
      // console.log(username, "-------", name, "-------", email);






    }, [])
  );

  // const onDisplayNotification = async () => {


  //   await notifee.requestPermission()

  //   const channelId = await notifee.createChannel({
  //     id: 'default',
  //     name: 'Default Channel',
  //     sound: 'default',
  //     importance: AndroidImportance.HIGH,

  //   });



  //   const notificationId = await notifee.displayNotification({
  //     id: '123',
  //     title: 'Notification Title',
  //     body: 'Main body content of the notification',
  //     android: {
  //       channelId,
  //     },
  //   });

  //   // Sometime later...
  //   await notifee.displayNotification({
  //     id: '123',
  //     title: 'IOU has been approved by JobOwner',
  //     body: 'IOU Request IOU_159_1_M has been approved by the JobOwner and total payable has been updated',
  //     android: {
  //       channelId,

  //     },
  //   });
  // }


  // const backHandletListener = () => {

  //   const onBackPress = () => {

  //     // Return true to stop default back navigaton
  //     // Return false to keep default back navigaton
  //     return true;
  //   };

  //   // Add Event Listener for hardwareBackPress
  //   BackHandler.addEventListener(
  //     'hardwareBackPress',
  //     onBackPress
  //   );

  //   return () => {
  //     // Once the Screen gets blur Remove Event Listener
  //     BackHandler.removeEventListener(
  //       'hardwareBackPress',
  //       onBackPress
  //     );
  //   };


  // }

  const getAppVesion = () => {

    console.log("-----  version -----   ", version);

    //setAppVersion("CLIVE" + version + "V");
    setAppVersion("CUAT" + version + "V");

  }


  return (
    <SafeAreaView>
      <Header title="Profile" isBtn={true} btnOnPress={() => navigation.goBack()} />

    
        {/* <ScrollView style={{ height: '80%', marginBottom: 0, marginLeft: 13, marginRight: 13 }} showsVerticalScrollIndicator={false}> */}


        <View style={{ alignContent: "flex-end", alignItems: "flex-end", marginRight: 10 }} >
          <Text style={{ color: ComponentsStyles.COLORS.DASH_COLOR, fontSize: 15, }}>{AppVersion}</Text>
        </View>

        <ViewField
          title="UserName :"
          Value={username} titleStyle={undefined} valustyle={undefined} />
        <ViewField
          title="Name :"
          Value={name} titleStyle={undefined} valustyle={undefined} />
        <ViewField
          title="Email : "
          Value={email} titleStyle={undefined} valustyle={undefined} />
        {/* </ScrollView> */}
        {/* <View style={{ marginBottom: 0, marginLeft: 20, alignItems: 'flex-start', justifyContent: 'space-evenly' }} >
        <View style={{ flex: 2, borderBottomRightRadius: 20, borderBottomLeftRadius: 20 }}>
          <Text style={{ fontSize: 20, marginTop: 10, color: '#ffffff', fontFamily: 'Montserrat-Bold' }}>{ }</Text>
          <View style={{ flexDirection: 'row', marginBottom: 10 }}>
            <Text style={{ color: '#000000', fontFamily: 'Montserrat-SemiBold' }}>UserName : </Text>
            <Text style={{ marginLeft: 15, color: '#000000', fontFamily: 'Montserrat-SemiBold' }}>{username}</Text>
          </View>
          <View style={{ flexDirection: 'row', marginBottom: 10 }}>
            <Text style={{ color: '#000000', fontFamily: 'Montserrat-SemiBold' }}>Name : </Text>
            <Text style={{ marginLeft: 15, color: '#000000', fontFamily: 'Montserrat-SemiBold' }}>{name}</Text>
          </View>
          <View style={{ flexDirection: 'row', marginBottom: 10 }}>
            <Text style={{ color: '#000000', fontFamily: 'Montserrat-SemiBold' }}>Email : </Text>
            <Text style={{ marginLeft: 15, color: '#000000', fontFamily: 'Montserrat-SemiBold' }}>{email}</Text>
          </View>
        </View>

      </View> */}
    





      {/* <View style={{ marginTop: 20, marginBottom: 10, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontFamily: 'Montserrat-SemiBold' }}>Developed By Pristine</Text>
        <Text style={{ fontFamily: 'Montserrat-SemiBold' }}>Version </Text> */}
      {/* </View> */}



    </SafeAreaView>




  );
}
export default ProfileScreen; 