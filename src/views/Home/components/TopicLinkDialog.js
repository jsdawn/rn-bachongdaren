import React, {useEffect, useState} from 'react';
import {Text, View} from 'react-native';

import {Dialog, makeStyles, Button} from '@rneui/themed';

import {sleep} from '@utils/index';

const StatusCode = {
  QUEUE: 0,
  HISTORY: 1,
  LINKING: 2,
  CANCEL: -1,
};

const TopicLinkDialog = ({visible, setVisible}) => {
  const styles = useStyles();
  const [status, setStatus] = useState(StatusCode.QUEUE);
  const [queueInfo, setQueueInfo] = useState({});

  const fetchQueueStatus = () => {
    sleep(1000).then(() => {
      setQueueInfo({
        count: 88,
      });

      setStatus(StatusCode.HISTORY);
    });
  };

  const fetchLinkAndCall = () => {
    setStatus(StatusCode.LINKING);
    sleep(2000).then(() => {
      // 获取倾听者信息，跳转拨打页
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

  const StatusHistory = () => (
    <>
      <Dialog.Title title="这是最近为您倾听的老师，可点击连线他们：" />
      <View style={{alignItems: 'center'}}>
        <Text style={styles.linkItem} onPress={() => fetchLinkAndCall()}>
          麦当劳叔叔
        </Text>
        <Text style={styles.linkItem} onPress={() => fetchLinkAndCall()}>
          肯德基阿姨
        </Text>
        <Text style={styles.linkItem} onPress={() => fetchLinkAndCall()}>
          必胜客小哥
        </Text>
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

  const StatusCancel = () => {
    let timer = null;
    const [time, setTime] = useState(10);

    useEffect(() => {
      runTime();
      return () => {
        if (timer) clearInterval(timer);
      };
    }, []);

    const runTime = () => {
      timer = setInterval(() => {
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
            onPress={clickToCancel}>
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

  linkItem: {
    paddingVertical: 5,
    fontSize: 15,
  },
}));
