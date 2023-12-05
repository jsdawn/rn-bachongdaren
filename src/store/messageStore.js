import {createContext, useContext} from 'react';
import {configure, makeAutoObservable} from 'mobx';

configure({useProxies: 'never'});

class MessageStore {
  visible = false;
  options = {
    title: '系统提示',
    confirmButtonText: '确定',
    showConfirmButton: true,
    cancelButtonText: '取消',
    showCancelButton: true,
  };

  constructor() {
    makeAutoObservable(this, {}, {autoBind: true});
  }

  show(value) {
    this.options = {...this.options, ...value};
    this.visible = true;
  }

  hide() {
    this.visible = false;
  }
}

// Instantiate the counter store.
export const messageStore = new MessageStore();
// Create a React Context with the counter store instance.
export const MessageStoreContext = createContext(messageStore);
export const useMessageStore = () => useContext(MessageStoreContext);
