// utils.index.js
import {Dimensions, PixelRatio, Platform} from 'react-native';

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

/*
 * @desc pxToDp 屏幕尺寸适配
 * @params {String} uiElementPx 1倍稿元素尺寸
 * @params {Number} uiWidth     设计稿稿尺寸(default 375)
 * @return {number}
 */

export const p2d = (uiElementPx, isInt = true, uiWidth = 375) => {
  const deviceWidthDp = Dimensions.get('window').width; //屏幕宽
  if (typeof uiElementPx === 'string') {
    uiElementPx = Number(uiElementPx);
  }
  if (uiElementPx <= 3) {
    return uiElementPx;
  }
  if (Platform.OS === 'web') {
    return (uiElementPx * 10) / uiWidth + 'rem';
  } else {
    const mathResult = (uiElementPx * deviceWidthDp) / uiWidth;
    const resultInt = isInt ? Math.ceil(mathResult) : mathResult;
    return mathResult > 1 / PixelRatio.get() ? resultInt : 1 / PixelRatio.get();
  }
};
