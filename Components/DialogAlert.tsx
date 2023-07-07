import React, { useState } from "react";
import { Button, Dialog, Paragraph, Portal } from "react-native-paper";
import { View } from "react-native";

const DialogAlert = () => {
  const [visible, setVisible] = useState(false);

  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  return (
    <View>
      <Button onPress={showDialog}>Open Dialog</Button>

      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>Dialog Title</Dialog.Title>
          <Dialog.Content>
            <Paragraph>This is a simple dialog example.</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Close</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

export default DialogAlert;
