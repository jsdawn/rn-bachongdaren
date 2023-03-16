import {StyleSheet, Text, View, Button} from 'react-native';
import React from 'react';
import {NativeModules} from 'react-native';

const My = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>旅行者，你将去往何方～</Text>
      <Button
        title="提示语"
        onPress={() => {
          NativeModules.ToastExample.show(
            'Awesome222',
            NativeModules.ToastExample.SHORT,
          );
        }}
      />
    </View>
  );
};

export default My;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
  },
});
