import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';

import ListenerItem from '@components/ListenerItem';
import MyPopup from '@components/MyPopup';
import {Button, Icon, Text} from '@rneui/themed';

export const StatusQueue = ({topic, task, onPress}) => (
  <>
    <MyPopup.FaceImage />
    <Text h2 style={styles.title}>
      {topic?.name}
    </Text>
    <View style={styles.subTitle}>
      <Icon iconStyle={styles.icon} name="phone-in-talk" type="materialIcons" />
      <Text h3>
        目前排队中，第
        {task?.ranking == undefined ? '--' : task.ranking}
        位...
      </Text>
    </View>
    <View style={styles.actions}>
      <Button buttonStyle={styles.btn} raised onPress={onPress}>
        我不等了
      </Button>
    </View>
  </>
);

export const StatusHistory = ({items, onClickItem, onPress}) => (
  <>
    <Text h3 style={styles.subTitle}>
      这是最近为您倾听的老师，可点击连线他们
    </Text>
    <View style={styles.historyWrap}>
      {items.map((item) => (
        <ListenerItem
          item={item}
          key={item.teacherId}
          onPress={() => {
            onClickItem?.(item);
          }}
        />
      ))}
    </View>
    <View style={styles.actions}>
      <Button buttonStyle={styles.btn} raised onPress={onPress}>
        我要连线新老师
      </Button>
    </View>
  </>
);

export const StatusLinking = ({topic, onPress}) => (
  <>
    <MyPopup.FaceImage />
    <Text h2 style={styles.title}>
      《{topic?.name}》
    </Text>
    <View style={styles.subTitle}>
      <Icon iconStyle={styles.icon} name="phone-in-talk" type="materialIcons" />
      <Text h3>正在连线倾听者...</Text>
    </View>
    <View style={styles.actions}>
      <Button buttonStyle={styles.btn} raised onPress={onPress}>
        取消连线
      </Button>
    </View>
  </>
);

export const StatusCancel = ({topic, onPress, onFinished}) => {
  const timerOut = useRef(null);
  const [time, setTime] = useState(10);

  useEffect(() => {
    autoRunTime();
    return () => {
      if (timerOut.current) clearInterval(timerOut.current);
    };
  }, []);

  useEffect(() => {
    // 倒计时结束
    if (time == 0) {
      if (timerOut.current) clearInterval(timerOut.current);
      onFinished?.();
    }
  }, [time]);

  const autoRunTime = () => {
    timerOut.current = setInterval(() => {
      setTime((pre) => pre - 1);
    }, 1000);
  };

  return (
    <>
      <MyPopup.FaceImage />
      <Text h2 style={styles.title}>
        {topic?.name}
      </Text>
      <View style={styles.subTitle}>
        <Icon
          iconStyle={styles.icon}
          name="closecircle"
          type="antdesign"
          color="#FF7B7B"
        />
        <Text h3>已取消连线，{time}秒后为你自动退出登录...</Text>
      </View>
      <View style={styles.actions}>
        <Button buttonStyle={styles.btn} raised onPress={onPress}>
          先不退出
        </Button>
      </View>
    </>
  );
};

const TopicLinkStatus = () => {
  return (
    <View>
      <Text>TopicLinkStatus</Text>
    </View>
  );
};
export default TopicLinkStatus;

const styles = StyleSheet.create({
  title: {
    marginTop: -10,
    marginBottom: 20,
    fontSize: 21,
    opacity: 0.7,
  },
  subTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    opacity: 0.9,
  },
  icon: {
    fontSize: 20,
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
    position: 'relative',
    width: 160 * 2 + 8 * 4,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
