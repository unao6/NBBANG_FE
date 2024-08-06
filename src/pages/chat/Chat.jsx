import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { startChat } from '../../api/chat/chatApi';
import useUserStore from '../../store/useUserStore';
import { fetchUserInfo } from '../../api/user/userApi';

const Chat = () => {
  const location = useLocation();
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);
  const stompClientRef = useRef(null);

  const { user, setUser } = useUserStore((state) => ({
    user: state.user,
    setUser: state.setUser,
  }));

  const getCurrentKSTTimeString = () => {
    // 현재 시간을 UTC 기준으로 가져오기
    const currentDate = new Date();
    
    // UTC 시간에서 9시간을 더해 KST로 변환
    const kstOffset = 9 * 60 * 60 * 1000; // 9시간을 밀리초로 변환
    const kstTime = new Date(currentDate.getTime() + kstOffset);
  
    // ISO 8601 형식으로 변환하여 반환
    return kstTime.toISOString().slice(0, 19); // ".000Z" 제거
  };

  useEffect(() => {
    const initializeUserAndChat = async () => {
      try {
        // 유저 정보 가져오기
        const userInfo = await fetchUserInfo();
        setUser(userInfo);

        if (userInfo) {
          const chatResponse = await startChat();
          setChatId(chatResponse.chatId);

          // 메시지 변환
          const formattedMessages = chatResponse.messages.map((msg) => ({
            ...msg,
            sentAt: parseSentAt(msg.sentAt),
          }));
          setMessages(formattedMessages);

          // WebSocket 설정
          const client = new Client({
            webSocketFactory: () => new SockJS(`${process.env.REACT_APP_API_BASE_URL}/ws`),
            debug: (str) => {
              console.log(str);
            },
            onConnect: () => {
              console.log('웹소켓 연결 성공');
              const token = localStorage.getItem('access');
              client.publish({
                destination: '/app/auth',
                body: JSON.stringify({ token }),
              });

              // 중복 구독 방지
              if (stompClientRef.current) {
                client.unsubscribe(stompClientRef.current.subscriptionId);
              }

              // 메시지 구독
              const subscription = client.subscribe(
                `/queue/messages/${chatId}`,
                (message) => {
                  const newMessage = JSON.parse(message.body);
                  newMessage.sentAt = parseSentAt(newMessage.sentAt);

                  console.log('Received message:', newMessage);

                  if (!isNaN(newMessage.sentAt.getTime())) {
                    // 메시지 중복 방지
                    setMessages((prevMessages) => {
                      const isDuplicate = prevMessages.some(
                        (msg) =>
                          msg.sentAt.getTime() ===
                          newMessage.sentAt.getTime()
                      );
                      if (!isDuplicate) {
                        return [...prevMessages, newMessage];
                      }
                      return prevMessages;
                    });
                  } else {
                    console.error('Invalid date received:', newMessage.sentAt);
                  }
                }
              );
              stompClientRef.current = { client, subscriptionId: subscription.id };
            },
            onStompError: (frame) => {
              console.error(
                'STOMP Error: ',
                frame.headers['message'],
                frame.body
              );
            },
          });

          client.activate();
        }
      } catch (error) {
        console.error('초기화 중 오류 발생:', error);
      }

      // Cleanup 함수
      return () => {
        if (stompClientRef.current) {
          stompClientRef.current.client.deactivate();
        }
      };
    };

    initializeUserAndChat();
  }, []);

  // sentAt 필드 파싱 함수
  const parseSentAt = (sentAt) => {
    if (Array.isArray(sentAt)) {
      return new Date(...sentAt);
    }
    return new Date(sentAt);
  };

  const handleSend = async () => {
    if (input.trim() !== '' && stompClientRef.current && stompClientRef.current.client.connected) {
      const message = {
        chatId: chatId,
        userId: user.id,
        message: {
          nickname: user.nickname,
          text: input,
          sentAt: getCurrentKSTTimeString(),
        },
      };

      stompClientRef.current.client.publish({
        destination: '/app/chat/send',
        body: JSON.stringify(message),
      });
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
              {/* KST로 시간을 변환하여 표시 */}
              {new Date(msg.sentAt).toLocaleTimeString('ko-KR', {
                timeZone: 'Asia/Seoul',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
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
          placeholder="메세지 입력"
        />
        <button onClick={handleSend} className="bg-blue-500 text-white p-2 rounded">
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;