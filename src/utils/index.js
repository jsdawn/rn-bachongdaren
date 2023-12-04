// utils.index.js

/**
 * sleep debug
 * @param {*} ms
 * @returns
 */
export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
