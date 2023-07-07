import React from 'react'
import { StyleSheet, Text, TouchableOpacity, Dimensions, View, Button, Alert, TextInput, ScrollView } from 'react-native'
import ComponentsStyles from "../Constant/Components.styles";
import ActionButton from './ActionButton';
import InputText from './InputText';
let width = Dimensions.get("screen").width;
const height = Dimensions.get('screen').height;


type params = {

    approvebtn?: Function;
    cancelbtn?: Function;

}

const SubmitCancelModal = ({ approvebtn, cancelbtn }: params) => {

    return (

        <View>

            <ScrollView
                style={ComponentsStyles.CONTENTLOG}
                showsVerticalScrollIndicator={true}>

                <View style={styles.container}>

                    <Text style={styles.headertext}>Submit Request</Text>
                    <Text style={styles.textsub}>Are you sure you want to submit this request?</Text>

                    <ActionButton
                        onPress={approvebtn}
                        title="Submit"
                        styletouchable={{ width: '100%' }}
                    />

                    <View style={{ padding: 5 }} />

                    <ActionButton
                        onPress={cancelbtn}
                        title="Cancel"
                        style={{ backgroundColor: "red" }}
                        styletouchable={{ width: '100%' }}

                    />



                </View>

            </ScrollView>


        </View>



    );

}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: ComponentsStyles.COLORS.WHITE,
        alignItems: 'center',
        padding: 10,
        justifyContent: "center",
        height: height / 2.5,
    },
    text: {
        margin: 5,
        fontSize: 16,

    },
    headertext: {
        margin: 5,
        fontSize: 20,
        fontFamily: ComponentsStyles.FONT_FAMILY.BOLD,
        color: ComponentsStyles.COLORS.HEADER_BLACK,

    },
    textsub: {

        margin: 5,
        fontSize: 16,
        color: ComponentsStyles.COLORS.PROCEED_ASH,
        fontFamily: ComponentsStyles.FONT_FAMILY.REGULAR,
        padding: 20,
    },
})

export default SubmitCancelModal;