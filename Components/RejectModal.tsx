import React from 'react'
import { StyleSheet, Text, TouchableOpacity, Dimensions, View, Button, Alert } from 'react-native'
import { TextInput } from 'react-native-paper';


const WIDTH = Dimensions.get('window').width;
const HEIGHT_MODAL = 250;

const RejectModal = (props: { ChangeRejectModalVisible: (arg0: boolean) => void; setRejectData: (arg0: string) => void; }) => {

    // CloseModal = (bool, data) => {
    //     props.ChangeModalVisible(bool);
    //     props.setData(data);
    // }

    

    function CloseModal(bool: boolean, data: string): void {
        props.ChangeRejectModalVisible(bool);
        props.setRejectData(data);
    }

    const onSubmit = (bool: boolean, data: string) => {
        Alert.alert('Rejected');
        props.ChangeRejectModalVisible(bool);
        props.setRejectData(data);
    }

    return (
        <TouchableOpacity disabled={true} style={styles.container}>
            <View style={styles.modal}>
                <View style={styles.textView}>
                    <Text style={[styles.text, {fontSize: 20, color: 'black', fontWeight: 'bold'}]}>Add Reject Remark</Text>
                    <Text style={styles.text}>Do you want to add a remark and reject?</Text>
                    <View>
                        <TextInput placeholder={"Add reject remark here(Optional)"} style={styles.inputContainer} multiline={true} numberOfLines={10}/> 
                    </View>
                </View>
                
                <View style={styles.buttonsView}>
                    <TouchableOpacity style={styles.touchableOpacity} >
                        <Button title='No'
                        onPress={() => CloseModal(false, 'No')}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.touchableOpacity} >
                    <Button title='Reject'
                        onPress={() => onSubmit(false, 'Reject')}
                        
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modal: {
        height: HEIGHT_MODAL,
        width: WIDTH - 70,
        paddingTop: 10,
        backgroundColor: 'white',
        borderRadius: 10
    },
    textView: {
        flex: 1,
        alignItems: 'center'
    },
    text: {
        margin: 5,
        fontSize: 16,
        
    },
    buttonsView: {
        width: '100%',
        flexDirection: 'row',
    },
    touchableOpacity: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center'
    },
    inputContainer: {
        justifyContent: 'space-between',
        alignItems: 'center',
        textAlignVertical: 'top',
        width: 300,
        height: 100,   
        padding: 8,
        backgroundColor: "#f4f4f4",
        borderRadius: 5,
        
      },
})

export default RejectModal;