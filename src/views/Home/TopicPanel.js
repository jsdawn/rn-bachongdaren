import React, {useEffect, useState} from 'react';
import {observer} from 'mobx-react';
import {
  TouchableOpacity,
  View,
  BackHandler,
  ImageBackground,
} from 'react-native';
import {TagCloud} from 'react-tagcloud/rn';

import TopicLinkDialog from './components/TopicLinkDialog';
import UserLoginDialog from './components/UserLoginDialog';
import MessageBox from '@components/MessageBox';
import MsgToast from '@components/MsgToast';
import {useNavigation} from '@react-navigation/native';
import {Button, makeStyles, Text, Image, useTheme} from '@rneui/themed';

import {requestPermissions} from '@utils/permissions';
import {listTopic, userLogout} from '@api/index';
import {appStore} from '@store/appStore';
import {userStore} from '@store/userStore';

const TopicPanel = () => {
  const styles = useStyles();
  const {theme} = useTheme();
  const navigation = useNavigation();

  const [isPermisOK, setIsPermisOK] = useState(false);
  const [visible, setVisible] = useState(false);
  const [linkVisible, setLinkVisible] = useState(false);
  const [pageNum, setPageNum] = useState(1);
  const [pageSize] = useState(10);
  const [dataList, setDataList] = useState([]); // [{value,count}, ...]
  const [topic, setTopic] = useState({}); // 当前话题

  const changeTopics = () => {
    getList();
  };

  const logout = () => {
    MessageBox.show({
      title: '系统提示',
      message: '确定退出登陆吗？',
      onConfirm(done) {
        userLogout().catch(() => {}); // logout api
        // keep token
        setTimeout(() => {
          appStore.setUserToken('');
          userStore.clearUser();
          done();
        }, 0);
      },
    });
  };

  const openHelper = () => {
    MessageBox.show({
      title: '使用帮助',
      message: '这里是帮助指南',
    });
  };

  const clickItem = item => {
    if (!userStore.isUsered) {
      MessageBox.show({
        title: '操作提示',
        message: '请先点击右下角按钮登陆账号',
        showCancelButton: false,
        confirmButtonText: '好的',
      });
      return;
    }

    if (!isPermisOK) {
      MessageBox.show({
        title: '权限提示',
        message: '系统权限不足，请检查应用权限列表',
        showCancelButton: false,
        confirmButtonText: '好的',
      });
      return;
    }

    setTopic(item);
    setLinkVisible(true);
  };

  const getList = () => {
    listTopic({pageNum, pageSize}).then(res => {
      if (!res || !res.rows) return;
      setDataList(
        res.rows.map(v => ({...v, value: v.name, count: v.fontSize})),
      );
      // update page num
      if (res.rows.length < pageSize || pageNum * pageSize == res.total) {
        setPageNum(1);
        return;
      }
      setPageNum(pre => pre + 1);
    });
  };

  useEffect(() => {
    // 禁用系统返回键
    BackHandler.addEventListener('hardwareBackPress', () => true);

    getList();

    requestPermissions()
      .then(() => {
        setIsPermisOK(true);
      })
      .catch(() => {});
  }, []);

  // tag item render, size by count[min,max]
  const ItemRenderer = (tag, size, color) => (
    <View key={tag.value} style={styles.tagItemWrap}>
      <TouchableOpacity style={styles.tagItem} onPress={() => clickItem(tag)}>
        <Text style={{...styles.tagText, fontSize: size}}>{tag.value}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.bgImage}
        source={require('@assets/image/topic_bg.jpg')}
        resizeMode="stretch">
        <View style={styles.topicWrap}>
          <TagCloud
            minSize={8}
            maxSize={20}
            tags={dataList}
            renderer={ItemRenderer}
          />
        </View>

        <View style={styles.logoWrap}>
          <View style={styles.logoWrap_text}>
            <Text style={styles.logoText}>设备编号：6883974989</Text>
            <Text style={styles.logoText}>广州市格米中学</Text>
          </View>
          <Image
            style={styles.logo}
            source={require('@assets/image/logo_sm.png')}
          />
        </View>

        <View style={styles.loginWrap}>
          <Text style={styles.loginText}>点击登录</Text>
        </View>

        {/* ==弹窗== */}
        <UserLoginDialog
          visible={visible}
          setVisible={setVisible}
          onSuccess={data => {
            MsgToast.show({
              text1: '登陆成功',
              text2: `接下来请根据自己心情，在屏幕上选择你想倾听的话题！`,
            });
          }}
        />

        <TopicLinkDialog
          visible={linkVisible}
          setVisible={setLinkVisible}
          linkTopic={topic}
          onSuccess={() => {
            navigation.navigate('ListenCenter');
          }}
        />
      </ImageBackground>
    </View>
  );
};

export default observer(TopicPanel);

const useStyles = makeStyles(theme => ({
  container: {
    position: 'relative',
    flex: 1,
    backgroundColor: '#fff',
  },
  bgImage: {
    flex: 1,
  },

  logoWrap: {
    position: 'absolute',
    bottom: 35,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoWrap_text: {
    paddingRight: 20,
    marginRight: 20,
    alignItems: 'flex-end',
    borderRightWidth: 1,
    borderRightColor: theme.colors.grey2,
    opacity: 0.4,
  },
  logoText: {
    fontSize: 24,
    color: theme.colors.grey2,
  },
  logo: {
    width: 130,
    height: 45,
  },

  loginWrap: {
    padding: 20,
    position: 'absolute',
    bottom: 20,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.grey3,
    borderRadius: 100,
  },
  loginText: {
    fontSize: 24,
    color: '#fff',
  },

  header: {
    padding: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  hdButton: {
    padding: 0,
    width: 180,
    height: 55,
    borderRadius: 55,
  },

  topicWrap: {
    paddingHorizontal: 200,
    paddingBottom: 25,
    flex: 1,
    justifyContent: 'center',
  },
  tagItemWrap: {
    margin: 10,
    elevation: 2,
    borderRadius: 50,
    backgroundColor: '#f6f6f7',
  },
  tagItem: {
    paddingHorizontal: 25,
    paddingVertical: 8,
    borderColor: theme.colors.primary,
    borderWidth: 1,
    borderRadius: 50,
    backgroundColor: '#fff',
    opacity: 0.65,
  },
  tagText: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
}));
