import React, { useState, useEffect, Component  } from 'react';
import { StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import {Icon, Header, Content, Footer, List, ListItem, Body, Text, Right, Left, Switch, H3, colors, Thumbnail, Button} from 'native-base';
import { Avatar} from '@ui-kitten/components';
import { Card, CardTitle, CardContent, CardAction, CardButton, CardImage } from 'react-native-cards'; 
import { render } from 'react-dom';
import {DrawerActions, NavigationContainer, DefaultTheme, DarkTheme, useTheme} from '@react-navigation/native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { Appbar } from 'react-native-paper';




export const faqpage =({navigation}) => {
  const {colors} = useTheme();
  return(

<SafeAreaView style={{
        flex: 1,
        backgroundColor: colors.text,
    

}}>
            <ScrollView>
            
            <Card>
    <CardTitle
      title="What is ISeek?"
    />
    <CardContent 
    text="ISeek is an app to help the visually imparied with finding objects and reading text out loud"
    />
    <CardAction 
      separator={true} 
      inColumn={false}>
    </CardAction>
    <CardTitle
      title="Object detection"
    />
    <CardContent text="To use object detection, you can either take a photo or use a live video stream. Either tap the center button at the bottom of the camera page or use your voice to activate the camera. This will allow the camera to find objects in the room and read what it finds out loud." />
  <CardAction 
      separator={true} 
      inColumn={false}>
    </CardAction>
    <CardTitle
      title="Chat Bot"
    />
    <CardContent text="To use the chat bot, open the Messenger page. You can either type messages or speak out loud to activate the chat bot. It will continuously learn about you and try to help answer any questions you may have." />
  <CardAction 
      separator={true} 
      inColumn={false}>
    </CardAction>
  <CardTitle
      title="Light / Dark Mode"
    />
    <CardContent text="To use light and dark mode, open the drawer to the side of the app. This will give you the option to toggle a swtich based on your visual needs for light and dark text. "/>
    <CardAction 
      separator={true} 
      inColumn={false}>
    </CardAction>
    <CardTitle
      title="Questions or Feedback"
    />
    <CardContent text="If you have questions or feedback about this app, please email us at admin@iseek.com" />
  <CardAction 
      separator={true} 
      inColumn={false}>
    </CardAction>
    <CardTitle
      title="App Version"
    />
    <CardContent text="1.0.5" />
  <CardAction 
      separator={true} 
      inColumn={false}>
    </CardAction>
    
            

            </Card>
          </ScrollView>
        </SafeAreaView>
  
);
}

    