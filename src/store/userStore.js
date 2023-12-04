import {createContext, useContext} from 'react';
import {configure, makeAutoObservable, action} from 'mobx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {makePersistable, isHydrated} from 'mobx-persist-store';

configure({useProxies: 'never'});

class UserStore {
  user = {};

  constructor() {
    makeAutoObservable(this, {}, {autoBind: true});
    makePersistable(this, {
      name: 'userStore',
      properties: ['user'],
      storage: AsyncStorage,
      //expireIn: 10000, // One day in milliseconds
      //removeOnExpiration: true,
    }).then(
      action(res => {
        console.log(res);
      }),
    );
  }

  get isHydrated() {
    return isHydrated(this);
  }

  get userInfo() {
    return this.user;
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
