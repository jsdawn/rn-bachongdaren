import React from 'react';
import {observer} from 'mobx-react';
import {StyleSheet, View} from 'react-native';

import {Image, Text, makeStyles} from '@rneui/themed';

import {appStore} from '@store/appStore';

const LogoFlag = ({showLogo}) => {
  const styles = useStyles();

  return (
    <View style={styles.logoWrap}>
      <View style={styles.logoWrap_text}>
        <Text style={styles.logoText}>设备编号：{appStore.uuid}</Text>
        <Text style={styles.logoText}>广州市格米中学</Text>
      </View>

      {showLogo === false ? null : (
        <>
          <View style={styles.line}></View>
          <Image
            style={styles.logo}
            source={require('@assets/image/logo_sm.png')}
          />
        </>
      )}
    </View>
  );
};

export default observer(LogoFlag);

const useStyles = makeStyles(theme => ({
  logoWrap: {
    position: 'absolute',
    bottom: 18,
    right: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoWrap_text: {
    alignItems: 'flex-end',
    opacity: 0.4,
  },
  logoText: {
    fontSize: 12,
  },
  line: {
    marginHorizontal: 10,
    width: 1,
    height: 28,
    backgroundColor: theme.colors.black,
    opacity: 0.4,
  },
  logo: {
    width: 65,
    height: 22,
  },
}));
