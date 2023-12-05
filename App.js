import React, {useEffect} from 'react';
import {StyleSheet, StatusBar, View} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import SplashScreen from 'react-native-splash-screen';

import MessageBox from '@components/MessageBox';
import MsgToast from '@components/MsgToast';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ThemeProvider, createTheme} from '@rneui/themed';
import DeviceLogin from '@views/Home/DeviceLogin';
import TopicPanel from '@views/Home/TopicPanel';

const Stack = createNativeStackNavigator();
const StackScreen = () => (
  <Stack.Navigator initialRouteName="TopicPanel">
    <Stack.Screen
      name="TopicPanel"
      component={TopicPanel}
      options={{title: '话题工作台', headerShown: false}}
    />
    <Stack.Screen
      name="DeviceLogin"
      component={DeviceLogin}
      options={{title: '设备登陆', headerShown: false}}
    />
  </Stack.Navigator>
);

const theme = createTheme({
  lightColors: {
    primary: '#304cff',
  },
});

const App = () => {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <>
        <StatusBar translucent={false} />
        <SafeAreaProvider>
          <NavigationContainer>
            <StackScreen></StackScreen>
          </NavigationContainer>
        </SafeAreaProvider>

        {/* global toast */}
        <MsgToast />
        {/* global MessageBox */}
        <MessageBox />
      </>
    </ThemeProvider>
  );
};

const styles = StyleSheet.create({});

export default App;
