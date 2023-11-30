import React, {useEffect} from 'react';
import {StyleSheet, StatusBar, View} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {ThemeProvider, createTheme} from '@rneui/themed';
import MsgToast from '@components/MsgToast';
import {FullWindowOverlay} from 'react-native-screens';

import TopicPanel from '@views/Home/TopicPanel';

const Stack = createNativeStackNavigator();
const StackScreen = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="TopicPanel"
      component={TopicPanel}
      options={{title: '话题工作台', headerShown: false}}
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
      </>
    </ThemeProvider>
  );
};

const styles = StyleSheet.create({});

export default App;
