import {TouchableOpacity, Text, View, Image, Alert} from 'react-native';
import React, {useState} from 'react';
import {Button, makeStyles} from '@rneui/themed';
import {TagCloud} from 'react-tagcloud/rn';
import UserLoginDialog from './components/UserLoginDialog';

const TopicPanel = () => {
  const styles = useStyles();

  const [visible, setVisible] = useState(false);
  const [data, setData] = useState([
    {value: 'JavaScript', count: 38},
    {value: 'React', count: 30},
    {value: 'Nodejs', count: 28},
    {value: 'Express.js', count: 25},
    {value: 'HTML5', count: 33},
    {value: 'MongoDB', count: 18},
    {value: 'CSS3', count: 20},
  ]);

  const changeTopics = () => {
    setData([
      {value: 'JavaScript1', count: 38},
      {value: 'React1', count: 30},
      {value: 'Nodejs1', count: 28},
      {value: 'Express.js1', count: 25},
      {value: 'HTML51', count: 33},
      {value: 'MongoDB1', count: 18},
      {value: 'CSS31', count: 20},
    ]);
  };

  const TagRenderer = (tag, size, color) => (
    <View key={tag.value} style={styles.tagItemWrap}>
      <TouchableOpacity
        style={styles.tagItem}
        onPress={() => console.log(tag.value)}>
        <Text style={{...styles.tagText, fontSize: size}}>{tag.value}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          style={styles.logo}
          source={require('../../image/logo_mini.png')}
        />
        <Button
          buttonStyle={styles.hdButton}
          size="lg"
          titleStyle={{fontSize: 28}}
          icon={{name: 'reload1', type: 'ant-design', color: '#fff', size: 20}}
          onPress={changeTopics}>
          换一批
        </Button>
      </View>

      <View style={styles.topicWrap}>
        <TagCloud
          minSize={12}
          maxSize={35}
          tags={data}
          renderer={TagRenderer}
        />
      </View>

      <View style={styles.loginBar}>
        <Text onPress={() => Alert.alert('使用帮助')} style={{color: '#fff'}}>
          使用帮助
        </Text>
        <Button
          type="outline"
          buttonStyle={{backgroundColor: '#fff', borderRadius: 30}}
          onPress={() => setVisible(true)}>
          账号登陆
        </Button>
      </View>

      <View style={styles.chatWrap}>
        <Image
          style={styles.chatImg}
          source={require('../../image/girl.png')}
        />
        <View style={styles.bubble}>
          <View style={styles.bubbleArrow}></View>
          <View style={styles.bubbleArrow2}></View>
          <Text style={styles.bubbleMsg}>同学可以先登陆账号哦～</Text>
        </View>
      </View>

      <UserLoginDialog visible={visible} setVisible={setVisible} />
    </View>
  );
};

export default TopicPanel;

const useStyles = makeStyles(theme => ({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f7',
  },

  header: {
    padding: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  hdButton: {
    padding: 0,
    width: 180,
    height: 55,
    borderRadius: 55,
  },

  topicWrap: {
    paddingHorizontal: 200,
    paddingBottom: 25,
    flex: 1,
    justifyContent: 'center',
  },
  tagItemWrap: {
    margin: 10,
    elevation: 2,
    borderRadius: 50,
    backgroundColor: '#f6f6f7',
  },
  tagItem: {
    paddingHorizontal: 25,
    paddingVertical: 8,
    borderColor: theme.colors.primary,
    borderWidth: 1,
    borderRadius: 50,
    backgroundColor: '#fff',
    opacity: 0.65,
  },
  tagText: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },

  loginBar: {
    paddingHorizontal: 20,
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
  },

  chatWrap: {
    position: 'absolute',
    bottom: 60,
    right: 0,
    zIndex: 10,
  },
  chatImg: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 260,
    height: 250,
  },
  bubble: {
    position: 'absolute',
    right: 170,
    bottom: 140,
    marginTop: 15,
    padding: 15,
    width: 190,
    height: 90,
    borderColor: theme.colors.primary,
    borderWidth: 1,
    borderRadius: 10,
    opacity: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  bubbleArrow: {
    position: 'absolute',
    right: -20,
    top: 40,
    width: 0,
    height: 0,
    borderWidth: 10,
    borderRightColor: 'transparent',
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: theme.colors.primary,
  },
  bubbleArrow2: {
    position: 'absolute',
    right: -19,
    top: 40,
    width: 0,
    height: 0,
    borderWidth: 10,
    borderRightColor: 'transparent',
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: '#fff',
  },
  bubbleMsg: {
    color: theme.colors.primary,
  },
}));
