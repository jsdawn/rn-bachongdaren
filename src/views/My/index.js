import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

const My = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>旅行者，你将去往何方～</Text>
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
