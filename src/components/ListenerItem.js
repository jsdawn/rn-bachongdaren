import React from 'react';
import {Text, TouchableOpacity, View, Image} from 'react-native';

import {makeStyles} from '@rneui/themed';
import BgImgView from './BgImgView';
import MyAvatar from './MyAvatar';

const ListenerItem = ({item, size, showStatus = true, onPress}) => {
  const styles = useStyles();

  const statusIcons = [
    require('@assets/image/ls_status_off.png'),
    require('@assets/image/ls_status_on.png'),
    require('@assets/image/ls_status_ing.png'),
  ];

  return (
    <TouchableOpacity
      key={item.teacherId}
      disabled={item.status != 1}
      onPress={onPress}
    >
      <View style={size == 'lg' ? styles.itemLg : styles.item}>
        <BgImgView
          source={require('@assets/image/ls_item_bg.png')}
          style={styles.bg}
        ></BgImgView>

        <MyAvatar avatar={item.avatar} style={styles.avatar}>
          {showStatus && (
            <Image
              source={statusIcons[item.status]}
              resizeMode="cover"
              style={styles.statusIcon}
            ></Image>
          )}
        </MyAvatar>

        <Text style={size == 'lg' ? styles.itemTextLg : null}>
          {item.nickname}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default ListenerItem;

const itemBgWidth = 189;
const itemWidth = itemBgWidth - 14.5 * 2; // 160
const useStyles = makeStyles((theme) => ({
  item: {
    position: 'relative',
    margin: 8,
    paddingTop: 75,
    width: itemWidth,
    height: 115,
    alignItems: 'center',
    borderRadius: 12,
  },
  bg: {
    position: 'absolute',
    bottom: -14.5,
    left: -14.5,
    width: itemBgWidth,
    aspectRatio: 189 / 130,
  },
  avatar: {
    position: 'absolute',
    top: -5,
    left: 160 / 2 - 74 / 2,
  },
  statusIcon: {
    position: 'absolute',
    bottom: 0,
    left: 74 / 2 - 18,
    width: 36,
    height: 17,
    zIndex: 1,
  },

  itemLg: {
    position: 'relative',
    margin: 8,
    padding: 20,
    width: 300,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 24,
  },
  itemTextLg: {
    fontSize: 24,
  },
}));
