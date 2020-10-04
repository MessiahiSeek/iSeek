import React, { useState, useEffect, Component  } from 'react';
import { Text, View, StyleSheet, TouchableOpacity  } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'
import ActionButton from 'react-native-action-button';
import { Left, Right, Separator } from 'native-base';
import { Row, Divider, Caption, Rubik, Switch, switchOn, Button } from '@shoutem/ui';


export const settingspage =({navigation}) => {

  return (
    <View style={styles.container}>


    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0e68b3',
  },

  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
  Subtitle: {
    alignContent: "center",
  },
});