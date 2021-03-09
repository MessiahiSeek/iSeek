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
      setRecording(null);
    });
    return blurCamera;
  }, [navigation]);

  const {colors} = useTheme();

  const handleOnPressIn = () => {
    startRecording();
  };
  
  const handleOnPressOut = () => {
    stopRecording();
    getTranscription();
  };


  const getTranscription = async () => {
    setIsFetching(true);
    try {
        const info = await FileSystem.getInfoAsync(recording.getURI());
        const fileUri = info.uri;
        const name = fileUri.split(".")[1] == "wav" ? 'audio.wav' : 'audio.m4a';
            var file = {
              uri: fileUri,
              type: 'audio/x-wav',
              name: name
            }
        var body = new FormData();
        body.append('file',file);
        
        const response = await fetch('http://iseek.cs.messiah.edu:5000/voiceStreamingCheck'/*'http://153.42.129.91:5000/voiceStreamingCheck'*/, {
            method: 'POST',
            body: body
        });
        const data = await response.json();
        console.log(data)
        if(data.amazonNeeded){
        switch(data.textResponse){
          case ("%0oc"):
            navigation.navigate('Camera');
            break; 
          case("%0om"):
            navigation.navigate('Messenger');
            break;
            case("%0st"):
          
            break;
          case("%0tp"):
            console.log("her")
            navigation.navigate('Camera');
            console.log("herer")
            break;
          case("%1si"):
          case("%0ri"):
          if(prediction === 'N/A'){
            Speech.speak("We cannot determine  the object in the screen.")
          }
          else{
            Speech.speak("The Object Currently Shown is " + prediction);
          }
          break;
        default:
          Speech.speak(data.textResponse);
        }
      }
      else{
        if(data.objectAvailability){

          if(data.yesNoNeeded){
            /*JOE*/
            console.log("yes No needed")
            console.log(data.objectChoice)
            //YES NO NEEDED HERE
            //if yes- pop up saying is this okay, if they click no ask them  to type again

          }
          else{

          
            console.log("Here")
            console.log(data.objectChoice)
            setInputVal(data.objectChoice)

          }

         }else{
           Alert.alert("We currently dont support this object");
         }

      }
    } catch(error) {
        console.log('There was an error reading file', error);
        Alert.alert("Error, please try again")
        stopRecording();
        // resetRecording();
    }
  
    setIsFetching(false);
  }



  startRecording = async () => {
    const { status } = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
    setHasPermission(status === 'granted');
    if (status !== 'granted') return;
    setIsRecording(true);
    Vibration.vibrate();
    // some of these are not applicable, but are required
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: false,
  
    });
    const recording = new Audio.Recording();
    try {
      await recording.prepareToRecordAsync(recordingOptions);
      await recording.startAsync();
    } catch (error) {
      console.log(error);
      stopRecording();
    }
    setRecording(recording);
  }

  const stopRecording = async () => {
    setIsRecording(false);
    try {
        await recording.stopAndUnloadAsync();
    } catch (error) {
        // Do nothing -- we are already unloaded.
    }
}


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
    size={25}
    onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
  />
 </TouchableOpacity> 

 { cameraFocus && <TouchableOpacity style = {{position: 'absolute', borderRadius:"100%",bottom:'2%',left:'80%'}} onPressIn={handleOnPressIn} onPressOut={handleOnPressOut}>
    {isFetching ?  <ActivityIndicator color="#0f0"></ActivityIndicator> :
         <Image source={require("./images/chat.png")} style={{ width: 55, height: 55 ,  borderRadius:100}} />}
      </TouchableOpacity>  }


  </>
);
}

    