import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { fetchChatMessages, endChat, archiveChat, resetNewMessagesCount } from '../../../api/chat/chatApi';
import useUserStore from '../../../store/useUserStore';
import { fetchUserInfo } from '../../../api/user/userApi';

const AdminChat = () => {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [memo, setMemo] = useState('');
  const chatEndRef = useRef(null);
  const [isChatEnded, setIsChatEnded] = useState(location.state?.isChatEnded || false);
  const [open, setOpen] = useState(false);
  const stompClientRef = useRef(null);
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
        const userInfo = await fetchUserInfo();
        if (!userInfo) {
          console.error('Failed to fetch user information');
          return;
        }

        setUser(userInfo);

        const client = new Client({
          webSocketFactory: () =>
            new SockJS(`${process.env.REACT_APP_API_BASE_URL}/ws`),
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

                setMessages((prevMessages) => [...prevMessages, newMessage]);
              }
            );

            stompClientRef.current = {
              client,
              subscriptionId: subscription.id,
            };
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

        const data = await fetchChatMessages(chatId);
        setMessages(data);
      } catch (error) {
        console.error('Error during initialization:', error);
      }
    };

    initialize();

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.client.deactivate();
      }
      resetNewMessagesCount(chatId);
    };
  }, []);

  const parseSentAt = (sentAt) => {
    if (Array.isArray(sentAt)) {
      return new Date(...sentAt);
    }
    return new Date(sentAt);
  };

  const handleSend = () => {
    const newMessage = {
      chatId: chatId,
      userId: user.id,
      message: {
        nickname: 'N/BBANG',
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

  const handleEndChat = async () => {
    try {
      await endChat(chatId);
      setIsChatEnded(true);
      sendEndNotification();
      alert('채팅을 종료하였습니다.');
    } catch (error) {
      console.error('Failed to end chat', error);
    }
  };

  const sendEndNotification = () => {
    const endMessage = {
      chatId: chatId,
      message: {
        nickname: 'System',
        text: '상담이 종료되었습니다. 감사합니다.',
        sentAt: getCurrentKSTTimeString(),
      },
    };

    stompClientRef.current.client.publish({
      destination: '/app/chat/send/' + chatId,
      body: JSON.stringify(endMessage),
    });
  };

  const handleOpenMemoModal = () => {
    setOpen(true); // Open memo dialog
  };

  const handleSaveMemo = async () => {
    try {
      await archiveChat(chatId, memo);
      setOpen(false); // Close dialog
      alert('채팅이 성공적으로 저장되었습니다.');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert('이미 저장된 채팅입니다.');
      } else {
        console.error('저장 실패', error);
        alert('저장에 실패했습니다. 다시 시도해주세요.');
      }
    }
  };

  const userNickname =
    messages.find(
      (msg) => msg.nickname !== 'N/BBANG' && msg.nickname !== 'System'
    )?.nickname || 'User';

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  let lastDate = null;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex justify-between items-center p-4 bg-white border-b border-gray-200">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/admin/chat')}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>
          <div>
            <h4 className="ml-2 text-lg font-semibold text-gray-800">채팅</h4>
            <p className="ml-2 text-sm text-gray-500">'{userNickname}'와의 채팅 중</p>
          </div>
        </div>
        <div className="flex items-center">
          {isChatEnded && (
            <button
              onClick={handleOpenMemoModal}
              className="bg-primary text-white px-3 py-1.5 rounded-md mr-2 hover:bg-accent transition duration-200"
            >
              상담 저장
            </button>
          )}
          <button
            onClick={handleEndChat}
            className={`${
              isChatEnded ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'
            } text-white px-3 py-1.5 rounded-md transition duration-200`}
            disabled={isChatEnded}
          >
            상담 종료
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 flex flex-col"> 
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
                  msg.nickname === 'N/BBANG'
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
      {!isChatEnded && (
        <div className="flex-none p-4 bg-white border-t border-gray-200 flex items-center justify-center">
          <div className="flex items-center w-full max-w-3xl">
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
              className="flex-1 p-2 border border-gray-300 rounded-md mr-2 text-sm placeholder-gray-400"
              placeholder="메시지를 입력하세요"
            />
            <button
              type="button"
              onClick={handleSend}
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-accent transition duration-200"
            >
              보내기
            </button>
          </div>
        </div>
      )}
      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">저장 메모</h2>
            <textarea
              autoFocus
              className="w-full p-2 border border-gray-300 rounded-md mb-4 resize-none text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              rows="4"
              placeholder="메모를 입력하세요"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
            />
            <div className="flex justify-end">
              <button onClick={() => setOpen(false)} className="bg-gray-400 text-white px-3 py-1.5 rounded-md mr-2 hover:bg-gray-500 transition duration-200">
                취소
              </button>
              <button onClick={handleSaveMemo} className="bg-primary text-white px-3 py-1.5 rounded-md hover:bg-accenet transition duration-200">
                저장
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminChat;
