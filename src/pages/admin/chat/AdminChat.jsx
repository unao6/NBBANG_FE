import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchChatMessages, endChat, sendMessage } from './chatApi';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { TextField, Button, Paper, Typography} from '@mui/material';

const ChatDetails = () => {
    const { chatId } = useParams();
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const chatEndRef = useRef(null);
    const [stompClient, setStompClient] = useState(null);
    const [isChatEnded, setIsChatEnded] = useState(false);

    useEffect(() => {
        const loadMessages = async () => {
            const response = await fetchChatMessages(chatId);
            setMessages(response);
        };

        const initiateChat = async () => {
            loadMessages();
            
            const client = new Client({
                webSocketFactory: () => new SockJS('/ws'),
                debug: (str) => {
                    console.log(str);
                },
                onConnect: () => {
                    client.subscribe('/queue/messages', (message) => {
                        const newMessage = JSON.parse(message.body);
                        setMessages((prevMessages) => [...prevMessages, newMessage]);
                    });
                },
            });

            client.activate();
            setStompClient(client);

            return () => {
                if(client) {
                    client.deactivate();
                }
            };
        };

        initiateChat();
    }, [chatId]);

    const handleSend = async () => {
        if (input.trim() !== '' && chatId !== null && stompClient) {
            const message = {
                chatId: chatId,
                userId: 1, // 관리자 ID
                message: {
                    nickname: "관리자", // 관리자 닉네임
                    text: input,
                    sentAt: new Date().toISOString(),
                },
            };

            try {
                const response = await sendMessage(message);
                setMessages([...messages, response]);
            } catch(error) {
                console.error('Error sending message: ', error);
            }
            setInput('');
        }
    };

    const handleEndChat = async () => {
        try {
            await endChat(chatId);
            setIsChatEnded(true);
        } catch (error) {
            console.error('Error ending chat: ', error);
        }
    };

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="flex flex-col h-full relative p-4">
            <div className="flex justify-between items-center mb-4">
                <Typography variant="h4">채팅 상세보기</Typography>
                <Button onClick={handleEndChat} variant="contained" color="secondary">
                    상담 종료
                </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 bg-white flex flex-col border border-gray-200 rounded-lg" style={{ paddingTop: '68px', paddingBottom: '68px' }}>
                <div ref={chatEndRef} />
                {messages.map((msg, index) => (
                    <Paper key={index} className={`my-2 p-2 ${msg.nickname === '관리자' ? 'self-end text-right bg-blue-100' : 'self-start text-left bg-gray-100'}`}>
                        <Typography variant="body2" className="text-gray-600 mb-1">{msg.nickname}</Typography>
                        <Typography variant="body1">{msg.text}</Typography>
                        <Typography variant="caption" className="text-gray-500 mt-1 block">{new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Typography>
                    </Paper>
                ))}
                <div ref={chatEndRef} />
            </div>
            {!isChatEnded && (
                <div className="fixed bottom-[68px] left-0 right-0 flex p-2 bg-white z-50 max-w-[540px] mx-auto">
                    <TextField 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="flex-1 mr-2"
                        variant="outlined"
                        placeholder="메시지를 입력하세요..."
                    />
                    <Button onClick={handleSend} variant="contained" color="primary">
                        보내기
                    </Button>
                </div>
            )}
        </div>
    );
};

export default ChatDetails;
