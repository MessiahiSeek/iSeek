import React, { Component } from 'react';
import { Entypo } from '@expo/vector-icons'; 
import { Container, Header, Content, Button, View, StyleSheet, Alert, Text, Footer, FooterTab, Fab, Left, Body, Right, Title, Tab, Tabs } from 'native-base';
import { XCamera } from './iCamera.js';

export const HomeScreen =({navigation}) => {
        return (
          <Container>
              
        <Header>
          <Left/>
          <Body>
            <Title>iSeek</Title>
          </Body>
          <Right />
        </Header>
        
          <Button block blue 
          onPress={()=>navigation.navigate('Camera')}>
          <Text>Read Text From pic</Text>
          
          </Button>

          <Button block blue>
            <Text>Find Objects</Text>
          </Button>

        <Content />

        <Footer>
        
          <FooterTab>
            
            <Button vertical>
              <Text>FAQ</Text>
            </Button>

            <Button vertical >  
              <Text>Settings</Text>
            </Button>

          </FooterTab>
        </Footer>

        
      </Container>

        );
    };

