import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { startChat } from '../../api/chat/chatApi';
import useUserStore from '../../store/useUserStore';

const Chat = () => {
  const { chatId: initialChatId } = useParams();
  const [chatId, setChatId] = useState(initialChatId || '-1');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);
  const stompClientRef = useRef(null);

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

  const initializeWebSocket = useCallback((chatId) => {
    if (stompClientRef.current) {
      stompClientRef.current.deactivate();
    }

    const client = new Client({
      webSocketFactory: () => new SockJS(`${process.env.REACT_APP_API_BASE_URL}/ws`),
      debug: (str) => {
        console.log(str);
      },
      onConnect: () => {
        console.log('WebSocket connected');
        const token = localStorage.getItem('access');
        client.publish({
          destination: '/app/auth',
          body: JSON.stringify({ token }),
        });

        const subscription = client.subscribe(
          `/queue/messages/${chatId}`,
          (message) => {
            const newMessage = JSON.parse(message.body);
            newMessage.sentAt = parseSentAt(newMessage.sentAt);

            console.log('Received message:', newMessage);

            setMessages((prevMessages) => {
              const isDuplicate = prevMessages.some((msg) => msg.id === newMessage.id);
              if (!isDuplicate) {
                return [...prevMessages, newMessage];
              }
              return prevMessages;
            });

          }
        );

        stompClientRef.current = {
          client,
          subscriptionId: subscription.id,
        };
      },
      onStompError: (frame) => {
        console.error('STOMP Error: ', frame.headers['message'], frame.body);
      },
    });

    client.activate();

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.client.deactivate();
      }
    };
  }, []);

  useEffect(() => {
    const initializeUserAndChat = async () => {
      try {
        const userInfo = await fetchUserInfo();
        if (!userInfo) {
          console.error('Failed to fetch user information');
          return;
        }

        setUser(userInfo);

        if (chatId === '-1') {
          const chatResponse = await startChat();
          setChatId(chatResponse.chatId);
          setMessages(chatResponse.messages);
        }
      } catch (error) {
        console.error('Error during initialization:', error);
      }
    };

    initializeUserAndChat();
  }, [setUser, chatId]);

  useEffect(() => {
    if (chatId !== '-1') {
      const cleanup = initializeWebSocket(chatId);
      return cleanup;
    }
  }, [chatId, initializeWebSocket]);

  const parseSentAt = (sentAt) => {
    if (Array.isArray(sentAt)) {
      return new Date(...sentAt);
    }
    return new Date(sentAt);
  };

  const handleSend = async () => {
    if (!user || !user.id) {
      console.error('User information is missing');
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

    console.log('Sending message:', newMessage);

    stompClientRef.current.client.publish({
      destination: '/app/chat/send/' + chatId,
      body: JSON.stringify(newMessage),
    });

    setMessages((prevMessages) => [...prevMessages, newMessage.message]);
    setInput('');
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
