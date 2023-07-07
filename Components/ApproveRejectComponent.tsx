import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, Dimensions, View, Button, Alert, TextInput, ScrollView } from 'react-native'
//import { ScrollView } from 'react-native-gesture-handler';
import ComponentsStyles from "../Constant/Components.styles";
import { saveApproveRemark } from '../SQLiteDBAction/Controllers/IOUController';
import ActionButton from './ActionButton';
import InputText from './InputText';
import { useFocusEffect } from '@react-navigation/native';
let width = Dimensions.get("screen").width;
const height = Dimensions.get('screen').height;


type params = {

    approvebtn?: any;
    cancelbtn?: any;
    placeholder?: string;
    headertxt?: string;
    subtxt?: string;
    approverejecttxt?: string;
    reamrkState?: any;
    approved_status?: Function;
    remark?: any;
    selectedItems?: any;
    txtremark?: string;
}

const ApproveRejectModal = ({txtremark,reamrkState, approvebtn, cancelbtn, placeholder, headertxt, subtxt, approverejecttxt, approved_status }: params) => {
    const [remark, setRemark] = useState('')


    // const updateRemark = () => {
    //     const remark = remark
    //     saveApproveRemark(remark, (response: any) => {
    //         setRemark(remark)
    //     })
    // }

    useFocusEffect(
        React.useCallback(() => {
            setRemark('');
        },[])
    );

    return (

        <View>

            <ScrollView
                style={ComponentsStyles.CONTENTLOG}
                showsVerticalScrollIndicator={true}
                keyboardShouldPersistTaps='always'>


                <View style={styles.container}>

                    {/* <ScrollView 
                showsVerticalScrollIndicator={true}> */}


                    <Text style={styles.headertext}>{headertxt}</Text>
                    <Text style={styles.textsub}>{subtxt}</Text>


                    <InputText
                        borderStyle={{ height: 100 }}
                        placeholder={placeholder}
                        stateValue={txtremark}
                        editable={true}
                        setState={reamrkState}
                        // setState={(val: any) => setRemark(val)}
                        style={ComponentsStyles.IOUInput}
                        multiline={true}
                        numberOfLines={15}
                        placeholderColor={ComponentsStyles.COLORS.DASH_COLOR}
                    />

                    {/* <View>
                <TextInput
                    placeholder={"Add approval remark here(Optional)"}
                    style={styles.inputContainer}
                    multiline={true}
                    numberOfLines={10} />
            </View> */}


                    <ActionButton
                        onPress={() => approvebtn(remark)}
                        title={approverejecttxt}
                        styletouchable={{ width: '100%' }}
                    />

                    <View style={{ padding: 5 }} />

                    <ActionButton
                        onPress={cancelbtn}
                        title="No"
                        style={{ backgroundColor: "red" }}
                        styletouchable={{ width: '100%' }}

                    />




                    {/* </ScrollView> */}


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
        justifyContent: "center"
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

    },
})

export default ApproveRejectModal;