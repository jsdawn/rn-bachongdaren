import {NativeModules, PermissionsAndroid} from 'react-native';

const {AutoAnswerModule} = NativeModules;

// 获取权限
export const requestPermissions = () => {
  return new Promise(async (resolve, reject) => {
    const hadPermis = await checkPermissions();
    if (hadPermis) {
      return resolve(true);
    }

    console.log('需要去获取');

    PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
      PermissionsAndroid.PERMISSIONS.CALL_PHONE,
      PermissionsAndroid.PERMISSIONS.ANSWER_PHONE_CALLS,
      PermissionsAndroid.PERMISSIONS.READ_CALL_LOG,
      PermissionsAndroid.PERMISSIONS.WRITE_CALL_LOG,
    ])
      .then(granted => {
        let isPermisOK = true;
        for (const key in granted) {
          if (Object.hasOwnProperty.call(granted, key)) {
            const val = granted[key];
            if (val != PermissionsAndroid.RESULTS.GRANTED) {
              isPermisOK = false;
            }
          }
        }
        console.log(granted);
        resolve(true);
      })
      .catch(err => {
        reject(err);
      });
  });
};

const checkPermissions = async () => {
  const granted1 = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
  );
  const granted2 = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.CALL_PHONE,
  );
  const granted3 = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.ANSWER_PHONE_CALLS,
  );
  const granted4 = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.READ_CALL_LOG,
  );
  const granted5 = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.WRITE_CALL_LOG,
  );

  if (granted1 && granted2 && granted3 && granted4 && granted5) {
    console.log('检查权限都有了');
    return true;
  } else {
    console.log('检查权限无无无');
    return false;
  }
};
