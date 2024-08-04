import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Paper, Typography, IconButton, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { fetchChatMessages, sendMessage, endChat, archiveChat } from '../../../api/chat/chatApi';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import useUserStore from '../../../store/useUserStore';

const AdminChat = () => {
    const { chatId } = useParams();
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [memo, setMemo] = useState('');
    const chatEndRef = useRef(null);
    const [isChatEnded, setIsChatEnded] = useState(false);
    const [open, setOpen] = useState(false); // Dialog 상태
    const stompClient = useRef(null);
    
    const user = useUserStore(state => state.user);

    useEffect(() => {
        const loadMessages = async () => {
            try {
                const data = await fetchChatMessages(chatId);
                setMessages(data);
            } catch (error) {
                console.error("Failed to fetch messages", error);
            }
        };

        const connectWebSocket = () => {
            const socket = new SockJS(`${process.env.REACT_APP_API_BASE_URL}/ws`);
            stompClient.current = new Client({
                webSocketFactory: () => socket,
                debug: (str) => {
                    console.log(str);
                },
                onConnect: () => {
                    stompClient.current.subscribe(`/queue/messages/${chatId}`, (message) => {
                        if (message.body) {
                            setMessages((prevMessages) => [...prevMessages, JSON.parse(message.body)]);
                            chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
                        }
                    });
                },
                onStompError: (frame) => {
                    console.error('Broker reported error: ' + frame.headers['message']);
                    console.error('Additional details: ' + frame.body);
                },
            });

            stompClient.current.activate();
        };

        loadMessages();
        connectWebSocket();

        return () => {
            if (stompClient.current) {
                stompClient.current.deactivate();
            }
        };
    }, [chatId]);

    const handleSend = () => {
        if (input.trim() !== '' && !isChatEnded) {
            const newMessage = {
                chatId: chatId,
                userId: user.id,
                message: {
                    nickname: 'N/BBANG',
                    text: input,
                    sentAt: new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul', hour12: false })
                }
            };
            sendMessage(stompClient.current, newMessage);
            setInput('');
        }
    };

    const handleEndChat = () => {
        setOpen(true); // Dialog 열기
    };

    const handleSaveMemo = async () => {
        try {
            await endChat(chatId);
            await archiveChat(chatId, memo);
            setIsChatEnded(true);
            setOpen(false); // Dialog 닫기
        } catch (error) {
            console.error("Failed to save memo and end chat", error);
        }
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
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>채팅 메모</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="메모"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={memo}
                        onChange={(e) => setMemo(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} color="primary">
                        취소
                    </Button>
                    <Button onClick={handleSaveMemo} color="primary">
                        저장
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default AdminChat;
