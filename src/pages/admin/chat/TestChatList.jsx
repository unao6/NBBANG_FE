import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { List, ListItem, ListItemText, Paper, Typography } from '@mui/material';
import ReactPaginate from 'react-paginate';

const dummyChats = [
    {
        id: 1,
        user: { nickname: 'User1' },
        lastRepliedAt: new Date(),
        status: 'ONGOING'
    },
    {
        id: 2,
        user: { nickname: 'User2' },
        lastRepliedAt: new Date(new Date().setHours(new Date().getHours() - 1)),
        status: 'ENDED'
    }
];

const TestChatList = () => {
    const [chats, setChats] = useState(dummyChats);
    const [pageCount, setPageCount] = useState(1);
    const [currentPage, setCurrentPage] = useState(0);
    const navigate = useNavigate();

    const handlePageClick = (data) => {
        setCurrentPage(data.selected);
    };

    const handleChatClick = (chatId) => {
        navigate(`/admin/chat/${chatId}`);
    };

    return (
        <div className="p-4">
            <Typography variant="h4" gutterBottom>채팅 목록</Typography>
            <List>
                {chats.map(chat => (
                    <Paper 
                        key={chat.id} 
                        elevation={2} 
                        className="mb-4 cursor-pointer" 
                        onClick={() => handleChatClick(chat.id)}
                    >
                        <ListItem>
                            <ListItemText
                                primary={
                                    <div className="flex justify-between">
                                        <Typography variant="h6">{chat.user.nickname}</Typography>
                                        <Typography variant="body2">{}</Typography>
                                        <Typography variant="body2" color={chat.status === 'ONGOING' ? 'blue' : 'gray'}>
                                            {chat.status === 'ONGOING' ? '상담 중' : '상담 종료'}
                                        </Typography>
                                    </div>
                                }
                                secondary={`마지막 메시지: ${new Date(chat.lastRepliedAt).toLocaleTimeString()}`}
                            />
                        </ListItem>
                    </Paper>
                ))}
            </List>
            <ReactPaginate
                previousLabel={'이전'}
                nextLabel={'다음'}
                breakLabel={'...'}
                pageCount={pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageClick}
                containerClassName={'pagination'}
                activeClassName={'active'}
            />
        </div>
    );
};

export default TestChatList;
