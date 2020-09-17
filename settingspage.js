import React, { useState, useEffect, Component  } from 'react';
import { Text, View, Switch, StyleSheet  } from 'react-native';
import { Left, Right, Separator } from 'native-base';
import { divide } from 'react-native-reanimated';


export const settingspage =({navigation}) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => 
    !previousState);

  return (
    <View>
        <View 
          style={{
            flex: 1,
            backgroundColor: 'transparent',
            flexDirection: 'row',
          }}>
          
        </View>
    </View>
  );
}
