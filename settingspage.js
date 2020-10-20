import React, { useState, useEffect, Component  } from 'react';
import { NavigationContainer, DrawerActions, DefaultTheme, DarkTheme, useTheme } from '@react-navigation/native';
import { Text, View, StyleSheet, TouchableOpacity, Switch, FlatList  } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'
import { Left, Right, Separator } from 'native-base';
import { Row, Divider, Caption, Rubik, switchOn, Button } from '@shoutem/ui';
import { EventRegister } from 'react-native-event-listeners';
import { color } from 'react-native-reanimated';



export const settingspage =({navigation}) => {

  const {colors} = useTheme();

  const [darkMode,setDarkMode]=useState(false);

  return (

    <View style={styles.container}>
      <Text style={styles.item}> Dark Mode</Text>
      <Switch value={darkMode} 
      onValueChange={(value)=>{
      setDarkMode(value);
      EventRegister.emit('changeThemeEvent', value);
      }}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.primary,
  },
  text: {
    fontSize: 20,
    padding: 25,
    alignContent: "center",
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
});