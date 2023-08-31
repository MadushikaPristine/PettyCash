import React from "react";
import {
    View,
    Text,
    StyleSheet
} from "react-native";
import { TextInput } from "react-native";
import comStyles from '../Constant/Components.styles';
import IconA from 'react-native-vector-icons/AntDesign';
import ComponentsStyles from "../Constant/Components.styles";

type CustomPropTypes = {
    placeholder?: string;
    editable?: boolean;
    is_name?: boolean;
    name?: string;
    is_ex?: boolean;
    ex?: string;
    style?: any;
    bdrStyle?: any;
    textstyle?: any;
    secureTextEntry?: boolean;
    placeholderColor?: string;
    setState?: Function;
    stateValue?: any;
    keyType?: "default" | "email-address" | "numeric" | "phone-pad" | "number-pad" | "decimal-pad" | "visible-password" | "ascii-capable" | "numbers-and-punctuation" | "url" | "name-phone-pad" | "twitter" | "web-search" | undefined;
    multiline?: boolean;
    numberOfLines?: number;
    max?: number;
    onBlur?: Function;
    onFocus?: Function;
    is_icon?: boolean;
    onpress?: any;
    icon_name?: string;
    icon_name1?: string;
    is_clr_icon?: boolean;
    iconClr?: any;
    is_back_icon?: boolean;
    back_icon_name?: string;
    backiconClr?: any;
    backicononpress?: Function;
    imgStyle?: any;
    borderStyle?: any;
}
const InputText = ({ borderStyle,bdrStyle, imgStyle, is_back_icon, back_icon_name, backiconClr, placeholder, is_clr_icon, editable, style, secureTextEntry, placeholderColor, setState, stateValue, keyType, multiline, numberOfLines, max, onBlur, onFocus, is_icon, icon_name, onpress, icon_name1, iconClr, backicononpress }: CustomPropTypes) => {
    var customBackground = { backgroundColor: 'transparent' };
    if (editable != undefined && editable == false)
        customBackground = { backgroundColor: 'gray' };
    else {
        customBackground = { backgroundColor: 'transparent' }
    }
    return (
        <View style={[styles.container,borderStyle]} >
            {is_icon ?
                <View style={styles.imageStyle}>
                    <IconA name={icon_name}
                        size={27}
                        onPress={onpress}
                        color={comStyles.COLORS.ICON_BLUE} />
                </View>
                : <></>
            }

            {is_clr_icon ?
                <View style={[styles.imageStyle, imgStyle]}>
                    <IconA name={icon_name1}
                        size={18}
                        color={iconClr} />
                </View>
                : <></>
            }

            <View style={[styles.borderStyle, bdrStyle]}>
                <TextInput style={[styles.inputTextStyle, customBackground, style]}
                    secureTextEntry={secureTextEntry}
                    placeholder={placeholder}
                    placeholderTextColor={placeholderColor}
                    onChangeText={(text: any) => {
                        if (setState) setState(text);
                    }}
                    value={stateValue}
                    keyboardType={keyType}
                    editable={editable}
                    multiline={multiline}
                    numberOfLines={numberOfLines}
                    maxLength={max}
                    onBlur={() => {
                        if (onBlur) onBlur();
                    }}
                    onFocus={() => {
                        if (onFocus) onFocus();
                    }}
                >
                </TextInput>

                {is_back_icon ?
                    <View style={{ position: "absolute", alignSelf: 'flex-end', alignItems: "center", padding: 20, justifyContent: "center" }}>
                        <IconA name={back_icon_name}
                            size={20}
                            onPress={backicononpress}
                            color={backiconClr} />
                    </View>
                    : <></>
                }


            </View>

        </View>
    );
}
export default InputText;
const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: "row",
        marginBottom: 10,
        justifyContent: "center",
        alignItems: "center"
    },
    imageStyle: {
        position: 'absolute',
        left: 60,
        alignSelf: 'center',
        alignItems: "center"
    },
    inputTextStyle: {
        color: ComponentsStyles.COLORS.ICON_BLUE,
        fontSize: 15,
        height: 45,
        borderColor: ComponentsStyles.COLORS.ICON_BLUE,
        borderWidth: 1,
        paddingLeft: 100,
        borderRadius: 6,
        fontFamily: comStyles.FONT_FAMILY.SEMI_BOLD,
        padding: 0,
    },
    borderStyle: {
        paddingTop: 7,
        paddingBottom: 7,
        flex: 2,
        height: 60,

    }
});