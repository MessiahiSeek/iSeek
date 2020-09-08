import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen } from './Home.js';
import { XCamera } from './iCamera.js';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Welcometo the iSeek App' }}
        />
        <Stack.Screen name="Camera" component={XCamera} options={{title:'iSeek Camera'}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
