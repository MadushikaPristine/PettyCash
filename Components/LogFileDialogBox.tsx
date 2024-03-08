import { useState } from "react";
import { Dimensions, FlatList, Text, TouchableOpacity, View } from "react-native";
import { Dialog } from "react-native-paper";
import ActionButton from "./ActionButton";
import ComponentsStyles from "../Constant/Components.styles";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React from "react";
import moment from "moment";
import RNFS from 'react-native-fs';
import AsyncStorage from "@react-native-async-storage/async-storage";
import AsyncStorageConstants from "../Constant/AsyncStorageConstants";
import IconA from 'react-native-vector-icons/Ionicons';
import Share from 'react-native-share';

let width = Dimensions.get("screen").width;
const LogFileDialogBox = () => {

    const navigation = useNavigation();
    const [isDialog, setisDialog] = useState(false);
    const [fileList, setFileList] = useState([]);

    const closeDialog = async () => {

        await AsyncStorage.setItem(AsyncStorageConstants.VIEW_LOG_FILE_BOX, "false");

        setisDialog(false);
    }

    const ShareLog = () => {
        console.log("share log");

        var date = new Date();

        const fileArray: any[] = [];

        let j = 0;

        for (let i = 0; i <= 7; i++) {

            date.setDate(date.getDate() - i);

            console.log(moment(date).utcOffset('+05:30').format('YYYY-MM-DD'));

            const current_date = moment(date).utcOffset('+05:30').format('YYYY-MM-DD') + "_log";

            const logFilePath = `${RNFS.DocumentDirectoryPath}/${current_date}.txt`;

            RNFS.exists(logFilePath)
                .then(async (exists) => {
                    if (exists) {

                        j = j + 1;
                        fileArray.push(
                            {
                                "Id": j,
                                "path": logFilePath,
                                "fileName": current_date + ".txt"
                            }
                        );
                        // console.log('File exists -----  ----  ' , logFilePath);
                    } else {

                        // console.log('File not exists -----------  ' , logFilePath);

                    }

                    if (i == 7) {

                        viewLogFileList(fileArray);

                    }

                })
                .catch((error) => {
                    console.log(error);
                });


        }


    }

    const viewLogFileList = (list: any) => {

        setFileList(list);

        console.log(" log file list [][][][]  ", list);

        setisDialog(true);

    }

    const ShareFile = async (path: any, fileName: any) => {
        console.log("file path ====  ", path);

        let filePath = 'file:///' + path;

        Share.open({
            url: filePath,
            title: fileName,
            message: 'Pettycash log file',
        })


    }


    useFocusEffect(
        React.useCallback(() => {
            console.log(" log file ======================  ");

            ShareLog();

        }, [])
    );

    return (

        <Dialog
            visible={isDialog}
            onDismiss={() => closeDialog()}
        >

            <Dialog.Title style={{ color: ComponentsStyles.COLORS.BLACK, fontFamily: ComponentsStyles.FONT_FAMILY.SEMI_BOLD }}>Share Log Files</Dialog.Title>

            <Dialog.Content style={{ alignContent: "center", alignItems: "center" }}>



                <FlatList
                    //nestedScrollEnabled={true}
                    data={fileList}

                    //horizontal={false}
                    renderItem={({ item }) => {
                        return (
                            <View style={{ width: width - 50, padding: 3 }}>

                                <View style={{
                                    padding: 3,
                                    backgroundColor: "#fff",
                                    borderRadius: 5,
                                    marginVertical: 5,
                                    marginHorizontal: 6,
                                    flexDirection: "row",
                                    justifyContent: "space-between"

                                }}>

                                    <Text style={{ color: ComponentsStyles.COLORS.BLACK, fontSize: 18, }}>{item.fileName}</Text>

                                    <TouchableOpacity onPress={() => ShareFile(item.path, item.fileName)}>
                                        <IconA name="share-social" size={22} color={ComponentsStyles.COLORS.ICON_BLUE} style={{ marginRight: 45 }} />

                                    </TouchableOpacity>
                                </View>

                            </View>
                        )
                    }

                    }
                    keyExtractor={item => `${item.Id}`}
                />

                <View style={{ padding: 10 }} />

                <ActionButton
                    title="Close"
                    onPress={() => closeDialog()}
                    style={{ backgroundColor: ComponentsStyles.COLORS.RED_COLOR }}
                />
                <View style={{ padding: 5 }} />

            </Dialog.Content>

        </Dialog >


    );

}
export default LogFileDialogBox;

