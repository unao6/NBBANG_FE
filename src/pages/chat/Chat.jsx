import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import useUserStore from '../../store/useUserStore';
import { fetchUserInfo } from '../../api/user/userApi';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SettingsIcon from '@mui/icons-material/Settings'; 

const Chat = () => {
  const { chatId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [messages, setMessages] = useState(location.state?.messages || []);
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);
  const stompClientRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isChatEnded, setIsChatEnded] = useState(false);
  const inputRef = useRef(null);

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

                if (newMessage.nickname === 'System' && newMessage.text.includes('상담이 종료되었습니다. 감사합니다.')) {
                  setIsChatEnded(true);
                }

                setMessages((prevMessages) => [...prevMessages, newMessage]);
              }
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
  }, []);

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
    inputRef.current.focus(); 
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!isLoading) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isLoading]);

  const formatDate = (date) => {
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('ko-KR', {
      timeZone: 'Asia/Seoul',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const isSameDay = (d1, d2) => {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  let lastDate = null;

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex justify-between mb-2">
        <IconButton aria-label="back" onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton>
      </div>

      <div
        className="flex-1 overflow-y-auto p-4 bg-white flex flex-col"
        style={{ paddingBottom: '68px' }}
      >
        {messages.map((msg, index) => {
          const msgDate = new Date(msg.sentAt);
          const showDate = !lastDate || !isSameDay(lastDate, msgDate);
          lastDate = msgDate;

          return (
            <React.Fragment key={index}>
              {showDate && (
                <div className="text-center my-2 text-sm text-gray-500">
                  {formatDate(msgDate)}
                </div>
              )}
              <div
                className={`my-1 ${
                  msg.nickname === user?.nickname
                    ? 'self-end text-right'
                    : 'self-start text-left'
                }`}
              >
                <div className="text-xs text-gray-500 mb-1">{msg.nickname}</div>
                <div
                className={`inline-block p-2 rounded-lg shadow w-auto max-w-xs break-words ${
                  msg.nickname === 'N/BBANG'
                    ? 'bg-primary text-white'
                    : msg.nickname === 'System'
                    ? 'bg-gray-300 text-black'
                    : 'bg-yellow-400 text-black'
                }`}
              >
                  {msg.text}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {formatTime(msgDate)}
                </div>
              </div>
            </React.Fragment>
          );
        })}
        <div ref={chatEndRef} />
      </div>
      <div className="fixed bottom-[68px] left-0 right-0 flex p-2 bg-white z-50 max-w-[540px] mx-auto">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSend();
            }
          }}
          className="flex-1 p-2 border border-gray-300 rounded mr-2"
          placeholder={isChatEnded ? "상담이 종료되었습니다." : "메세지를 입력하세요"}
          disabled={isChatEnded}
        />
        <button 
          type="button"
          onClick={handleSend} 
          className={`${
            isChatEnded ? 'bg-gray-400' : 'bg-primary text-white p-2 rounded'
            } text-white px-3 py-1.5 rounded-md transition duration-200`} 
          disabled={isChatEnded} >
          보내기
        </button>
      </div>
    </div>
  );
};

export default Chat;
