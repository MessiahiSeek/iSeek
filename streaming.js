import React, { useState, useEffect } from 'react';
import { ActivityIndicator, Alert, Text, View, ScrollView, StyleSheet, Vibration, Platform, TouchableOpacity, Image, Modal} from 'react-native';
import Constants from 'expo-constants';
import Icon from 'react-native-vector-icons/Ionicons';
import { DrawerActions } from '@react-navigation/native';
import {
  Button,
  Paragraph,
  Dialog,
  Portal,
  Provider,
  TextInput,
} from 'react-native-paper';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import * as Speech from 'expo-speech';

//Permissions
import * as Permissions from 'expo-permissions';


//camera
import { Camera } from 'expo-camera';


//tensorflow
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import {cameraWithTensors} from '@tensorflow/tfjs-react-native';

console.disableYellowBox = true;

export const streamingPage = ({navigation}) => {
    const [predictionFound, setPredictionFound] = useState(false);
    const [hasPermission, setHasPermission] = useState(null);
    const [isFetching, setIsFetching] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [recording, setRecording] = useState(null);


    //for text input boxes
    const [inputVal, setInputVal] = useState("lol");
    const [isDialogVisible, setIsDialogVisible] = useState(false);

    //Tensorflow and Permissions
    const [mobilenetModel, setMobilenetModel] = useState(null);
    const [frameworkReady, setFrameworkReady] = useState(false);
    const [prediction, setPrediction] = useState('N/A');

    const [popUpTitle,setPopUpTitle] = useState("What object Are you looking for?")
    const [cameraFocus, setCameraFocus] = useState(true);

    const TensorCamera = cameraWithTensors(Camera);
    let requestAnimationFrameId = 0;






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

      //performance hacks (Platform dependent)
    const textureDims = Platform.OS === "ios" ? { width: 1080, height: 1920 } : { width: 1600, height: 1200 };
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
        console.log("reached here");
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
  if(!tensor) { 
    return;}


    //topk set to 1
    const prediction = await mobilenetModel.classify(tensor, 1);
    
    //console.log(`prediction: ${JSON.stringify(prediction)}`);
    
    //console.log(prediction[0].className);

    if(!prediction || prediction.length === 0) { 
      console.log("No predict")
      return; }

    //only attempt translation when confidence is higher than 20%
    
    if(prediction[0].className == inputVal) {
      console.log(inputVal);
      Vibration.vibrate();
      const { sound } = Audio.Sound.createAsync(
        require('./assets/small-bell-ringing-02.mp3'),{ shouldPlay: true }
          );
          console.log('Playing Sound');
    }
      


    if(prediction[0].probability > 0.4) {
      setPrediction(prediction[0].className)
      cancelAnimationFrame(requestAnimationFrameId);
      setPredictionFound(true);
      
      
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
      //updatePreview();
      //gl.endFrameEXP();
    };
    loop();
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
                  onReady={(imageAsTensors) => handleCameraStream(imageAsTensors)}
                  autorender={true}
                />
                
            </View>;
  }

  const handleOnPressIn = () => {
    startRecording();
  };
  
  const handleOnPressOut = () => {
    stopRecording();
  };


  



  startRecording = async () => {
    const { status } = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
    setHasPermission(status === 'granted');
    if (status !== 'granted') return;
    setIsRecording(true);
    Vibration.vibrate();
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
    } catch (error) {
      console.log(error);
      stopRecording();
    }
    setRecording(recording);
  }

  const stopRecording = async () => {
    setIsRecording(false);
    setIsFetching(true);

    setTimeout(async ()  => {
    try {
        await recording.stopAndUnloadAsync();
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
                Speech.speak("We Support " + data.objectChoice  + " is this okay?");
                Speech.speak("If yes, continue with scanning, if no please try another word.");
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
    } catch (error) {
      console.log(error)
        // Do nothing -- we are already unloaded.
    }
  }, 1000);
}

  const renderChatButton = () => {
    return <View>
      <TouchableOpacity /*style = {{position: 'absolute', borderRadius:"100%",bottom:'9%',left:'75%'}}*/ onPressIn={handleOnPressIn} onPressOut={handleOnPressOut}> 
    {isFetching ?  <ActivityIndicator color="#0f0"></ActivityIndicator> :
         <Image source={require("./images/chat.png")} style={{ width: 55, height: 55 ,  borderRadius:100}} />}
      </TouchableOpacity> 
    </View>
  }
  const checkForAvailability = async () =>{
    
    // console.log(inputVal);
    //fetch('http://ec2-3-23-33-73.us-east-2.compute.amazonaws.com:5000/streamingCheck',
    await fetch(/*'http://153.42.129.91:5000/streamingCheck'*/'http://iseek.cs.messiah.edu:5000/streamingCheck',
           {
             method: 'POST',
             headers:{
               Accept: 'application/json',
               'Content-Type': 'application/json',
             },
             body: JSON.stringify({
               requestedObject: inputVal
             }),
           }).then((response) => response.json())
           .then((json) => {
             console.log("HI");
             if(json.objectAvailability){

              if(json.yesNoNeeded){
                console.log("hello world");
                Alert.alert(
                  "Training Mismatch",
                  "Is "+ json.objectChoice + " okay?",
                  [
                    {
                      text: "No",
                      onPress: () => console.log("Canceled"),
                      style: "cancel"
                    },
                    { text: "Yes", onPress: () => setInputVal(json.objectChoice) }
                  ],
                  { cancelable: false }
                );
              }
              else{
                console.log("Here")
                console.log(json.objectChoice)
                setInputVal(json.objectChoice)

              }

             }else{
               
               Alert.alert("We currently dont support this object");
             }
                setIsDialogVisible(false);
                setIsFetching(false);
            })
    }
  
  const renderTextInput = () => {
    return <Provider>
      <View>
      <TouchableOpacity onPress={() => {
        setIsDialogVisible(true);
        setCameraFocus(false);
      }
      }>
      <Image source={require("./images/binoculars.png")} style={{ width: 55, height: 55 ,  borderRadius:100}} />
      </TouchableOpacity> 
      <Portal >
        <Dialog visible={isDialogVisible}
            onDismiss={() => setIsDialogVisible(false)}
            style = {{position:'absolute', width:300, bottom:400 }}
            >
              <Dialog.Title>{popUpTitle}</Dialog.Title>
            <Dialog.Content>
              <TextInput
                value={inputVal}
                onChangeText={inputVal => setInputVal(inputVal)}
              />
              </Dialog.Content>
              <Dialog.Actions>
              <Button onPress={() => {
                setIsDialogVisible(false);
                setCameraFocus(true);
                checkForAvailability();
                
                if(popUpTitle !== "What object are you looking for?"){
                  setPopUpTitle("What object are you looking for?")
                }
                }}>Done</Button>
            </Dialog.Actions>
          </Dialog>
      </Portal>
      </View>
      </Provider>
  }

  const renderMenuButton = () => {
    return <View>
    <TouchableOpacity style = {{position: 'absolute', top:'50%',left:'5%'}} onPressIn={handleOnPressIn} onPressOut={handleOnPressOut}> 
    
         <Icon
         name="ios-menu"
         //color="#"
         size={25}
         onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
       />
      </TouchableOpacity>
      </View>
  }
  return (
     <>
    
      
    <View style={styles.container}>
      { renderMenuButton() }
      <View style={styles.cameraView}>
        { cameraFocus && renderCameraView() }
      </View>
      <Text style={styles.legendTextField2}>  Searching For: {inputVal}</Text>
      <Text style={styles.legendTextField}>  Prediction: {prediction.split(",")[0]}</Text>
      <View style={styles.body}>
      </View>  
        <View style = {{position: 'absolute',  zIndex: 1200, borderRadius:100,bottom:'2%',left:'3%'}}  >{ renderTextInput() }</View>
      <View style = {{position: 'absolute', zIndex: 1200, borderRadius:100,bottom:'2%',left:'80%'}}>{ cameraFocus && renderChatButton() }</View>
  </View>

      </>
  );

      
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'flex-start',
      paddingTop: Constants.statusBarHeight,
      backgroundColor: '#E8E8E8',
    },
    cameraView: {
      display: 'flex',
      justifyContent: 'center', 
      width: '100%',
      height: '100%',
      alignItems: 'flex-start',
    },
    camera : {
      width: '100%',
      height: '100%',
      zIndex: 1,
      marginTop: 120
    },
    translationView: {
      marginTop: 30, 
      padding: 20,
      borderColor: '#cccccc',
      borderWidth: 1,
      borderStyle: 'solid',
      backgroundColor: '#ffffff',
      marginHorizontal: 20,
      height: 500
    },
    translationTextField: {
      fontSize:60
    },
    wordTextField: {
      textAlign:'right', 
      fontSize:20, 
      marginBottom: 50
    },
    legendTextField: {
      textAlign: 'center', 
      fontStyle: 'italic',
      color: '#0f3381',
      position:'absolute',
      bottom:'94%',
      right:'-5%',
      fontSize: 18,
      width: 400,
    },
    legendTextField2: {
    textAlign: 'center', 
    fontStyle: 'italic',
    color: '#0f3381',
    position:'absolute',
    bottom:'96%',
    right:'-5%',
    fontSize: 18,
    width: 400,
  },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: 'blue',
        borderStyle: 'solid',
        borderRadius: 8,
        color: 'black',
        paddingRight: 30,
        backgroundColor: '#ffffff'
      },
      
      submitButton: {
        position: 'absolute',
        bottom:'2%',
        left:'3%',
    },
    submitButton2: {
      position: 'absolute',
      bottom:'2%',
      right:'3%',
  }
    });
    const pickerSelectStyles = StyleSheet.create({
        inputIOS: {
          fontSize: 16,
          paddingVertical: 12,
          paddingHorizontal: 10,
          borderWidth: 1,
          borderColor: 'grey',
          borderRadius: 4,
          color: 'black',
          paddingRight: 30
        },
        inputAndroid: {
          fontSize: 16,
          paddingHorizontal: 10,
          paddingVertical: 8,
          borderWidth: 0.5,
          borderColor: 'grey',
          borderRadius: 3,
          color: 'black',
          paddingRight: 30,
          backgroundColor: '#cccccc'
        }
      });
      
          