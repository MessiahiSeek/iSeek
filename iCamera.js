import React, { useState, useEffect, Component  } from 'react';
import { Text, View, TouchableOpacity, ref, StyleSheet, ActivityIndicator, Image, ImageBackground  } from 'react-native';
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
import { Header, Left } from 'native-base';
import { YellowBox } from 'react-native'
import * as ImagePicker from 'expo-image-picker';
import { Video } from 'expo-av';
import { settingspage } from './settingspage.js';
import { message } from './message.js';
import { Container } from 'semantic-ui-react';
import { DrawerActions } from '@react-navigation/native';

//tensorflow
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import {cameraWithTensors} from '@tensorflow/tfjs-react-native';


//disable yellow warnings on EXPO client!
console.disableYellowBox = true;



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

  //Tensorflow and Permissions
  const [mobilenetModel, setMobilenetModel] = useState(null);
  const [frameworkReady, setFrameworkReady] = useState(false);

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

  const TensorCamera = cameraWithTensors(Camera);
  let requestAnimationFrameId = 0;


  //performance hacks (Platform dependent)
  const textureDims = Platform.OS === "ios"? { width: 1080, height: 1920 } : { width: 1600, height: 1200 };
  const tensorDims = { width: 152, height: 200 }; 

  //-----------------------------
  // Run effect once
  // 1. Check camera permissions
  // 2. Initialize TensorFlow
  // 3. Load Mobilenet Model
  //-----------------------------
  useEffect(() => {
    if(!frameworkReady) {
      (async () => {


        
        //check permissions
        const { status } = await Camera.requestPermissionsAsync();
        console.log(`permissions status: ${status}`);
        setHasPermission(status === 'granted');


        //we must always wait for the Tensorflow API to be ready before any TF operation...
        await tf.ready();


        //load the mobilenet model and save it in state
        setMobilenetModel(await loadMobileNetModel());


        setFrameworkReady(true);
      })();
    }
  }, []);


    //--------------------------
  // Run onUnmount routine
  // for cancelling animation 
  // (if running) to avoid leaks
  //--------------------------
  useEffect(() => {
    return () => {
      cancelAnimationFrame(requestAnimationFrameId);
    };
  }, [requestAnimationFrameId]);


  //-----------------------------------------------------------------
  // Loads the mobilenet Tensorflow model: 
  // https://github.com/tensorflow/tfjs-models/tree/master/mobilenet
  // Parameters:
  // 
  // NOTE: Here, I suggest you play with the version and alpha params
  // as they control performance and accuracy for your app. For instance,
  // a lower alpha increases performance but decreases accuracy. More
  // information on this topic can be found in the link above.  In this
  // tutorial, I am going with the defaults: v1 and alpha 1.0
  //-----------------------------------------------------------------
  const loadMobileNetModel = async () => {
    const model = await mobilenet.load();
    return model;
  }

/*-----------------------------------------------------------------------
MobileNet tensorflow model classify operation returns an array of prediction objects with this structure: 

prediction = [ {"className": "object name", "probability": 0-1 } ]

where:
  className = The class of the object being identified. Currently, this model identifies 1000 different classes.
  probability = Number between 0 and 1 that represents the prediction's probability 

Example (with a topk parameter set to 3 => default):
  [
     {"className":"joystick","probability":0.8070220947265625},
     {"className":"screen, CRT screen","probability":0.06108357384800911},
     {"className":"monitor","probability":0.04016926884651184}
  ]

In this case, we use topk set to 1 as we are interested in the higest result for both performance and simplicity. This means the array will return 1 prediction only!
------------------------------------------------------------------------*/
const getPrediction = async(tensor) => {
  if(!tensor) { return; }

  //topk set to 1
  const prediction = await mobilenetModel.classify(tensor, 1);
  console.log(`prediction: ${JSON.stringify(prediction)}`);

  if(!prediction || prediction.length === 0) { return; }

  //only attempt translation when confidence is higher than 20%
  if(prediction[0].probability > 0.2) {


    //stop looping!
    cancelAnimationFrame(requestAnimationFrameId);
    setPredictionFound(true);


    //get translation!
    await getTranslation(prediction[0].className);
  }
}
/*-----------------------------------------------------------------------
Helper function to handle the camera tensor streams. Here, to keep up reading input streams, we use requestAnimationFrame JS method to keep looping for getting better predictions (until we get one with enough confidence level).
More info on RAF: https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
-------------------------------------------------------------------------*/
const handleCameraStream = (imageAsTensors) => {
  const loop = async () => {
    const nextImageTensor = await imageAsTensors.next().value;
    await getPrediction(nextImageTensor);
    requestAnimationFrameId = requestAnimationFrame(loop);
  };
  if(!predictionFound) loop();
}

/*-----------------------------------------------------------------------
Helper function to show the Camera View. 

NOTE: Please note we are using TensorCamera component which is constructed on line: 37 of this function component. This is just a decorated expo.Camera component with extra functionality to stream Tensors, define texture dimensions and other goods. For further research:
https://js.tensorflow.org/api_react_native/0.2.1/#cameraWithTensors
-----------------------------------------------------------------------*/
const renderCameraView = () => {
  return <View style={styles.cameraView}>
              <TensorCamera
                style={styles.camera}
                type={Camera.Constants.Type.back}
                zoom={0}
                cameraTextureHeight={textureDims.height}
                cameraTextureWidth={textureDims.width}
                resizeHeight={tensorDims.height}
                resizeWidth={tensorDims.width}
                resizeDepth={3}
                onReady ={(imageAsTensors) => handleCameraStream(imageAsTensors)}//  ​={(imageAsTensors) => handleCameraStream(imageAsTensors)}
                autorender={true}
              />
              <Text style={styles.legendTextField}>Point to any object and get its {availableLanguages.find(al => al.value === language).label } translation</Text>
          </View>;
}

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
      {!checkVid ? 
      <TouchableOpacity style = {{position: 'absolute', borderRadius:100,bottom:'9%',left:'42.5%'}} onPress={ async () =>  this.snap()}>
         <Image source={require("./images/cam.png")} style={{ width: 55, height: 55 , borderRadius:100}} onPress={ async () =>  this.snap()}/>
      </TouchableOpacity>
         : 
         <TouchableOpacity style = {{position: 'absolute', borderRadius:100,bottom:'9%',left:'42.5%'}} onPressIn={starVideo} onPressOut = {stopVideo}>
         <Image source={require("./images/vid.jpeg")} style={{ width: 55, height: 55 ,  borderRadius:100}} />
      </TouchableOpacity>  
      }

      <TouchableOpacity style = {{position: 'absolute', borderRadius:100,bottom:'9%',left:'75%'}} onPressIn={handleOnPressIn} onPressOut={handleOnPressOut}> 
    {isFetching ?  <ActivityIndicator color="#0f0"></ActivityIndicator> :
         <Image source={require("./images/chat.png")} style={{ width: 55, height: 55 ,  borderRadius:100}} />}
      </TouchableOpacity> 

      <TouchableOpacity style = {{position: 'absolute', borderRadius:100,bottom:'9%',left:'10%'}} onPress={() => {setType(type === Camera.Constants.Type.back? Camera.Constants.Type.front: Camera.Constants.Type.back);}}> 
    {isFetching ?  <ActivityIndicator color="#0f0"></ActivityIndicator> :
         <Image source={require("./images/flipcamera.png")} style={{ width: 55, height: 55 ,  borderRadius:100}} />}
      </TouchableOpacity> 

      
      <TouchableOpacity style = {{position: 'absolute', borderRadius:100,bottom:'87.5%',left:'45%'}} onPress={() => checksetVid(!checkVid)}> 
    {isFetching ?  <ActivityIndicator color="#0f0"></ActivityIndicator> :
         <Icon name="ios-refresh-circle" color="#ccc" size={50}/>}
      </TouchableOpacity> 




      <TouchableOpacity style = {{position: 'absolute', borderRadius:100,bottom:'90%',left:'5%'}} onPressIn={handleOnPressIn} onPressOut={handleOnPressOut}> 
    {isFetching ?  <ActivityIndicator color="#0f0"></ActivityIndicator> :
         <Icon
         name="ios-menu"
         color="#ccc"
         size={25}
         onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
       />}
      </TouchableOpacity> 

      <TouchableOpacity style = {{position: 'absolute', borderRadius:100,bottom:'90%',left:'90%'}} onPressIn={handleOnPressIn} onPressOut={handleOnPressOut}> 
    {isFetching ?  <ActivityIndicator color="#0f0"></ActivityIndicator> :
         <Icon
         name="ios-browsers"
         color="#ccc"
         size={25}
         onPress = {() =>  this.getCameraPic()}
       />}

      </TouchableOpacity>

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
    bottom:'5%',
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