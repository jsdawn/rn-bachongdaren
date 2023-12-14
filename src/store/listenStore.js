import {createContext, useContext} from 'react';
import {configure, makeAutoObservable} from 'mobx';

configure({useProxies: 'never'});

class ListenStore {
  queue = {};
  topic = {};
  listener = {};

  constructor() {
    makeAutoObservable(this, {}, {autoBind: true});
  }

  get listenInfo() {
    return {
      queue: this.queue,
      topic: this.topic,
      listener: this.listener,
    };
  }

  setQueue(val) {
    this.queue = val || {};
  }

  setTopic(val) {
    this.topic = val || {};
  }

  setListener(val) {
    this.listener = val || {};
  }

  resetListen() {
    this.topic = {};
    this.listener = {};
  }
}

// Instantiate the counter store.
export const listenStore = new ListenStore();
// Create a React Context with the counter store instance.
export const ListenStoreContext = createContext(listenStore);
export const useListenStore = () => useContext(ListenStoreContext);
