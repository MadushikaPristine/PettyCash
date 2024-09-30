import React, { Component, useState } from "react";
import {
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    FlatList,
    Dimensions
} from 'react-native';
import ActionButton from "../../../Components/ActionButton";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import CancelSubmitPopup from "../../../Components/CancelSubmitPopup";
import AddAnotherJob from "../../../Components/AddAnotherJob";
import Header from "../../../Components/Header";
import { todayNotifications, yesterdayNotifications } from "../../../Constant/DummyData";
import NotificationList from "../../../Components/NotificationList";
import NotificationPopup from "../../../Components/NotificationPopup";
import ComponentsStyles from "../../../Constant/Components.styles";
//import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { filterRequestsByStatus } from "../../../SQLiteDBAction/Controllers/IOUController";
import moment from "moment";

const NotificationScreen = () => {
    const navigation = useNavigation();
    const [todayNotificationList, setTodayNotificationList] = useState([]);
    var currentDate = moment().utcOffset('+05:30').format('YYYY-MM-DD 23:59:59');

    const getNotificationByStatus = () => {
    //   filterRequestsByStatus((result: any) => {
    //     console.log("Today Notifications ", result);
    //     setTodayNotificationList(result);
        
    // })

    }

    useFocusEffect(
      React.useCallback(() => {
        //getNotificationByStatus();
        filterRequestsByStatus(currentDate, (result: any) => {
          // console.log("Today Notifications ", result);
          // setTodayNotificationList(result);
          
      })
          
  
      },[navigation])
  )


    
    return(
      <SafeAreaView style={ComponentsStyles.CONTAINER}>
        <View style={styles.screen}>
            <Header title="Petty Cash Request" isBtn={true}  btnOnPress={() => navigation.navigate('Home')}/>
            {/* <Text style={styles.listHeadling}>Today</Text>

            <FlatList
            showsHorizontalScrollIndicator={false}
            data={todayNotificationList}
            horizontal={false}
            renderItem={({ item }) => {
            return (
              <View>

                <NotificationList
                  ID={item.IOU_ID}
                  date={item.RequestDate}
                  approvedBy={item.CreatedBy}
                />

                

              </View>
            )
          }

          }
          keyExtractor={item => `${item._Id}`}
        />
        <Text style={styles.listHeadling}>Yesterday</Text>
        <FlatList           
            data={yesterdayNotifications}            
            renderItem={({ item }) => {
            return (
              <View>
                <NotificationList
                  title={item.title}
                  date={item.date}
                  time={item.time}
                  description={item.description}
                />
              </View>
            )
          }

          }
          keyExtractor={item => `${item._id}`}
        />
         */}
        </View>
        </SafeAreaView>
        
        );
}

const styles = StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: "#e9e9e9",
      
    },
    listHeadling: {
      color: ComponentsStyles.COLORS.HEADER_BLACK,
      fontSize: 20,
      fontFamily: ComponentsStyles.FONT_FAMILY.SEMI_BOLD,
      padding: 15
    },
    heading: {
      color: '#000',
      backgroundColor: "#fff",
      padding: 10,
      alignItems: 'center',
      justifyContent: "center",
      fontSize: 25,
      fontWeight: 'bold',
    },
  })
export default NotificationScreen;