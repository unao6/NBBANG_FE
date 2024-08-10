import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const StartChat = () => {
  const navigate = useNavigate();

  // const handleButtonClick = () => {
  //   axios.post('/api/chat/start')
  //     .then(response => {
  //       const { chatId, messages } = response.data;
  //       navigate('/chat', { state: { chatId, messages } });
  //     })
  //     .catch(error => console.error('Error starting chat:', error));
  // };

  //테스트용
	const handleButtonClick = () => {
    const userId = 1;
    axios.post('/api/chat/start', { userId })
      .then(response => {
        const { chatId, messages } = response.data;
        navigate('/chat', { state: { chatId, messages } });
      })
      .catch(error => console.error('Error starting chat:', error));
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex items-center justify-center mt-10">
        <div className="w-full max-w-lg bg-white p-4 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <div className="text-2xl font-bold">NBBANG</div>
          </div>
          <div className="mb-4">
            <p className="text-lg font-semibold">NBBANG</p>
            <p className="text-md text-gray-500">OTT 계정 공유 서비스, NBBANG</p>
          </div>
          <button className="w-full bg-yellow-400 text-black py-2 rounded-lg text-center"
                  onClick={handleButtonClick}>
            문의하기
          </button>
          <p className="text-sm text-gray-500 text-center mt-2">
            몇 분 내 답변 받으실 수 있어요.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StartChat;
