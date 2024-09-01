import React, { useEffect } from 'react';
import { deleteEmptyChat, startChat } from '../../api/chat/chatApi';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import IconButton from '@mui/material/IconButton';
import { useNavigate } from 'react-router-dom';

const StartChat = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const cleanupEmptyChats = async () => {
      try {
        await deleteEmptyChat();
      } catch (error) {
        console.error('빈 채팅방 삭제 실패:', error.response ? error.response.data : error.message);
      }
    };

    cleanupEmptyChats();
  }, []);

  const handleButtonClick = async () => {
    try {
      const response = await startChat();
      const { chatId, messages } = response;
      navigate(`/chat/${chatId}`, { state: { messages } });
    } catch (error) {
      console.log("Error starting chat: ", error);
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between mb-2">
        <IconButton aria-label="back" onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton>
      </div>
      <div className="flex-1 flex items-start justify-center mt-0">
        <div className="w-full max-w-lg bg-white p-4 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <div className="text-2xl font-bold">채팅 상담</div>
          </div>
          <div className="mb-4">
            <div className="flex flex-wrap justify-center">
              <img src={`${process.env.PUBLIC_URL}/assets/imgs/nbbang.png`} alt="NBBANG" className="mb-3 w-1/2 h-1/2" />
            </div>
            <p className="text-lg font-semibold">NBBANG</p>
            <p className="text-md text-gray-500">대한민국 N등 OTT 계정 공유 서비스, NBBANG입니다.</p>
            <p className="text-md text-gray-500">궁금하신 사항이 있다면 언제든지 문의해주세요.</p>
            <p className="text-md text-black">운영시간 : 10:00 ~ 19:00</p>
          </div>
          <button className="w-full bg-primary text-white py-2 rounded-lg text-center"
                  onClick={handleButtonClick}>
            문의하기
          </button>
          <p className="text-sm text-gray-500 text-center mt-2 mb-20">
            몇 분 내 답변 받으실 수 있어요.
          </p>
        </div>
      </div>
    </div>
  );
  
};

export default StartChat;
