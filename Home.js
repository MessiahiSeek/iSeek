import React, { Component } from 'react';
import { Entypo } from '@expo/vector-icons'; 
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { Container, Header, Content, View, Alert, Text, Footer, FooterTab, Fab, Left, Body, Right, Title, Tab, Tabs, Styles } from 'native-base';
import {  Button, ButtonGroup, Layout, Spinner, Divider, Caption, Rubik, Tile, Image, Subtitle, ImageBackground, Overlay, TouchableOpacity } from '@shoutem/ui';
import { XCamera } from './iCamera.js';
import { settingspage } from './settingspage.js';
import { color } from 'react-native-reanimated';



export const HomeScreen =({navigation}) => {
        return (


          <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView}>

             
          <Button
          style={styles.button1}
          onPress={()=>navigation.navigate('Camera')}>
          <Text>Read Text</Text>
          </Button>

          <Divider />

          <Button 
          style={styles.button2}
          onPress={()=>navigation.navigate('Camera')}>
            <Text>Find Objects</Text>
          </Button>

          <Divider />

          <Button 
          style={styles.button3}
          onPress={()=>navigation.navigate('Faq')}> 
              <Text>FAQ</Text>
            </Button>

            <Divider />

            <Button
            style={styles.button4}
            onPress={()=>navigation.navigate('Settings')}>  
              <Text>Settings</Text>
            </Button>

        <Content />

       

          </ScrollView>
        </SafeAreaView>
      

        );
    }

    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: '#0e68b3',
      },
      button1: {
        height: 150,
        marginTop: 10,
        marginLeft: 8,
        width: '95%',
        borderRadius: 20,
        backgroundColor: '#6bcbeb',
      },
      button2: {
        height: 150,
        marginTop: 10,
        marginLeft: 8,
        width: '95%',
        borderRadius: 20,
        backgroundColor: '#07a5dc',
      },
      button3: {
        height: 150,
        marginTop: 10,
        marginLeft: 8,
        width: '95%',
        borderRadius: 20,
        backgroundColor: '#0290cf',
      },
      button4: {
        height: 150,
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