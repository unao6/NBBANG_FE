import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import {startChat, sendMessage} from '../../api/chat/chatApi';
import useUserStore from '../../store/useUserStore';
import { fetchUserInfo } from '../../api/user/userApi';

const Chat = () => {
  const location = useLocation();
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);
  const [stompClient, setStompClient] = useState(null);
 
  const { user, setUser } = useUserStore((state) => ({
    user: state.user,
    setUser: state.setUser,
  }));

  useEffect(() => {
    const initializeUserAndChat = async () => {
      // 유저 정보 가져오기
      try {
        const userInfo = await fetchUserInfo();
        setUser(userInfo); // 유저 정보를 상태에 저장
      } catch (error) {
        console.error('유저 정보를 가져오는데 실패했습니다:', error);
        return;
      }

      // 채팅 시작
      try {
        const chatResponse = await startChat();
        setChatId(chatResponse.chatId);
        setMessages(chatResponse.messages);
        
        // WebSocket 클라이언트 설정
        const client = new Client({
          webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
          debug: (str) => {
            console.log(str);
          },
          onConnect: () => {
            client.subscribe('/queue/messages', (message) => {
              const newMessage = JSON.parse(message.body);
              setMessages((prevMessages) => [...prevMessages, newMessage]);
            });
          },
          onStompError: (frame) => {
            console.error('STOMP Error: ', frame.headers['message'], frame.body); // STOMP 에러 처리
          },
        });

        client.activate();
        setStompClient(client);

        return () => {
          if (client) {
            client.deactivate();
          }
        };
      } catch (error) {
        console.error('채팅을 시작하는데 실패했습니다:', error);
      }
    };

    // 유저 정보 및 채팅 초기화
    initializeUserAndChat();
  }, []); // 의존성 배열에 chatId를 제거했습니다. 초기화 시에만 호출하도록 변경

  const handleSend = async () => {
    if (input.trim() !== '' && chatId !== null && stompClient) {
      const message = {
        chatId: chatId,
        userId: user.id,
        message: {
          nickname: user.nickname,
          text: input,
          sentAt: new Date().toISOString(),
        },
      };

      try {
        const response = await sendMessage(stompClient, message);
        setMessages([...messages, response]);
      } catch(error) {
        console.error('메시지 전송 중 오류 발생: ', error);
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
              msg.nickname === user.nickname
                ? 'self-end text-right'
                : 'self-start text-left'
            }`}
          >
            <div className="text-xs text-gray-500 mb-1">{msg.nickname}</div>
            <div
              className={`inline-block p-2 rounded-lg shadow w-auto max-w-xs break-words ${
                msg.nickname === user.nickname
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
