import React, { useState, useEffect, Component  } from 'react';
import { Text, View, TouchableOpacity, ref, StyleSheet,  } from 'react-native';
import {  Button, ButtonGroup, Icon, Layout, Spinner } from '@ui-kitten/components';
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
        <View>
          <ButtonGroup style={styles.buttonGroup} size='large'>
        <Button onPress={async () =>  this.snap()}>
          Camera</Button>
          <Button onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}>Flip</Button>
        </ButtonGroup>
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  
  buttonGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    paddingTop: '135%',
    paddingLeft: '20%',
    margin: 6,
  },
});

