import React from 'react';
import {useForm} from 'react-hook-form';
import {StyleSheet, View} from 'react-native';

import {InputController} from '@components/FormController';
import {Dialog, Button} from '@rneui/themed';

import {sleep} from '@utils/index';

const UserSignInForm = ({onSuccess, onCancel}) => {
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

  const onSubmit = async data => {
    console.log(data);
    await sleep(1000);
    reset();
    onSuccess?.(data);
  };

  return (
    <>
      <Dialog.Title title="注册新账号" titleStyle={{textAlign: 'center'}} />

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
          onPress={handleSubmit(onSubmit)}>
          注册
        </Button>
        <Button
          buttonStyle={styles.btn}
          titleStyle={{color: '#666'}}
          size="lg"
          radius={25}
          type="outline"
          onPress={() => {
            reset();
            onCancel?.();
          }}>
          取消
        </Button>
      </View>
    </>
  );
};

export default UserSignInForm;

const styles = StyleSheet.create({
  actions: {},
  btn: {
    marginTop: 10,
    borderColor: '#999',
  },
});
