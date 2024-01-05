import {createContext, useContext} from 'react';
import {configure, makeAutoObservable, action} from 'mobx';
import {makePersistable, isHydrated} from 'mobx-persist-store';

import AsyncStorage from '@react-native-async-storage/async-storage';

configure({useProxies: 'never'});

class AppStore {
  machineToken = ''; // 设备token
  sessionObj = null; // request请求体
  uuid = ''; // 安卓ID
  wind = {}; // window info

  constructor() {
    makeAutoObservable(this, {}, {autoBind: true});
    // 缓存数据，
    makePersistable(this, {
      name: 'appStore',
      properties: ['machineToken'],
      storage: AsyncStorage,
      //expireIn: 10000, // One day in milliseconds
      //removeOnExpiration: true,
    }).then(
      action((res) => {
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

  setSessionObj(val) {
    this.sessionObj = val || null;
  }

  setUuid(val) {
    this.uuid = val || '';
  }

  setWind(val) {
    this.wind = val || {};
  }

  clearAppCache() {
    this.machineToken = '';
    this.sessionObj = null;
    this.uuid = '';
    this.wind = {};
  }
}

// Instantiate the counter store.
export const appStore = new AppStore();
// Create a React Context with the counter store instance.
export const AppStoreContext = createContext(appStore);
export const useAppStore = () => useContext(AppStoreContext);
