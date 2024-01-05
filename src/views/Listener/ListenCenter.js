import React, {useState, useRef, useEffect} from 'react';
import {observer} from 'mobx-react';
import {
  View,
  ImageBackground,
  NativeModules,
  NativeEventEmitter,
  Dimensions,
  Image,
} from 'react-native';

import BgImgView from '@components/BgImgView';
import ListenSettleDialog from '@components/ListenSettleDialog';
import LoginUser from '@components/LoginUser';
import MessageBox from '@components/MessageBox';
import MyAvatar from '@components/MyAvatar';
import {useNavigation} from '@react-navigation/native';
import {Button, Text, makeStyles} from '@rneui/themed';
import TopicLinkDialog from '@views/Home/components/TopicLinkDialog';

import {requestPermissions} from '@utils/permissions';
import useBackHandler from '@utils/useBackHandler';
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
  useBackHandler();

  const eventEmitter = new NativeEventEmitter(AutoAnswerModule);
  const eventListener = useRef(null);
  const navigation = useNavigation();

  const [showSettle, setShowSettle] = useState(false);

  const [linkVisible, setLinkVisible] = useState(false);
  const [isExclude, setIsExclude] = useState(false);
  const [status, setStatus, statusRef] = useStateRef(StatusCode.DIALING);
  // 通话状态
  const callState = useRef({});
  // 前一次通话记录
  const preCallLog = useRef({
    callDuration: '',
    phNumber: '',
    startDate: '',
  });
  const timerLog = useRef(null); // 通话记录timer
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
      setDuration((pre) => pre + 1);
    }, 1000);

    AutoAnswerModule.getLastCall().then((res) => {
      preCallLog.current = res;
    });
  };

  // 挂断后，定时获取最近通话记录
  const getLastCallInfo = () => {
    AutoAnswerModule.getLastCall().then((res) => {
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

  // 挂断
  const toBeHangUp = () => {
    // 监听到原生通话挂断
    // 取消监听
    AutoAnswerModule.unregisterPhoneStateListener();
    setStatus(StatusCode.HANGUP);
    setShowSettle(true);
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
  };

  const fmtDuration = (num) => {
    let h = Math.floor(num / (60 * 60)) % 24;
    let m = Math.floor(num / 60) % 60;
    let s = Math.floor(num) % 60;
    m = m < 10 ? '0' + m : m;
    s = s < 10 ? '0' + s : s;
    return (h > 0 ? `${h}:` : '') + `${m}:${s}`;
  };

  // 监听原生通话状态 处理函数
  // 注：目前判断不出是否已接听，按拨号即接听处理）
  const callStateHandler = (params) => {
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
  const handleReLink = (_isExclude) => {
    setShowSettle(false);
    if (timerDur.current) clearInterval(timerDur.current);
    if (timerLog.current) clearInterval(timerLog.current);

    setIsExclude(!!_isExclude);
    setTimeout(() => {
      setLinkVisible(true);
    }, 0);
  };

  // 重连成功，关闭弹窗
  const onSuccessLink = () => {
    // reset data
    setStatus(StatusCode.DIALING);
    callState.current = {};
    preCallLog.current = {};
    setDuration(0);
    // call phone
    if (listenStore.listener?.calledNo) {
      // 拨打电话并开始监听 phoneState
      AutoAnswerModule.callPhone(listenStore.listener.calledNo);
    }
  };

  // 关闭重连
  const onClosedLink = (isLogOut) => {
    if (isLogOut) {
      navigation.goBack();
      return;
    }
  };

  const handleFinish = () => {
    MessageBox.show({
      title: '',
      message: '确定结束倾诉吗？',
      onConfirm(done) {
        // 页面按钮触发 挂断通话。等待监听处理
        AutoAnswerModule.endPhoneCalling();
        done();
      },
    });
  };

  // 退出登录倒计时
  const handleCountdown = () => {
    userStore.clearUserCache();
    navigation.goBack();
  };

  // init start
  useEffect(() => {
    requestPermissions().then(() => {
      if (listenStore.listener?.calledNo) {
        // 拨打电话并开始监听 phoneState
        AutoAnswerModule.callPhone(listenStore.listener.calledNo);
      }
    });

    eventListener.current = eventEmitter.addListener(
      'callStateChanged',
      (val) => {
        callStateHandler(val);
      },
    );

    return () => {
      if (timerDur.current) clearInterval(timerDur.current);
      if (timerLog.current) clearInterval(timerLog.current);

      if (eventListener.current) {
        eventListener.current.remove();
      }
      AutoAnswerModule.unregisterPhoneStateListener();
    };
  }, []);

  return (
    <ImageBackground
      style={{flex: 1}}
      source={require('@assets/image/topic_bg.jpg')}
      resizeMode="stretch"
    >
      <View style={styles.container}>
        <BgImgView
          source={require('@assets/image/call_pic.png')}
          width={489}
          height={461}
          style={styles.bgpic}
        ></BgImgView>

        <BgImgView
          style={styles.panel}
          source={require('@assets/image/call_panel.png')}
          width={358}
          height={410}
        >
          <View style={styles.avatarWrap}>
            <MyAvatar large></MyAvatar>
          </View>
          <Text style={styles.panelName}>{listenStore.listener?.nickname}</Text>

          {status === StatusCode.DIALING ? (
            <>
              <View style={styles.panelIcon}>
                <Image
                  source={require('@assets/image/icon_call.png')}
                  style={{width: 142, height: 142}}
                />
              </View>
              <Text style={{fontSize: 15}}>
                即将为你接通麦当劳叔叔，请拿起听筒...
              </Text>
              <Button onPress={() => setShowSettle(true)}>显示</Button>
            </>
          ) : (
            <>
              <Text style={styles.panelTime}>{fmtDuration(duration)}</Text>
              <Button
                buttonStyle={styles.panelBtn}
                raised
                disabled={status !== StatusCode.CALLING}
                onPress={() => handleFinish()}
              >
                结束倾诉
              </Button>
            </>
          )}
        </BgImgView>

        <ListenSettleDialog
          visible={showSettle}
          setVisible={setShowSettle}
          listener={listenStore.listener}
          onRelink={() => handleReLink()}
          onSwitch={() => handleReLink(true)}
          onCountdown={() => handleCountdown()}
        />

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

const useStyles = makeStyles((theme) => ({
  container: {
    padding: 50,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  bgpic: {
    position: 'absolute',
    left: 60,
    bottom: 0,
    width: Dimensions.get('window').width / 2,
    aspectRatio: 489 / 461,
  },

  panel: {
    position: 'relative',
    paddingTop: 120,
    alignItems: 'center',
  },
  avatarWrap: {
    position: 'absolute',
    top: -15,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  panelName: {
    fontSize: 24,
  },
  panelTime: {
    marginTop: 60,
    marginBottom: 20,
    fontSize: 45,
    fontWeight: 'bold',
    letterSpacing: 1.1,
  },
  panelBtn: {
    width: 180,
    height: 50,
  },
  panelIcon: {
    marginVertical: 0,
  },
}));
