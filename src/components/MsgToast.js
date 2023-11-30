import {StyleSheet} from 'react-native';
import React, {forwardRef} from 'react';
import Toast, {
  ToastProps,
  BaseToast,
  ErrorToast,
  InfoToast,
} from 'react-native-toast-message';

const toastConfig = {
  /*
      Overwrite 'success' type,
      by modifying the existing `BaseToast` component
    */
  success: props => (
    <BaseToast
      {...props}
      style={{...styles.base, borderLeftColor: '#52c41a'}}
      contentContainerStyle={styles.container}
      text1Style={styles.text1}
      text2Style={styles.text2}
      text2NumberOfLines={5}
    />
  ),
  error: props => (
    <ErrorToast
      {...props}
      style={{...styles.base, borderLeftColor: '#ff190c'}}
      contentContainerStyle={styles.container}
      text1Style={styles.text1}
      text2Style={styles.text2}
      text2NumberOfLines={5}
    />
  ),
  info: props => (
    <InfoToast
      {...props}
      style={{...styles.base, borderLeftColor: '#2089dc'}}
      contentContainerStyle={styles.container}
      text1Style={styles.text1}
      text2Style={styles.text2}
      text2NumberOfLines={5}
    />
  ),
};

/**
 *
 * @param {ToastProps} props
 * @returns
 */
const MsgToast = props => {
  const {config, ...attrs} = props;
  return <Toast {...attrs} config={toastConfig} />;
};

MsgToast.show = Toast.show;
MsgToast.hide = Toast.hide;
MsgToast.setRef = Toast.setRef;

export default MsgToast;

const styles = StyleSheet.create({
  base: {
    height: undefined,
    minHeight: 60,
    borderLeftWidth: 6,
  },
  container: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  text1: {
    fontSize: 16,
    fontWeight: '600',
  },
  text2: {
    marginTop: 4,
    fontSize: 14,
    color: '#666',
  },
});
