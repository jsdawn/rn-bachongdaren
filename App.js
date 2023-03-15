import React, {useEffect} from 'react';
import {StyleSheet} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import AntDesignIcons from 'react-native-vector-icons/AntDesign';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import Character from './src/views/Character';
import CharacterDetail from './src/views/Character/Detail';
import MyIndex from './src/views/My';
import User from './src/views/My/User';

const CharacterStack = createNativeStackNavigator();
const CharacterStackScreen = () => (
  <CharacterStack.Navigator>
    <CharacterStack.Screen
      name="Character"
      component={Character}
      options={{title: '角色图鉴'}}
    />
    <CharacterStack.Screen
      name="Detail"
      component={CharacterDetail}
      options={{title: ''}}
    />
  </CharacterStack.Navigator>
);

const MyStack = createNativeStackNavigator();
const MyStackScreen = () => (
  <MyStack.Navigator>
    <MyStack.Screen
      name="MyIndex"
      component={MyIndex}
      options={{title: '魔神任务'}}
    />
    <MyStack.Screen
      name="User"
      component={User}
      options={{title: '我的信息'}}
    />
  </MyStack.Navigator>
);

const Tab = createBottomTabNavigator();

const App = () => {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator
          initialRouteName="Home"
          screenOptions={{headerShown: false}}>
          <Tab.Screen
            name="HomeTab"
            component={CharacterStackScreen}
            options={{
              tabBarLabel: '图鉴',
              tabBarIcon: ({color, size}) => (
                <AntDesignIcons name="home" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="MyTab"
            component={MyStackScreen}
            options={{
              tabBarLabel: '我的',
              tabBarIcon: ({color, size}) => (
                <AntDesignIcons name="user" color={color} size={size} />
              ),
              tabBarBadge: 1,
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({});

export default App;
