import React, {useEffect, useRef, useState} from 'react';
import {observer} from 'mobx-react';
import {Text, View} from 'react-native';

import {useNavigation} from '@react-navigation/native';
import {Dialog, makeStyles, Button} from '@rneui/themed';

import {sleep} from '@utils/index';
import {createListen, getListenStatus, updateDialogStatus} from '@api/index';
import {useListenStore} from '@store/listenStore';
import {useUserStore} from '@store/userStore';

const StatusCode = {
  QUEUE: 0,
  HISTORY: 1,
  LINKING: 2,
  CANCEL: -1,
};

const TopicLinkDialog = ({visible, setVisible, linkTopic}) => {
  const styles = useStyles();
  const navigation = useNavigation();

  const {clearUser} = useUserStore();
  const {setQueue, setTopic, setListener} = useListenStore();

  const [status, setStatus] = useState(StatusCode.QUEUE);
  const statusRef = useRef(status);
  statusRef.current = status; // 跟踪status的当前值

  const timer = useRef(null);
  const [queueInfo, setQueueInfo] = useState({
    waitKey: '',
    ranking: undefined,
    waitTime: 0,
  });
  const [history, setHistory] = useState([]);

  const closeDialog = isLogout => {
    setStatus(StatusCode.QUEUE);
    setQueueInfo({});
    if (isLogout) {
      clearUser();
    }
    setVisible(false);
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

  const fetchQueueInfo = () => {
    if (!linkTopic?.name) return;
    createListen({
      topic: linkTopic.name,
    }).then(res => {
      if (statusRef.current != StatusCode.QUEUE) {
        // 判断状态是否已经改变
        return;
      }
      if (!res.data) return;

      setQueueInfo(res.data || {});
      timer.current = setTimeout(() => {
        fetchQueueStatus(res.data.waitKey);
      }, res.data.waitTime * 1000);
    });
  };

  const fetchQueueStatus = _waitKey => {
    if (!_waitKey) return;
    getListenStatus({
      waitKey: _waitKey,
    }).then(res => {
      if (statusRef.current != StatusCode.QUEUE) {
        // 判断状态是否已经改变
        return;
      }
      if (!res.data) return;

      if (res.data.calledNo) {
        // 排队结束，倾听师信息 res.data
        fetchLinkAndCall(res.data);
        return;
      }

      setQueueInfo(res.data || {});
      timer.current = setTimeout(() => {
        fetchQueueStatus(res.data.waitKey);
      }, res.data.waitTime * 1000);
    });
  };

  const fetchLinkAndCall = _listener => {
    setStatus(StatusCode.LINKING);
    // 缓存倾听信息
    setQueue(queueInfo);
    setTopic(linkTopic);
    setListener(_listener);
    // 获取倾听者信息，跳转拨打页
    closeDialog();
    navigation.navigate('ListenCenter');
  };

  const clickToCancel = () => {
    // 由组件处理取消逻辑
    setStatus(StatusCode.CANCEL);

    updateDialogStatus({
      id: queueInfo.dialogId,
      status: 10,
    }).catch(() => {});
  };

  useEffect(() => {
    if (!visible) {
      if (timer.current) clearTimeout(timer.current);
      return;
    }

    setQueueInfo({});
    setHistory([]);
    setStatus(StatusCode.QUEUE);
    fetchHistory();

    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [visible]);

  // ===Status Components===

  // 排队中
  const StatusQueue = () => (
    <>
      <Dialog.Title title="倾诉排队中..." titleStyle={{textAlign: 'center'}} />
      <Text style={{textAlign: 'center'}}>
        排在您前面的还有
        {queueInfo.ranking == undefined ? '--' : queueInfo.ranking}人
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
  );

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
      console.log('取消连接组件');
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
