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
import { Video } from 'expo-av';


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
  const [vid,setVid] = useState(null);
  const [checkVid,checksetVid] = useState(null);


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
  starVideo = async () =>
  {
      console.log("world")
      
      const options = { quality: Camera.Constants.VideoQuality[2160], mute:true}
      const video = await this.camera.recordAsync(options);
      setIsPictureFetching(true);

      MediaLibrary.saveToLibraryAsync(video.uri);
      const fileUri = video.uri;
      var file = {
        uri: fileUri,
        name: 'video.mov'
      }
      var body = new FormData();
      body.append('file',file);
      fetch('http://ec2-3-23-33-73.us-east-2.compute.amazonaws.com:5000/video', {
          method: 'POST',
          body: body
      }).then((response) => response.json())
      .then((json) => {
        setVid(json.vidResponse);
        setIsPictureFetching(false);
       })
  } 

  stopVideo = async () =>
  {
      this.camera.stopRecording();
  }
 
  return (
    
    <View style={styles.container}>
        {(photoJson != "" && vid == null && !isPictureFetching)  && (
           
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

        {(photoJson == "" && vid != null && !isPictureFetching)  && (
           <>
         
           <Video
           source={{ vid }}
           rate={1.0}
           volume={1.0}
           isMuted={false}
           resizeMode="cover"
           shouldPlay
           isLooping
           //style={{ width: 300, height: 300 }}
         />

            {(Load) && (
            <ActivityIndicator alignContent="center" size="large" color="#000" 
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
          </>
        )}

          

      {(isPictureFetching)&&<View style={[styles.container_nik,styles.horizontal]}>
        <ActivityIndicator alignContent="center" size="large" color="#000"></ActivityIndicator>
      </View>}


      {(photoJson == "" && !isPictureFetching && vid == null) &&(
        <>
        <Camera style={{ flex: 1 }} type={type} ref={ref => { this.camera = ref; }}>
      </Camera>
      { !checkVid ? 
         <Button onPress={ async () =>  this.snap()}> Camera</Button> 
         : <Button onPressIn={starVideo} onPressOut = {stopVideo}> Video</Button> } 
        <Button onPressIn={handleOnPressIn}    onPressOut={handleOnPressOut}>
                    {isFetching && <ActivityIndicator/>}
                    {!isFetching && <Text>Voice Search</Text>}
                </Button>

        <ActionButton style={styles.close2} buttonColor="rgba(23,176,60,.71)">  
          <ActionButton.Item title="Switch Camera" buttonColor='#5d2124' onPress={() => {setType(type === Camera.Constants.Type.back? Camera.Constants.Type.front: Camera.Constants.Type.back);}}>
            <Icon name="ios-refresh"/>
          </ActionButton.Item>
                <ActionButton.Item title="Camera Roll" buttonColor='#1d4691' onPress = {() =>  this.getCameraPic()}> 
                <Icon name="ios-book"/>
                </ActionButton.Item>
                {/*</ButtonGroup>*/}
                {checkVid ? <ActionButton.Item buttonColor='#5d27f2' title="switch to camera" onPress={() => checksetVid(!checkVid)}  >
                  <Icon name="ios-videocam"/>
            </ActionButton.Item> :
            <ActionButton.Item buttonColor='#5d27f2' title="switch to video" onPress={() => checksetVid(!checkVid)}  >
            <Icon name="ios-videocam"/>
      </ActionButton.Item>}

          </ActionButton>
        </>  
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
    bottom:'15%',
    //width: '100%', 
    //padding: 30,
    //justifyContent: 'center', 
    //alignItems: 'flex-start',
    //top: '195%',
    alignSelf:'flex-end'
   //marginRight:'5%',

  },
  buttongroup: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: '135%',
    paddingLeft: '0.1%',
    margin: 6,
  },
});