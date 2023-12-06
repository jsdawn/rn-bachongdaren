import React, {useEffect, useRef, useState} from 'react';
import {Text, View} from 'react-native';

import {useNavigation} from '@react-navigation/native';
import {Dialog, makeStyles, Button} from '@rneui/themed';

import {sleep} from '@utils/index';
import {useUserStore} from '@store/userStore';

const StatusCode = {
  QUEUE: 0,
  HISTORY: 1,
  LINKING: 2,
  CANCEL: -1,
};

const TopicLinkDialog = ({visible, setVisible}) => {
  const styles = useStyles();
  const navigation = useNavigation();
  const {clearUser} = useUserStore();

  const [status, setStatus] = useState(StatusCode.QUEUE);
  const statusRef = useRef(status);
  statusRef.current = status; // 跟踪status的当前值

  const [queueInfo, setQueueInfo] = useState({});
  const [history, setHistory] = useState([]);

  const closeDialog = isLogout => {
    setStatus(StatusCode.QUEUE);
    setQueueInfo({});
    if (isLogout) {
      clearUser();
    }
    setVisible(false);
  };

  const fetchQueueStatus = () => {
    sleep(2000).then(() => {
      if (statusRef.current != StatusCode.QUEUE) {
        // 判断状态是否已经改变
        return;
      }
      setQueueInfo({
        count: 88,
      });
      // 有倾听历史
      setStatus(StatusCode.HISTORY);
      setHistory([
        {id: 1, name: '麦当劳叔叔', phone: '13533403735'},
        {id: 2, name: '肯德基阿姨', phone: '13533403735'},
        {id: 3, name: '必胜客小哥', phone: '13533403735'},
      ]);
    });
  };

  const fetchLinkAndCall = item => {
    setStatus(StatusCode.LINKING);
    sleep(2000).then(() => {
      // 获取倾听者信息，跳转拨打页
      closeDialog();
      navigation.navigate('ListenCenter', {
        ...item,
      });
    });
  };

  const clickToCancel = () => {
    setStatus(StatusCode.CANCEL);
  };

  useEffect(() => {
    if (!visible) {
      setStatus(StatusCode.QUEUE);
      setQueueInfo({});
      return;
    }
    fetchQueueStatus();
  }, [visible]);

  // ===Status Components===

  // 排队中
  const StatusQueue = () => (
    <>
      <Dialog.Title title="倾诉排队中..." titleStyle={{textAlign: 'center'}} />
      <Text style={{textAlign: 'center'}}>
        排在您前面的还有{queueInfo.count || '--'}人
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
    const timer = useRef(null);
    const [time, setTime] = useState(10);

    useEffect(() => {
      runTime();
      return () => {
        if (timer.current) clearInterval(timer.current);
      };
    }, []);

    useEffect(() => {
      // 退出登陆
      if (time == 0) {
        if (timer.current) clearInterval(timer.current);
        closeDialog(true);
      }
    }, [time]);

    const runTime = () => {
      timer.current = setInterval(() => {
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

export default TopicLinkDialog;

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
