import 'react-native-gesture-handler';
import React, { useState, useEffect, Component }  from 'react';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, Layout } from '@ui-kitten/components';
import { DarkTheme, DefaultTheme, getFocusedRouteNameFromRoute, NavigationContainer, useIsFocused, useTheme } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem, } from '@react-navigation/drawer';
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

const Drawer = createDrawerNavigator();
function HomeScreen({navigation}) {
  const {colors} = useTheme();
  return (
    <Container style={{Color: colors.card}}>
      <Header>
        <Left style={{flex: 0.1}} />
        <Body style={{flex: 1, alignItems: 'center'}}>
          <Title>Home</Title>
        </Body>
        <Right style={{flex: 0.1}} />
      </Header>
      <Content
        contentContainerStyle={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Text>HomeScreen</Text>
          </Content>
    </Container>
  );
}
const MyTheme = {
  dark: false,
  colors: {
    primary: 'rgb(255, 45, 85)',
    background: 'rgb(242, 242, 242)',
    card: 'rgb(255, 255, 255)',
    text: 'rgb(28, 28, 30)',
    border: 'rgb(199, 199, 204)',
    notification: 'rgb(255, 69, 58)',
  },
};

const AppDrawer = () => {
  return (
    <Drawer.Navigator  drawerContent={props => <Sidebar {...props} />}>
      
      <Drawer.Screen
      name="Camera"
      component={XCamera}
      options={{
        drawerIcon: ({focused, color, size}) => (
          <Icon name="ios-camera" style={{fontSize: size, color: Colors.text}} />
        ),
      }}
      />

      <Drawer.Screen
      name="Messenger"
      color = {Colors.Text}
      component={message}
      options={{
        drawerIcon: ({focused, color, size}) => (
          <Icon name="ios-chatbubbles" style={{fontSize: size, color: color}} />
        ),
      }}
      />  

      <Drawer.Screen
      name="FAQ"
      color = {Colors.Title}
      component={faqpage}
      options={{
        drawerIcon: ({focused, color, size}) => (
          <Icon name="ios-book" style={{fontSize: size, color: color}} />
        ),
      }}
      />
      <Drawer.Screen
      name="BETA Streaming"
      color = {Colors.Title}
      component={streamingPage}
      options={{
        drawerIcon: ({focused, color, size}) => (
          <Icon name="ios-camera" style={{fontSize: size, color: color}} />
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