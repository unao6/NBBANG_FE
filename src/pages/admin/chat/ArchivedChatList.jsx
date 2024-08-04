import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { List, ListItem, ListItemText, Paper, Typography, TextField } from '@mui/material';
import ReactPaginate from 'react-paginate';
import { styled } from '@mui/material/styles';
import { fetchArchivedChats } from '../../../api/chat/chatApi';

const CustomTextField = styled(TextField)({
    '& label.Mui-focused': {
        color: 'green',
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: 'green',
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: 'green',
        },
        '&:hover fieldset': {
            borderColor: 'green',
        },
        '&.Mui-focused fieldset': {
            borderColor: 'green',
        },
        '&.Mui-focused': {
            outline: 'none',
            boxShadow: 'none',
        },
        '& input': {
            boxShadow: 'none !important',
            outline: 'none !important',
            padding: '8.5px 14px', 
        },
    },
});

const ChatList = () => {
    const [chats, setChats] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('ALL');
    const chatsPerPage = 10;
    const navigate = useNavigate();

    useEffect(() => {
        const loadChats = async () => {
            try {
                const data = await fetchArchivedChats();
                setChats(data);
            } catch (error) {
                console.error("Failed to fetch chats", error);
            }
        };
        loadChats();
    }, []);

    const filteredChats = chats.filter(chat => {
        const matchesStatus = filter === 'ALL' || (filter === 'ONGOING' && chat.status) || (filter === 'ENDED' && !chat.status);
        const matchesSearch = chat.user.nickname.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const pageCount = Math.ceil(filteredChats.length / chatsPerPage);

    const handlePageClick = (data) => {
        setCurrentPage(data.selected);
    };

    const handleChatClick = (archivedId) => {
        navigate(`/admin/chat/${archivedId}`);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(0); // 검색어가 변경될 때 첫 페이지로 이동
    };

    const displayChats = filteredChats.slice(currentPage * chatsPerPage, (currentPage + 1) * chatsPerPage);

    return (
        <div className="p-4 h-full overflow-y-auto">
            <Typography variant="h5" gutterBottom>채팅 목록</Typography>
            <div className="flex justify-between items-center mb-4">
                <CustomTextField 
                    label="닉네임 검색"
                    variant="outlined"
                    size="small"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    InputLabelProps={{
                        style: {
                            fontSize: '0.75rem'
                        }
                    }}
                    InputProps={{
                        style: {
                            height: '40px',
                            padding: '0 14px',
                        }
                    }}
                />
            </div>
            <List>
                {displayChats.map(archivedChat => (
                    <Paper 
                        key={archivedChat.id} 
                        elevation={2} 
                        className="mb-2 cursor-pointer p-2"
                        onClick={() => handleChatClick(archivedChat.id)}
                    >
                        <ListItem className="p-2">
                            <ListItemText
                                primary={
                                    <div className="flex justify-between items-center text-sm">
                                        <Typography variant="subtitle1">{archivedChat.user.nickname}</Typography>
                                    </div>
                                }
                                secondary={
                                    <Typography variant="body2" className="text-xs">
                                        상담 종료일: {new Date(archivedChat.endedAt).toLocaleTimeString()}
                                    </Typography>
                                }
                            />
                        </ListItem>
                    </Paper>
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
                containerClassName={'flex justify-center mt-4'} 
                activeClassName={'font-bold text-blue-500'}
                pageClassName={'mx-2'}
                previousClassName={'mx-2'}
                nextClassName={'mx-2'}
                breakClassName={'mx-2'}
                pageLinkClassName={'p-2 border rounded'}
                previousLinkClassName={'p-2 border rounded'}
                nextLinkClassName={'p-2 border rounded'}
                breakLinkClassName={'p-2 border rounded'}
            />
        </div>
    );
};

export default ChatList;
