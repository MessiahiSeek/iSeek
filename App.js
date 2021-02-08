import 'react-native-gesture-handler';
import React, { useState, useEffect, Component }  from 'react';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, Layout } from '@ui-kitten/components';
import { DarkTheme, DefaultTheme, getFocusedRouteNameFromRoute, NavigationContainer, useIsFocused, useTheme } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem} from '@react-navigation/drawer';
import { XCamera } from './iCamera.js';
import { streamingPage } from './streaming.js';
import { settingspage } from './settingspage.js';
import { faqpage } from './faq.js';
import { message } from './message.js';
import { EventRegister } from 'react-native-event-listeners';
import { Animated, StyleSheet, View, TouchableWithoutFeedback, Text, Container, Body, Content, Right, Footer, Left } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Switch, List, ListItem } from '@shoutem/ui';
import Sidebar from './customDrawer.js';
import { PropsService } from '@ui-kitten/components/devsupport';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { color } from 'react-native-reanimated';


const Drawer = createDrawerNavigator();
const AppDrawer = () => {
  const {colors} = useTheme();
  return (
    <Drawer.Navigator 
    drawerContentOptions={{
      inactiveTintColor: colors.text
    }}
    drawerContent={props => <Sidebar {...props} />}>
      
      
      <Drawer.Screen
    
      name="Camera"
      component={XCamera}
      options={{
        drawerIcon: ({focused, color, size}) => (
          <Icon name="ios-camera" style={{fontSize: size, color: colors.text}} />
        ),
      }}
      />

      <Drawer.Screen
      name="Messenger" 
      component={message}
      options={{
        drawerIcon: ({focused, color, size}) => (
          <Icon name="ios-chatbubbles" style={{fontSize: size, color: colors.text}} />
        ),
      }} 
      />  

      <Drawer.Screen
      name="FAQ"
      color = {colors.text}
      component={faqpage}
      options={{
        drawerIcon: ({focused, color, size}) => (
          <Icon name="ios-book" style={{fontSize: size, color: colors.text}} />
        ),
      }}
      />
      <Drawer.Screen
      name="BETA Streaming"
      color = {colors.text}
      component={streamingPage}
      options={{
        drawerIcon: ({focused, color, size}) => (
          <Icon name="ios-videocam" style={{fontSize: size, color: colors.text}} />
        ),
      }}
      />

    </Drawer.Navigator>
  );
};

function App() {
  const [darkApp, setDarkApp]=useState(false);
  const appTheme = darkApp ? DarkTheme : DefaultTheme; 

  useEffect(()=>{
    let eventListener = EventRegister.addEventListener(
      'appChangeThemeEvent',
      data => {

        setDarkApp(data);
      },
    );
    return () => {
      EventRegister.removeEventListener(eventListener);
    };
  }, []);
  return (
    <NavigationContainer theme={appTheme}>
      <AppDrawer />
    </NavigationContainer>
  );
}

export default App;