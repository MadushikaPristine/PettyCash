import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    SafeAreaView,
    Alert,
    Animated,
    Easing
} from "react-native";
import ComponentsStyles from "../Constant/Components.styles";

type ParamTypes = {
    title: string;
    Value: string;
    titleStyle:any;
    valustyle:any;
    
}

const ViewField = ({title,Value,titleStyle,valustyle}:ParamTypes) => {

    return (

        <View style={styles.container}>

            <Text style={[ComponentsStyles.blackSemiBold, titleStyle]}>{title}</Text>
            <View style={{ flex: 1 }} />
            <Text style={[ComponentsStyles.blackSemiBold , valustyle]}>{Value}</Text>

        </View>


    );

}
export default ViewField;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 40,
        backgroundColor: ComponentsStyles.COLORS.WHITE,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        justifyContent: "center",
        elevation: 5,
        marginTop:10,
    
    },

    textStyle: {
        fontFamily: ComponentsStyles.FONT_FAMILY.BOLD,
        color: 'black',
        fontSize: 18,
        alignSelf: 'center'

    },



});