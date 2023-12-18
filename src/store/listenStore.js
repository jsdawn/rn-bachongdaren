import {createContext, useContext} from 'react';
import {configure, makeAutoObservable} from 'mobx';

configure({useProxies: 'never'});

class ListenStore {
  task = {}; // 任务信息
  topic = {}; // 话题信息
  listener = {}; // 倾听师信息

  constructor() {
    makeAutoObservable(this, {}, {autoBind: true});
  }

  get listenInfo() {
    return {
      task: this.task,
      topic: this.topic,
      listener: this.listener,
    };
  }

  setTask(val) {
    this.task = val || {};
  }

  setTopic(val) {
    this.topic = val || {};
  }

  setListener(val) {
    this.listener = val || {};
  }

  resetListen() {
    this.task = {};
    this.topic = {};
    this.listener = {};
  }
}

// Instantiate the counter store.
export const listenStore = new ListenStore();
// Create a React Context with the counter store instance.
export const ListenStoreContext = createContext(listenStore);
export const useListenStore = () => useContext(ListenStoreContext);
