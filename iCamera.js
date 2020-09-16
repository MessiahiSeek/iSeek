import React, { useState, useEffect, Component  } from 'react';
import { Text, View, TouchableOpacity, ref, Button, StyleSheet,  } from 'react-native';
import {  Icon, Layout, Spinner } from '@ui-kitten/components';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library'

export const XCamera =({navigation}) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
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
            flexDirection: '',
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
            <Text > Flip </Text>
          </TouchableOpacity>
        <Button
        title="Press Me!"
        onPress={async () =>  this.snap()}
        expo
        />
        </View>
      </Camera>
    </View>
  );
}

