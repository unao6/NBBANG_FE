import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import useUserStore from '../../store/useUserStore';
import { fetchUserInfo } from '../../api/user/userApi';

const Chat = () => {
  const { chatId } = useParams();
  const location = useLocation();
  const [messages, setMessages] = useState(location.state?.messages || []);
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);
  const stompClientRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isChatEnded, setIsChatEnded] = useState(false);

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
    const initialize = async () => {
      try {
        setIsLoading(true);
        const userInfo = await fetchUserInfo();

        setUser(userInfo);
        setIsLoading(false);

        const client = new Client({
          webSocketFactory: () => new SockJS(`${process.env.REACT_APP_API_BASE_URL}/ws`),
          debug: (str) => {
            console.log(str);
          },
          onConnect: () => {
            console.log('WebSocket connected');

            client.publish({
              destination: '/app/auth',
              body: localStorage.getItem('access'),
            });

            const subscription = client.subscribe(
              `/topic/messages/${chatId}`,
              (message) => {
                const newMessage = JSON.parse(message.body);
                newMessage.sentAt = parseSentAt(newMessage.sentAt);

                console.log('받은 메세지:', newMessage);

                // 상담 종료 메세지를 받은 경우 input창 비활성화
                if (newMessage.nickname === 'System' && newMessage.text.includes('상담이 종료되었습니다. 감사합니다.')) {
                  setIsChatEnded(true);
                }

                setMessages((prevMessages) => [...prevMessages, newMessage]);
              }, {ack: "client-individual"}
            );


            stompClientRef.current = {
              client,
              subscriptionId: subscription.id,
            };

            if (messages.length === 0) {
              sendWelcomeMessage();
            }
          },
          onStompError: (frame) => {
            console.error('STOMP Error: ', frame.headers['message'], frame.body);
          },
        });

        client.activate();
      } catch (error) {
        console.error('Error during initialization:', error);
        setIsLoading(false);
      }
    };
  
    initialize();

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.client.deactivate();
      }
      setIsLoading(false);
    };
  }, [chatId, setUser, messages]);

  const sendWelcomeMessage = () => {
    if (!stompClientRef.current || !stompClientRef.current.client.connected) {
      console.error('WebSocket is not connected');
      return;
    }
    
    const welcomeMessage = {
      chatId: chatId,
      message: {
        nickname: 'System',
        text: '환영합니다! 문의사항을 남겨주시면 확인 후 답변 드리겠습니다:)',
        sentAt: getCurrentKSTTimeString(),
      },
    };
  
    stompClientRef.current.client.publish({
      destination: '/app/chat/send/' + chatId,
      body: JSON.stringify(welcomeMessage),
    });
  };

  const parseSentAt = (sentAt) => {
    if (Array.isArray(sentAt)) {
      return new Date(...sentAt);
    }
    return new Date(sentAt);
  };

  const handleSend = () => {
    if (!user || !user.userId || !user.nickname) {
      console.error('User information is missing or incomplete');
      return;
    }

    if (input.trim() === '') {
      console.error('Input message is empty');
      return;
    }

    if (!stompClientRef.current || !stompClientRef.current.client.connected) {
      console.error('WebSocket is not connected');
      return;
    }

    const newMessage = {
      chatId: chatId,
      userId: user.id,
      message: {
        nickname: user.nickname,
        text: input,
        sentAt: getCurrentKSTTimeString(),
      },
    };

    console.log('보낸 메세지:', newMessage);

    stompClientRef.current.client.publish({
      destination: '/app/chat/send/' + chatId,
      body: JSON.stringify(newMessage),
    });

    setInput('');
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!isLoading) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isLoading]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col h-full relative">
      <div
        className="flex-1 overflow-y-auto p-4 bg-white flex flex-col"
        style={{ paddingTop: '68px', paddingBottom: '68px' }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`my-1 ${
              msg.nickname === user?.nickname
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
          placeholder={isChatEnded ? "상담이 종료되었습니다." : "메세지 입력"}
          disabled={isChatEnded}
        />
        <button 
          onClick={handleSend} 
          className={`${
            isChatEnded ? 'bg-gray-400' : 'bg-blue-500 text-white p-2 rounded'
            } text-white px-3 py-1.5 rounded-md transition duration-200`} 
          disabled={isChatEnded} >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;