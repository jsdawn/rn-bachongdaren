import React, {useEffect, useState} from 'react';
import {observer} from 'mobx-react';
import {StyleSheet, View, Dimensions, ImageBackground} from 'react-native';
import {getAndroidId} from 'react-native-device-info';

import LogoFlag from '@components/LogoFlag';
import {useNavigation} from '@react-navigation/native';
import {Button, Text} from '@rneui/themed';

import {authDevice} from '@api/index';
import {appStore} from '@store/appStore';

const LaunchScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const handleCache = () => {
    appStore.clearCache();
  };

  const handleLaunch = () => {
    if (!appStore.machineToken) {
      // 设备未登录
      navigation.navigate('DeviceLogin');
      return;
    }
    authDevice({uuid: appStore.uuid, timestamp: new Date().getTime()}).then(
      res => {
        if (!res || !res.data) return;
        if (res.data.machine?.status == 1) {
          navigation.navigate('TopicPanel');
        }
      },
    );
  };

  const initData = async () => {
    const uuid = await getAndroidId();
    appStore.setUuid(uuid);

    const _window = Dimensions.get('window');
    appStore.setWind(_window);

    setLoading(true);

    handleLaunch();
  };

  useEffect(() => {
    if (!appStore.isHydrated) return;
    initData();
  }, [appStore.isHydrated]);

  return (
    <ImageBackground
      style={{flex: 1}}
      source={require('@assets/image/topic_bg.jpg')}
      resizeMode="stretch">
      <View style={styles.container}>
        <Text>LOADING...</Text>
        <Text>androidId: {appStore.uuid}</Text>
        <Text>machineToken: {appStore.machineToken}</Text>
        <Text>userToken: {appStore.userToken}</Text>
        <View style={{height: 20}}></View>
        <Button onPress={handleCache}>清除缓存</Button>

        <Text style={styles.subText}>
          小亭子等你很久了，点击屏幕开始你的倾听之旅吧
        </Text>

        <Button
          buttonStyle={styles.startBtn}
          raised
          disabled={!loading}
          onPress={handleLaunch}>
          开始你的倾听之旅
        </Button>
      </View>

      <LogoFlag showLogo={false} />
    </ImageBackground>
  );
};

export default observer(LaunchScreen);

const styles = StyleSheet.create({
  container: {
    padding: 50,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startBtn: {
    width: 210,
    height: 50,
    fontSize: 18,
  },
  subText: {
    marginTop: 30,
    marginBottom: 38,
    fontSize: 19,
    fontWeight: 'bold',
  },
});
