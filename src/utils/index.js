
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

/**
 * 参数处理
 * @param {*} params  参数
 */
export const tansParams = params => {
  let result = '';
  for (const propName of Object.keys(params)) {
    const value = params[propName];
    var part = encodeURIComponent(propName) + '=';
    if (value !== null && value !== '' && typeof value !== 'undefined') {
      if (typeof value === 'object') {
        for (const key of Object.keys(value)) {
          if (
            value[key] !== null &&
            value[key] !== '' &&
            typeof value[key] !== 'undefined'
          ) {
            let params = propName + '[' + key + ']';
            var subPart = encodeURIComponent(params) + '=';
            result += subPart + encodeURIComponent(value[key]) + '&';
          }
        }
      } else {
        result += part + encodeURIComponent(value) + '&';
      }
    }
  }
  return result;
};
