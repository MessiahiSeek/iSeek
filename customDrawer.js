import React, { useState } from 'react';
import {
    DrawerContentScrollView,
    DrawerItemList,
    DrawerItem,
    DrawerContent,
    navigation,
    DrawerActions,
} from '@react-navigation/drawer';
import { NavigationContainer, DefaultTheme, DarkTheme, useTheme} from '@react-navigation/native';
import {Icon, Header, Content, Footer, List, ListItem, Body, Text, Right, Left, Switch, H3, colors, Thumbnail, Button} from 'native-base';
import Animated from 'react-native-reanimated';
import { Container } from 'semantic-ui-react';
import { View } from '@shoutem/ui';
import { EventRegister } from 'react-native-event-listeners';

// Credit for this code goes to @ReactNativeTutorials

function Sidebar({progress, ...props}) {
    const {colors} = useTheme();
    const [darkMode,setDarkMode]=useState(false)
    const translateX  = Animated.interpolate(progress, {
        inputRange: [0, 1],
        outputRange: [-100, 0],
    });
    return (
        <NavigationContainer independent={true}>
            <Header style={{backgroundColor: colors.card, borderBottomWidth: 0}}>
                <Right>
                    <Button transparent>
                        <Icon 
                        name="menu" />
                    </Button>
                </Right>
            </Header>
            <Content contentContainerStyle={{flex: 1}}>
                <ListItem thumbnail>
                    <Left>
                        <Thumbnail
                        source={require("./assets/icon.png")} />
                    </Left>
                    <Body>
                        <H3 style={{color: colors.text}}>ISeek</H3>
                    </Body>
                </ListItem>
        <DrawerContentScrollView {...props}>
            <Animated.View style={{transform: [{translateX}]}}>
            <DrawerItemList {...props} />
        </Animated.View>
        </DrawerContentScrollView>
                <List>
                    <ListItem>
                        <Body>
                            <Text style={{color: colors.text}}>Dark Mode</Text>
                        </Body>
                        <Right>
                            <Switch 
                            value={darkMode} 
                            onValueChange={(val) => {
                                setDarkMode(val)
                                EventRegister.emit('appChangeThemeEvent', val);
                            }}/>
                        </Right>
                    </ListItem>
                </List>

        </Content>
        <Footer style={{backgroundColor: colors.card, borderTopWidth: 0}}/>
        </NavigationContainer>
    );
}
export default Sidebar;