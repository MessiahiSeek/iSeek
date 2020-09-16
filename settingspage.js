import React, { useState, useEffect, Component  } from 'react';
import { Text, View, Switch, StyleSheet  } from 'react-native';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library'
import { Left, Right, Separator } from 'native-base';
import { divide } from 'react-native-reanimated';


export const settingspage =({navigation}) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => 
    !previousState);

  return (
    <View style={styles.container}>
        <View 
          style={{
            flex: 1,
            backgroundColor: 'transparent',
            flexDirection: 'row',
          }}>
              
        


          <Switch  
        trackColor={{ false: "#fff", true: "#22ff00" }}
        thumbColor={isEnabled ? "#fff" : "#fff"}
        ios_backgroundColor="#D2D2D2"
        onValueChange={toggleSwitch}
        value={isEnabled}
      />

          <Separator />

          <Switch  
        trackColor={{ false: "#fff", true: "#22ff00" }}
        thumbColor={isEnabled ? "#fff" : "#fff"}
        ios_backgroundColor="#D2D2D2"
        onValueChange={toggleSwitch}
        value={isEnabled}
      />

        </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      position:'relative',
      padding: 0,
      flexDirection: 'column',
      alignItems: 'center'
    },
    
    switch: {
        padding: 25
    }
  });