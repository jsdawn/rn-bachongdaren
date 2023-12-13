import request from '@utils/request';

// yarn add -D react-native-dotenv
// 注册设备
export function register(data) {
  return request({
    url: '/machine/register',
    headers: {
      isToken: false,
    },
    method: 'post',
    data: data,
  });
}

// 验证设备
export function authDevice(data) {
  return request({
    url: '/machine/auth',
    headers: {
      isToken: false,
    },
    method: 'post',
    data: data,
  });
}
