import React from 'react';
import {useForm} from 'react-hook-form';
import {Text, Image, View, ImageBackground} from 'react-native';

import {InputController} from '@components/FormController';
import {Button, makeStyles} from '@rneui/themed';

import {sleep} from '@utils/index';

const DeviceLogin = () => {
  const styles = useStyles();

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
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.bgImage}
        source={require('../../assets/image/device_bg.png')}
        resizeMode="stretch">
        {/* <Image
          style={styles.logo}
          source={require('../../assets/image/logo_lg.png')}
        /> */}

        <View style={styles.form}>
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
              buttonStyle={styles.submitBtn}
              size="lg"
              radius={10}
              loading={isSubmitting}
              onPress={handleSubmit(onSubmit)}>
              登 陆
            </Button>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

export default DeviceLogin;

const useStyles = makeStyles(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary,
  },
  bgImage: {
    flex: 1,
    alignItems: 'center',
  },
  logo: {
    marginVertical: 80,
    width: 143,
    height: 50,
  },
  form: {
    width: 320,
  },
  actions: {
    marginTop: 20,
  },
  submitBtn: {
    backgroundColor: theme.colors.success,
  },
}));
