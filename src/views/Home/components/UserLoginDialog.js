import React, {useState} from 'react';
import {observer} from 'mobx-react';
import {useForm} from 'react-hook-form';
import {ToastAndroid, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import {InputController} from '@components/FormController';
import MsgToast from '@components/MsgToast';
import {Dialog, makeStyles, Button, Icon, Text} from '@rneui/themed';
import UserSignInForm from './UserSignInForm';

import {getUserInfo, userLogin} from '@api/index';
import {appStore} from '@store/appStore';
import {userStore} from '@store/userStore';

const UserLoginDialog = observer(({visible, setVisible, onSuccess}) => {
  const styles = useStyles();
  const [active, setActive] = useState('login'); // login/signIn

  const {
    control,
    handleSubmit,
    reset,
    formState: {errors, isSubmitting},
  } = useForm({
    defaultValues: {
      username: 'qt001',
      password: '123456',
    },
    resetOptions: {
      keepDirtyValues: false,
    },
  });

  const onSubmit = async data => {
    const res = await userLogin(data).catch(() => {});
    if (!res) return;
    appStore.setUserToken(res.token);

    const res2 = await getUserInfo().catch(() => {});
    if (!res2) return;
    userStore.updateUser({
      ...res2.data,
    });
    reset();
    setVisible(false);
    onSuccess?.(data);
  };

  const onError = err => {
    let msg = '';
    Object.keys(err).forEach(k => {
      if (err[k] && err[k].message && !msg) {
        msg = err[k].message;
      }
    });
    if (msg) {
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    }
  };

  return (
    <Dialog
      isVisible={visible}
      onBackdropPress={() => {}}
      overlayStyle={styles.wrap}>
      <LinearGradient style={styles.container} colors={['#E7EEFA', '#D1E1FF']}>
        <Icon
          containerStyle={styles.icon}
          name="close"
          type="antdesign"
          onPress={() => setVisible(false)}
        />

        <Text h2 style={styles.title}>
          密码登录
        </Text>

        <InputController
          control={control}
          errors={errors}
          rules={{
            required: '请输入您的账号',
          }}
          name="username"
          placeholder="请输入账号"
        />

        <InputController
          control={control}
          errors={errors}
          rules={{required: '请输入您的密码'}}
          name="password"
          placeholder="请输入密码"
        />

        <View style={styles.actions}>
          <Button
            buttonStyle={styles.btn}
            size="lg"
            radius={25}
            loading={isSubmitting}
            onPress={handleSubmit(onSubmit, onError)}>
            登陆
          </Button>
        </View>

        {visible ? <MsgToast /> : null}
      </LinearGradient>
    </Dialog>
  );
});

export default UserLoginDialog;

const useStyles = makeStyles(theme => ({
  wrap: {
    padding: 0,
    width: 400,
    borderRadius: 20,
  },
  container: {
    padding: 20,
    paddingHorizontal: 70,
    borderRadius: 20,
    alignItems: 'center',
  },
  icon: {
    position: 'absolute',
    right: 15,
    top: 15,
    zIndex: 10,
    opacity: 0.4,
  },
  title: {
    marginBottom: 15,
  },

  actions: {
    width: 260,
  },
  btn: {
    borderColor: '#999',
  },
}));
