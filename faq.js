import React, { useState, useEffect, Component  } from 'react';
import {  Switch, StyleSheet, SafeAreaView, ScrollView,  } from 'react-native';
import { Left, Right, Separator, Container, View } from 'native-base';
import { Avatar, Button, Text, List } from '@ui-kitten/components';
import { Header } from '@react-navigation/stack';
import { Divider, Caption, Rubik, Card, Subtitle, Image, Row } from '@shoutem/ui';

export const faqpage =({navigation}) => {

  return(
  
<SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView}>



            <Row>
              <View styleName="vertical">
              <View styleName="horizontal space-between">
                <Subtitle>FAQ 1</Subtitle>
                <Caption>iSeek was founded in 2020</Caption>
              </View>
                <Text styleName="multiline"></Text>
              </View>
            </Row>

            <Row>
              <View styleName="vertical">
              <View styleName="horizontal space-between">
                <Subtitle>FAQ 2</Subtitle>
                <Caption>To find objects in the room use the first button</Caption>
              </View>
                <Text styleName="multiline"></Text>
              </View>
            </Row>

            <Row>
              <View styleName="vertical">
              <View styleName="horizontal space-between">
                <Subtitle>FAQ 3</Subtitle>
                <Caption>To read text, use the second button</Caption>
              </View>
                <Text styleName="multiline"></Text>
              </View>
            </Row>


       

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


