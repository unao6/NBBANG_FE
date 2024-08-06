import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { fetchChatMessages, sendMessage, endChat, archiveChat } from '../../../api/chat/chatApi';
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
            const token = localStorage.getItem('access');
            client.publish({
              destination: '/app/auth',
              body: JSON.stringify({ token }),
            });

            // 기존 구독 취소 및 새 구독 설정
            if (stompClientRef.current && stompClientRef.current.subscriptionId) {
              client.unsubscribe(stompClientRef.current.subscriptionId);
            }

            const subscription = client.subscribe(
              `/queue/messages/${chatId}`,
              (message) => {
                const newMessage = JSON.parse(message.body);
                newMessage.sentAt = parseSentAt(newMessage.sentAt);

                console.log('Received message:', newMessage);

                if (!isNaN(newMessage.sentAt.getTime())) {
                  setMessages((prevMessages) => {
                    const isDuplicate = prevMessages.some((msg) => msg.id === newMessage.id);
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

            // Store the client and subscription in a ref
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
    };
  }, [chatId, setUser]);

  const parseSentAt = (sentAt) => {
    if (Array.isArray(sentAt)) {
      return new Date(...sentAt);
    }
    return new Date(sentAt);
  };

  const handleSend = () => {
    if (!user || !user.id) {
      console.error('User information is missing');
      return;
    }

    if (input.trim() === '') {
      console.error('Input message is empty');
      return;
    }

    if (
      !stompClientRef.current ||
      !stompClientRef.current.client.connected
    ) {
      console.error('WebSocket is not connected');
      return;
    }

    const newMessage = {
      chatId: chatId,
      userId: user.id,
      message: {
        nickname: 'N/BBANG',
        text: input,
        sentAt: getCurrentKSTTimeString(),
      },
    };

    console.log('Sending message:', newMessage);

    stompClientRef.current.client.publish({
      destination: '/app/chat/send',
      body: JSON.stringify(newMessage),
    });

    setMessages((prevMessages) => [...prevMessages, newMessage.message]);
    setInput('');
  };

  const handleEndChat = async () => {
    try {
      await endChat(chatId);
      setIsChatEnded(true);
      alert('채팅을 종료하였습니다.');
    } catch (error) {
      console.error('Failed to end chat', error);
    }
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
    messages.find((msg) => msg.nickname !== 'N/BBANG')?.nickname ||
    'User';

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
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
              className="bg-blue-500 text-white px-3 py-1.5 rounded-md mr-2 hover:bg-blue-600 transition duration-200"
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
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`my-2 p-3 rounded-lg max-w-lg ${
              msg.nickname === 'N/BBANG' ? 'self-end text-right bg-blue-100' : 'self-start text-left bg-white shadow'
            }`}
          >
            <p className="text-xs text-gray-500">{msg.nickname}</p>
            <p className="text-sm text-gray-700">{msg.text}</p>
            <p className="text-xs text-gray-400 mt-1">
              {new Date(msg.sentAt).toLocaleTimeString('ko-KR', {
                timeZone: 'Asia/Seoul',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              })}
            </p>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      {!isChatEnded && (
        <div className="flex-none p-4 bg-white border-t border-gray-200 flex items-center justify-center">
          <div className="flex items-center w-full max-w-3xl">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded-md mr-2 text-sm placeholder-gray-400"
              placeholder="메시지를 입력하세요"
            />
            <button
              onClick={handleSend}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
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
              className="w-full p-2 border border-gray-300 rounded-md mb-4 resize-none text-sm"
              rows="4"
              placeholder="메모를 입력하세요"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
            />
            <div className="flex justify-end">
              <button onClick={() => setOpen(false)} className="bg-gray-400 text-white px-3 py-1.5 rounded-md mr-2 hover:bg-gray-500 transition duration-200">
                취소
              </button>
              <button onClick={handleSaveMemo} className="bg-blue-500 text-white px-3 py-1.5 rounded-md hover:bg-blue-600 transition duration-200">
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
