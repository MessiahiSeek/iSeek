import React, { Component } from 'react';
import { Entypo } from '@expo/vector-icons'; 
import { SafeAreaView, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'
import ActionButton from 'react-native-action-button';
import Carousel from "react-native-carousel-control";
import { Container, Header, Content, View, Alert, Text, Footer, FooterTab, Fab, Left, Body, Right, Title, Tab, Tabs, Styles } from 'native-base';
import {  Button, ButtonGroup, Layout, Spinner, Divider, Caption, Rubik, Tile, Image, Subtitle, ImageBackground, Overlay } from '@shoutem/ui';
import { XCamera } from './iCamera.js';
import { settingspage } from './settingspage.js';
import { color } from 'react-native-reanimated';



export const HomeScreen =({navigation}) => {
      
        return (

<View style={styles.container}>
          <Carousel>

          <Button
          style={styles.button1}
          onPress={()=>navigation.navigate('Camera')}>
          <Text>Read Text </Text>
          <Icon name="ios-glasses" style={styles.actionButtonIcon} />
          </Button>
    
          <Button 
          style={styles.button2}
          onPress={()=>navigation.navigate('Camera')}>
            <Text>Find Objects  </Text>
            <Icon name="md-camera" style={styles.actionButtonIcon} />
          </Button>

          <Button 
          style={styles.button3}
          onPress={()=>navigation.navigate('Faq')}> 
              <Text>FAQ  </Text>
              <Icon name="md-book" style={styles.actionButtonIcon} />
            </Button>

            <Button
            style={styles.button4}
            onPress={()=>navigation.navigate('Settings')}>  
              <Text>Settings  </Text>
              <Icon name="md-settings" style={styles.actionButtonIcon} />
            </Button>

</Carousel>

<ActionButton buttonColor="rgba(231,76,60,1)">
          <ActionButton.Item buttonColor='#ffa500' onPress={() => console.log("notes tapped!")}>
            <Icon name="ios-text" style={styles.actionButtonIcon} />
          </ActionButton.Item>
        </ActionButton>
        </View>
        

        );
    }

    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: '#fff',
      },
      button1: {
        height: 300,
        marginTop: 10,
        marginLeft: 8,
        width: '95%',
        borderRadius: 20,
        backgroundColor: '#6bcbeb',
      },
      button2: {
        height: 300,
        marginTop: 10,
        marginLeft: 8,
        width: '95%',
        borderRadius: 20,
        backgroundColor: '#07a5dc',
      },
      button3: {
        height: 300,
        marginTop: 10,
        marginLeft: 8,
        width: '95%',
        borderRadius: 20,
        backgroundColor: '#0290cf',
      },
      button4: {
        height: 300,
        marginTop: 10,
        marginLeft: 8,
        width: '95%',
        borderRadius: 20,
        backgroundColor: '#037ec3',
      },
      Subtitle: {
        alignContent: "center",
      },
    });