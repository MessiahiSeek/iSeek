import React, { useState, useEffect, Component  } from 'react';
import { Text, View, StyleSheet  } from 'react-native';
import { Left, Right, Separator } from 'native-base';
import { Row, Icon, Divider, Caption, Rubik, Switch, switchOn, Button } from '@shoutem/ui';


export const settingspage =({navigation}) => {

  return (
    <View>
        <View 
          style={{
            flex: 1,
            backgroundColor: 'transparent',
            flexDirection: 'row',
          }}>
        </View>

        <Row styleName="small">
          <Text>About</Text>
          
          <Button styleName="primary">
  <Icon name="add-event" />
  <Text>ADD TO CALENDAR</Text>
</Button>

        </Row>

    </View>
  );
}
