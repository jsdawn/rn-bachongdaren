import {createContext, useContext} from 'react';
import {configure, makeAutoObservable} from 'mobx';

configure({useProxies: 'never'});

class UserStore {
  user = {};

  constructor() {
    makeAutoObservable(this, {}, {autoBind: true});
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
