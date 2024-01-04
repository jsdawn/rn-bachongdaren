import React, {useState} from 'react';
import {observer} from 'mobx-react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';

import {useNavigation, useRoute} from '@react-navigation/native';
import {Text} from '@rneui/themed';
import MessageBox from './MessageBox';
import MsgToast from './MsgToast';
import UserLoginDialog from './UserLoginDialog';

import {userLogout} from '@api/index';
import {appStore} from '@store/appStore';
import {userStore} from '@store/userStore';

const LoginUser = ({showLogout = true}) => {
  const navigation = useNavigation();
  const route = useRoute();
  const [visible, setVisible] = useState(false);

  const logout = () => {
    MessageBox.show({
      title: '',
      message: '确定退出登录吗？',
      onConfirm(done) {
        userLogout().catch(() => {}); // logout api
        // keep token
        setTimeout(() => {
          appStore.setUserToken('');
          userStore.clearUser();
          done();
          if (route.name != 'TopicPanel') {
            navigation.navigate('TopicPanel');
          }
        }, 0);
      },
    });
  };

  return (
    <>
      {userStore.isUsered ? (
        <View style={styles.loginWrap}>
          <Text style={styles.loginText}>
            欢迎您，{userStore.user?.nickName}
          </Text>
          {showLogout && (
            <TouchableOpacity style={styles.logoutBtn} onPress={() => logout()}>
              <Text style={styles.logoutText}>退出登录</Text>
            </TouchableOpacity>
          )}
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
          setTimeout(() => {
            MessageBox.show({
              title: '',
              message: '登录成功',
              desc: '接下来请根据自己心情，在屏幕上选择你想倾听的话题！',
              showCancelButton: false,
              confirmButtonText: '好的',
            });
          }, 0);
        }}
      />
    </>
  );
};

export default observer(LoginUser);

const styles = StyleSheet.create({
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
});
