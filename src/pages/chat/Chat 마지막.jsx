import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import {startChat, sendMessage} from '../../api/chat/chatApi';
import useUserStore from '../../store/useUserStore';
import { fetchUserInfo } from '../../api/user/userApi';

const Chat = () => {
  const { chatId } = useParams();
  const location = useLocation();
  const [messages, setMessages] = useState(location.state?.messages || []);
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);
  const [stompClient, setStompClient] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
 
  const { user, setUser } = useUserStore((state) => ({
    user: state.user,
    setUser: state.setUser,
  }));

  const getCurrentKSTTimeString = () => {
    const currentDate = new Date();
    const kstOffset = 9 * 60 * 60 * 1000; // 9시간
    const kstTime = new Date(currentDate.getTime() + kstOffset);
    return kstTime.toISOString().slice(0, 19);
  };

  useEffect(() => {
    const initializeUserAndChat = async () => {
      // 유저 정보 가져오기
      try {
        setIsLoading(true);
        const userInfo = await fetchUserInfo();
        setUser(userInfo); // 유저 정보를 상태에 저장
        setIsLoading(false);
      } catch (error) {
        console.error('유저 정보를 가져오는데 실패했습니다:', error);
        setIsLoading(false);
        return;
      }

      // 채팅 시작
      try {
        const chatResponse = await startChat();
        setMessages(chatResponse.messages);
        
        // WebSocket 클라이언트 설정
        const client = new Client({
          webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
          debug: (str) => {
            console.log(str);
          },
          onConnect: () => {
            client.subscribe(`/topic/messages/${chatId}`, (message) => {
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

    initializeUserAndChat();
  }, []); 

  const handleSend = () => {
    if (input.trim() !== '' && chatId !== null && stompClient.current) {
      const messageRequest = {
        chatId: chatId,
        userId: user.id,
        message: {
          nickname: user.nickname,
          text: input,
          sentAt: getCurrentKSTTimeString(),
        },
      };

      console.log('보낸 메세지:', messageRequest);

      try {
        const destination = `/app/chat/send/${chatId}`;

        stompClient.current.send(destination, {}, JSON.stringify(messageRequest));

        console.log('Message sent:', messageRequest);

        // Update the local message state
        setMessages((prevMessages) => [...prevMessages, messageRequest.message]);

        // Clear the input field after sending
        setInput('');
      } catch (error) {
        console.error('메시지 전송 중 오류 발생: ', error);
      }
    }
  };
  

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);


  if (isLoading) {
    return <div>Loading...</div>;
  }

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
