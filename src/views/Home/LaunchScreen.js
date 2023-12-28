import React, {useEffect} from 'react';
import {observer} from 'mobx-react';
import {StyleSheet, Text, View, NativeModules} from 'react-native';
import {getAndroidId} from 'react-native-device-info';

import {useNavigation} from '@react-navigation/native';
import {Button} from '@rneui/themed';

import {sleep} from '@utils/index';
import {authDevice} from '@api/index';
import {appStore} from '@store/appStore';

const {MyReceiverModule} = NativeModules;

const LaunchScreen = () => {
  const navigation = useNavigation();

  const handleCache = () => {
    appStore.clearCache();
  };

  const handleLaunch = async () => {
    const uuid = await getAndroidId();
    appStore.setAndroidId(uuid);

    if (!appStore.machineToken) {
      // 设备未登录
      navigation.navigate('DeviceLogin');
      return;
    }

    authDevice({uuid, timestamp: new Date().getTime()}).then(res => {
      if (!res || !res.data) return;
      if (res.data.machine?.status == 1) {
        navigation.navigate('TopicPanel');
      }
    });
  };

  useEffect(() => {
    if (!appStore.isHydrated) return;
    // sleep(2000).then(() => {
    //   handleLaunch();
    // });

    MyReceiverModule.registerBroadcastReceiver();
  }, [appStore.isHydrated]);

  return (
    <View style={styles.container}>
      <Text>LOADING...</Text>
      <Text>androidId: {appStore.androidId}</Text>
      <Text>machineToken: {appStore.machineToken}</Text>
      <Text>userToken: {appStore.userToken}</Text>

      <View style={{height: 20}}></View>
      <Button onPress={handleCache}>清除缓存</Button>

      <View style={{height: 20}}></View>
      <Button onPress={handleLaunch}>进入应用</Button>
    </View>
  );
};

export default observer(LaunchScreen);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
});
