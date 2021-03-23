import React, { useState, useEffect, Component  } from 'react';
import { StyleSheet, SafeAreaView, ScrollView , Text, TouchableOpacity, Image, Vibration,  ActivityIndicator, Alert} from 'react-native';
import { CardTitle, CardContent, CardAction, CardButton, CardImage } from 'react-native-cards'; 
import { render } from 'react-dom';
import {/*DrawerActions*/ NavigationContainer, DefaultTheme, DarkTheme, useTheme} from '@react-navigation/native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { Appbar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import { DrawerActions } from '@react-navigation/native';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import * as Permissions from 'expo-permissions';
import { Card, Button} from 'react-native-elements'

const recordingOptions = {
  // android not currently in use, but parameters are required
  android: {
      extension: '.m4a',
      outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
      audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
      sampleRate: 44100,
      numberOfChannels: 2,
      bitRate: 128000,
  },
  ios: {
      extension: '.wav',
      audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
      sampleRate: 44100,
      numberOfChannels: 1,
      bitRate: 128000,
      linearPCMBitDepth: 16,
      linearPCMIsBigEndian: false,
      linearPCMIsFloat: false,
  },
};



export const faqpage =({navigation}) => {

  const [isRecording, setIsRecording] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [recording, setRecording] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraFocus, setCameraFocus] = useState(true);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      
      setCameraFocus(true);
    });
    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  React.useEffect(() =>{
    const blurCamera = navigation.addListener('blur', () =>{
      setCameraFocus(false);
    });
    return blurCamera;
  }, [navigation]);

  const {colors} = useTheme();

  


  return(
    <>
   

<SafeAreaView style={{
        flex: 1,
        backgroundColor: colors.background,
    

}}>
   


            <ScrollView>
            <Card containerStyle={{backgroundColor: colors.background}}>
              <Card.Title style={{color: colors.text}}>What is iSeek?</Card.Title>
              <Text style={{marginBottom: 10, color: colors.text}}>
              ISeek is an app to help the visually imparied with finding objects and reading text out loud
              </Text>
              <Card.Divider style={{color: colors.text}}/>
              {/*--------------------------------------------------------------*/}
              <Card.Title style={{color: colors.text}}>Object Detection</Card.Title>
              <Text style={{marginBottom: 10, color: colors.text}}>
              To use object detection, you can either take a photo or use a live video stream. Either tap the center button at the bottom of the camera page or use your voice to activate the camera. This will allow the camera to find objects in the room and read what it finds out loud.
              </Text>
              <Card.Divider style={{color: colors.text}}/>
              {/*--------------------------------------------------------------*/}
              <Card.Title style={{color: colors.text}}>Chat Bot</Card.Title>
              <Text style={{marginBottom: 10, color: colors.text}}>
              To use the chat bot, open the Messenger page. You can either type messages or speak out loud to activate the chat bot. It will continuously learn about you and try to help answer any questions you may have.
              </Text>
              <Card.Divider style={{color: colors.text}}/>
              {/*--------------------------------------------------------------*/}
              <Card.Title style={{color: colors.text}}>Sensory Queues</Card.Title>
              <Text style={{marginBottom: 10, color: colors.text}}>
                In order to use iSeek without sight we offer audio and senory clues. When using the chatbot button your phone will vibrate and play a bell sound to ensure you that you are pressing the correct button.
                Once you have taken a picture a bell will play so that you may continue on with finding your desired objects. On the streaming page once you have said what object you want to find, your phone will begin vibrating and
                playing a sound if that object is found.
              </Text>
              {/*--------------------------------------------------------------*/}
              <Card.Title style={{color: colors.text}}>Light Dark Mode</Card.Title>
              <Text style={{marginBottom: 10, color: colors.text}}>
              To use light and dark mode, open the drawer to the side of the app. This will give you the option to toggle a swtich based on your visual needs for light and dark text.
              </Text>
              <Card.Divider style={{color: colors.text}}/>
              {/*--------------------------------------------------------------*/}
              <Card.Title style={{color: colors.text}}>Questions</Card.Title>
              <Text style={{marginBottom: 10, color: colors.text}}>
              If you have questions or feedback about this app, please email us at admin@iseek.com
              </Text>
              <Card.Divider style={{color: colors.text}}/>
              {/*--------------------------------------------------------------*/}
              <Card.Title style={{color: colors.text}}>App Version</Card.Title>
              <Text style={{marginBottom: 10, color: colors.text}}>
              1.0.5
              </Text>
              {/*--------------------------------------------------------------*/}
              </Card>
          </ScrollView>
        </SafeAreaView>


  <TouchableOpacity style = {{position: 'absolute', borderRadius:100,bottom:'90%',left:'5%'}} onPress={() => navigation.dispatch(DrawerActions.openDrawer())}/*onPressIn={handleOnPressIn} onPressOut={handleOnPressOut}*/> 
    
    <Icon
    name="ios-menu"
    color="#ccc"
    size={35}
    onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
  />
 </TouchableOpacity> 

 


  </>
);
}

    