import React, { useState, useEffect } from 'react';
import { ActivityIndicator, Text, View, ScrollView, StyleSheet, Vibration, Platform,TouchableOpacity , Image} from 'react-native';
import Constants from 'expo-constants';
import * as Speech from 'expo-speech';
import {
  Button,
  Paragraph,
  Dialog,
  Portal,
  Provider,
  TextInput,
} from 'react-native-paper';

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


    //for text input boxes
    const [inputVal, setInputVal] = useState("laptop");
    const [isDialogVisible, setIsDialogVisible] = useState(false);

    //Tensorflow and Permissions
    const [mobilenetModel, setMobilenetModel] = useState(null);
    const [frameworkReady, setFrameworkReady] = useState(false);
    const [prediction, setPrediction] = useState('N/A');

    const [popUpTitle,setPopUpTitle] = useState("What object Are you looking for?")

    const TensorCamera = cameraWithTensors(Camera);
    let requestAnimationFrameId = 0;


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
    if(!tensor) { return; }

    //topk set to 1
    const prediction = await mobilenetModel.classify(tensor, 1);
    console.log(`prediction: ${JSON.stringify(prediction)}`);
    //console.log(prediction[0].className);

    if(!prediction || prediction.length === 0) { return; }

    //only attempt translation when confidence is higher than 20%
    
    if(prediction[0].className == inputVal) {
      console.log(inputVal);
      Vibration.vibrate();
    }
    if(prediction[0].probability > 0.6) {
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
    getTranscription();
  };


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
       //Speech.speak("You said " + data.voiceResponse);
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
    } catch(error) {
        console.log('There was an error reading file', error);
        stopRecording();
        // resetRecording();
    }
    setIsFetching(false);
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
    console.log(inputVal)
    //fetch('http://ec2-3-23-33-73.us-east-2.compute.amazonaws.com:5000/streamingCheck',
    await fetch('http:192.168.1.5:5000/streamingCheck',
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
             
             if(json.objectAvailability == "True"){
               console.log("Here")
               setInputVal(json.objectChoice)
             }else{
               setIsDialogVisible(true);
               setPopUpTitle("We currently dont support that object, try again.")
             }
            })
    }
  
  const renderTextInput = () => {
    return <Provider>
      <View>
      <TouchableOpacity onPress={() => setIsDialogVisible(true)}>
      <Image source={require("./images/chat.png")} style={{ width: 55, height: 55 ,  borderRadius:100}} />
      </TouchableOpacity> 
      <Portal >
        <Dialog visible={isDialogVisible}
            onDismiss={() => setIsDialogVisible(false)}
            style = {{position:'absolute',width:300,bottom:300 }}
            >
              <Dialog.Title>{popUpTitle}</Dialog.Title>
            <Dialog.Content>
              <TextInput
                value={inputVal}
                onEndEditing={text => setInputVal(text)}
              />
              </Dialog.Content>
              <Dialog.Actions>
              <Button onPress={() => {
                setIsDialogVisible(false);
                
                checkForAvailability();
                
                if(popUpTitle !== "What object Are you looking for?"){
                  setPopUpTitle("What object Are you looking for?")
                }
                }}>Done</Button>
            </Dialog.Actions>
          </Dialog>
      </Portal>
      </View>
      </Provider>
  }
 
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          Object Detection Streaming
        </Text>
      </View>
      {!isDialogVisible && (
      <View style={styles.container}>
      <View style={styles.body}>
        { renderCameraView() }
      </View>  
      <Text style={styles.legendTextField}>  Prediction: {prediction}</Text>
      <View style={styles.body}>
        
      </View>  
      </View>
      )}
        <View style={styles.submitButton} >{ renderTextInput() }</View>
        {!isDialogVisible && (<View style={styles.submitButton2}>{ renderChatButton() }</View>)}
      </View>
  );

      
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'flex-start',
      paddingTop: Constants.statusBarHeight,
      backgroundColor: '#E8E8E8',
    },
    header: {
      backgroundColor: '#41005d'
    },
    title: {
      margin: 10,
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
      color: '#ffffff'
    },
    body: {
      padding: 5,
      paddingTop: 25
    },
    cameraView: {
      display: 'flex',
      flex:1,
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'flex-end',
      width: '100%',
      height: '100%',
      paddingTop: 10
    },
    camera : {
      width: 700/2,
      height: 800/2,
      zIndex: 1,
      borderWidth: 0,
      borderRadius: 0,
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
      bottom:'20%',
      right:'20%',
      fontSize: 18,
      width: 200,
    },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: 'purple',
        borderStyle: 'solid',
        borderRadius: 8,
        color: 'black',
        paddingRight: 30,
        backgroundColor: '#ffffff'
      },
      
      submitButton: {
        position: 'absolute',
        bottom:15,
        left:15,
    },
    submitButton2: {
      position: 'absolute',
      bottom:15,
      right:15,
  }
    });
    const pickerSelectStyles = StyleSheet.create({
        inputIOS: {
          fontSize: 16,
          paddingVertical: 12,
          paddingHorizontal: 10,
          borderWidth: 1,
          borderColor: 'gray',
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
        },
        inpAn: {
          fontSize: 16,
          paddingHorizontal: 10,
          paddingVertical: 8,
          borderWidth: 0.5,
          borderColor: 'grey',
          borderRadius: 3,
          color: 'black',
          paddingRight: 30,
          backgroundColor: '#cccccc'
        },
      });
      
          