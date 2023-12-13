import {createContext, useContext} from 'react';
import {configure, makeAutoObservable, action} from 'mobx';
import {makePersistable, isHydrated} from 'mobx-persist-store';

import AsyncStorage from '@react-native-async-storage/async-storage';

configure({useProxies: 'never'});

class AppStore {
  machineToken = ''; // 设备token
  userToken = ''; // 用户token
  sessionObj = null; // request请求体
  androidId = ''; // 设备uuid

  constructor() {
    makeAutoObservable(this, {}, {autoBind: true});
    makePersistable(this, {
      name: 'appStore',
      properties: ['machineToken', 'userToken'],
      storage: AsyncStorage,
    }).then(
      action(res => {
        // console.log(res);
      }),
    );
  }

  get isHydrated() {
    return isHydrated(this);
  }

  setMachineToken(val) {
    this.machineToken = val || '';
  }

  setUserToken(val) {
    this.userToken = val || '';
  }

  setSessionObj(val) {
    this.sessionObj = val || null;
  }

  setAndroidId(val) {
    this.androidId = val || null;
  }

  clearCache() {
    this.machineToken = '';
    this.userToken = '';
    this.sessionObj = null;
  }
}

// Instantiate the counter store.
export const appStore = new AppStore();
// Create a React Context with the counter store instance.
export const AppStoreContext = createContext(appStore);
export const useAppStore = () => useContext(AppStoreContext);
