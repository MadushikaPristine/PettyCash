import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import AsyncStorageConstants from "../../Constant/AsyncStorageConstants";
//import { serverUrl } from '../config.json';

const UNAUTHORIZED = 401;
const axiosInstance = axios;

const getAuthToken=async()=>{

    let token=await AsyncStorage.getItem(AsyncStorageConstants.ASYNC_TOCKEN);
    return token
}

axiosInstance.defaults.headers.common = {
    "Access-Control-Allow-Origin": "*",
    "Authorization":`Bearer ${getAuthToken()}`
};

axiosInstance.defaults.withCredentials = true;

axiosInstance.interceptors.response.use(
    response => response,
    error => {
        if (error && error.response) {
            const { status } = error.response;
            console.log(JSON.stringify(status));
        }
        return Promise.reject(error);
    }
);

export default {
    get: axiosInstance.get,
    post: axiosInstance.post,
    put: axiosInstance.put,
    delete: axiosInstance.delete
};
