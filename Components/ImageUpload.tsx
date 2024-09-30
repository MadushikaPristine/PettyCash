
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, Dimensions, View, Button, Alert, TextInput } from 'react-native'
import ComponentsStyles from "../Constant/Components.styles";
import ActionButton from './ActionButton';
import InputText from './InputText';
let width = Dimensions.get("screen").width;
const height = Dimensions.get('screen').height;


type params = {

    camerabtn?: Function;
    gallerybtn?: Function;
    cancelbtn?: Function;
    cbtn?: Function;
    closeModal?: Function;
    placeholder?: string;
    headertxt?: string;
    subtxt?: string;
    approverejecttxt?: string;
    isvisible?: boolean;
}

const ImageUpload = ({ isvisible,camerabtn, gallerybtn, cancelbtn,placeholder,headertxt,subtxt,approverejecttxt, cbtn,closeModal }: params) => {

    return (

        <View style={styles.container}>
            <TouchableOpacity style={styles.dashStyle} onPress={closeModal} />
            <Text style={styles.headertext}>{headertxt}</Text>
            <Text style={styles.textsub}>{subtxt}</Text>
            <ActionButton
                onPress={camerabtn}
                title='Take a photo'
                styletouchable={{ width: '100%' }}
            />
            <View style={{ padding: 5 }} />
            {isvisible ? 
            <View>
            <ActionButton
            onPress={gallerybtn}
            title="Open Gallery"
            styletouchable={{ width: '100%' }}
        />
        <View style={{ padding: 5 }} />
        </View>  
        :
        <></>
        }
            <ActionButton
                onPress={cancelbtn}
                title="cancel"
                style={{ backgroundColor: "gray" }}
                styletouchable={{ width: '100%' }}
            />
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
        color: ComponentsStyles.COLORS.SUB_COLOR,
        fontFamily: ComponentsStyles.FONT_FAMILY.REGULAR,
    },

    dashStyle: {
        width: 50,
        height: 5,
        backgroundColor: ComponentsStyles.COLORS.DASH_COLOR,
        borderRadius: 20,
        marginTop: 5,
        marginBottom:10,
      },
})

export default ImageUpload;



// import React, {Fragment, Component} from 'react';
// import ImagePicker from 'react-native-image-picker';
// import {
//   SafeAreaView,
//   StyleSheet,
//   ScrollView,
//   View,
//   Text,
//   StatusBar,
//   Image,
//   Button,
//   Dimensions,
//   TouchableOpacity
// } from 'react-native';

// import {
//     Header,
//     LearnMoreLinks,
//     Colors,
//     DebugInstructions,
//     ReloadInstructions,
//   } from 'react-native/Libraries/NewAppScreen';

//   const options = {
//     title: 'Select Avatar',
//     customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
//     storageOptions: {
//       skipBackup: true,
//       path: 'images',
//     },
//   };

//   export default class ImageUpload extends Component {
//     constructor(props) {
//       super(props)
//       this.state = {
//         filepath: {
//           data: '',
//           uri: ''
//         },
//         fileData: '',
//         fileUri: ''
//       }
//     }
  
//     chooseImage = () => {
//       let options = {
//         title: 'Select Image',
//         customButtons: [
//           { name: 'customOptionKey', title: 'Choose Photo from Custom Option' },
//         ],
//         storageOptions: {
//           skipBackup: true,
//           path: 'images',
//         },
//       };
//       ImagePicker.showImagePicker(options, (response) => {
//         console.log('Response = ', response);
  
//         if (response.didCancel) {
//           console.log('User cancelled image picker');
//         } else if (response.error) {
//           console.log('ImagePicker Error: ', response.error);
//         } else if (response.customButton) {
//           console.log('User tapped custom button: ', response.customButton);
//           alert(response.customButton);
//         } else {
//           const source = { uri: response.uri };
  
//           // You can also display the image using data:
//           // const source = { uri: 'data:image/jpeg;base64,' + response.data };
//           // alert(JSON.stringify(response));s
//           console.log('response', JSON.stringify(response));
//           this.setState({
//             filePath: response,
//             fileData: response.data,
//             fileUri: response.uri
//           });
//         }
//       });
//     }
  
//     launchCamera = () => {
//       let options = {
//         storageOptions: {
//           skipBackup: true,
//           path: 'images',
//         },
//       };
//       ImagePicker.launchCamera(options, (response) => {
//         console.log('Response = ', response);
  
//         if (response.didCancel) {
//           console.log('User cancelled image picker');
//         } else if (response.error) {
//           console.log('ImagePicker Error: ', response.error);
//         } else if (response.customButton) {
//           console.log('User tapped custom button: ', response.customButton);
//           alert(response.customButton);
//         } else {
//           const source = { uri: response.uri };
//           console.log('response', JSON.stringify(response));
//           this.setState({
//             filePath: response,
//             fileData: response.data,
//             fileUri: response.uri
//           });
//         }
//       });
  
//     }
//     launchImageLibrary = () => {
//         let options = {
//           storageOptions: {
//             skipBackup: true,
//             path: 'images',
//           },
//         };
//         ImagePicker.launchImageLibrary(options, (response) => {
//           console.log('Response = ', response);
    
//           if (response.didCancel) {
//             console.log('User cancelled image picker');
//           } else if (response.error) {
//             console.log('ImagePicker Error: ', response.error);
//           } else if (response.customButton) {
//             console.log('User tapped custom button: ', response.customButton);
//             alert(response.customButton);
//           } else {
//             const source = { uri: response.uri };
//             console.log('response', JSON.stringify(response));
//             this.setState({
//               filePath: response,
//               fileData: response.data,
//               fileUri: response.uri
//             });
//           }
//         });
    
//       }
    
//       renderFileData() {
//         if (this.state.fileData) {
//           return <Image source={{ uri: 'data:image/jpeg;base64,' + this.state.fileData }}
//             style={styles.images}
//           />
//         } else {
//           return <Image source={require('')}
//             style={styles.images}
//           />
//         }
//       }
    
//       renderFileUri() {
//         if (this.state.fileUri) {
//           return <Image
//             source={{ uri: this.state.fileUri }}
//             style={styles.images}
//           />
//         } else {
//           return <Image
//             source={require('')}
//             style={styles.images}
//           />
//         }
//       }
//       render() {
//         return (
//           <Fragment>
//             <StatusBar barStyle="dark-content" />
//             <SafeAreaView>
//               <View style={styles.body}>
//                 <Text style={{textAlign:'center',fontSize:20,paddingBottom:10}} >Pick Images from Camera & Gallery</Text>
//                 <View style={styles.ImageSections}>
//                   <View>
//                     {this.renderFileData()}
//                     <Text  style={{textAlign:'center'}}>Base 64 String</Text>
//                   </View>
//                   <View>
//                     {this.renderFileUri()}
//                     <Text style={{textAlign:'center'}}>File Uri</Text>
//                   </View>
//                 </View>
    
//                 <View style={styles.btnParentSection}>
//                   <TouchableOpacity onPress={this.chooseImage} style={styles.btnSection}  >
//                     <Text style={styles.btnText}>Choose File</Text>
//                   </TouchableOpacity>
    
//                   <TouchableOpacity onPress={this.launchCamera} style={styles.btnSection}  >
//                     <Text style={styles.btnText}>Directly Launch Camera</Text>
//                   </TouchableOpacity>
    
//                   <TouchableOpacity onPress={this.launchImageLibrary} style={styles.btnSection}  >
//                     <Text style={styles.btnText}>Directly Launch Image Library</Text>
//                   </TouchableOpacity>
//                 </View>
    
//               </View>
//             </SafeAreaView>
//           </Fragment>
//         );
//       }
//     };
    
//     const styles = StyleSheet.create({
//         scrollView: {
//           backgroundColor: Colors.lighter,
//         },
      
//         body: {
//           backgroundColor: Colors.white,
//           justifyContent: 'center',
//           borderColor: 'black',
//           borderWidth: 1,
//           height: Dimensions.get('screen').height - 20,
//           width: Dimensions.get('screen').width
//         },
//         ImageSections: {
//           display: 'flex',
//           flexDirection: 'row',
//           paddingHorizontal: 8,
//           paddingVertical: 8,
//           justifyContent: 'center'
//         },
//         images: {
//           width: 150,
//           height: 150,
//           borderColor: 'black',
//           borderWidth: 1,
//           marginHorizontal: 3
//         },
//         btnParentSection: {
//           alignItems: 'center',
//           marginTop:10
//         },
//         btnSection: {
//           width: 225,
//           height: 50,
//           backgroundColor: '#DCDCDC',
//           alignItems: 'center',
//           justifyContent: 'center',
//           borderRadius: 3,
//           marginBottom:10
//         },
//         btnText: {
//           textAlign: 'center',
//           color: 'gray',
//           fontSize: 14,
//           fontWeight:'bold'
//         }
//       });