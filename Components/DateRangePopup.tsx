import moment from 'moment';
import React, { useState } from 'react';
import {
    Button,
    Dimensions,
    GestureResponderEvent,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/FontAwesome';
import DateRangePicker from 'rn-select-date-range';
import ComponentsStyles from '../Constant/Components.styles';
const deviceHeight = Dimensions.get('window').height;

type ParamTypes = {
    filter?: any;
}

const DateRangePopup = ({filter}:ParamTypes) => {
    const [visible, setVisible] = useState(false);
    const [selectedRange, setRange] = useState({});

    // const getDatesFromRange = (range:any) => {

    //     console.log(range.firstDate , " dates -----------", range.secondDate);
        

    // }
    
 

    return (
        <View style={{  }}>

            <Icon name={"calendar"} size={20} onPress={() => setVisible(true)} style={{ color: ComponentsStyles.COLORS.ICON_BLUE }} />
            <View style={styles.container}>
                <Modal isVisible={visible} style={styles.contentView} backdropOpacity={0.3} >
                    <View style={styles.modalMainContainer}>
                        <SafeAreaView>
                            <View style={styles.containerf}>
                                <DateRangePicker
                                    onSelectDateRange={(range) => {
                                        setRange(range);
                                        filter(range);
                                        //console.log(filter(range));
                                    }}
                                    blockSingleDateSelection={true}
                                    responseFormat="YYYY-MM-DD"
                                    // maxDate={moment()}
                                    // minDate={moment().subtract(100, "days")}
                                    selectedDateContainerStyle={styles.selectedDateContainerStyle}
                                    selectedDateStyle={styles.selectedDateStyle}
                                    onConfirm = {() => {
                                        setVisible(false)
                                    }}
                                />
                                <View style={styles.container}>
                                    <Text>first date: {selectedRange.firstDate}</Text>
                                    <Text>second date: {selectedRange.secondDate}</Text>
                                </View>
                            </View>
                        </SafeAreaView>

                    </View>
                </Modal>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {

      margin: 20,
      
    },
    containerf:{
        margin: 30
    },
    selectedDateContainerStyle: {
      height: 35,
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "blue",
    },
    selectedDateStyle: {
      fontWeight: "bold",
      color: "white",
    },

    headerContainer: {
        justifyContent: 'center'
    },
    

    contentView: {
        width:'100%',
        justifyContent: 'flex-end',
        margin: 0,
        height: '100%',
    },

    modalMainContainer: {
        
        justifyContent: "center",
        alignItems: "center",
        padding: 5,
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

  export default DateRangePopup;