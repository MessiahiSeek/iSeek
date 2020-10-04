import React, { useState, useEffect, Component  } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Switch  } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'
import { Left, Right, Separator } from 'native-base';
import { Row, Divider, Caption, Rubik, switchOn, Button } from '@shoutem/ui';


export const settingspage =({navigation}) => {

  const [isSwitchEnabled, setSwitch] = React.useState(false)

  return (
    <View style={styles.container}>
      <Text>Light and Dark</Text>
      <Switch
        value={true}
        onValueChange={(value) => setSwitch(value)}
      />
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0e68b3',
  },
  text: {
    fontSize: 20,
    padding: 25,
    alignContent: "center"
  }
});