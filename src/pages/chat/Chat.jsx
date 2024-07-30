import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import axios from 'axios';

const Chat = () => {
  const location = useLocation();
  const chatId = location.state?.chatId || null;
  const initialMessages = location.state?.messages || [];
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);
  const [stompClient, setStompClient] = useState(null);
  const userId = 1; // 예제 사용자 ID. 실제 애플리케이션에서는 로그인한 사용자 ID를 사용.

  useEffect(() => {
    if (chatId !== null) {
      const client = new Client({
        webSocketFactory: () => new SockJS('/ws'),
        debug: (str) => {
          console.log(str);
        },
        onConnect: () => {
          client.subscribe('/queue/messages', (message) => {
            const newMessage = JSON.parse(message.body);
            setMessages((prevMessages) => [...prevMessages, newMessage]);
          });
        },
      });

      client.activate();
      setStompClient(client);

      return () => {
        if (client) {
          client.deactivate();
        }
      };
    }
  }, [chatId]);

  const handleSend = () => {
    if (input.trim() !== '' && chatId !== null && stompClient) {
      const message = {
        chatId: chatId,
        userId: userId,
        message: {
          nickname: 'User A', // Example nickname, replace with actual user nickname
          text: input,
          sentAt: new Date().toISOString(),
        },
      };

      if (chatId === -1) {
        axios.post('/api/chat/send', {
          userId: userId,
          message: message.message
        })
          .then(response => {
            setMessages([...messages, response.data]);
          })
          .catch(error => console.error('Error sending message:', error));
      } else {
        stompClient.publish({
          destination: '/app/chat/send',
          body: JSON.stringify({ userId, ...message }),
        });
      }
      setInput('');
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-full relative">
      <div
        className="flex-1 overflow-y-auto p-4 bg-white flex flex-col"
        style={{ paddingTop: '68px', paddingBottom: '68px' }}
      >
        <div ref={chatEndRef} />
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`my-1 ${
              msg.nickname === 'User A'
                ? 'self-end text-right'
                : 'self-start text-left'
            }`}
          >
            <div className="text-xs text-gray-500 mb-1">{msg.nickname}</div>
            <div
              className={`inline-block p-2 rounded-lg shadow w-auto max-w-xs break-words ${
                msg.nickname === 'User A'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-300 text-black'
              }`}
            >
              {msg.text}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {new Date(msg.sentAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <div className="fixed bottom-[68px] left-0 right-0 flex p-2 bg-white z-50 max-w-[540px] mx-auto">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 border border-gray-300 rounded mr-2"
          placeholder="Type a message..."
        />
        <button onClick={handleSend} className="bg-blue-500 text-white p-2 rounded">
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
