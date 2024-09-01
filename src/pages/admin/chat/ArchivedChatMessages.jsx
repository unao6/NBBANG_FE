import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import { fetchArchivedChatMessages } from '../../../api/chat/chatApi';

const ArchivedChatMessages = () => {
  const { archivedId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const data = await fetchArchivedChatMessages(archivedId);
        setMessages(data.messages);
      } catch (error) {
        setError('Failed to fetch messages');
      } finally {
        setLoading(false);
      }
    };
    loadMessages();
  }, [archivedId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const userNickname =
    messages.find(
      (msg) => msg.nickname !== 'N/BBANG' && msg.nickname !== 'System'
    )?.nickname || 'User';

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center mt-4">{error}</div>;
  }

  let lastDate = null;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex justify-between items-center p-4 bg-white border-b border-gray-200">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/admin/chat/archived/list')}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>
          <div>
            <h4 className="ml-2 text-lg font-semibold text-gray-800">아카이브 채팅</h4>
            <p className="ml-2 text-sm text-gray-500">'{userNickname}'와의 채팅</p>
          </div>
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
    </div>
  );
};

export default ArchivedChatMessages;
