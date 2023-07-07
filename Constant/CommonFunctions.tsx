import { BackHandler } from "react-native";
import moment from 'moment-timezone';

 export const getCurrentTime = (callback:any) => {

    // console.log(".............................  " + moment().utcOffset('+05:30').format(' hh:mm:ss a') + "...................................")

    return moment().utcOffset('+05:30').format(' hh:mm:ss a');

}

export const getCurrentDate = (callback:any) => {

  // console.log(".............................  " + moment().format('MMMM Do YYYY') + "...................................")

  let datec = moment().format('MMMM Do YYYY');

  return datec;

}

export const BackPressHandler = (callback:any) => {
    BackHandler.addEventListener('hardwareBackPress', () => {
      callback();
      return true;
    });
}


