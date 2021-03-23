import React, { useState, useCallback, useEffect } from 'react';
import { Alert, TouchableOpacity } from 'react-native';
import { GiftedChat, SystemMessage } from 'react-native-gifted-chat';
import Icon from 'react-native-vector-icons/Ionicons';
import { DrawerActions } from '@react-navigation/native';
import { XCamera } from './iCamera.js';
import { settingspage } from './settingspage.js';
import { faqpage } from './faq.js';

var uuid = require('react-native-uuid');

export const message =({navigation}) => {
  const [messages, setMessages] = useState([]);
  const [userText,setText] = useState("");
  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Hello! How may I assist you?',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: require('./assets/splash.png'),
        },
      },
    ])
  }, [])

    function getResponse(text) {
      console.log("Whats up");
      console.log(text)
      fetch('http://iseek.cs.messiah.edu:5000/chatbot',
      //fetch('http://153.42.129.91:5000/chatbot',
      {
      method: 'POST',
      headers:{
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        textString: text,
      })
    })
  .then((response) => response.json())
  .then((json) => {
    console.log(json.textResponse);
    setText("");
    switch(json.textResponse){
      case ("%0oc"):
        navigation.navigate('Camera');
        break; 
      case("%0om"):
        navigation.navigate('Messenger');
        break;
      case("%0tp"):
        navigation.navigate('Camera');
        //XCamera.snap();
        break;
      case("%0st"):
        navigation.navigate('BETA Streaming')  ;
        break;
      case("%1si"):
      case("%0ri"):  
      case("%0sp"):
      json.textResponse == "This cannot be preformed on this screen."
    default:
        if(json.textResponse.startsWith('%',0)){
          Alert.alert("Sorry this is not supported on this page");
        }
      else{
        console.log(json.textResponse)
      setMessages(previousMessages => GiftedChat.append(previousMessages,{
        _id: uuid.v1() ,
        text: json.textResponse,
        createdAt: new Date().getTime(),
        user: {
          _id: 2,
          name: 'System',
          avatar: require('./assets/splash.png')
        }
      } 
      ));
    }
      break;
    }
  })
  setText("");
  
    }
    const onSend = useCallback((messages = []) => {
      setText(messages[0].text);
      console.log(userText);
      console.log(messages[0].text)
      setMessages(previousMessages => GiftedChat.append(previousMessages, messages));
      console.log("Reached");
      getResponse(messages[0].text);
    }, [])


  return(
    <>
    <GiftedChat
    messages={messages}
    onSend={messages => onSend(messages)}
    user={{ _id: 1, name: 'Luke' }}
    placeholder="Ask your quesiton here..."
    showUserAvatar
    alwaysShowSend
    scrollToBottom
    />

    <TouchableOpacity style = {{position: 'absolute', borderRadius:100,bottom:'90%',left:'5%'}} onPress={() => navigation.dispatch(DrawerActions.openDrawer())}/*onPressIn={handleOnPressIn} onPressOut={handleOnPressOut}*/> 
    
         <Icon
         name="ios-menu"
         color="#ccc"
         size={35}
         onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
       />
      </TouchableOpacity> 
      </>
  );
}