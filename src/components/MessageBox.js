import React, {useState} from 'react';
import {Text} from 'react-native';

import {Dialog, makeStyles} from '@rneui/themed';

/**
 * - import MessageBox, {useMessageBox} from '@components/MessageBox';
 * - const {showMessage, ...msgProps} = useMessageBox();
 * - <MessageBox {...msgProps} />
 * @param {*} config
 * @returns
 */
export const useMessageBox = config => {
  const [visible, setVisible] = useState(false);
  const [options, setOptions] = useState(config);

  const showMessage = opts => {
    setOptions(opts);
    setVisible(true);
  };

  const hideMessage = () => {
    setVisible(false);
  };

  return {
    visible,
    setVisible,
    showMessage,
    hideMessage,
    ...options,
  };
};

const MessageBox = ({
  visible,
  setVisible,
  title,
  message,
  onConfirm,
  confirmButtonText = '确定',
  onCancel,
  cancelButtonText = '取消',
}) => {
  const styles = useStyles();

  return (
    <Dialog
      isVisible={visible}
      onBackdropPress={() => {}}
      overlayStyle={styles.container}>
      <Dialog.Title title={title || '系统提示'} />

      <Text>{message}</Text>

      <Dialog.Actions>
        <Dialog.Button title={confirmButtonText} onPress={onConfirm} />
        <Dialog.Button
          titleStyle={{color: '#888'}}
          title={cancelButtonText}
          onPress={() => {
            onCancel?.();
            setVisible(false);
          }}
        />
      </Dialog.Actions>
    </Dialog>
  );
};

export default MessageBox;

const useStyles = makeStyles(theme => ({
  container: {
    width: 320,
    borderRadius: 8,
  },
}));
