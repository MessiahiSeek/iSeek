import React, { useState, useEffect, Component  } from 'react';
import {  Switch, StyleSheet, SafeAreaView, ScrollView,  } from 'react-native';
import { Left, Right, Separator, Container, View } from 'native-base';
import { Avatar, Button, Text, List } from '@ui-kitten/components';
import { Header } from '@react-navigation/stack';
import { Card, CardTitle, CardContent, CardAction, CardButton, CardImage } from 'react-native-cards'; 
import { render } from 'react-dom';



export const faqpage =({navigation}) => {

  return(
  
<SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView}>

            <Card>
    <CardTitle
      title="What is ISeek?"
    />
    <CardContent text="ISeek is an app to help the visually imparied with finding object and reading text" />
    <CardAction 
      separator={true} 
      inColumn={false}>
    </CardAction>
    <CardTitle
      title="Who Created ISeek"
    />
    <CardContent text="The Creators are Nik, Joe, Sam, and Luke" />
  <CardAction 
      separator={true} 
      inColumn={false}>
    </CardAction>
    <CardTitle
      title="Contact for Help?"
    />
    <CardContent text="jk1551@messiah.edu" />
  <CardAction 
      separator={true} 
      inColumn={false}>
    </CardAction>
  <CardTitle
      title="Current Version of the App"
    />
    <CardContent text="Version 3"/>
    <CardAction 
      separator={true} 
      inColumn={false}>
    </CardAction>
    <CardTitle
      title="Final Publish Date"
    />
    <CardContent text="May 2021" />
  <CardAction 
      separator={true} 
      inColumn={false}>
    </CardAction>
            

            </Card>
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
  