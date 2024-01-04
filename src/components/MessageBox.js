import React, {useEffect, useState} from 'react';
import {observer} from 'mobx-react';
import {View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import {Button, Dialog, Icon, Image, Text, makeStyles} from '@rneui/themed';
import MyPopup from './MyPopup';

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
    <MyPopup isVisible={visible}>
      <MyPopup.CloseIcon onPress={() => hide()} />

      {options.showFace || options.face ? <MyPopup.FaceImage /> : null}

      {options.title && (
        <Text h2 style={styles.title}>
          {options.title}
        </Text>
      )}

      {options.message || options.iconProps ? (
        <View style={styles.message}>
          {options.iconProps && <Icon {...options.iconProps} />}
          <Text h3>{options.message}</Text>
        </View>
      ) : null}

      {options.desc && <Text style={styles.desc}>{options.desc}</Text>}

      <MyPopup.Actions>
        {options.showCancelButton ? (
          <MyPopup.Button
            containerStyle={{marginRight: 15}}
            title={options.cancelButtonText}
            loading={cancelLoading}
            color="error"
            onPress={() => {
              if (options.onCancel) {
                setCancelLoading(true);
                options.onCancel((isHide) => {
                  (isHide == undefined || isHide) && hide();
                  setCancelLoading(false);
                });
              } else {
                hide();
              }
            }}
          />
        ) : null}
        {options.showConfirmButton ? (
          <MyPopup.Button
            title={options.confirmButtonText}
            loading={confirmLoading}
            onPress={() => {
              if (options.onConfirm) {
                setConfirmLoading(true);
                options.onConfirm((isHide) => {
                  (isHide == undefined || isHide) && hide();
                  setConfirmLoading(false);
                });
              } else {
                hide();
              }
            }}
          />
        ) : null}
      </MyPopup.Actions>
    </MyPopup>
  );
});

MessageBox.show = (opts) => messageStore.show(opts);
MessageBox.hide = () => messageStore.hide();

export default MessageBox;

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
    paddingBottom: 40,
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

  faceWrap: {
    position: 'absolute',
    top: -56,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  face: {
    width: 109,
    height: 113,
  },

  title: {
    marginBottom: 15,
  },
  message: {
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  desc: {
    marginBottom: 15,
  },
}));
