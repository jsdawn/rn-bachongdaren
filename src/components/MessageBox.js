import React, {useEffect, useState} from 'react';
import {observer} from 'mobx-react';

import {Dialog, Text, makeStyles} from '@rneui/themed';

import {isThenable} from '@utils/index';
import {useMessageStore, messageStore} from '@store/messageStore';

const MessageBox = observer(() => {
  const styles = useStyles();
  const {visible, options, hide} = useMessageStore();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      setConfirmLoading(false);
      setCancelLoading(false);
    }
  }, [visible]);

  return (
    <Dialog
      isVisible={visible}
      onBackdropPress={() => {}}
      overlayStyle={styles.container}>
      <Dialog.Title title={options.title} />

      <Text>{options.message}</Text>

      <Dialog.Actions>
        <Dialog.Button
          title={options.confirmButtonText}
          loading={confirmLoading}
          onPress={() => {
            if (options.onConfirm) {
              setConfirmLoading(true);
              options.onConfirm(isHide => {
                (isHide == undefined || isHide) && hide();
                setConfirmLoading(false);
              });
            } else {
              hide();
            }
          }}
        />
        {options.showCancelButton ? (
          <Dialog.Button
            titleStyle={{color: '#888'}}
            title={options.cancelButtonText}
            loading={cancelLoading}
            onPress={() => {
              if (options.onCancel) {
                setCancelLoading(true);
                options.onCancel(isHide => {
                  (isHide == undefined || isHide) && hide();
                  setCancelLoading(false);
                });
              } else {
                hide();
              }
            }}
          />
        ) : null}
      </Dialog.Actions>
    </Dialog>
  );
});

MessageBox.show = opts => messageStore.show(opts);
MessageBox.hide = () => messageStore.hide();

export default MessageBox;

const useStyles = makeStyles(theme => ({
  container: {
    width: 320,
    borderRadius: 8,
  },
}));
