import React, {useState, useRef, useEffect} from 'react';
import {observer} from 'mobx-react';
import {
  Text,
  View,
  ImageBackground,
  NativeModules,
  NativeEventEmitter,
} from 'react-native';

import {useNavigation} from '@react-navigation/native';
import {Button, makeStyles} from '@rneui/themed';

import {requestPermissions} from '@utils/permissions';
import {updateDialogStatus} from '@api/index';
import {useListenStore} from '@store/listenStore';
import {useUserStore} from '@store/userStore';

const {AutoAnswerModule} = NativeModules;

const StatusCode = {
  DIALING: 0, // 拨号
  CALLING: 1, // 通话中
  HANGUP: -1, // 挂断
};

const ListenCenter = ({route}) => {
  const styles = useStyles();

  const eventEmitter = new NativeEventEmitter(AutoAnswerModule);
  const eventListener = useRef(null);

  const {listenInfo} = useListenStore();
  const {name, phone} = route.params || {};
  const navigation = useNavigation();
  const {clearUser} = useUserStore();

  const [status, setStatus] = useState(StatusCode.DIALING);
  const statusRef = useRef(status);
  statusRef.current = status; // 跟踪status的当前值

  // 通话状态
  const [callState, setCallState] = useState({});
  const callStateRef = useRef(callState);
  callStateRef.current = callState;

  // 前一次通话记录
  const preCallLog = useRef({
    callDuration: '',
    phNumber: '',
    startDate: '',
  });

  const timer = useRef(null); // 退出timer
  const timerLog = useRef(null); // 通话记录timer
  const [outNum, setOutNum] = useState(10);
  const timerDur = useRef(null); // 时长timer

  const [duration, setDuration] = useState(0); // 秒
  const durationRef = useRef(duration);
  durationRef.current = duration;

  // 正在拨号
  const toBeDialing = () => {
    setStatus(StatusCode.DIALING);
  };

  // 通话中
  const toBeCalling = () => {
    setStatus(StatusCode.CALLING);
    setDuration(0);
    timerDur.current = setInterval(() => {
      setDuration(pre => pre + 1);
    }, 1000);

    AutoAnswerModule.getLastCall().then(res => {
      preCallLog.current = res;
    });
  };

  // 挂断后，定时获取最近通话记录
  const getLastCallInfo = () => {
    AutoAnswerModule.getLastCall().then(res => {
      if (!res.phNumber || res.startDate == preCallLog.current.startDate) {
        timerLog.current = setTimeout(() => {
          getLastCallInfo();
        }, 1000);
        return;
      }
      if (
        res.startDate != preCallLog.current.startDate &&
        res.phNumber == listenInfo.listener.calledNo &&
        listenInfo.task?.dialogId
      ) {
        console.log(res);
        // 最近通话记录
        updateDialogStatus({
          id: listenInfo.task?.dialogId,
          waitDuring: durationRef.current - res.callDuration,
          callDuring: res.callDuration,
          status: 9, // 通话结束
        }).catch(() => {});
      }
    });
  };

  // 挂断
  const toBeHangUp = isManual => {
    if (isManual) {
      // 页面按钮触发 挂断通话。等待监听处理
      AutoAnswerModule.endPhoneCalling();
      return;
    }

    // 监听到原生通话挂断
    setStatus(StatusCode.HANGUP);
    if (timerDur.current) clearInterval(timerDur.current);
    // 获取通话记录
    getLastCallInfo();
    // 更新 log状态
    if (listenInfo.task?.dialogId) {
      updateDialogStatus({
        id: listenInfo.task?.dialogId,
        status: 9, // 通话结束
      }).catch(() => {});
    }
    // 登出读条
    // setOutNum(10);
    // timer.current = setInterval(() => {
    //   setOutNum(pre => pre - 1);
    // }, 1000);
  };

  const fmtDuration = num => {
    let h = Math.floor(num / (60 * 60)) % 24;
    let m = Math.floor(num / 60) % 60;
    let s = Math.floor(num) % 60;
    m = m < 10 ? '0' + m : m;
    s = s < 10 ? '0' + s : s;
    return (h > 0 ? `${h}:` : '') + `${m}:${s}`;
  };

  // 监听原生通话状态 处理函数
  // 注：目前判断不出是否已接听，按拨号即接听处理）
  const callStateHandler = params => {
    console.log('======event.eventProperty=====');
    console.log(params);

    setCallState(pre => {
      if (pre.isCalling && !params.isCalling) {
        // 原生挂断，calling -> no calling
        toBeHangUp();
      } else if (!pre.isCalling && params.isCalling) {
        // 原生拨号，no calling -> calling
        toBeCalling();
      }

      return params;
    });
  };

  // 退出登陆
  useEffect(() => {
    if (outNum == 0) {
      if (timer.current) clearInterval(timer.current);
      clearUser();
      navigation.goBack();
    }
  }, [outNum]);

  // init start
  useEffect(() => {
    requestPermissions().then(() => {
      if (listenInfo.listener?.calledNo) {
        AutoAnswerModule.callPhone(listenInfo.listener.calledNo);
      }
    });

    eventListener.current = eventEmitter.addListener(
      'callStateChanged',
      callStateHandler,
    );

    return () => {
      if (timerDur.current) clearInterval(timerDur.current);
      if (timer.current) clearInterval(timer.current);
      if (timerLog.current) clearInterval(timerLog.current);

      if (eventListener.current) {
        eventListener.current.remove();
      }
      AutoAnswerModule.unregisterPhoneStateListener();
    };
  }, []);

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
              已为你连线 {listenInfo.listener.teacherName}
            </Text>
            <Text style={{paddingBottom: 10, color: '#fff'}}>
              你的烦恼是 【{listenInfo.topic.name}】
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
                <Button
                  buttonStyle={styles.panelBtn}
                  size="sm"
                  onPress={() => {
                    AutoAnswerModule.getLastCall().then(res => {
                      console.log(res);
                    });
                  }}>
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
            <Button
              buttonStyle={styles.finishBtn}
              onPress={() => toBeHangUp(true)}>
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

export default observer(ListenCenter);

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
