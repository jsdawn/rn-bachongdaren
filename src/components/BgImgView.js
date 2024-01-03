import React from 'react';
import {ImageBackground, StyleSheet, View} from 'react-native';

const BgImgView = ({
  source,
  width,
  height,
  center = false,
  style,
  children,
}) => {
  const centerStyle = center
    ? {justifyContent: 'center', alignItems: 'center'}
    : {};

  return source ? (
    <ImageBackground
      source={source}
      resizeMode="stretch"
      style={{width, aspectRatio: width / height, ...centerStyle, ...style}}>
      {children}
    </ImageBackground>
  ) : (
    <View
      style={{width, aspectRatio: width / height, ...centerStyle, ...style}}>
      {children}
    </View>
  );
};

export default BgImgView;

const styles = StyleSheet.create({});
