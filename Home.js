import React, { Component } from 'react';
import { Entypo } from '@expo/vector-icons'; 
import { Container, Header, Content, View, StyleSheet, Alert, Text, Footer, FooterTab, Fab, Left, Body, Right, Title, Tab, Tabs, Styles } from 'native-base';
import {  Button, ButtonGroup, Icon, Layout, Spinner, Divider } from '@ui-kitten/components';
import { XCamera } from './iCamera.js';
import { settingspage } from './settingspage.js';



export const HomeScreen =({navigation}) => {
        return (


          
          <Container>
          <Divider />  
             
          <Button
          onPress={()=>navigation.navigate('Camera')}>
          <Text>Read Text From pic</Text>
          </Button>

          <Divider />

          <Button onPress={()=>navigation.navigate('Camera')}>
            <Text>Find Objects</Text>
          </Button>

          <Divider />

          <Button onPress={()=>navigation.navigate('Faq')}> 
              <Text>FAQ</Text>
            </Button>

            <Divider />

            <Button onPress={()=>navigation.navigate('Settings')}>  
              <Text>Settings</Text>
            </Button>

        <Content />
      </Container>

        );
    }