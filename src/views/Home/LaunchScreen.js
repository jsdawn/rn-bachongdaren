import React, {useEffect} from 'react';
import {observer} from 'mobx-react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ImageBackground,
} from 'react-native';
import {getAndroidId} from 'react-native-device-info';

import LogoFlag from '@components/LogoFlag';
import {useNavigation} from '@react-navigation/native';
import {Button} from '@rneui/themed';

import {sleep} from '@utils/index';
import {authDevice} from '@api/index';
import {appStore} from '@store/appStore';

const LaunchScreen = () => {
  const navigation = useNavigation();

  const handleCache = () => {
    appStore.clearCache();
  };

  const handleLaunch = async () => {
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

  const initData = async () => {
    const uuid = await getAndroidId();
    appStore.setAndroidId(uuid);
  };

  useEffect(() => {
    if (!appStore.isHydrated) return;
    initData();

    const {height, width} = Dimensions.get('window');
    console.log(height, width);
  }, [appStore.isHydrated]);

  return (
    <ImageBackground
      style={{flex: 1}}
      source={require('@assets/image/topic_bg.jpg')}
      resizeMode="stretch">
      <View style={styles.container}>
        {/* <Text>LOADING...</Text>
        <Text>androidId: {appStore.androidId}</Text>
        <Text>machineToken: {appStore.machineToken}</Text>
        <Text>userToken: {appStore.userToken}</Text> */}
        {/* <View style={{height: 20}}></View>
        <Button onPress={handleCache}>清除缓存</Button>

        <View style={{height: 20}}></View> */}

        <Button onPress={handleLaunch}>进入应用</Button>

        <LogoFlag showLogo={false} />
      </View>
    </ImageBackground>
  );
};

export default observer(LaunchScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
