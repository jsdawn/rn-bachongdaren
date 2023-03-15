import {StyleSheet} from 'react-native';
import {WebView} from 'react-native-webview';
import React, {useState, useEffect, useCallback} from 'react';
import {useNavigation} from '@react-navigation/native';
import {renderDetailHtml} from './detail_ui';

const Detail = ({route}) => {
  const {contentId} = route.params;

  const navigation = useNavigation();
  const [info, setInfo] = useState();
  const [skillContent, setSkillContent] = useState();

  const fetchInfoData = useCallback(() => {
    // 获取角色列表
    fetch(
      `https://api-static.mihoyo.com/common/blackboard/ys_obc/v1/content/info?app_sn=ys_obc&content_id=${contentId}`,
    )
      .then(response => response.json())
      .then(responseJson => {
        setInfo(responseJson.data.content);

        const content = responseJson.data.content.contents.find(
          v => v.name === '天赋介绍' || v.name === '角色天赋',
        );
        setSkillContent(content?.text);
      })
      .catch(error => {
        console.error(error);
      });
  }, [contentId]);

  useEffect(() => {
    fetchInfoData();
  }, [fetchInfoData]);

  useEffect(() => {
    if (info?.title) {
      navigation.setOptions({title: info.title});
    }
  }, [navigation, info]);

  return (
    <WebView
      originWhitelist={['*']}
      source={{html: renderDetailHtml(info?.title, skillContent)}}
      style={styles.container}
    />
  );
};

export default Detail;

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#fff',
  },
});
