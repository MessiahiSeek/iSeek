import React, { useState, useEffect, Component  } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ref, Button, ActivityIndicator  } from 'react-native';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { Audio } from 'expo-av';
import * as Permissions from 'expo-permissions';
import * as FileSystem from 'expo-file-system';





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
            console.log(photo.uri);   
            MediaLibrary.saveToLibraryAsync(photo.uri);    
            });  
            
    }
  };

  
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

const styles = StyleSheet.create({
  container: {
      marginTop: 40,
      backgroundColor: '#fff',
      alignItems: 'center',
  },
  button: {
      backgroundColor: '#48C9B0',
      paddingVertical: 20,
      width: '35%',
      alignItems: 'center',
      borderRadius: 5,
      marginTop: 0,
      height: '10%'
  }
});


  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={{ flex: 1 }}>
      <Camera style={{ flex: 1 }} type={type} ref={ref => { this.camera = ref; }}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'transparent',
            flexDirection: 'row',
          }}>
          <TouchableOpacity
            style={{
              flex: 0.1,
              alignSelf: 'flex-end',
              alignItems: 'center',
            }}
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}>
            <Text style={{ fontSize: 25, marginBottom: 50, color: 'white' }}> Flip </Text>
          </TouchableOpacity>
        <Button
        title="Press Me!"
        onPress={async () =>  this.snap()}
        color="#67f210"
        />
        <TouchableOpacity
                    style={styles.button}
                    onPressIn={handleOnPressIn}
                    onPressOut={handleOnPressOut}
                >
                    {isFetching && <ActivityIndicator color="#ffffff" />}
                    {!isFetching && <Text>Hold for Voice Search</Text>}
                </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );

  
}
