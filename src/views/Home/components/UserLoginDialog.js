import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {Dialog, makeStyles, Input, Button} from '@rneui/themed';
import {useForm, Controller} from 'react-hook-form';

const UserLoginDialog = ({visible, setVisible}) => {
  const styles = useStyles();

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      account: '',
      password: '',
    },
  });

  const onSubmit = data => {
    console.log(data);
  };
  const onError = errors => {
    console.log(errors);
  };

  const InputController = ({rules, name, label, placeholder}) => (
    <Controller
      control={control}
      rules={rules}
      name={name}
      render={({field: {value, onChange}}) => (
        <Input
          value={value}
          onChangeText={onChange}
          label={label}
          labelStyle={styles.label}
          inputContainerStyle={styles.input}
          placeholder={placeholder}
          errorMessage={errors[name]?.message}
        />
      )}
    />
  );

  return (
    <Dialog
      isVisible={visible}
      onBackdropPress={() => setVisible(!visible)}
      overlayStyle={styles.container}>
      <Dialog.Title title="请先登陆账号" titleStyle={{textAlign: 'center'}} />
      <View>
        <InputController
          label="账号"
          name="account"
          rules={{
            required: '请输入您的账号',
            minLength: {value: 6, message: '最少输入6位数'},
          }}
          placeholder="请输入账号"
        />

        {/* <Controller
          control={control}
          rules={{
            required: '请输入您的账号',
            minLength: {value: 6, message: '最少输入6位数'},
          }}
          name="account"
          render={({field: {value, onChange}}) => (
            <Input
              value={value}
              onChangeText={onChange}
              label="账号"
              labelStyle={styles.label}
              inputContainerStyle={styles.input}
              placeholder="请输入账号"
              errorMessage={errors.account?.message}
            />
          )}
        /> */}

        <Controller
          control={control}
          rules={{required: '请输入您的密码'}}
          name="password"
          render={({field: {value, onChange}}) => (
            <Input
              value={value}
              onChangeText={onChange}
              label="密码"
              labelStyle={styles.label}
              inputContainerStyle={styles.input}
              secureTextEntry={true}
              placeholder="请输入密码"
              errorMessage={errors.password?.message}
            />
          )}
        />

        <View style={styles.actions}>
          <Button
            buttonStyle={styles.btn}
            size="lg"
            radius={25}
            onPress={handleSubmit(onSubmit, onError)}>
            登陆
          </Button>
          <Button
            buttonStyle={styles.btn}
            titleStyle={{color: '#666'}}
            size="lg"
            radius={25}
            type="outline">
            注册
          </Button>
        </View>
      </View>
    </Dialog>
  );
};

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
