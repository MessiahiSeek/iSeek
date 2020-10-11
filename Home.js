import React, { Component } from 'react';
import { Entypo } from '@expo/vector-icons'; 
import { SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { BlurView } from 'expo-blur';
import Icon from 'react-native-vector-icons/Ionicons'
import { Container, Header, Content, View, Alert, Text, Footer, FooterTab, Fab, Left, Body, Right, Title, Tab, Tabs, Styles } from 'native-base';
import {  Button, ButtonGroup, Layout, Spinner, Divider, Caption, Rubik, Tile, Image, Subtitle, ImageBackground, Overlay } from '@shoutem/ui';
import { XCamera } from './iCamera.js';
import { settingspage } from './settingspage.js';
import { color } from 'react-native-reanimated';



export const HomeScreen =({navigation}) => {
      
        return (
        
<ImageBackground source={require('./assets/home.png')} style={styles.container}>
<BlurView intensity={100} style={[StyleSheet.absoluteFill, styles.nonBlurredContent]}></BlurView>

  <View
    style={{
    flexDirection: 'row',
    borderBottomColor: 'white',
    borderBottomWidth: 1,
    }}
  >

  <Button
    style={styles.button}
    onPress={()=>navigation.navigate('Camera')}>
  <BlurView intensity={50} style={[StyleSheet.absoluteFill, styles.nonBlurredContent, styles.blur]}></BlurView>
  <Icon name="ios-search" size='50x' color="#fff" style={styles.actionButtonIcon} />
  <Text style={styles.text}>Read</Text>
  </Button>       

  <Button 
    style={styles.button}
    onPress={()=>navigation.navigate('Camera')}>
  <BlurView intensity={50} style={[StyleSheet.absoluteFill, styles.nonBlurredContent, styles.blur]}></BlurView>
  <Icon name="md-camera" size="50x" color="#fff" style={styles.actionButtonIcon} />
  <Text style={styles.text}>Search</Text>
  </Button>

  </View>

  <View
    style={{
    flexDirection: 'row',
    borderBottomColor: 'white',
    borderBottomWidth: 1,
    }}
  >

          <Button 
          style={styles.button}
          onPress={()=>navigation.navigate('Faq')}>
            <BlurView intensity={50} style={[StyleSheet.absoluteFill, styles.nonBlurredContent, styles.blur]}></BlurView> 
              <Icon name="md-book" size="50x" color="#fff" style={styles.actionButtonIcon} />
              <Text style={styles.text}>FAQ</Text>
            </Button>

            

            <Button
            style={styles.button}
            onPress={()=>navigation.navigate('Settings')}>
              <BlurView intensity={50} style={[StyleSheet.absoluteFill, styles.nonBlurredContent, styles.blur]}></BlurView>  
              <Icon name="md-chatbubbles" size="50x" color="#fff" style={styles.actionButtonIcon} />
              <Text style={styles.text}>Messages</Text>
            </Button>
        
            </View>

            <View
  style={{
    flexDirection: 'row',
    borderBottomColor: 'white',
  }}
>
<Button 
          style={styles.button}
          onPress={()=>navigation.navigate('Faq')}>
            <BlurView intensity={50} style={[StyleSheet.absoluteFill, styles.nonBlurredContent, styles.blur]}></BlurView> 
              <Icon name="md-help" size="50x" color="#fff" style={styles.actionButtonIcon} />
              <Text style={styles.text}>Unkown?</Text>
            </Button>

            <Button
            style={styles.button}
            onPress={()=>navigation.navigate('Settings')}>
              <BlurView intensity={50} style={[StyleSheet.absoluteFill, styles.nonBlurredContent, styles.blur]}></BlurView>  
              <Icon name="md-settings" size="50x" color="#fff" style={styles.actionButtonIcon} />
              <Text style={styles.text}>Settings</Text>
              
            </Button>
             
            
</View>
        </ImageBackground>
        

        );
    }

    const styles = StyleSheet.create({
      container: {
        flex: 1,
        flexDirection: "row",
        flexWrap: "wrap",
      },
      button: {
        height: 125,
        padding: 2,
        marginLeft: '5%',
        marginRight: '5%',
        marginTop: '5%',
        marginBottom: '5%',
        width: '40%',
        borderRadius: 100,
        backgroundColor: 'transparent',
        flexDirection: 'column'
      },
      blur: {
        borderRadius: 60
      },
      text: {
        color: '#fff',
        marginTop: 5
      },
      image: {
        width: "100%"
      }
    });