import 'react-native-gesture-handler';
import React, { useState, useEffect, Component }  from 'react';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, Layout, Text } from '@ui-kitten/components';
import { NavigationContainer, DefaultTheme, DarkTheme, useTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen } from './Home.js';
import { XCamera } from './iCamera.js';
import { settingspage } from './settingspage.js';
import { faqpage } from './faq.js';
import { message } from './message.js';
import { EventRegister } from 'react-native-event-listeners';

const Stack = createStackNavigator();

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'rgb(255, 45, 85)',
  },
};

const App = () => {

  const [darkApp,setDarkApp]=useState(false);
  const appTheme = darkApp ? DefaultTheme : DarkTheme;

  useEffect(() => {
    let eventListener = EventRegister.addEventListener(
      'changeThemeEvent',
      data => {
        alert(data);
      },
    );
    return() => {
      EventRegister.removeEventListener(eventListener);
    };
}, []);

  return (
    <ApplicationProvider {...eva} theme={eva.light}>
    <NavigationContainer theme={MyTheme}>
      <Stack.Navigator>
        <Stack.Screen
          name="ISeek"
          component={HomeScreen}
        />
        <Stack.Screen name="Camera" component={XCamera} options={{title:'iSeek Camera'}}/>
        <Stack.Screen name="Settings" component={settingspage} options={{title:'Settings'}}/>
        <Stack.Screen name="Faq" component={faqpage} options={{title:'FAQ'}}/>
        <Stack.Screen name="Message" component={message} options={{title: 'Message'}}/>
      </Stack.Navigator>
    </NavigationContainer>
    </ApplicationProvider>
  );
};

export default App ;
