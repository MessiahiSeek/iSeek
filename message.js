import React, { useState } from 'react';
import { GiftedChat, SystemMessage } from 'react-native-gifted-chat';
import { XCamera } from './iCamera.js';
import { settingspage } from './settingspage.js';
import { faqpage } from './faq.js';

export const message =({navigation}) => {
  

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


  function handleSend(newMessage = []){

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
    setMessages(prevState => [...prevState, {
      _id: 3,
      text: json,
      createdAt: new Date().getTime(),
      system: true
    }])
  })
 
}

function voiceNav (nav){
switch(nav){
  case 1:
}
}

  return(
    <GiftedChat
    onSend={newMessage => handleSend(newMessage)}
    messages={messages}
    user={{ _id: 1, name: 'Luke' }}
    placeholder="Ask your quesiton here..."
    showUserAvatar
    alwaysShowSend
    scrollToBottom
    />
  );
}