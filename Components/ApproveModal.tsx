import React from 'react'
import { StyleSheet, Text, TouchableOpacity, Dimensions, View, Button, Alert } from 'react-native'
import { TextInput } from 'react-native-paper';
import ActionButton from './ActionButton';
import ComStyles from "../Constant/Components.styles";


const WIDTH = Dimensions.get('window').width;
const HEIGHT_MODAL = 250;

type params = {

    approvebtn?: Function;
    cancelbtn?: Function;
}

const ApproveModal = ({ approvebtn, cancelbtn }: params) => {

    // CloseModal = (bool, data) => {
    //     props.ChangeModalVisible(bool);
    //     props.setData(data);
    // }


    return (
            <View style={styles.modal}>
                <View style={styles.textView}>
                    <Text style={styles.headertext}>Add Approval Remark</Text>
                    <Text style={styles.text}>Do you want to add a remark and approve?</Text>
                    <View>
                        <TextInput
                            placeholder={"Add approval remark here(Optional)"}
                            style={styles.inputContainer}
                            multiline={true}
                            numberOfLines={10} />
                    </View>
                </View>

                {/* <View style={styles.buttonsView}>
                    <TouchableOpacity style={styles.touchableOpacity} >

                        <ActionButton
                        title=''/>
                        <Button title='No'
                        onPress={() => CloseModal(false, 'No')}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.touchableOpacity} >
                    <Button title='Approve'
                        onPress={() => onSubmit(false, 'Approved')}
                        />
                    </TouchableOpacity>
                </View> */}

                <View style={{ flexDirection: "row" }}>
                    <ActionButton
                        onPress={approvebtn}
                        title="Approve"
                        styletouchable={{ width: '49%' }}
                        style={{ flexDirection: 'row', justifyContent: "center" }}
                    />

                    <ActionButton
                        onPress={cancelbtn}
                        title="No"
                        styletouchable={{ width: '49%', marginLeft: 5 }}
                        style={{ flexDirection: 'row', justifyContent: "center", backgroundColor: "white" }}
                    />

                </View>
            </View>
      
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modal: {
        paddingTop: 10,
        backgroundColor: 'white',
        borderRadius: 10
    },
    textView: {
        flex: 1,
        alignItems: 'center'
    },
    headertext: {
        margin: 5,
        fontSize: 16,
        fontFamily: ComStyles.FONT_FAMILY.BOLD,
        color: ComStyles.COLORS.HEADER_BLACK,
    },
    text: {

        margin: 5,
        fontSize: 16,
        color: ComStyles.COLORS.PROCEED_ASH,
        fontFamily: ComStyles.FONT_FAMILY.REGULAR,

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

export default ApproveModal;