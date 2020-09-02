import React, { Component   } from 'react';
import 'react-native-gesture-handler';
import { Camera } from 'expo-camera';
import {Constants,  ImagePicker, Text } from 'expo';
import * as Permissions from 'expo-permissions';
import { Button, View, StyleSheet, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


export default class Xcamera extends Component{
  constructor(props){
    super(props);
    this.state = {
    hasPermission: null,
    type: Camera.Constants.Type.back,
    }
  }
  async UNSAFE_componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasPermission: status === 'granted' });
  }


  /*async UNSAFE_componentWillMount(){
    const {  status } = await Permissions.askAsync('Permissions.CAMERA');
    this.setState({hasPermission:status === 'granted'});
  }
*/
  
  render(){
    this.UNSAFE_componentWillMount();
    const { hasPermission } = this.state
    if (hasPermission === null) {
      return <View />;
    } else if (hasPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
          <View style={{ flex: 1 }}>
            <Camera style={{ flex: 1 }} type={this.state.cameraType}>
              
            </Camera>
        </View>
      );
    }
  }
  
}
