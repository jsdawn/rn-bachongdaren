
// utils.index.js
/**
 * sleep debug
 * @param {*} ms
 * @returns
 */
export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

/**
 * 是否是 Promise 对象
 * @param {*} thing
 * @returns
 */
export const isThenable = thing => {
  return !!(thing && thing.then);
};
