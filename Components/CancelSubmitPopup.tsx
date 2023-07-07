import React, {useState} from "react";
import { StyleSheet, View, Text, Modal, TouchableOpacity, SafeAreaView, Button } from "react-native";

import SimpleModal from "./SimpleModal";

const cancelSubmitPopup = () => {
    const [isModalVisible, setisModalVisible] = useState(false);
    const [chooseData, setchooseData] = useState();

    const ChangeModalVisible = (bool: any) => {
        setisModalVisible(bool)
    }

    const setData = (data: any) => {
        setchooseData(data);
    }
    return(
        <View >
            
            <TouchableOpacity>
                <Button title="Submit Request" onPress={() => ChangeModalVisible(true)} />
            </TouchableOpacity>
            <Modal
                transparent={true}
                animationType='fade'
                visible={isModalVisible}
                onRequestClose={()=> ChangeModalVisible(false)}
                >
                    <SimpleModal 
                        ChangeModalVisible={ChangeModalVisible}
                        setData={setData}
                    />
            </Modal>
        </View>
    )
}

export default cancelSubmitPopup;

const styles = StyleSheet.create({
    
    text: {
        marginVertical: 20,
        fontSize: 20,
        fontWeight: 'bold',
        
    }

})