import 'react-native-gesture-handler';
import * as React from 'react';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, Layout, Text } from '@ui-kitten/components';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen } from './Home.js';
import { XCamera } from './iCamera.js';
import { settingspage } from './settingspage.js';
import { faqpage } from './faq.js';

const Stack = createStackNavigator();

const App = () => {
  return (
    <ApplicationProvider {...eva} theme={eva.light}>
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="ISeek"
          component={HomeScreen}
        />
        <Stack.Screen name="Camera" component={XCamera} options={{title:'iSeek Camera'}}/>
        <Stack.Screen name="Settings" component={settingspage} options={{title:'Settings'}}/>
        <Stack.Screen name="Faq" component={faqpage} options={{title:'FAQ'}}/>
      </Stack.Navigator>
    </NavigationContainer>
    </ApplicationProvider>
  );
};

export default App ;
