import React, {useEffect, useRef, useState} from 'react';
import {observer} from 'mobx-react';
import {TouchableOpacity, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import ListenerItem from '@components/ListenerItem';
import {Dialog, Text, makeStyles, Button, Icon} from '@rneui/themed';

import useStateRef from '@utils/useStateRef';
import {
  createListen,
  getListenStatus,
  updateDialogStatus,
  listHistory,
} from '@api/index';
import {listenStore} from '@store/listenStore';
import {userStore} from '@store/userStore';

const StatusCode = {
  QUEUE: 0,
  HISTORY: 1,
  LINKING: 2,
  CANCEL: -1,
};

/**
 *
 * @param {*} linkTopic 指定话题
 * @param {*} linkListener 指定倾听师
 * @param {*} onSuccess 连接成功回调
 * @param {*} onClosed 关闭成功回调 (isLogout)
 * @returns
 */
const TopicLinkDialog = ({
  visible,
  setVisible,
  linkTopic,
  linkListener,
  onSuccess,
  onClosed,
  isExclude,
}) => {
  const styles = useStyles();

  // 连接状态
  const [status, setStatus, statusRef] = useStateRef(StatusCode.QUEUE);
  const waitKeyRef = useRef('');
  const timer = useRef(null);
  // 历史倾听师
  const [history, setHistory] = useState([]);

  const closeDialog = isLogout => {
    setStatus(StatusCode.QUEUE);
    if (isLogout) {
      userStore.clearUser();
    }
    setVisible(false);
    onClosed?.(isLogout);
  };

  const fetchHistory = () => {
    listHistory()
      .then(res => {
        setStatus(StatusCode.HISTORY);
        if (!res.data || res.data.length == 0) {
          // 无历史倾听师
          fetchQueueInfo();
          return;
        }
        setHistory(res.data || []);
      })
      .catch(() => {
        fetchQueueInfo();
      });
  };

  // 创建排队 task
  const fetchQueueInfo = _teacherId => {
    // 指定倾听师id
    _teacherId = _teacherId || linkListener?.teacherId;

    const data = {
      topic: linkTopic.name,
    };
    if (!isExclude && _teacherId) {
      data.teacherId = _teacherId;
    }
    if (isExclude && _teacherId) {
      data.params = {excludeTeacherIds: [_teacherId]};
    }
    setStatus(StatusCode.QUEUE);
    createListen(data).then(res => {
      if (statusRef.current != StatusCode.QUEUE) {
        return; // 状态已改变
      }
      if (!res.data) return;

      listenStore.setTask(res.data);
      waitKeyRef.current = res.data.waitKey;
      // 定时获取
      timer.current = setTimeout(() => {
        fetchQueueStatus();
      }, res.data.waitTime * 1000);
    });
  };

  // 查询排队状态，获取倾听师信息
  const fetchQueueStatus = () => {
    if (!waitKeyRef.current) return;
    getListenStatus({
      waitKey: waitKeyRef.current,
    }).then(res => {
      if (!visible || statusRef.current != StatusCode.QUEUE) {
        return; // 状态已改变
      }
      if (!res.data) return;

      if (res.data.teacherId && res.data.calledNo) {
        // 排队结束，倾听师信息 res.data
        fetchLinkAndCall(res.data);
        return;
      }

      // 否则，继续排队
      listenStore.setTask(res.data);
      waitKeyRef.current = res.data.waitKey;
      // 定时获取
      timer.current = setTimeout(() => {
        fetchQueueStatus();
      }, res.data.waitTime * 1000);
    });
  };

  // 准备就绪，缓存信息
  const fetchLinkAndCall = _listener => {
    setStatus(StatusCode.LINKING);
    // 缓存倾听信息
    listenStore.setTopic(linkTopic);
    listenStore.setListener(_listener);
    // 获取倾听者信息，跳转拨打页
    closeDialog();

    // 成功
    onSuccess?.();
  };

  const clickToCancel = () => {
    // 由组件处理取消逻辑
    if (timer.current) {
      clearTimeout(timer.current);
    }
    setStatus(StatusCode.CANCEL);

    if (!listenStore.task?.dialogId) return;
    // 更新 log状态
    updateDialogStatus({
      id: listenStore.task.dialogId,
      status: 10, // 用户取消
      waitKey: waitKeyRef.current,
    }).catch(() => {});
  };

  // init data
  const initData = () => {
    listenStore.resetListen();

    if (linkTopic?.name) {
      listenStore.setTopic(linkTopic);
    }
    if (linkListener?.teacherId) {
      listenStore.setListener(linkListener);
    }
    setHistory([]);
    setStatus(StatusCode.QUEUE);

    if (!isExclude && linkListener?.teacherId) {
      // 指定倾听师
      fetchQueueInfo();
    } else {
      // 查询历史倾听师
      fetchHistory();
    }
  };

  useEffect(() => {
    if (!visible) {
      if (timer.current) clearTimeout(timer.current);
      return;
    }
    if (!linkTopic?.name) return;

    initData();

    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [visible]);

  // ===Status Components===

  // 排队中
  const StatusQueue = observer(() => (
    <>
      <Text h2 style={styles.title}>
        《{linkTopic?.name}》
      </Text>
      <View style={styles.subTitle}>
        <Icon
          iconStyle={styles.icon}
          name="phone-in-talk"
          type="materialIcons"
        />
        <Text h3>
          目前排队中，第
          {listenStore.task?.ranking == undefined
            ? '--'
            : listenStore.task.ranking}
          位...
        </Text>
      </View>
      <View style={styles.actions}>
        <Button buttonStyle={styles.btn} raised onPress={clickToCancel}>
          我不等了
        </Button>
      </View>
    </>
  ));

  // 倾听者历史
  const StatusHistory = () => (
    <>
      <Text h3 style={styles.subTitle}>
        这是最近为您倾听的老师，可点击连线他们
      </Text>
      <View style={styles.historyWrap}>
        {history.map(item => (
          <ListenerItem
            item={item}
            key={item.teacherId}
            onPress={() => fetchQueueInfo(item.teacherId)}
          />
        ))}
      </View>
      <View style={styles.actions}>
        <Button
          buttonStyle={styles.btn}
          raised
          onPress={() => fetchQueueInfo()}>
          我要连线新老师
        </Button>
      </View>
    </>
  );

  // 连线中
  const StatusLinking = () => (
    <>
      <Text h2 style={styles.title}>
        《{linkTopic?.name}》
      </Text>
      <View style={styles.subTitle}>
        <Icon
          iconStyle={styles.icon}
          name="phone-in-talk"
          type="materialIcons"
        />
        <Text h3>正在连线倾听者...</Text>
      </View>
      <View style={styles.actions}>
        <Button buttonStyle={styles.btn} raised onPress={clickToCancel}>
          取消连线
        </Button>
      </View>
    </>
  );

  // 取消连线
  const StatusCancel = () => {
    const timerOut = useRef(null);
    const [time, setTime] = useState(10);

    useEffect(() => {
      // runTime();
      return () => {
        if (timerOut.current) clearInterval(timerOut.current);
      };
    }, []);

    useEffect(() => {
      // 退出登陆
      if (time == 0) {
        if (timerOut.current) clearInterval(timerOut.current);
        closeDialog(true);
      }
    }, [time]);

    const runTime = () => {
      timerOut.current = setInterval(() => {
        setTime(pre => pre - 1);
      }, 1000);
    };

    return (
      <>
        <Text h2 style={styles.title}>
          《{linkTopic?.name}》
        </Text>
        <View style={styles.subTitle}>
          <Icon
            iconStyle={styles.icon}
            name="closecircle"
            type="antdesign"
            color="#FF7B7B"
          />
          <Text h3>已取消连线，{time}秒后为你自动退出登陆...</Text>
        </View>
        <View style={styles.actions}>
          <Button buttonStyle={styles.btn} raised onPress={() => closeDialog()}>
            先不退出
          </Button>
        </View>
      </>
    );
  };

  return (
    <Dialog
      isVisible={visible}
      onBackdropPress={() => {}}
      overlayStyle={styles.wrap}>
      <LinearGradient style={styles.container} colors={['#E7EEFA', '#D1E1FF']}>
        {status == StatusCode.QUEUE && <StatusQueue />}
        {status == StatusCode.HISTORY && <StatusHistory />}
        {status == StatusCode.LINKING && <StatusLinking />}
        {status == StatusCode.CANCEL && <StatusCancel />}
      </LinearGradient>
    </Dialog>
  );
};

export default observer(TopicLinkDialog);

const useStyles = makeStyles(theme => ({
  wrap: {
    position: 'relative',
    padding: 0,
    width: 400,
    borderRadius: 20,
  },
  container: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    paddingBottom: 35,
    borderRadius: 20,
    alignItems: 'center',
  },

  title: {
    marginBottom: 35,
  },
  subTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: {
    marginRight: 5,
  },
  desc: {
    marginBottom: 10,
  },

  actions: {
    position: 'absolute',
    bottom: -25,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  btn: {
    paddingHorizontal: 35,
    minWidth: 160,
    height: 50,
    fontSize: 15,
  },

  historyWrap: {
    width: 150 * 2 + 8 * 4,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
}));
