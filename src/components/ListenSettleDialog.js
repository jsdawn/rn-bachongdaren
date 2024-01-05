import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';

import {Button, Text} from '@rneui/themed';
import MyPopup from './MyPopup';

const ListenSettleDialog = ({
  visible,
  setVisible,
  onRelink,
  onSwitch,
  onCountdown,
}) => {
  const [autoNum, setAutoNum] = useState(10);
  const timerNum = useRef(null);

  const autoLogOut = () => {
    clearTimer();
    timerNum.current = setInterval(() => {
      setAutoNum((pre) => pre - 1);
    }, 1000);
  };

  const clearTimer = () => {
    if (timerNum.current) clearInterval(timerNum.current);
  };

  useEffect(() => {
    if (!visible) {
      clearTimer();
      return;
    }
    setAutoNum(10);
    autoLogOut();

    return () => clearTimer();
  }, [visible]);

  useEffect(() => {
    if (autoNum == 0) {
      setVisible(false);
      onCountdown?.();
    }
  }, [autoNum]);

  return (
    <MyPopup isVisible={visible}>
      <Text h2 style={{opacity: 0.8, marginBottom: 20}}>
        还有未说完的话...
      </Text>

      <Button buttonStyle={styles.btn} onPress={onRelink}>
        重新连线麦当劳叔叔
      </Button>

      <Button buttonStyle={styles.btn} onPress={onSwitch}>
        换一个人倾诉
      </Button>

      <Text style={{fontWeight: 'bold', marginTop: 10}}>
        {autoNum}秒后为你自动退出登录
      </Text>
    </MyPopup>
  );
};

export default ListenSettleDialog;

const styles = StyleSheet.create({
  btn: {
    marginBottom: 15,
    width: 260,
    height: 50,
  },
});
