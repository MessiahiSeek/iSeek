import { Container, View } from 'native-base';
import React, { useState } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';

export const message =({navigation}) => {

  const [messages, setMessages] = useState([
    {
      _id: 0,
      text: 'New chat started.',
      createdAt: new Date().getTime(),
      system: true
    },
    {
      _id: 1,
      text: 'Hello!',
      createdAt: new Date().getTime(),
      user: {
        _id: 2,
        name: 'Test User'
      }
    }
  ]);

  function handleSend(newMessage = []){
    setMessages(GiftedChat.append(messages, newMessage));
  }


  
  return(

    <GiftedChat
    messages={messages}
    onSend={newMessage => handleSend(newMessage)}
    user={{ _id: 1 }}
    />
    
  );
}