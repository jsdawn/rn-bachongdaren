import {createContext, useContext} from 'react';
import {configure, makeAutoObservable, action} from 'mobx';
import {makePersistable, isHydrated} from 'mobx-persist-store';

import AsyncStorage from '@react-native-async-storage/async-storage';

configure({useProxies: 'never'});

class UserStore {
  user = {};

  constructor() {
    makeAutoObservable(this, {}, {autoBind: true});
    // debug：线上不缓存
    makePersistable(this, {
      name: 'userStore',
      properties: ['user'],
      storage: AsyncStorage,
      //expireIn: 10000, // One day in milliseconds
      //removeOnExpiration: true,
    }).then(
      action(res => {
        // console.log(res);
      }),
    );
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

  updateUser(value) {
    this.user = value;
  }

  clearUser() {
    this.user = {};
  }
}

// Instantiate the counter store.
export const userStore = new UserStore();
// Create a React Context with the counter store instance.
export const UserStoreContext = createContext(userStore);
export const useUserStore = () => useContext(UserStoreContext);
