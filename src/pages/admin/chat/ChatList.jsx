import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { fetchAllChats } from "../../api/chat/chatApi";
import ReactPaginate from "react-paginate";
import { List, ListItem, ListItemText, Paper, Typography } from '@mui/material';

const ChatList = () => {
    const [chats, setChats] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const navigate = useNavigate();

    useEffect(()=> {
        const loadChats = async (page) => {
            const response = await fetchAllChats(page, 10);
            setChats(response.content);
            setPageCount(response.totalPages);
        };

        loadChats(currentPage);
    }, [currentPage]);

    const handlePageClick = (data) => {
        setCurrentPage(data.selected);
    }

    const handleChatClick = (chatId) => {
        navigate(`/admin/chat/${chatId}`);
    }

    return ( 
        <div className="p-4">
            <Typography variant="h4" gutterBottom>채팅 목록</Typography>
            <List>
                {chats.map(chat=> (
                    <paper
                        key={chat.id}
                        elevation={2}
                        className="mb-4 cursor-pointer"
                        onClick={()=> handleChatClick(chat.id)}
                    >
                        <ListItem>
                            <ListItemText
                                primary= {
                                    <div className="flex justify-between">
                                        <Typography variant="h6">{chat.user.nickname}</Typography>
                                        <Typography variant="body2" color={chat.status==='ONGOING' ? 'green' : 'gray'}>
                                            {chat.status === 'ONGOING' ? '문의 중' : '문의 종료'}
                                        </Typography>
                                    </div>
                                }
                                secondary= {`마지막 메세지 시간: ${new Date(chat.lastRepliedAt).toLocaleTimeString()}`} 
                                />
                        </ListItem>
                    </paper>
                ))}
            </List>
            <ReactPaginate 
                previousLabel={'<'}
                nextLabel={'>'}
                breakLabel={'...'}
                pageCount={pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageClick}
                containerClassName={'pagination'}
                activeClassName={'active'}
            />
        </div>
    )
}

export default ChatList;