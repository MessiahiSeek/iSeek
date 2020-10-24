import React, { useState, useEffect, Component  } from 'react';
import { Text, View, TouchableOpacity, ref, StyleSheet, ActivityIndicator,Image, ImageBackground  } from 'react-native';
import {  Button, ButtonGroup,/* Icon*/ Layout, Spinner } from '@ui-kitten/components';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { Audio } from 'expo-av';
import * as Permissions from 'expo-permissions';
import * as FileSystem from 'expo-file-system';
import { render } from 'react-dom';
import * as Speech from 'expo-speech';
import Icon from 'react-native-vector-icons/Ionicons';
import ActionButton from 'react-native-action-button';
import { Left } from 'native-base';
import { YellowBox } from 'react-native'
import * as ImagePicker from 'expo-image-picker';

YellowBox.ignoreWarnings([
  'Animated: `useNativeDriver` was not specified. This is a required option and must be explicitly set to `true` or `false`',
])

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
  const [objectsInPic,SetObjectsInPhoto] = useState("");
  const [isPictureFetching, setIsPictureFetching] = useState(false);
  const [picStr,setPicStr] = useState("");
  const [textInPic,setTextinPic] = useState("");
  const [Load,SetLoad] = useState(false);



  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);


  snap = async () => {
    if (this.camera) {
      setIsPictureFetching(true);
      const options = { quality: .1, base64: true, fixOrientation: true, 
        exif: true};
        await this.camera.takePictureAsync(options).then(photo => {
           //photo.exif.Orientation = 1;            
            setPicStr(photo.base64);
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
             SetObjectsInPhoto(json.objects);
             //console.log(photoJson);
             //console.log("hello world")npm
             setIsPictureFetching(false);
            })
         });
         
     }  
     
   }

  
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
      const fileUri = info.uri;
      var file = {
        uri: fileUri,
        type: 'audio/x-wav',
        name: 'audio.wav'
      }
      var body = new FormData();
      body.append('file',file);
      
      const response = await fetch('http://ec2-3-23-33-73.us-east-2.compute.amazonaws.com:5000/recording', {
          method: 'POST',
          body: body
      });
      const data = await response.json();
      Speech.speak("You said " + data.voiceResponse);
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
  
  SavePicture = async () =>{
    const filename = FileSystem.documentDirectory + "iSeekPhoto.jpg";
    await FileSystem.writeAsStringAsync(filename, photoJson, {
    encoding: FileSystem.EncodingType.Base64,
    });
    await MediaLibrary.saveToLibraryAsync(filename);
  }
  ListObjects = async () => {
    let obj = objectsInPic.split('\n');
    Speech.speak("The Objects in this picture are:");
    for(i = 0; i < obj.length; i++){
      if (obj[i+1] === "" ){
        Speech.speak("and " +obj[i]);
        return;
      }
      else{
      Speech.speak(obj[i]);
    }
  }
  }
  findText = async () => {
    SetLoad(true);
     fetch('http://ec2-3-23-33-73.us-east-2.compute.amazonaws.com:5000/text',
           {
             method: 'POST',
             headers:{
               Accept: 'application/json',
               'Content-Type': 'application/json',
             },
             body: JSON.stringify({
               pictureString: picStr,
             }),
           }).then((response) => response.json())
           .then((json) => {
            console.log(json.imageText);
             setTextinPic(json.imageText);
             SetLoad(false);


           if (textInPic === null){
            Speech.speak("There is no  text in this picture.");
           }
           else{
           Speech.speak("The text in this picture is ");
           Speech.speak(json.imageText);
           }
          }
           )
           
  }
  getCameraPic = async () =>{
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      //allowsEditing: true,
      //aspect: [4, 3],
      quality: 1,
      base64: true,
    });


    if (!result.cancelled) {
      setIsPictureFetching(true);
      fetch('http://ec2-3-23-33-73.us-east-2.compute.amazonaws.com:5000/image',
      //fetch('153.42.129.91:5000/image',
           {
             method: 'POST',
             headers:{
               Accept: 'application/json',
               'Content-Type': 'application/json',
             },
             body: JSON.stringify({
               pictureString: result.base64,
             }),
           }).then((response) => response.json())
           .then((json) => {
             setPhoto(json.pictureResponse);
             SetObjectsInPhoto(json.objects);
             setIsPictureFetching(false);
            })
    }
  }
  return (
    
    <View style={styles.container}>
        {(photoJson != "" && !isPictureFetching)  && (
          <ImageBackground source ={{ uri:`data:image/jpg;base64,${photoJson}`}} style={{flex:1, height: undefined, width: undefined}}>
            {(Load) && (<ActivityIndicator alignContent="center" size="large" color="#000" 
            style={{position:"absolute"}}> </ActivityIndicator>)}
          <View style={styles.close}>
          <Button title="Save Picture" style={{position:"absolute", backgroundColor:'#F50303',borderRadius:10,borderWidth: 1,borderColor: '#fff'}} onPress={async () => this.SavePicture()}> Save Picture</Button>
          </View>
          <ActionButton style={styles.close2} buttonColor="rgba(231,76,60,1)">
          <ActionButton.Item buttonColor='#f0fff1' title="Read Objects out loud" onPress={()=>this.ListObjects()}>
            <Icon name="ios-text"   onPress={()=>this.ListObjects()}/>
          </ActionButton.Item>
          <ActionButton.Item buttonColor='#5f6702' title="Find text in screen"onPress={()=>this.findText()} >
            <Icon name="ios-book" onPress={()=>this.findText()}/>
          </ActionButton.Item>
          </ActionButton>
          
          </ImageBackground>
          )}


          

      {(isPictureFetching)&&<View style={[styles.container_nik,styles.horizontal]}>
        <ActivityIndicator alignContent="center" size="large" color="#000"></ActivityIndicator>
      </View>}


      {(photoJson == "" && !isPictureFetching) &&(
        <Camera style={{ flex: 1 }} type={type} ref={ref => { this.camera = ref; }}>
        <View>
          <ButtonGroup style={styles.buttongroup} size='large'>
        <Button onPress={ async () =>  this.snap()}> Camera</Button>
          <Button onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}>Flip</Button>
        
        <Button onPressIn={handleOnPressIn}    onPressOut={handleOnPressOut}>
                    {isFetching && <ActivityIndicator/>}
                    {!isFetching && <Text>Voice Search</Text>}
                </Button>
                <Button  onPress = {() =>  this.getCameraPic()}> Camera Roll</Button>
                </ButtonGroup>
                </View>
                </Camera>
      ) }
        
    </View>
   ); 
  }
          
        
      
const styles = StyleSheet.create({
  container_nik: {
    flex: 1,
    justifyContent: "center"
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },

  container: {
    flex: 1,
  },
  close: {
    position: 'absolute',
    width: '100%', 
    padding: 30,
    justifyContent: 'center', 
    alignItems: 'flex-start',
   bottom: 45,
   marginLeft:'5%',

  },
  close2: {
    position: 'absolute',
    width: '100%', 
    padding: 30,
    justifyContent: 'center', 
    alignItems: 'flex-start',
   bottom: 20,
   marginRight:'5%',

  },
  buttongroup: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: '135%',
    paddingLeft: '0.1%',
    margin: 6,
  },
});