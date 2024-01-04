import React, {useState, useRef, useEffect} from 'react';
import {observer} from 'mobx-react';
import {
  View,
  ImageBackground,
  NativeModules,
  NativeEventEmitter,
  BackHandler,
} from 'react-native';

import BgImgView from '@components/BgImgView';
import ListenerItem from '@components/ListenerItem';
import LoginUser from '@components/LoginUser';
import MessageBox from '@components/MessageBox';
import {useNavigation} from '@react-navigation/native';
import {Button, Icon, Text, makeStyles} from '@rneui/themed';
import TopicLinkDialog from '@views/Home/components/TopicLinkDialog';

import {requestPermissions} from '@utils/permissions';
import useStateRef from '@utils/useStateRef';
import {updateDialogStatus} from '@api/index';
import {listenStore} from '@store/listenStore';
import {userStore} from '@store/userStore';

const {AutoAnswerModule} = NativeModules;

const StatusCode = {
  DIALING: 0, // 拨号
  CALLING: 1, // 通话中
  HANGUP: -1, // 挂断
};

const ListenCenter = () => {
  const styles = useStyles();

  const eventEmitter = new NativeEventEmitter(AutoAnswerModule);
  const eventListener = useRef(null);
  const navigation = useNavigation();

  const [linkVisible, setLinkVisible] = useState(false);
  const [isExclude, setIsExclude] = useState(false);
  const [status, setStatus, statusRef] = useStateRef(StatusCode.CALLING);
  // 通话状态
  const callState = useRef({});
  // 前一次通话记录
  const preCallLog = useRef({
    callDuration: '',
    phNumber: '',
    startDate: '',
  });
  const timerOut = useRef(null); // 退出timer
  const timerLog = useRef(null); // 通话记录timer
  const [outNum, setOutNum] = useState(10);
  const timerDur = useRef(null); // 时长timer
  const [duration, setDuration, durationRef] = useStateRef(0); // 秒

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
        res.phNumber == listenStore.listener?.calledNo &&
        listenStore.task?.dialogId
      ) {
        // 最近通话记录
        updateDialogStatus({
          id: listenStore.task?.dialogId,
          waitDuring: durationRef.current - res.callDuration,
          callDuring: +res.callDuration,
          status: 9, // 通话结束
        }).catch(() => {});
      }
    });
  };

  // 自动登出
  const autoLogOut = () => {
    if (timerOut.current) clearInterval(timerOut.current);
    // 登出读条
    // setOutNum(10);
    // timerOut.current = setInterval(() => {
    //   setOutNum(pre => pre - 1);
    // }, 1000);
  };

  // 挂断
  const toBeHangUp = isManual => {
    if (isManual) {
      // 页面按钮触发 挂断通话。等待监听处理
      AutoAnswerModule.endPhoneCalling();
      return;
    }

    // 监听到原生通话挂断
    // 取消监听
    AutoAnswerModule.unregisterPhoneStateListener();
    setStatus(StatusCode.HANGUP);
    if (timerDur.current) clearInterval(timerDur.current);
    // 获取通话记录
    getLastCallInfo();
    // 更新 log状态
    if (listenStore.task?.dialogId) {
      updateDialogStatus({
        id: listenStore.task?.dialogId,
        status: 9, // 通话结束
      }).catch(() => {});
    }

    autoLogOut();
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

    if (callState.current.isCalling && !params.isCalling) {
      // 原生挂断，calling -> no calling
      toBeHangUp();
    } else if (!callState.current.isCalling && params.isCalling) {
      // 原生拨号，no calling -> calling
      toBeCalling();
    }
    callState.current = params;
  };

  // 重连
  const handleReLink = _isExclude => {
    if (timerDur.current) clearInterval(timerDur.current);
    if (timerLog.current) clearInterval(timerLog.current);
    if (timerOut.current) clearInterval(timerOut.current);

    setIsExclude(!!_isExclude);
    setLinkVisible(true);
  };

  // 重连成功，关闭弹窗
  const onSuccessLink = () => {
    // reset data
    setStatus(StatusCode.DIALING);
    callState.current = {};
    preCallLog.current = {};
    setOutNum(10);
    setDuration(0);
    // call phone
    if (listenStore.listener?.calledNo) {
      // 拨打电话并开始监听 phoneState
      AutoAnswerModule.callPhone(listenStore.listener.calledNo);
    }
  };

  // 关闭重连
  const onClosedLink = isLogOut => {
    if (isLogOut) {
      navigation.goBack();
      return;
    }
    autoLogOut();
  };

  const handleFinish = () => {
    MessageBox.show({
      title: '系统提示',
      message: '确定结束倾诉吗？',
      onConfirm(done) {},
    });
  };

  // 退出登录
  useEffect(() => {
    if (outNum == 0) {
      if (timerOut.current) clearInterval(timerOut.current);
      userStore.clearUser();
      navigation.goBack();
    }
  }, [outNum]);

  // init start
  useEffect(() => {
    // 禁用系统返回键
    BackHandler.addEventListener('hardwareBackPress', () => true);

    requestPermissions().then(() => {
      if (listenStore.listener?.calledNo) {
        // 拨打电话并开始监听 phoneState
        // AutoAnswerModule.callPhone(listenStore.listener.calledNo);
      }
    });

    eventListener.current = eventEmitter.addListener(
      'callStateChanged',
      val => {
        callStateHandler(val);
      },
    );

    return () => {
      if (timerDur.current) clearInterval(timerDur.current);
      if (timerLog.current) clearInterval(timerLog.current);
      if (timerOut.current) clearInterval(timerOut.current);

      if (eventListener.current) {
        eventListener.current.remove();
      }
      AutoAnswerModule.unregisterPhoneStateListener();
    };
  }, []);

  // ===Status Components===

  const StatusCalling = observer(() => {
    return (
      <View style={styles.callWrap}>
        <View style={styles.callInfo}>
          <Text h1 style={styles.callName}>
            {listenStore.listener?.nickname}
          </Text>
          <Text style={styles.callDesc}>
            因为陌生，所以勇敢。因为距离，所以美丽。
          </Text>
        </View>

        <BgImgView
          style={styles.panel}
          source={require('@assets/image/call_panel.png')}
          center
          width={493}
          height={392}>
          <BgImgView
            source={require('@assets/image/call_panel_name.png')}
            center
            width={320}
            height={136}>
            <Text style={styles.panelName} h1>
              {listenStore.topic?.name}
            </Text>
          </BgImgView>
          <Text style={styles.panelTime}>{fmtDuration(duration)}</Text>
          <Button
            buttonStyle={styles.panelBtn}
            raised
            disabled={!StatusCode.CALLING}
            onPress={() => handleFinish()}>
            结束倾诉
          </Button>

          {status == StatusCode.HANGUP && (
            <View style={{width: '60%', alignItems: 'center'}}>
              <View style={styles.panel2}>
                <Text
                  style={{marginBottom: 20, fontSize: 17, fontWeight: 'bold'}}>
                  还有未说完的话...
                </Text>
                <Button
                  buttonStyle={styles.panelBtn}
                  size="sm"
                  onPress={() => handleReLink()}>
                  重新连线 {listenStore.listener?.nickname}
                </Button>
                <Button
                  buttonStyle={styles.panelBtn}
                  size="sm"
                  onPress={() => handleReLink(true)}>
                  换一个人倾诉
                </Button>
                <Text style={{fontWeight: 'bold', marginTop: 10}}>
                  {outNum}秒后为你自动退出登录
                </Text>
              </View>
            </View>
          )}
        </BgImgView>
      </View>
    );
  });

  return (
    <ImageBackground
      style={{flex: 1}}
      source={require('@assets/image/topic_bg.jpg')}
      resizeMode="stretch">
      <View style={styles.container}>
        {status == StatusCode.DIALING && (
          <View style={styles.dialWrap}>
            <ListenerItem
              size="lg"
              showStatus={false}
              item={listenStore.listener}
            />

            <View style={styles.dialContent}>
              <Icon
                iconStyle={styles.dialIcon}
                name="phone-in-talk"
                type="materialIcons"
                raised
              />
              <Text style={styles.dialText} h2>
                即将为你接通{listenStore.listener?.nickname}，请拿起听筒...
              </Text>
            </View>
          </View>
        )}

        {(status == StatusCode.CALLING || status == StatusCode.HANGUP) && (
          <StatusCalling />
        )}

        <TopicLinkDialog
          visible={linkVisible}
          setVisible={setLinkVisible}
          linkTopic={listenStore.topic}
          linkListener={listenStore.listener}
          isExclude={isExclude}
          onSuccess={onSuccessLink}
          onClosed={onClosedLink}
        />

        <LoginUser showLogout={false} />
      </View>
    </ImageBackground>
  );
};

export default observer(ListenCenter);

const useStyles = makeStyles(theme => ({
  container: {
    flex: 1,
  },

  dialWrap: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialContent: {
    marginLeft: 25,
    alignItems: 'flex-start',
  },
  dialIcon: {},
  dialText: {
    marginTop: 25,
  },

  callWrap: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  callInfo: {
    marginRight: 35,
    width: 290,
  },
  callName: {
    marginTop: 20,
    fontSize: 24,
  },
  callDesc: {
    marginTop: 55,
    fontSize: 18,
  },

  panel: {},
  panelName: {
    fontSize: 26,
  },
  panelTime: {
    marginBottom: 10,
    fontSize: 45,
    fontWeight: 'bold',
    letterSpacing: 1.1,
  },
  panelBtn: {
    width: 180,
    height: 50,
  },
}));
