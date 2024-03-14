//import import NetInfo from "@react-native-community/netinfo";
import NetInfo from "@react-native-community/netinfo";
import { Alert } from "react-native";


export const Conection_Checking =  (callBack: any) =>{
    try {    
        NetInfo.fetch().then(state => {
            {state.isInternetReachable? (
                console.log("Is Mobile connected????????????????????????????????????????", state.isConnected)

            ):
                // Alert.alert("Device is Not Connected to the InterNet. Please Check Your Connection..")

                console.log(" No Internet Connection");
                
            }
            console.log("Is Mobile connected????????????????????????????????????????",state.isConnected)
            return callBack(state.isInternetReachable);       
          });

    } catch (error) {
        console.log('Error : ',error)
    }
}