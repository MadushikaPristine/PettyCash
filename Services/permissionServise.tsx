import { Alert } from 'react-native';
import { Platform } from 'react-native';
import { checkNotifications, checkMultiple, requestMultiple, PERMISSIONS, RESULTS } from 'react-native-permissions';

export async function requestPermission() {
    await checkPermissions();
}

export async function checkPermissions() {
    if (Platform.OS === "ios") {
        // await messaging().requestPermission();
  
        await requestMultiple([PERMISSIONS.IOS.CAMERA, PERMISSIONS.IOS.LOCATION_WHEN_IN_USE, PERMISSIONS.IOS.PHOTO_LIBRARY]).then(async (statuses) => {
            await console.log('CAMERA', statuses[PERMISSIONS.IOS.CAMERA]);
            // console.log('LOCATION_ALWAYS', statuses[PERMISSIONS.IOS.LOCATION_ALWAYS]);
            console.log('PHOTO_LIBRARY', statuses[PERMISSIONS.IOS.PHOTO_LIBRARY]);
        });
        await checkMultiple([PERMISSIONS.IOS.CAMERA, PERMISSIONS.IOS.LOCATION_WHEN_IN_USE, PERMISSIONS.IOS.PHOTO_LIBRARY]).then((statuses) => {
            switch (statuses[PERMISSIONS.IOS.CAMERA]) {
                case RESULTS.UNAVAILABLE:
                    Alert.alert('Camera is not available on this device.');
                    break;
                // case RESULTS.DENIED:
                //     Alert.alert('Camera permission has not been requested,', ' you have to set permissions manually in settings.');
                //     break;
                case RESULTS.LIMITED:
                    Alert.alert('Camera permission is limited:', ' some actions are possible.');
                    break;
                case RESULTS.GRANTED:
                    console.log('Camera permission is granted.');
                    break;
                // case RESULTS.BLOCKED:
                //     Alert.alert('Camera permission is denied', ' and not requestable anymore, you have to set permissions manually in settings.');
                //     break;
            };
            // switch (statuses[PERMISSIONS.IOS.LOCATION_ALWAYS]) {
            //     case RESULTS.UNAVAILABLE:
            //         Alert.alert('Location always is not available on this device.');
            //         break;
            //     case RESULTS.DENIED:
            //         Alert.alert('Location always permission has not been requested,', ' you have to set permissions manually in settings.');
            //         break;
            //     case RESULTS.LIMITED:
            //         Alert.alert('Location always permission is limited:', ' some actions are possible.');
            //         break;
            //     case RESULTS.GRANTED:
            //         console.log('Location always permission is granted.');
            //         break;
            //     case RESULTS.BLOCKED:
            //         Alert.alert('Location always permission is denied', ' and not requestable anymore, you have to set permissions manually in settings.');
            //         break;
            // };
            switch (statuses[PERMISSIONS.IOS.LOCATION_WHEN_IN_USE]) {
                case RESULTS.UNAVAILABLE:
                    Alert.alert('Location when in use is not available on this device.');
                    break;
                case RESULTS.DENIED:
                    Alert.alert('Location when in use permission has not been requested,', ' you have to set permissions manually in settings.');
                    break;
                case RESULTS.LIMITED:
                    Alert.alert('Location when in use permission is limited:', ' some actions are possible.');
                    break;
                case RESULTS.GRANTED:
                    console.log('Location when in use permission is granted.');
                    break;
                case RESULTS.BLOCKED:
                    Alert.alert('Location when in use permission is denied', ' and not requestable anymore, you have to set permissions manually in settings.');
                    break;
            };
            switch (statuses[PERMISSIONS.IOS.PHOTO_LIBRARY]) {
                case RESULTS.UNAVAILABLE:

                console.log('---------------------111-----------------');
                
                    Alert.alert('Photo library is not available on this device.');
                    break;
                // case RESULTS.DENIED:
                //     Alert.alert('Photo library permission has not been requested,', ' you have to set permissions manually in settings.');
                //     break;
                case RESULTS.LIMITED:
                    console.log('---------------------222-----------------');
                    Alert.alert('Photo library permission is limited:', ' some actions are possible.');
                    break;
                case RESULTS.GRANTED:
                    console.log('Photo library permission is granted.');
                    break;
                // case RESULTS.BLOCKED:
                //     Alert.alert('Photo library permission is denied', ' and not requestable anymore, you have to set permissions manually in settings.');
                //     break;
            };
        });
    } else {
        // await messaging().requestPermission();
        // await checkNotifications().then(({ status, settings }) => {
        //     console.log('>>>>>>>>>>>>>Notification>>>>>>>>>>>>', status, settings);
        //     if (status == "blocked") {
        //         Alert.alert("Notification permission is denied", " and not requestable anymore, you have to set permissions manually in settings.")
        //     }ß
        // });
        await requestMultiple([PERMISSIONS.ANDROID.CAMERA, PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION, PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION, PERMISSIONS.ANDROID.CALL_PHONE, PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE]).then(async (statuses) => {
             console.log('CAMERA', statuses[PERMISSIONS.ANDROID.CAMERA]);
            console.log('LOCATION_ALWAYS', statuses[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION]);
            console.log('PHOTO_LIBRARY', statuses[PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION]);
            console.log('PHOTO_LIBRARY', statuses[PERMISSIONS.ANDROID.CALL_PHONE]);
            console.log('PHOTO_LIBRARY', statuses[PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE]);
        });
        await checkMultiple([PERMISSIONS.ANDROID.CAMERA, PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION, PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION, PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE]).then((statuses) => {
            switch (statuses[PERMISSIONS.ANDROID.CAMERA]) {
                case RESULTS.UNAVAILABLE:
                    Alert.alert('Camera is not available on this device.');
                    break;
                // case RESULTS.DENIED:
                //     Alert.alert('Camera permission has not been requested,', ' you have to set permissions manually in settings.');
                //     break;
                case RESULTS.LIMITED:
                    Alert.alert('Camera permission is limited:', ' some actions are possible.');
                    break;
                case RESULTS.GRANTED:
                    console.log('Camera permission is granted.');
                    break;
                // case RESULTS.BLOCKED:
                //     Alert.alert('Camera permission is denied', 'and not requestable anymore, you have to set permissions manually in settings.');
                //     break;
            };
            // switch (statuses[PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION]) {
            //     case RESULTS.UNAVAILABLE:
            //         Alert.alert('Background location is not available on this device.');
            //         break;
            //     case RESULTS.DENIED:
            //         Alert.alert('Background location permission has not been requested,', ' you have to set permissions manually in settings.');
            //         break;
            //     case RESULTS.LIMITED:
            //         Alert.alert('Background location permission is limited:', ' some actions are possible.');
            //         break;
            //     case RESULTS.GRANTED:
            //         console.log('Background location permission is granted.');
            //         break;
            //     case RESULTS.BLOCKED:
            //         Alert.alert('Background location permission is denied', ' and not requestable anymore, you have to set permissions manually in settings.');
            //         break;
            // };
            switch (statuses[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION]) {
                case RESULTS.UNAVAILABLE:
                    Alert.alert('Location is not available on this device.');
                    break;
                case RESULTS.DENIED:
                    Alert.alert('Location permission has not been requested,', ' you have to set permissions manually in settings.');
                    break;
                case RESULTS.LIMITED:
                    Alert.alert('Location permission is limited:', ' some actions are possible.');
                    break;
                case RESULTS.GRANTED:
                    console.log('Location permission is granted.');
                    break;
                // case RESULTS.BLOCKED:
                //     Alert.alert('Location permission is denied', ' and not requestable anymore, you have to set permissions manually in settings.');
                //     break;
            };
            // switch (statuses[PERMISSIONS.ANDROID.CALL_PHONE]) {
            //     case RESULTS.UNAVAILABLE:
            //         Alert.alert('CALL_PHONE is not available on this device.');
            //         break;
            //     case RESULTS.DENIED:
            //         Alert.alert('CALL_PHONE permission has not been requested, you have to set permissions manually in settings.');
            //         break;
            //     case RESULTS.LIMITED:
            //         Alert.alert('CALL_PHONE permission is limited: some actions are possible.');
            //         break;
            //     case RESULTS.GRANTED:
            //         console.log('CALL_PHONE permission is granted.');
            //         break;
            //     case RESULTS.BLOCKED:
            //         Alert.alert('CALL_PHONE permission is denied and not requestable anymore, you have to set permissions manually in settings.');
            //         break;
            // };
            switch (statuses[PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE]) {
                case RESULTS.UNAVAILABLE:
                    Alert.alert('Access storage is not available on this device.');
                    break;
                // case RESULTS.DENIED:
                //     Alert.alert('Access storage permission has not been requested,', ' you have to set permissions manually in settings.');
                //     break;
                case RESULTS.LIMITED:
                    Alert.alert('Access storage permission is limited:', ' some actions are possible.');
                    break;
                case RESULTS.GRANTED:
                    console.log('Access storage permission is granted.');
                    break;
                // case RESULTS.BLOCKED:
                //     Alert.alert('Access storage permission is denied', ' and not requestable anymore, you have to set permissions manually in settings.');
                //     break;
            };
        });
    }

}
