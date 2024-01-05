import {createContext, useContext} from 'react';
import {configure, makeAutoObservable, action} from 'mobx';
import {makePersistable, isHydrated} from 'mobx-persist-store';

import AsyncStorage from '@react-native-async-storage/async-storage';

configure({useProxies: 'never'});

class UserStore {
  userToken = ''; // 用户token
  user = {};

  constructor() {
    makeAutoObservable(this, {}, {autoBind: true});

    // 缓存数据，线上不缓存 user
    if (__DEV__) {
      makePersistable(this, {
        name: 'userStore',
        properties: ['userToken', 'user'],
        storage: AsyncStorage,
        //expireIn: 10000, // One day in milliseconds
        //removeOnExpiration: true,
      }).then(
        action((res) => {
          // console.log(res);
        }),
      );
    }
  }

  get isHydrated() {
    return isHydrated(this);
  }

  get userInfo() {
    return this.user;
  }

  get isUsered() {
    return !!(this.user && this.user.id);
  }

  setUser(value) {
    this.user = value;
  }

  setUserToken(val) {
    this.userToken = val || '';
  }

  clearUserCache() {
    this.userToken = '';
    this.user = {};
  }
}

// Instantiate the counter store.
export const userStore = new UserStore();
// Create a React Context with the counter store instance.
export const UserStoreContext = createContext(userStore);
export const useUserStore = () => useContext(UserStoreContext);
