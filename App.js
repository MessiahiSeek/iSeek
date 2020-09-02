import React, { Component } from 'react';
import { Entypo } from '@expo/vector-icons'; 
import { Container, Header, Content, Button, View, StyleSheet, Alert, Text, Footer, FooterTab, Fab, Left, Body, Right, Title, Tab, Tabs } from 'native-base';
//import  { Text } from 'react-native';

export default class TabsExample extends Component {

   render() {
        return (
//	<Text> Hello World </Text>
          
          <Container>
              
        <Header>
          <Left/>
          <Body>
            <Title>iseek</Title>
          </Body>
          <Right />
        </Header>
        
          <Button block blue>
          <Text>Read Text</Text>
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
    }
}
