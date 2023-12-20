import React, {useEffect, useRef, useState} from 'react';
import {observer} from 'mobx-react';
import {Text, View} from 'react-native';

import {Dialog, makeStyles, Button} from '@rneui/themed';

import {sleep} from '@utils/index';
import useStateRef from '@utils/useStateRef';
import {createListen, getListenStatus, updateDialogStatus} from '@api/index';
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
    sleep(1000)
      .then(res => {
        // setStatus(StatusCode.HISTORY);
        // setHistory([
        //   {id: 1, name: '麦当劳叔叔', phone: '13533403735'},
        //   {id: 2, name: '肯德基阿姨', phone: '13533403735'},
        //   {id: 3, name: '必胜客小哥', phone: '13533403735'},
        // ]);
        // 无历史倾听师
        fetchQueueInfo();
      })
      .catch(() => {
        fetchQueueInfo();
      });
  };

  // 创建排队 task
  const fetchQueueInfo = () => {
    const data = {
      topic: linkTopic.name,
    };
    if (!isExclude && linkListener?.teacherId) {
      data.teacherId = linkListener?.teacherId;
    }
    if (isExclude && linkListener?.teacherId) {
      data.params = {excludeTeacherIds: [linkListener.teacherId]};
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

  useEffect(() => {
    if (!visible) {
      if (timer.current) clearTimeout(timer.current);
      return;
    }
    if (!linkTopic?.name) return;

    // init data
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
      fetchHistory();
    }

    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [visible]);

  // ===Status Components===

  // 排队中
  const StatusQueue = observer(() => (
    <>
      <Dialog.Title title="倾诉排队中..." titleStyle={{textAlign: 'center'}} />
      <Text style={{textAlign: 'center'}}>
        排在您前面的还有
        {listenStore.task?.ranking == undefined
          ? '--'
          : listenStore.task.ranking}
        人
      </Text>
      <View style={styles.actions}>
        <Button
          buttonStyle={styles.btn}
          size="sm"
          radius={8}
          onPress={clickToCancel}>
          我不等了
        </Button>
      </View>
    </>
  ));

  // 倾听者历史
  const StatusHistory = () => (
    <>
      <Dialog.Title title="这是最近为您倾听的老师，可点击连线他们：" />
      <View style={{alignItems: 'center'}}>
        {history.map(item => (
          <Text
            key={item.id}
            style={styles.historyItem}
            onPress={() => fetchLinkAndCall(item)}>
            {item.name}
          </Text>
        ))}
      </View>
      <View style={styles.actions}>
        <Button
          buttonStyle={styles.btn}
          size="sm"
          radius={8}
          onPress={() => fetchLinkAndCall()}>
          我要连线新老师
        </Button>
      </View>
    </>
  );

  // 连线中
  const StatusLinking = () => (
    <>
      <Dialog.Title
        title="正在连线倾听者..."
        titleStyle={{textAlign: 'center'}}
      />
      <View style={styles.actions}>
        <Button
          buttonStyle={styles.btn}
          size="sm"
          radius={8}
          onPress={clickToCancel}>
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
      runTime();
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
        <Dialog.Title title="已取消连线" titleStyle={{textAlign: 'center'}} />
        <Text style={{textAlign: 'center'}}>{time}秒后为你自动退出登陆</Text>
        <View style={styles.actions}>
          <Button
            buttonStyle={styles.btn}
            size="sm"
            radius={8}
            onPress={() => closeDialog()}>
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
      overlayStyle={styles.container}>
      {status == StatusCode.QUEUE && <StatusQueue />}
      {status == StatusCode.HISTORY && <StatusHistory />}
      {status == StatusCode.LINKING && <StatusLinking />}
      {status == StatusCode.CANCEL && <StatusCancel />}
    </Dialog>
  );
};

export default observer(TopicLinkDialog);

const useStyles = makeStyles(theme => ({
  container: {
    width: 320,
    borderRadius: 10,
  },

  actions: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  btn: {
    paddingHorizontal: 15,
    minWidth: 110,
    borderColor: '#999',
  },

  historyItem: {
    paddingVertical: 5,
    fontSize: 15,
  },
}));
