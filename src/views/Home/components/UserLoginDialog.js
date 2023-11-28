import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {Dialog, makeStyles, Input, Button} from '@rneui/themed';

const UserLoginDialog = ({visible, setVisible}) => {
  const styles = useStyles();

  const [form, setForm] = useState({});
  const changeForm = obj => {
    setForm({...form, ...obj});
  };

  const [msg, setMsg] = useState({});
  const changeMsg = obj => {
    setMsg({...msg, ...obj});
  };

  const validForm = () => {
    Object.keys(form).forEach(key => {});
  };

  const submitForm = () => {};

  return (
    <Dialog
      isVisible={visible}
      onBackdropPress={() => setVisible(!visible)}
      overlayStyle={styles.container}>
      <Dialog.Title title="请先登陆账号" titleStyle={{textAlign: 'center'}} />
      <View>
        <Input
          value={form.account}
          onChangeText={account => changeForm({account})}
          label="账号"
          labelStyle={styles.label}
          inputContainerStyle={styles.input}
          placeholder="请输入账号"
          errorMessage={msg.account}
        />
        <Input
          value={form.password}
          onChangeText={password => changeForm({password})}
          label="密码"
          labelStyle={styles.label}
          inputContainerStyle={styles.input}
          secureTextEntry={true}
          placeholder="请输入密码"
          errorMessage={msg.password}
        />

        <View style={styles.actions}>
          <Button
            buttonStyle={styles.btn}
            size="lg"
            radius={25}
            onPress={submitForm}>
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

  actions: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  btn: {
    width: 120,
    borderColor: '#999',
  },
}));
