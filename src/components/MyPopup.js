import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import {Button, Dialog, Icon, Text, makeStyles} from '@rneui/themed';

const MyPopup = ({visible, setVisible, children, ...options}) => {
  const styles = useStyles();

  return (
    <Dialog
      isVisible={visible}
      onBackdropPress={() => {}}
      overlayStyle={styles.wrap}>
      <LinearGradient style={styles.container} colors={['#E7EEFA', '#D1E1FF']}>
        <Icon
          containerStyle={styles.closeIcon}
          name="close"
          type="antdesign"
          onPress={() => setVisible(false)}
        />

        {options.title && (
          <Text h2 style={styles.title}>
            {options.title}
          </Text>
        )}

        {options.subTitle || options.iconProps ? (
          <View style={styles.subTitle}>
            {options.iconProps && <Icon {...options.iconProps} />}
            <Text h3>{options.subTitle}</Text>
          </View>
        ) : null}

        {options.message && (
          <Text style={styles.message}>{options.message}</Text>
        )}

        {children}
      </LinearGradient>
    </Dialog>
  );
};

MyPopup.Actions = ({children}) => {
  const styles = useStyles();
  return <View style={styles.actions}>{children}</View>;
};

export default MyPopup;

const useStyles = makeStyles(theme => ({
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
  closeIcon: {
    position: 'absolute',
    right: 15,
    top: 15,
    zIndex: 10,
    opacity: 0.4,
  },

  title: {
    marginBottom: 20,
  },
  subTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  message: {
    marginBottom: 20,
  },

  actions: {
    position: 'absolute',
    bottom: -25,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  btn: {
    paddingHorizontal: 35,
    minWidth: 140,
    height: 50,
    fontSize: 15,
  },
}));
