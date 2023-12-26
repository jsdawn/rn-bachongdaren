import {PermissionsAndroid} from 'react-native';

// 获取权限
export const requestPermissions = () => {
  return new Promise(async (resolve, reject) => {
    const hadPermis = await checkPermissions();
    if (hadPermis) {
      return resolve(true);
    }

    console.log('requestPermissions：需要去获取权限');

    PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
      PermissionsAndroid.PERMISSIONS.CALL_PHONE,
      PermissionsAndroid.PERMISSIONS.ANSWER_PHONE_CALLS,
      PermissionsAndroid.PERMISSIONS.READ_CALL_LOG,
      PermissionsAndroid.PERMISSIONS.WRITE_CALL_LOG,
    ])
      .then(granted => {
        let isPermisOK = true;
        let noPermisKey = '';
        for (const key in granted) {
          if (Object.hasOwnProperty.call(granted, key)) {
            const val = granted[key];
            if (val != PermissionsAndroid.RESULTS.GRANTED) {
              isPermisOK = false;
              noPermisKey = key;
            }
          }
        }
        if (isPermisOK) {
          resolve(true);
        } else {
          console.warn('ERROR: no Permissions [' + noPermisKey + ']');
          reject('ERROR: no Permissions [' + noPermisKey + ']');
        }
      })
      .catch(err => {
        console.warn('ERROR: no Permissions [' + noPermisKey + ']');
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
    console.log('checkPermissions：检查权限满足');
    return true;
  } else {
    console.log('checkPermissions：检查权限不满足');
    return false;
  }
};
