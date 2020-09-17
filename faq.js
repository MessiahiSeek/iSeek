import React, { useState, useEffect, Component  } from 'react';
import { View, Switch, StyleSheet  } from 'react-native';
import { Left, Right, Separator, Container } from 'native-base';
import { Avatar, Button, Divider, Text, Card, List } from '@ui-kitten/components';
import { Header } from '@react-navigation/stack';

export const faqpage =({navigation}) => {
  

  return (
    <View>
        <View 
          style={{
            flex: 1,
            backgroundColor: 'transparent',
            flexDirection: 'row',
          }}>
        </View>

        <List
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    />

<Card>
      <Text>
        Hello world!
      </Text>
    </Card>


    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    maxHeight: 500,
  },
  contentContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  item: {
    marginVertical: 4,
  },
});

