import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import {Button, Dialog, Icon, Image, Text, makeStyles} from '@rneui/themed';

/**
 * 自定义弹出层
 * @param {*} param0
 * @returns
 */
const MyPopup = ({
  isVisible,
  overlayStyle,
  containerStyle,
  children,
  ...props
}) => {
  const styles = useStyles();

  return (
    <Dialog
      isVisible={isVisible}
      onBackdropPress={() => {}}
      overlayStyle={{...styles.wrap, ...overlayStyle}}
      {...props}
    >
      <LinearGradient
        style={{...styles.container, ...containerStyle}}
        colors={['#E7EEFA', '#D1E1FF']}
      >
        {children}
      </LinearGradient>
    </Dialog>
  );
};

MyPopup.CloseIcon = ({style, onPress, ...props}) => {
  return (
    <Icon
      containerStyle={{
        position: 'absolute',
        right: 15,
        top: 15,
        zIndex: 10,
        opacity: 0.4,
        ...style,
      }}
      name="close"
      type="antdesign"
      onPress={onPress}
      {...props}
    />
  );
};

MyPopup.FaceImage = ({source}) => {
  return (
    <>
      <View
        style={{
          position: 'absolute',
          top: -56,
          left: 0,
          right: 0,
          flexDirection: 'row',
          justifyContent: 'center',
        }}
      >
        <Image
          style={{width: 109, height: 113}}
          source={source || require('@assets/image/icon_sun.png')}
        />
      </View>
      {/* 下边距 15 */}
      <View style={{height: 30 + 15}}></View>
    </>
  );
};

MyPopup.Actions = ({style, children}) => {
  return (
    <View
      style={{
        position: 'absolute',
        bottom: -25,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        ...style,
      }}
    >
      {children}
    </View>
  );
};

MyPopup.Button = ({buttonStyle, children, ...props}) => {
  return (
    <Button
      raised
      buttonStyle={{
        paddingHorizontal: 35,
        minWidth: 140,
        height: 50,
        fontSize: 15,
        ...buttonStyle,
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

export default MyPopup;

const useStyles = makeStyles((theme) => ({
  wrap: {
    position: 'relative',
    padding: 0,
    width: 400,
    borderRadius: 20,
  },
  container: {
    paddingHorizontal: 20,
    paddingVertical: 25,
    paddingBottom: 35,
    borderRadius: 20,
    alignItems: 'center',
  },
}));
