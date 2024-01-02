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
import LogoFlag from '@components/LogoFlag';
import MessageBox from '@components/MessageBox';
import MsgToast from '@components/MsgToast';
import {useNavigation} from '@react-navigation/native';
import {Button, makeStyles, Text, useTheme} from '@rneui/themed';

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
    <View key={tag.value} style={{margin: 10}}>
      <TouchableOpacity style={styles.tagItem} onPress={() => clickItem(tag)}>
        <Text style={{...styles.tagText, fontSize: size}}>{tag.value}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ImageBackground
      style={{flex: 1}}
      source={require('@assets/image/topic_bg.jpg')}
      resizeMode="stretch">
      <View style={styles.container}>
        <View style={styles.topicWrap}>
          <TagCloud
            minSize={15}
            maxSize={25}
            tags={dataList}
            renderer={ItemRenderer}
          />
        </View>

        {userStore.isUsered ? (
          <View style={styles.loginWrap}>
            <Text style={styles.loginText}>
              欢迎您，{userStore.user.nickName}
            </Text>
            <TouchableOpacity style={styles.logoutBtn} onPress={() => logout()}>
              <Text style={styles.logoutText}>退出登录</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.loginWrap}
            onPress={() => {
              setVisible(true);
            }}>
            <Text style={styles.loginText}>密码登录</Text>
          </TouchableOpacity>
        )}

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
      </View>

      <LogoFlag />
    </ImageBackground>
  );
};

export default observer(TopicPanel);

const useStyles = makeStyles(theme => ({
  container: {
    flex: 1,
  },

  loginWrap: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    height: 50,
    paddingHorizontal: 25,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 100,
  },
  loginText: {
    fontSize: 15,
    color: '#fff',
    fontWeight: 'bold',
  },
  logoutBtn: {
    marginLeft: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: 90,
    height: 30,
    backgroundColor: 'rgba(244, 253, 242, 0.23)',
    borderRadius: 50,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderWidth: 1,
  },
  logoutText: {
    fontSize: 14,
    color: '#fff',
  },

  topicWrap: {
    paddingHorizontal: 200,
    paddingBottom: 25,
    flex: 1,
    justifyContent: 'center',
  },
  tagItem: {
    borderRadius: 50,
    paddingHorizontal: 25,
    paddingVertical: 8,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  tagText: {
    fontWeight: 'bold',
  },
}));
