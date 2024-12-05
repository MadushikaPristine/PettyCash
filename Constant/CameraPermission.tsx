import { PermissionsAndroid, Platform } from "react-native";

export const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                    title: "Camera Permission",
                    message: "This app needs camera access to take photos.",
                    buttonPositive: "OK",
                    buttonNegative: "Cancel",
                }
            );
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        } catch (err) {
            console.error("Camera permission error: ", err);
            return false;
        }
    }
    return true; // iOS automatically handles permissions
};