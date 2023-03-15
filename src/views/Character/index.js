import {useNavigation} from '@react-navigation/native';
import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  View,
  Image,
  FlatList,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';

const Character = () => {
  const navigation = useNavigation();
  const [list, setList] = useState([]);

  const fetchListData = () => {
    // 获取角色列表
    fetch(
      'https://api-static.mihoyo.com/common/blackboard/ys_obc/v1/home/content/list?app_sn=ys_obc&channel_id=25',
    )
      .then(response => response.json())
      .then(responseJson => {
        setList(responseJson.data.list[0].list);
      })
      .catch(error => {
        console.error(error);
      });
  };

  useEffect(() => {
    fetchListData();
  }, []);

  const renderItem = ({item}) => {
    return (
      <TouchableWithoutFeedback
        onPress={() =>
          navigation.navigate('Detail', {
            contentId: item.content_id,
          })
        }>
        <View style={styles.item}>
          <Image style={styles.img} source={{uri: item.icon}} />
          <Text style={styles.title}>{item.title}</Text>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {list.length ? (
        <FlatList
          style={styles.list}
          data={list}
          renderItem={renderItem}
          keyExtractor={item => item.content_id}
          horizontal={false}
          numColumns={4}
          columnWrapperStyle={styles.row}
        />
      ) : (
        <Text>Loading...</Text>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    paddingBottom: 10,
    flex: 1,
    backgroundColor: '#fff',
  },
  list: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  row: {
    marginBottom: 10,
    justifyContent: 'flex-start',
  },
  item: {
    flex: 1,
    // maxWidth: '25%',
    maxWidth: (Dimensions.get('window').width - (20 + 10 * 4)) / 4,
    marginLeft: 5,
    marginRight: 5,
    padding: 5,
    backgroundColor: '#efefef',
    borderRadius: 4,
  },
  img: {
    flex: 1,
    width: '100%',
    aspectRatio: 1,
  },
  title: {
    marginTop: 5,
    fontSize: 15,
    color: '#333',
    textAlign: 'center',
  },
});

export default Character;
