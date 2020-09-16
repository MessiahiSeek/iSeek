import React, { useState, useEffect, Component  } from 'react';
import { Text, View, Switch, StyleSheet  } from 'react-native';
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
              

        <Switch style={styles.switch}
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
      paddingTop: 20,
      paddingRight: 10,
      flexDirection: 'column',
      alignItems: 'flex-end'
    },
    
    switch: {
      
    }
  });