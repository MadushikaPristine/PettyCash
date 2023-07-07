import React from 'react'
import { StyleSheet, Text, TouchableOpacity, Dimensions, View, Button, Alert } from 'react-native'


const WIDTH = Dimensions.get('window').width;
const HEIGHT_MODAL = 150;

const SimpleModal = (props: { ChangeModalVisible: (arg0: boolean) => void; setData: (arg0: string) => void; }) => {

    // CloseModal = (bool, data) => {
    //     props.ChangeModalVisible(bool);
    //     props.setData(data);
    // }

    

    function CloseModal(bool: boolean, data: string): void {
        props.ChangeModalVisible(bool);
        props.setData(data);
    }

    const onSubmit = (bool: any, data: any) => {
        Alert.alert('Successfully submited');
        props.ChangeModalVisible(bool);
        props.setData(data);
    }

    return (
        <TouchableOpacity disabled={true} style={styles.container}>
            <View style={styles.modal}>
                <View style={styles.textView}>
                    <Text style={[styles.text, {fontSize: 20, color: 'black', fontWeight: 'bold'}]}>Submit Request</Text>
                    <Text style={styles.text}>Are you sure you want to submit this request</Text>
                </View>
                <View style={styles.buttonsView}>
                    <TouchableOpacity style={styles.touchableOpacity} >
                        <Button title='Cancel'
                        onPress={() => CloseModal(false, 'Cancel')}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.touchableOpacity} >
                    <Button title='Submit'
                        onPress={() => onSubmit(false, 'Submit')}
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
        width: WIDTH - 80,
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
    }
})

export default SimpleModal;

