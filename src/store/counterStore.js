import {createContext, useContext} from 'react';
import {configure, makeAutoObservable} from 'mobx';

configure({useProxies: 'never'});

class CounterStore {
  count = 1;

  constructor() {
    makeAutoObservable(this, {}, {autoBind: true});
  }

  get sum() {
    return this.count + 1000;
  }

  increment() {
    console.log('ddd');
    console.log(this);
    this.count += 1;
  }

  decrement() {
    this.count -= 1;
  }
}

// Instantiate the counter store.
export const counterStore = new CounterStore();
// Create a React Context with the counter store instance.
export const CounterStoreContext = createContext(counterStore);
export const useCounterStore = () => useContext(CounterStoreContext);
