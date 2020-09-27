import React, { useState, useEffect, Component  } from 'react';
import { Text, View, TouchableOpacity, ref, StyleSheet, ActivityIndicator,Image  } from 'react-native';
import {  Button, ButtonGroup, Icon, Layout, Spinner } from '@ui-kitten/components';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { Audio } from 'expo-av';
import * as Permissions from 'expo-permissions';
import * as FileSystem from 'expo-file-system';
import { render } from 'react-dom';





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


export const XCamera =({navigation}) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [isRecording, setIsRecording] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [recording, setRecording] = useState(null);
  //const useRef = useRef(null);
  const [photoJson,setPhoto] = useState("");



  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);


  snap = async () => {
    if (this.camera) {
      const options = { quality: 1, base64: true, fixOrientation: true, 
        exif: true};
        await this.camera.takePictureAsync(options).then(photo => {
           photo.exif.Orientation = 1;            
           //console.log(photo.base64); 
           //getTime();  
           //MediaLibrary.saveToLibraryAsync(photo.uri); 

           fetch('http://ec2-3-23-33-73.us-east-2.compute.amazonaws.com:5000/image',
           {
             method: 'POST',
             headers:{
               Accept: 'application/json',
               'Content-Type': 'application/json',
             },
             body: JSON.stringify({
               pictureString: photo.base64,
             }),
           }).then((response) => response.json())
           .then((json) => {
             setPhoto(json.pictureResponse);
             console.log(photoJson);
             console.log("hello world")
            })
         });
         
     }  
   }
 /*
 getTime =  () =>{ 
   console.log("hello");
   let response =  fetch('http://ec2-3-23-33-73.us-east-2.compute.amazonaws.com:5000/time').then((resp)=>{
     console.log("hello agagin")
     return resp.json()}).then(
       (
         (json)=>{
     console.log(json);
     const tim = json.time;
     //tim = tim.toString();
     console.log(tim);
   }));
   
 };*/

  
  startRecording = async () => {
    const { status } = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
    setHasPermission(status === 'granted');
    if (status !== 'granted') return;
    setIsRecording(true);
    // some of these are not applicable, but are required
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: true,
  
    });
    const recording = new Audio.Recording();
    try {
      await recording.prepareToRecordAsync(recordingOptions);
      await recording.startAsync();
    } catch (error) {x
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

//code snippet that reads audio file and converts it to text

const getTranscription = async () => {
  setIsFetching(true);
  try {
      const info = await FileSystem.getInfoAsync(recording.getURI());
      console.log(`FILE INFO: ${JSON.stringify(info)}`);
      const uri = info.uri;
      const formData = new FormData();
      formData.append('file', {
          uri,
          type: 'audio/x-wav',
          name: 'speech2text'
      });
      const response = await fetch(config.CLOUD_FUNCTION_URL, {
          method: 'POST',
          body: formData
      });
      const data = await response.json();
      console.log(data);
      setQuery(data.transcript);
  } catch(error) {
      console.log('There was an error reading file', error);
      stopRecording();
      // resetRecording();
  }
  setIsFetching(false);
}
const handleOnPressIn = () => {
  startRecording();
};

const handleOnPressOut = () => {
  stopRecording();
  getTranscription();
};


  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  
  return (
    
    <View style={styles.container}>
      
      <Camera style={{ flex: 1 }} type={type} ref={ref => { this.camera = ref; }}>
        <View>
        {(photoJson != "")  && (<Image source ={{ uri:`data:image/gif;base64,${photoJson}`}} 
      style={{alignContent:'center',justifyContent:'center',width:400,height:600}}/>)}
          <ButtonGroup style={styles.buttongroup} size='large'>
        <Button onPress={ async () =>  this.snap()}>
          Camera</Button>
          <Button onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}>Flip</Button>
        
        <Button
                    onPressIn={handleOnPressIn}
                    onPressOut={handleOnPressOut}
                >
                    {isFetching && <ActivityIndicator/>}
                    {!isFetching && <Text>Voice Search</Text>}
                </Button>
                </ButtonGroup>
                
        </View>
      </Camera>
    </View>
   ); 
  }
          
        
      
const styles = StyleSheet.create({

  container: {
    flex: 1,
  },
  
  buttongroup: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: '135%',
    paddingLeft: '0.1%',
    margin: 6,
  },
});
