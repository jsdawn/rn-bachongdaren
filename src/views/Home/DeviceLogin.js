import React, {useEffect, useState} from 'react';
import {observer} from 'mobx-react';
import {useForm} from 'react-hook-form';
import {View, ImageBackground} from 'react-native';

import {InputController} from '@components/FormController';
import {useNavigation} from '@react-navigation/native';
import {Button, makeStyles} from '@rneui/themed';

import {authDevice, register} from '@api/index';
import {appStore} from '@store/appStore';

const DeviceLogin = () => {
  const styles = useStyles();
  const navigation = useNavigation();

  const {
    control,
    handleSubmit,
    setValue,
    formState: {errors, isSubmitting},
  } = useForm({
    defaultValues: {
      uuid: '',
      code: '',
    },
    resetOptions: {
      keepDirtyValues: false,
    },
  });

  const onSubmit = async (data) => {
    const res = await register(data).catch(() => {});
    if (!res || !res.data) return;
    appStore.setMachineToken(res.data?.machine_token);

    const res2 = await authDevice({
      uuid: data.uuid,
      timestamp: new Date().getTime(),
    }).catch(() => {});
    if (!res2 || !res2.data) return;
    if (res2.data.machine?.status == 1) {
      navigation.navigate('TopicPanel');
    }
  };

  useEffect(() => {
    setValue('uuid', appStore.uuid);
  }, []);

  return (
    <ImageBackground
      style={{flex: 1}}
      source={require('@assets/image/start_bg.png')}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <InputController
          control={control}
          errors={errors}
          rules={{required: '正在获取设备ID'}}
          name="uuid"
          placeholder="获取设备ID"
          disabled
        />

        <InputController
          control={control}
          errors={errors}
          rules={{required: '请输入设备注册码'}}
          name="code"
          placeholder="请输入设备注册码"
        />

        <View style={styles.actions}>
          <Button
            buttonStyle={styles.submitBtn}
            size="lg"
            raised
            color="success"
            loading={isSubmitting}
            onPress={handleSubmit(onSubmit)}
          >
            设备登录
          </Button>
        </View>
      </View>
    </ImageBackground>
  );
};

export default observer(DeviceLogin);

const useStyles = makeStyles((theme) => ({
  container: {
    padding: 50,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  actions: {
    marginTop: 15,
    width: 260,
  },
}));
