import React, { useState, useEffect, Component  } from 'react';
import {  Switch, StyleSheet, SafeAreaView, ScrollView,  } from 'react-native';
import { Left, Right, Separator, Container, View } from 'native-base';
import Accordion from 'react-native-collapsible/Accordion';
import { Avatar, Button, Text, List } from '@ui-kitten/components';
import { Header } from '@react-navigation/stack';
import { Divider, Caption, Rubik, Card, Subtitle, Image, Row } from '@shoutem/ui'; 


export const faqpage =({navigation}) => {

  

  return(
  
<SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView}>
<Text>Hello World</Text>
            
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


