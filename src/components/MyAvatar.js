import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';

import BgImgView from './BgImgView';

const MyAvatar = ({avatar, style, children}) => {
  return (
    <BgImgView
      source={
        avatar
          ? require('@assets/image/ls_avatar.png')
          : require('@assets/image/ls_avatar_default.png')
      }
      style={{...styles.bgImg, ...style}}
    >
      {avatar && (
        <Image source={avatar} resizeMode="cover" style={styles.img}></Image>
      )}

      {children}
    </BgImgView>
  );
};

export default MyAvatar;

const styles = StyleSheet.create({
  bgImg: {
    width: 74,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  img: {
    width: 60,
    height: 60,
    borderRadius: 35,
  },
});
