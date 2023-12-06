import React, {useState, useRef, useEffect} from 'react';
import {Text, View, ImageBackground, NativeModules} from 'react-native';

import {useNavigation} from '@react-navigation/native';
import {Button, makeStyles} from '@rneui/themed';

import {sleep} from '@utils/index';
import {requestPermissions} from '@utils/permissions';
import {useUserStore} from '@store/userStore';

const {AutoAnswerModule} = NativeModules;

const StatusCode = {
  DIALING: 0,
  CALLING: 1,
  HANGUP: -1,
};

const ListenCenter = ({route}) => {
  const styles = useStyles();
  const {name, phone} = route.params || {};
  const navigation = useNavigation();
  const {clearUser} = useUserStore();

  const [status, setStatus] = useState(StatusCode.DIALING);
  const statusRef = useRef(status);
  statusRef.current = status; // 跟踪status的当前值

  const timer = useRef(null); // 退出timer
  const [outNum, setOutNum] = useState(10);
  const durTimer = useRef(null); // 时长timer
  const [duration, setDuration] = useState(0);

  const beDialing = () => {
    setStatus(StatusCode.DIALING);
  };

  const beCalling = () => {
    setStatus(StatusCode.CALLING);
    setDuration(0);
    durTimer.current = setInterval(() => {
      setDuration(pre => pre + 1);
    }, 1000);
  };

  const beHangUp = () => {
    AutoAnswerModule.endPhoneCalling();
    setStatus(StatusCode.HANGUP);
    if (durTimer.current) clearInterval(durTimer.current);
    setOutNum(10);
    timer.current = setInterval(() => {
      setOutNum(pre => pre - 1);
    }, 1000);
  };

  const fmtDuration = num => {
    let h = Math.floor(num / (60 * 60)) % 24;
    let m = Math.floor(num / 60) % 60;
    let s = Math.floor(num) % 60;
    m = m < 10 ? '0' + m : m;
    s = s < 10 ? '0' + s : s;
    return (h > 0 ? `${h}:` : '') + `${m}:${s}`;
  };

  useEffect(() => {
    // sleep(1000).then(() => {
    //   beCalling();
    // });
    requestPermissions().then(res => {
      AutoAnswerModule.callPhone('13533403735');
      beCalling();
    });

    return () => {
      if (durTimer.current) clearInterval(durTimer.current);
      if (timer.current) clearInterval(timer.current);
    };
  }, []);

  useEffect(() => {
    // 退出登陆
    if (outNum == 0) {
      if (timer.current) clearInterval(timer.current);
      clearUser();
      navigation.goBack();
    }
  }, [outNum]);

  // ===Status Components===

  const StatusCalling = () => {
    return (
      <View style={{flex: 1, paddingVertical: 30, paddingHorizontal: 40}}>
        <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
          <Text style={{fontSize: 38, paddingRight: 15, color: '#fff'}}>
            {fmtDuration(duration)}
          </Text>
          <Text style={{paddingBottom: 10, color: '#fff'}}>
            因为陌生，所以勇敢。因为距离，所以美丽。
          </Text>
        </View>

        <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
          <View style={{width: '40%'}}>
            <Text style={{paddingBottom: 10, color: '#fff'}}>
              已为你连线 麦当劳叔叔
            </Text>
            <Text style={{paddingBottom: 10, color: '#fff'}}>
              你的烦恼是 【心情不好】
            </Text>
            {status == StatusCode.HANGUP && (
              <Text style={{paddingBottom: 10, color: '#fff'}}>通话已结束</Text>
            )}
          </View>

          {status == StatusCode.HANGUP && (
            <View style={{width: '60%', alignItems: 'center'}}>
              <View style={styles.panel}>
                <Text
                  style={{marginBottom: 20, fontSize: 17, fontWeight: 'bold'}}>
                  还有未说完的话...
                </Text>
                <Button buttonStyle={styles.panelBtn} size="sm">
                  重新连线 麦当劳叔叔
                </Button>
                <Button buttonStyle={styles.panelBtn} size="sm">
                  换一个人倾诉
                </Button>
                <Text style={{fontWeight: 'bold', marginTop: 10}}>
                  {outNum}秒后为你自动退出登陆
                </Text>
              </View>
            </View>
          )}
        </View>

        {status == StatusCode.CALLING && (
          <View
            style={{
              paddingTop: 20,
              flexDirection: 'row',
              justifyContent: 'flex-end',
            }}>
            <Button buttonStyle={styles.finishBtn} onPress={() => beHangUp()}>
              结束倾诉
            </Button>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.bgImage}
        source={require('@assets/image/device_bg.png')}
        resizeMode="stretch">
        {status == StatusCode.DIALING && (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{fontSize: 25, color: '#fff'}}>
              即将为你接通{name}，请拿起听筒……
            </Text>
          </View>
        )}

        {(status == StatusCode.CALLING || status == StatusCode.HANGUP) && (
          <StatusCalling />
        )}
      </ImageBackground>
    </View>
  );
};

export default ListenCenter;

const useStyles = makeStyles(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary,
  },
  bgImage: {
    flex: 1,
  },
  panel: {
    padding: 20,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 12,
  },
  panelBtn: {
    width: 200,
    marginBottom: 15,
    borderRadius: 8,
  },

  finishBtn: {
    width: 140,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
}));
