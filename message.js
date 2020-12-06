import React, { useState, useCallback, useEffect } from 'react';
import { GiftedChat, SystemMessage } from 'react-native-gifted-chat';
import { XCamera } from './iCamera.js';
import { settingspage } from './settingspage.js';
import { faqpage } from './faq.js';
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
  /*
  const [messages, setMessages] = useState([
    {
      _id: 0,
      text: 'Hello! How may I assist you?',
      createdAt: new Date().getTime(),
      user: {
        _id: 2,
        name: 'System',
        avatar: require('./assets/splash.png')
      }
    },
    {
      _id: 1,
      text: 'New chat started.',
      createdAt: new Date().getTime(),
      system: true
    }
  ]);
*/
    function getResponse(text) {
      console.log("Whats up");
      console.log(text)
      fetch('http://iseek.cs.messiah.edu:5000/chatbot',
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
        XCamera.snap();
        break;
      case("%0ri"):
        XCamera.findText();
    default:
      setMessages(previousMessages => GiftedChat.append(previousMessages,{
        _id: 3,
        text: json.textResponse,
        createdAt: new Date().getTime(),
        user: {
          _id: 2,
          name: 'System',
          avatar: require('./assets/splash.png')
        }
      } 
      ));
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
/*
    setMessages(prevState => [...prevState, newMessage]);
    var userText = newMessage[0].text;
    console.log(userText);
    fetch('http://iseek.cs.messiah.edu:5000/chatbot',
    {
      method: 'POST',
      body: JSON.stringify({
        textString: userText,
      })
  })
  .then((response) => response.json())
  .then((json) => {
    console.log(json.textResponse)
    setMessages(prevState => [...prevState, {
      _id: 3,
      text: json.textResponse,
      createdAt: new Date().getTime(),
      system: true
    }])
  })
 */
function voiceNav (nav){
switch(nav){
  case 1:
}
}
  return(
    <GiftedChat
    messages={messages}
    onSend={messages => onSend(messages)}
    user={{ _id: 1, name: 'Luke' }}
    placeholder="Ask your quesiton here..."
    showUserAvatar
    alwaysShowSend
    scrollToBottom
    />
  );
}