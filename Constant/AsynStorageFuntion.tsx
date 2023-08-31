

import AsyncStorage from '@react-native-async-storage/async-storage';
import AsyncStorageConstants from './AsyncStorageConstants';

export const getCurrentPendingListType = async () => {
  try {
    const value = await AsyncStorage.getItem(AsyncStorageConstants.ASYNC_CURRENT_PENDING_LIST_TYPE)
    return value

  } catch (e) {
    // console.log('Failed to fetch the data from storage')
  }
}

export const getLoginUserRoll = async () => {
  try{
    const value = await AsyncStorage.getItem(AsyncStorageConstants.ASYNC_STORAGE_LOGIN_UserRoll)
    return value
  } catch (e) {
    // console.log('Failed to fetch the data from storage')
  }
}

export const getLoginUserName = async () => {
  try {
    const value = await AsyncStorage.getItem(AsyncStorageConstants.ASYNC_STORAGE_LOGIN_NAME)
    return value

  } catch (e) {
    // console.log('Failed to fetch the data from storage')
  }
}
export const getLoginUName = async () => {
  try {
    const value = await AsyncStorage.getItem(AsyncStorageConstants.ASYNC_STORAGE_LOGIN_USER_NAME)
    return value

  } catch (e) {
    // console.log('Failed to fetch the data from storage')
  }
}

export const getLoginPassword = async () => {
  try {
    const value = await AsyncStorage.getItem(AsyncStorageConstants.ASYNC_STORAGE_LOGIN_PASSWORD)
    return value

  } catch (e) {
    // console.log('Failed to fetch the data from storage')
  }
}

export const getLoginUserID = async () => {
  try {
    const value = await AsyncStorage.getItem(AsyncStorageConstants.ASYNC_STORAGE_LOGIN_UserID)
    return value

  } catch (e) {
    // console.log('Failed to fetch the data from storage')
  }
}

export const ClearAsyncStorage = async () => {
 
    try {
      await AsyncStorage.clear()
      return "OK"
    } catch (e) {
      // console.log('Failed to clear the async storage.')
    }
}

export const getRejectedId = async () => {
  try{
    const value = await AsyncStorage.getItem(AsyncStorageConstants.ASYNC_STORAGE_REJECTED_ID)
    return value
  } catch (e) {
    // console.log('Failed to fetch the data from storage')
  }
}

export const CopyRequest = async () => {
  try{
    const value = await AsyncStorage.getItem(AsyncStorageConstants.ASYNC_STORAGE_IS_COPY)
    return value
  } catch (e) {
    // console.log('Failed to fetch the data from storage')
  }
}

export const get_ASYNC_LOGIN_ROUND = async () => {
  try {
    const value = await AsyncStorage.getItem(AsyncStorageConstants.ASYNC_STORAGE_LOGIN_ROUND)
    return value

  } catch (e) {
    // console.log('Failed to fetch the data from storage')
  }
}

export const get_ASYNC_CHECKSYNC = async () => {
  try {
    const value = await AsyncStorage.getItem(AsyncStorageConstants.ASYNC_CHECK_SYNC)
    return value

  } catch (e) {
    // console.log('Failed to fetch the data from storage')
  }
}

export const get_ASYNC_IS_Auth_Requester = async () => {
  try {
    const value = await AsyncStorage.getItem(AsyncStorageConstants.ASYNC_IS_Auth_Requester)
    return value

  } catch (e) {
    // console.log('Failed to fetch the data from storage')
  }
}

export const get_ASYNC_COST_CENTER = async () => {
  try {
    const value = await AsyncStorage.getItem(AsyncStorageConstants.ASYNC_STORAGE_LOGIN_COSTCENTER)
    return value

  } catch (e) {
    // console.log('Failed to fetch the data from storage')
  }
}

export const get_ASYNC_EPFNO = async () => {
  try {
    const value = await AsyncStorage.getItem(AsyncStorageConstants.ASYNC_STORAGE_LOGIN_EPFNO)
    return value

  } catch (e) {
    // console.log('Failed to fetch the data from storage')
  }
}

export const get_ASYNC_MAX_AMOUNT = async () => {
  try {
    const value = await AsyncStorage.getItem(AsyncStorageConstants.ASYNC_STORAGE_MAXIMUM_REQUEST_AMOUNT)
    return value

  } catch (e) {
    // console.log('Failed to fetch the data from storage')
  }
}

export const get_ASYNC_JOBOWNER_APPROVAL_AMOUNT = async () => {
  try {
    const value = await AsyncStorage.getItem(AsyncStorageConstants.ASYNC_STORAGE_JOBOWNER_APPROVAL_AMOUNT)
    return value

  } catch (e) {
    // console.log('Failed to fetch the data from storage')
  }
}


  //   set_data = async (storage_key, value) => {
  //     try {
  //         const value_to_store = JSON.stringify(value);
  //         return await AsyncStorage.setItem(storage_key, value_to_store);
  //     } catch (error) {
  //         console.log(error);
  //         return error;
  //     }
  // }
  
  // get_data = async (storage_key) => {
  //     console.log("Getting Data", storage_key);
  //     const value = await AsyncStorage.getItem(storage_key)
  //         .then((returned_value) => {
  //             const parsed = JSON.parse(returned_value);
  //             return parsed;
  //         })
  //         .catch((error) => {
  //             console.log("Get Item Error: ", error);
  //         })
  //     console.log("Finished Getting Data");
  //     return value;
  // }
  
  // clear_data = async () => {
  //     console.log("Clearing Persistent Storage");
  //     return await AsyncStorage.clear();
  // }
  
  // module.exports = {
  //     set_data,
  //     get_data,
  //     clear_data
  // }


