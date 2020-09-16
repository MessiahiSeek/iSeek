import React, { useState, useEffect, Component  } from 'react';
import { Text, View, Switch, StyleSheet  } from 'react-native';
import { Left, Right, Separator, Container, Content, Card, CardItem } from 'native-base';
import { divide } from 'react-native-reanimated';
import SimpleAccordion from 'react-native-simple-accordian';


export const faqpage =({navigation}) => {
  

  return (
    <View style={styles.container}>
        <View 
          style={{
            flex: 1,
            backgroundColor: 'transparent',
            flexDirection: 'row',
          }}>
        </View>

        <Text style={styles.Text}>Welcome to iSeek!
        Below are some common questions you may have about the app</Text>


    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      position:'relative',
      flexDirection: 'column',
      alignItems: 'center'
    },
    
    Text: { 
        position: 'relative',
        padding: 25
    }
  });