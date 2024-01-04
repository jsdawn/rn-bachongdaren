import React, {useEffect, useState} from 'react';
import {observer} from 'mobx-react';
import {
  StyleSheet,
  View,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import {getAndroidId} from 'react-native-device-info';

import BgImgView from '@components/BgImgView';
import LogoFlag from '@components/LogoFlag';
import {useNavigation} from '@react-navigation/native';
import {Button, Image, Text} from '@rneui/themed';

import {authDevice} from '@api/index';
import {appStore} from '@store/appStore';

const LaunchScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);

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
      (res) => {
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

    setLoading(false);

    // 自动开始
    // handleLaunch();
  };

  useEffect(() => {
    if (!appStore.isHydrated) return;
    initData();
  }, [appStore.isHydrated]);

  return (
    <ImageBackground
      style={{flex: 1}}
      source={require('@assets/image/start_bg.png')}
      resizeMode="cover"
    >
      <View style={styles.container}>
        {/* debug info */}
        {__DEV__ ? (
          <View style={styles.debugInfo}>
            <Text>androidId: {appStore.uuid}</Text>
            <Text>machineToken: {appStore.machineToken}</Text>
            <Text>userToken: {appStore.userToken}</Text>
            <Text>__DEV__: {__DEV__ ? 'true' : 'false'}</Text>
            <View style={{height: 20}}></View>
            <Button buttonStyle={{width: 150}} onPress={handleCache}>
              清除缓存
            </Button>
          </View>
        ) : null}

        <Image
          style={styles.logo}
          source={require('@assets/image/logo_lg.png')}
        ></Image>

        <Text style={styles.subText}>
          小亭子等你很久了，点击屏幕开始你的倾听之旅吧
        </Text>

        <TouchableOpacity
          style={{opacity: loading ? 0.6 : 1}}
          disabled={loading}
          onPress={handleLaunch}
        >
          <BgImgView
            source={require('@assets/image/start_btn.png')}
            width={240}
            height={79}
            center
          >
            <Text style={styles.startBtnText}>开始你的倾听之旅</Text>
          </BgImgView>
        </TouchableOpacity>
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

  debugInfo: {
    position: 'absolute',
    top: 0,
    left: 0,
    padding: 10,
  },

  logo: {
    width: 173,
    height: 60,
  },
  subText: {
    marginTop: 30,
    marginBottom: 38,
    fontSize: 19,
    fontWeight: 'bold',
  },

  startBtnText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});
