import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {Chip, makeStyles} from '@rneui/themed';

const ListenerItem = ({item, size, showStatus = true, onPress}) => {
  const styles = useStyles();

  return (
    <TouchableOpacity
      style={size == 'lg' ? styles.itemLg : styles.item}
      key={item.teacherId}
      disabled={item.status != 1}
      onPress={onPress}>
      <Text style={size == 'lg' ? styles.itemTextLg : null}>
        {item.nickname}
      </Text>
      {showStatus && (
        <Chip
          title={item.status == 1 ? '在线' : item.status == 2 ? '忙碌' : '离线'}
          disabled={item.status != 1}
          size="sm"
        />
      )}
    </TouchableOpacity>
  );
};

export default ListenerItem;

const useStyles = makeStyles(theme => ({
  item: {
    margin: 8,
    paddingVertical: 5,
    width: 150,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 12,
  },
  itemLg: {
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
