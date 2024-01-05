import React, {useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';

import {Button, Text} from '@rneui/themed';
import MyPopup from './MyPopup';

const ListenSettleDialog = ({visible, setVisible}) => {
  const [autoNum, setAutoNum] = useState(10);
  const timerNum = useRef(null);

  const autoLogOut = () => {
    if (timerNum.current) clearInterval(timerNum.current);
    // 登出读条
    setAutoNum(10);
    timerNum.current = setInterval(() => {
      setAutoNum((pre) => pre - 1);
    }, 1000);
  };

  return (
    <MyPopup isVisible={visible}>
      <MyPopup.CloseIcon onPress={() => setVisible(false)} />

      <Text h2 style={{opacity: 0.8, marginBottom: 20}}>
        还有未说完的话...
      </Text>

      <Button buttonStyle={styles.btn}>重新连线麦当劳叔叔</Button>

      <Button buttonStyle={styles.btn}>换一个人倾诉</Button>

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
