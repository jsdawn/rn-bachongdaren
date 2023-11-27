import {
  Button,
  StyleSheet,
  NativeModules,
  View,
  Text,
  PermissionsAndroid,
  NativeEventEmitter,
} from 'react-native';
import React, {useState, useEffect} from 'react';

const {AutoAnswerModule} = NativeModules;

const PhoneState = () => {
  const [pmisMsg, setPmisMsg] = useState('请检查并获取权限');
  const [autoMsg, setAutoMsg] = useState('未开启自动接听');

  const requestPermissions = async () => {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
      PermissionsAndroid.PERMISSIONS.CALL_PHONE,
      PermissionsAndroid.PERMISSIONS.ANSWER_PHONE_CALLS,
      PermissionsAndroid.PERMISSIONS.READ_CALL_LOG,
      PermissionsAndroid.PERMISSIONS.WRITE_CALL_LOG,
    ]);
    console.log(granted);
    setPmisMsg('Permissions granted');
    for (const key in granted) {
      if (Object.hasOwnProperty.call(granted, key)) {
        const val = granted[key];
        if (val != PermissionsAndroid.RESULTS.GRANTED) {
          console.log(key + ' 权限获取失败');
          setPmisMsg('Permissions denied');
        }
      }
    }
  };

  const checkPermissions = async () => {
    const granted1 = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
    );
    const granted2 = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.CALL_PHONE,
    );
    const granted3 = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ANSWER_PHONE_CALLS,
    );
    const granted4 = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.READ_CALL_LOG,
    );
    const granted5 = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.WRITE_CALL_LOG,
    );

    if (granted1 && granted2 && granted3 && granted4 && granted5) {
      setPmisMsg('All permissions granted');
    } else {
      setPmisMsg('Not all permissions granted');
    }
  };

  useEffect(() => {
    const eventEmitter = new NativeEventEmitter(AutoAnswerModule);
    eventEmitter.addListener('callStateChanged', params => {
      console.log('======event.eventProperty=====');
      console.log(params);
    });

    return () => {
      // listener.remove();
      eventEmitter.removeAllListeners('callStateChanged');
    };
  });

  return (
    <View style={styles.container}>
      <Text>{pmisMsg}</Text>

      <View style={styles.mt10} />
      <Button
        title="检查 READ_PHONE_STATE 权限"
        onPress={() => {
          checkPermissions();
        }}
      />

      <View style={styles.mt10} />
      <Button
        title="获取 READ_PHONE_STATE 权限"
        onPress={() => {
          requestPermissions();
          // requestPhoneStatePermission();
        }}
      />

      <View style={styles.mt10} />
      <Text>{autoMsg}</Text>

      <View style={styles.mt10} />
      <Button
        title="开启监听电话状态"
        onPress={() => {
          //注册监听
          AutoAnswerModule.registerPhoneStateListener();
          setAutoMsg('已开启监听电话状态');
        }}
      />

      <View style={styles.mt10} />
      <Button
        title="关闭监听电话状态"
        onPress={() => {
          //取消注册监听
          AutoAnswerModule.unregisterPhoneStateListener();
          setAutoMsg('已关闭监听电话状态');
        }}
      />

      <View style={styles.mt10} />
      <Button
        title="手动挂断来电"
        onPress={() => {
          //取消注册监听
          AutoAnswerModule.endPhoneCalling();
        }}
      />

      <View style={styles.mt10} />
      <Button
        title="手动拨打电话"
        onPress={() => {
          //取消注册监听
          AutoAnswerModule.callPhone('13533403735');
        }}
      />

      <View style={styles.mt10} />
      <Button
        title="获取最近一次通话"
        onPress={() => {
          AutoAnswerModule.getLastCall().then(res => {
            console.log(res);
          });
        }}
      />
    </View>
  );
};

export default PhoneState;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mt10: {
    marginTop: 10,
  },
});
