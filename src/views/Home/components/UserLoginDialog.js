import React, {useState} from 'react';
import {observer} from 'mobx-react';
import {useForm} from 'react-hook-form';
import {Text, View} from 'react-native';

import {InputController} from '@components/FormController';
import MsgToast from '@components/MsgToast';
import {Dialog, makeStyles, Button, Icon} from '@rneui/themed';
import UserSignInForm from './UserSignInForm';

import {userLogin} from '@api/index';
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
    userStore.updateUser({
      ...data,
      nickName: data.username,
    });
    reset();
    setVisible(false);
    onSuccess?.(data);
  };

  return (
    <Dialog
      isVisible={visible}
      onBackdropPress={() => {}}
      overlayStyle={styles.container}>
      <Icon
        containerStyle={styles.icon}
        name="close"
        type="antdesign"
        color="#999"
        onPress={() => setVisible(false)}
      />

      {active == 'signIn' ? (
        <UserSignInForm onCancel={() => setActive('login')} />
      ) : (
        <>
          <Dialog.Title
            title="请先登陆账号"
            titleStyle={{textAlign: 'center'}}
          />

          <InputController
            control={control}
            errors={errors}
            rules={{
              required: '请输入您的账号',
            }}
            name="username"
            label="账号"
            placeholder="请输入账号"
          />

          <InputController
            control={control}
            errors={errors}
            rules={{required: '请输入您的密码'}}
            name="password"
            label="密码"
            placeholder="请输入密码"
          />

          <View style={styles.actions}>
            <Button
              buttonStyle={styles.btn}
              size="lg"
              radius={25}
              loading={isSubmitting}
              onPress={handleSubmit(onSubmit)}>
              登陆
            </Button>
            <Button
              buttonStyle={styles.btn}
              titleStyle={{color: '#666'}}
              size="lg"
              radius={25}
              type="outline"
              onPress={() => {
                reset();
                setVisible(false);
              }}>
              取消
            </Button>
            {/* <Button
              buttonStyle={styles.btn}
              titleStyle={{color: '#666'}}
              size="lg"
              radius={25}
              type="outline"
              onPress={() => {
                setActive('signIn');
              }}>
              注册
            </Button> */}
          </View>
        </>
      )}

      {visible ? <MsgToast /> : null}
    </Dialog>
  );
});

export default UserLoginDialog;

const useStyles = makeStyles(theme => ({
  container: {
    width: 320,
    borderRadius: 15,
  },
  icon: {
    position: 'absolute',
    right: 15,
    top: 15,
    zIndex: 10,
  },

  actions: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  btn: {
    width: 120,
    borderColor: '#999',
  },
}));
