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

// 用户登陆
export function userLogin(data) {
  return request({
    url: '/front/login',
    headers: {
      isToken: false,
    },
    method: 'post',
    data: data,
  });
}

// 用户信息by token
export function getUserInfo(data) {
  return request({
    url: '/front/userInfo',
    method: 'post',
    data: data,
  });
}

// 用户退出
export function userLogout(query) {
  return request({
    url: '/front/logout',
    method: 'get',
    params: query,
  });
}

// 查询话题列表
export function listTopic(query) {
  return request({
    url: '/topic/list',
    method: 'get',
    params: query,
  });
}

// 创建倾听连接
export function createListen(data) {
  return request({
    url: '/dialog/create',
    method: 'post',
    data: data,
  });
}

// 获取倾听师分配状态
export function getListenStatus(data) {
  return request({
    url: '/dialog/status',
    method: 'post',
    data: data,
  });
}

// 修改倾听记录状态
export function updateDialogStatus(data) {
  return request({
    url: '/dialog/edit',
    method: 'post',
    data: data,
  });
}
