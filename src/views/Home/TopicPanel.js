import React, {useEffect, useState} from 'react';
import {observer} from 'mobx-react';
import {
  TouchableOpacity,
  View,
  BackHandler,
  ImageBackground,
} from 'react-native';
import {TagCloud} from 'react-tagcloud/rn';

import TopicLinkDialog from './components/TopicLinkDialog';
import LoginUser from '@components/LoginUser';
import LogoFlag from '@components/LogoFlag';
import MessageBox from '@components/MessageBox';
import {useNavigation} from '@react-navigation/native';
import {makeStyles, Text} from '@rneui/themed';

import {requestPermissions} from '@utils/permissions';
import {listTopic} from '@api/index';
import {userStore} from '@store/userStore';

const TopicPanel = () => {
  const styles = useStyles();
  const navigation = useNavigation();

  const [isPermisOK, setIsPermisOK] = useState(false);
  const [linkVisible, setLinkVisible] = useState(false);
  const [pageNum, setPageNum] = useState(1);
  const [pageSize] = useState(10);
  const [dataList, setDataList] = useState([]); // [{value,count}, ...]
  const [topic, setTopic] = useState({}); // 当前话题

  const changeTopics = () => {
    getList();
  };

  const clickItem = item => {
    if (!userStore.isUsered) {
      MessageBox.show({
        title: '',
        message: '请先点击左下角按钮登录账号',
        showCancelButton: false,
        confirmButtonText: '好的',
      });
      return;
    }

    if (!isPermisOK) {
      MessageBox.show({
        title: '',
        message: '系统权限不足，请检查应用权限列表',
        showCancelButton: false,
        confirmButtonText: '好的',
      });
      return;
    }

    setTopic(item);
    setLinkVisible(true);
  };

  const getList = () => {
    listTopic({pageNum, pageSize}).then(res => {
      if (!res || !res.rows) return;
      setDataList(
        res.rows.map(v => ({...v, value: v.name, count: v.fontSize})),
      );
      // update page num
      if (res.rows.length < pageSize || pageNum * pageSize == res.total) {
        setPageNum(1);
        return;
      }
      setPageNum(pre => pre + 1);
    });
  };

  useEffect(() => {
    // 禁用系统返回键
    BackHandler.addEventListener('hardwareBackPress', () => true);

    getList();

    requestPermissions()
      .then(() => {
        setIsPermisOK(true);
      })
      .catch(() => {});
  }, []);

  // tag item render, size by count[min,max]
  const ItemRenderer = (tag, size, color) => (
    <View key={tag.value} style={{margin: 10}}>
      <TouchableOpacity style={styles.tagItem} onPress={() => clickItem(tag)}>
        <Text style={{...styles.tagText, fontSize: size}}>{tag.value}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ImageBackground
      style={{flex: 1}}
      source={require('@assets/image/topic_bg.jpg')}
      resizeMode="cover">
      <View style={styles.container}>
        <View style={styles.topicWrap}>
          <TagCloud
            minSize={15}
            maxSize={25}
            tags={dataList}
            renderer={ItemRenderer}
          />
        </View>

        <LoginUser />

        <TopicLinkDialog
          visible={linkVisible}
          setVisible={setLinkVisible}
          linkTopic={topic}
          onSuccess={() => {
            navigation.navigate('ListenCenter');
          }}
        />
      </View>

      <LogoFlag />
    </ImageBackground>
  );
};

export default observer(TopicPanel);

const useStyles = makeStyles(theme => ({
  container: {
    flex: 1,
  },

  topicWrap: {
    paddingHorizontal: 200,
    paddingBottom: 25,
    flex: 1,
    justifyContent: 'center',
  },
  tagItem: {
    borderRadius: 50,
    paddingHorizontal: 25,
    paddingVertical: 8,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  tagText: {
    fontWeight: 'bold',
  },
}));
