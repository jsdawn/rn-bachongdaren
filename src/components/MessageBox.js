import React, {useEffect, useState} from 'react';
import {observer} from 'mobx-react';
import {View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import {Button, Dialog, Icon, Image, Text, makeStyles} from '@rneui/themed';

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
      overlayStyle={styles.wrap}>
      <LinearGradient style={styles.container} colors={['#E7EEFA', '#D1E1FF']}>
        <Icon
          containerStyle={styles.closeIcon}
          name="close"
          type="antdesign"
          onPress={() => hide()}
        />

        {options.showFace || options.face ? (
          <>
            <View style={styles.faceWrap}>
              <Image
                style={styles.face}
                source={require('@assets/image/icon_sun.png')}
              />
            </View>
            <View style={{height: 50}}></View>
          </>
        ) : null}

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

        <View style={styles.actions}>
          {options.showCancelButton ? (
            <Button
              containerStyle={{marginRight: 15}}
              buttonStyle={{...styles.btn, ...styles.cancelBtn}}
              title={options.cancelButtonText}
              loading={cancelLoading}
              color="error"
              raised
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
          {options.showConfirmButton ? (
            <Button
              buttonStyle={styles.btn}
              title={options.confirmButtonText}
              loading={confirmLoading}
              raised
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
          ) : null}
        </View>
      </LinearGradient>
    </Dialog>
  );
});

MessageBox.show = opts => messageStore.show(opts);
MessageBox.hide = () => messageStore.hide();

export default MessageBox;

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
