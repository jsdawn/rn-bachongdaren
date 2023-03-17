import {StyleSheet, Text, View, Button} from 'react-native';
import React, {useEffect} from 'react';
import RNCallKeep from 'react-native-callkeep';

const My = () => {
  useEffect(() => {
    // RNCallKeep.setup({
    //   ios: {
    //     appName: 'My App Name',
    //   },
    //   android: {
    //     alertTitle: 'Permissions required',
    //     alertDescription:
    //       'This application needs to access your phone accounts',
    //     cancelButton: 'Cancel',
    //     okButton: 'ok',
    //   },
    // });
    // RNCallKeep.addEventListener('didReceiveStartCallAction', data => {
    //   console.log('didReceiveStartCallAction');
    //   // Automatically answer incoming calls
    //   // RNCallKeep.answerIncomingCall(data.callUUID);
    // });
    // RNCallKeep.addEventListener('answerCall', ({callUUID}) => {
    //   // Handle answer call action here
    //   console.log('answerCall');
    // });
    // RNCallKeep.addEventListener('endCall', ({callUUID}) => {
    //   // Handle end call action here
    //   console.log('endCall');
    // });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>旅行者，你将去往何方～</Text>
      <Button
        title="提示语"
        onPress={() => {
          // ToastModule.show('hhhhh', ToastModule.LONG);
        }}
      />
    </View>
  );
};

export default My;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
  },
});
