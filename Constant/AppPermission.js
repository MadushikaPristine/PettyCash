import { check,request ,PERMISSIONS, RESULTS } from 'react-native-permissions';
import { Platform } from 'react-native';


const PLATFORM_MICROPHONE_PERMISSIONS = {

    ios: PERMISSIONS.IOS.MICROPHONE,
    android: PERMISSIONS.ANDROID.RECORD_AUDIO
}
const PLATFORM_PHOTO_PERMISSIONS = {

    ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
    android: PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE
}
const REQUEST_PERMISSION_TYPE = {
    microphone: PLATFORM_MICROPHONE_PERMISSIONS,
    photo :PLATFORM_PHOTO_PERMISSIONS
}
const PERMISSION_TYPE = {
    microphone: 'microphone',
    photo : 'photo'
}
class AppPermission {
    checkPermission = async (type): Promise<boolean> => {

        console.log("AppPermission checkPermission type",type);
        const permissions = REQUEST_PERMISSION_TYPE[type][Platform.OS]
        console.log("AppPermission checkPermission permissions",permissions);
        if (!permissions) {
            return true
        }
        try {
            const result = await check(permissions)
            console.log("AppPermission checkPermission result",result);
            if (result === RESULTS.GRANTED) return true
            return this.requestPermission(permissions)
        } catch (error) {
            console.log("AppPermission  checkPermission error",error);
            return false;
        }
    }
    requestPermission = async (permissions): Promise<boolean> => {
        console.log("AppPermission requestPermission checkPermission permissions",permissions);
        try {
            const result = await request(permissions)
            console.log("AppPermission requestPermission checkPermission result",result);
            return result ===RESULTS.GRANTED
        } catch (error) {
            console.log("AppPermission requestPermission checkPermission error",error);
            return false
        }
    }
}
const Permission = new AppPermission()
export {Permission,PERMISSION_TYPE}