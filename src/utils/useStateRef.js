import {useRef, useState} from 'react';

/**
 * Returns a stateful value, a function to update it,
 * and a mutable ref object for value
 * @param {*} initData
 * @returns
 */
const useStateRef = initData => {
  const [data, setData] = useState(initData);
  const dataRef = useRef(data);
  dataRef.current = data;

  return [data, setData, dataRef];
};

export default useStateRef;
