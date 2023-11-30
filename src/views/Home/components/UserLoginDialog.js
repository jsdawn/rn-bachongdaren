import {Text, View} from 'react-native';
import React from 'react';
import {Dialog, makeStyles, Button} from '@rneui/themed';
import {useForm} from 'react-hook-form';
import {observer} from 'mobx-react';
import {useUserStore} from '@store/userStore';
import MsgToast from '@components/MsgToast';

import {InputController} from '@components/FormController';

const UserLoginDialog = observer(({visible, setVisible, onSuccess}) => {
  const styles = useStyles();
  const {updateUser} = useUserStore();

  const {
    control,
    handleSubmit,
    reset,
    formState: {errors, isSubmitting},
  } = useForm({
    defaultValues: {
      account: '',
      password: '',
    },
    resetOptions: {
      keepDirtyValues: false,
    },
  });

  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

  const onSubmit = async data => {
    console.log(data);
    await sleep(1000);
    updateUser({
      account: data.account,
      nickName: data.account,
    });
    reset();
    setVisible(false);
    onSuccess?.(data);
  };
  const onError = errors => {
    console.log(errors);
    MsgToast.show({
      type: 'error',
      text1: '系统提示',
      text2: JSON.stringify(errors),
    });
  };

  return (
    <>
      <Dialog
        isVisible={visible}
        onBackdropPress={() => setVisible(!visible)}
        overlayStyle={styles.container}>
        <Dialog.Title title="请先登陆账号" titleStyle={{textAlign: 'center'}} />
        <View>
          <InputController
            control={control}
            errors={errors}
            rules={{
              required: '请输入您的账号',
              minLength: {value: 6, message: '最少输入6位数'},
            }}
            name="account"
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
              onPress={handleSubmit(onSubmit, onError)}>
              登陆
            </Button>
            <Button
              buttonStyle={styles.btn}
              titleStyle={{color: '#666'}}
              size="lg"
              radius={25}
              type="outline"
              onPress={() => {}}>
              注册
            </Button>
          </View>
        </View>
        {visible ? <MsgToast /> : null}
      </Dialog>
    </>
  );
});

export default UserLoginDialog;

const useStyles = makeStyles(theme => ({
  container: {
    width: 320,
    borderRadius: 15,
  },
  input: {
    borderBottomWidth: 0,
    backgroundColor: '#ecf7ff',
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  label: {
    marginBottom: 5,
    color: theme.colors.primary,
  },

  errMsg: {
    color: theme.colors.error,
    textAlign: 'center',
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
