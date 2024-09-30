import React from "react";
import {
    View,
    Text,
    StyleSheet
} from "react-native";
import ComponentsStyles from "../Constant/Components.styles";

type ParamTypes = {
    reqNo: string;
    RequestBy?: string;
    empNo?: string;
    Rdate?: string;
}
const DetailsBox = ({ reqNo, RequestBy, empNo, Rdate}: ParamTypes) => {
    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row', }}>
                <Text style={styles.headerText}>Request ID : </Text>
                <Text style={styles.headerText}>{reqNo}</Text>
            </View>
            <View style={{ padding: 5 }} />
            <View style={{ flexDirection: 'row', }}>
                <Text style={styles.bodyTextLeft}>Request By</Text>
                <Text style={{}}> :  </Text>
                <Text style={styles.bodyTextRight}>{RequestBy}</Text>
            </View>
            <View style={{ flexDirection: 'row', }}>
                <Text style={styles.bodyTextLeft}>Employee No</Text>
                <Text style={{}}> :  </Text>
                <Text style={styles.bodyTextRight}>{empNo}</Text>
            </View>
            <View style={{ flexDirection: 'row', }}>
                <Text style={styles.bodyTextLeft}>Request Channel</Text>
                <Text style={{}}> :  </Text>
                <Text style={styles.bodyTextRight}>{"Mobile App"}</Text>
            </View>
            <View style={{ flexDirection: 'row', }}>
                <Text style={styles.bodyTextStatusRight}>Request Date</Text>
                <Text style={{}}> :  </Text>
                <Text style={styles.bodyTextRightStatus}>{Rdate}</Text>
            </View>
        </View>
    );
}
export default DetailsBox;


const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        width: '100%',
        shadowColor: "#000",
        padding: 7,
        flexDirection: 'column',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    headerText: {
        color: ComponentsStyles.COLORS.SERVISE_HEADER_ASH,
        fontFamily: ComponentsStyles.FONT_FAMILY.BOLD,
        fontSize: 16,
      
    },
    bodyTextLeft: {
        color: ComponentsStyles.COLORS.SERVISE_HEADER_ASH,
        fontFamily: ComponentsStyles.FONT_FAMILY.REGULAR,
        fontSize: 14,
        flex: 1,
        marginBottom: 5,
    },

   
    bodyTextRight: {
        color: ComponentsStyles.COLORS.SERVISE_HEADER_ASH,
        fontFamily: ComponentsStyles.FONT_FAMILY.SEMI_BOLD,
        fontSize: 14,
        flex: 2
    },



    bodyTextStatusRight: {
        color: ComponentsStyles.COLORS.BLACK,
        fontFamily: ComponentsStyles.FONT_FAMILY.REGULAR,
        fontSize: 14,
        flex: 1,
        marginBottom: 10,
    },


    
    bodyTextRightStatus: {
        color: ComponentsStyles.COLORS.SERVISE_HEADER_ASH,
        fontFamily: ComponentsStyles.FONT_FAMILY.BOLD,
        fontSize: 14,
        flex: 2,
        marginBottom: 10,
    },
    btnStyle: {
        //    position: 'absolute',
        width: '100%',
        alignSelf: 'center',
        marginTop: 5,
        marginBottom: 5,
    }
});