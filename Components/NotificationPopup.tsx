import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
    Button,
  Dimensions,
  GestureResponderEvent,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/FontAwesome';
import ComponentsStyles from '../Constant/Components.styles';
const deviceHeight = Dimensions.get('window').height;

const NotificationPopup = () => {
    const [visible, setVisible] = useState(false);

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      
      <Icon name={"caret-down"} size={20} onPress={() => setVisible(true)} style={{color: ComponentsStyles.COLORS.ICON_BLUE}}/>
      <View style={styles.container}>
      <Modal isVisible={visible} style={styles.contentView} backdropOpacity={0.3} >
        <View style={styles.modalMainContainer}>
            <View style={{alignItems: 'flex-end', justifyContent: 'center' }}>
            <Text style={{fontSize: 12, fontFamily: ComponentsStyles.FONT_FAMILY.REGULAR, }}>IOU Request #1234567 has been approved by the finance and total payable has been updated</Text>
            <Button title="Close" onPress={() => setVisible(false)} />
            </View>
          
        </View>
      </Modal>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({

    headerContainer: {
        justifyContent: 'center'
    },
    container: {
        width: 100,
    },

    contentView: {
        justifyContent: 'flex-end',
        margin: 0,
        height: '100%',
    },

    modalMainContainer: {
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
        backgroundColor: 'white',
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        width: '100%',
       
    },


    ActionButton: {
        marginTop: 10,
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center",
    },

    
    modalCont: {
        flex: 1,
        flexGrow: 1,
        paddingHorizontal: 10,

    },
});

export default NotificationPopup



