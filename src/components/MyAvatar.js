import React from 'react';
import {Image, StyleSheet} from 'react-native';

import BgImgView from './BgImgView';

const MyAvatar = ({avatar, large, style, children}) => {
  return (
    <BgImgView
      source={
        avatar
          ? require('@assets/image/ls_avatar.png')
          : require('@assets/image/ls_avatar_default.png')
      }
      style={{...(large ? styles.bgImgLg : styles.bgImg), ...style}}
    >
      {avatar && (
        <Image
          source={avatar}
          resizeMode="cover"
          style={large ? styles.imgLg : styles.img}
        ></Image>
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
    aspectRatio: 1,
    borderRadius: 35,
  },

  bgImgLg: {
    width: 118,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imgLg: {
    width: 95,
    height: 95,
    borderRadius: 50,
  },
});
