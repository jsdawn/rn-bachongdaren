import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {sleep} from '@utils/index';
import useStateRef from '@utils/useStateRef';

const demo = () => {
  const [list, setList, listRef] = useStateRef([]);

  const fetchList = () => {
    sleep(1000).then(res => {
      setList(res.data || []);

      getListItems();
    });
  };

  const getListItems = () => {
    doSomething();
  };

  const doSomething = () => {
    console.log(list); // 旧值
    console.log(listRef.current); // 新值
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <View>
      <Text>demo</Text>
    </View>
  );
};

export default demo;

const styles = StyleSheet.create({});
