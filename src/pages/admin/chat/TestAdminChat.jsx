import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Paper, Typography, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const dummyMessages = [
    {
        nickname: 'User1',
        text: '안녕하세요',
        sentAt: new Date().toISOString()
    },
    {
        nickname: 'N/BBANG',
        text: '안녕하세요, 무엇을 도와드릴까요?',
        sentAt: new Date(new Date().setMinutes(new Date().getMinutes() - 5)).toISOString()
    }
];

const TestAdminChat = () => {
    const { chatId } = useParams();
    const navigate = useNavigate();
    const [messages, setMessages] = useState(dummyMessages);
    const [input, setInput] = useState('');
    const chatEndRef = useRef(null);
    const [isChatEnded, setIsChatEnded] = useState(false);

    const handleSend = () => {
        if (input.trim() !== '' && !isChatEnded) {
            const newMessage = {
                nickname: 'N/BBANG',
                text: input,
                sentAt: new Date().toISOString()
            };
            setMessages([...messages, newMessage]);
            setInput('');
        }
    };

    const handleEndChat = () => {
        setIsChatEnded(true);
    };

    const userNickname = messages.find(msg => msg.nickname !== 'N/BBANG')?.nickname || 'User';

    return (
        <div className="flex flex-col h-full relative">
            <div className="flex justify-between items-center p-4 bg-gray-100">
                <div className="flex items-center">
                    <IconButton onClick={() => navigate('/admin/chat')}>
                        <ArrowBackIcon />
                    </IconButton>
                    <div>
                        <Typography variant="h4" className="ml-2">채팅</Typography>
                        <Typography variant="body2" className="ml-2">{userNickname}와의 채팅 중</Typography>
                    </div>
                </div>
                <Button onClick={handleEndChat} variant="contained" style={{ backgroundColor: '#FF9800', color: 'black' }}>
                    상담 종료
                </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 bg-white flex flex-col border border-gray-200 rounded-lg" style={{ paddingTop: '68px', paddingBottom: '68px' }}>
                {messages.map((msg, index) => (
                    <Paper key={index} className={`my-2 p-2 ${msg.nickname === 'N/BBANG' ? 'self-end text-right bg-blue-100' : 'self-start text-left bg-gray-100'}`}>
                        <Typography variant="body2" className="text-gray-600 mb-1">{msg.nickname}</Typography>
                        <Typography variant="body1">{msg.text}</Typography>
                        <Typography variant="caption" className="text-gray-500 mt-1 block">{new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Typography>
                    </Paper>
                ))}
                <div ref={chatEndRef} />
            </div>
            {!isChatEnded && (
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-white border-t border-gray-300 flex items-center max-w-full">
                    <div className="w-full max-w-4xl mx-auto flex items-center">
                        <TextField 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="flex-1 mr-4"
                            variant="outlined"
                            placeholder="메시지를 입력하세요"
                        />
                        <Button onClick={handleSend} variant="contained" color="primary">
                            보내기
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TestAdminChat;
