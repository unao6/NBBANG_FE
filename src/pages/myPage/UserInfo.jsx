import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Avatar, List, ListItem, ListItemIcon, ListItemText, Divider, IconButton } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const UserInfo = () => {
    const [user, setUser] = useState({ email: '', phoneNumber: '' });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('access');
                const response = await axios.get('http://localhost:8080/api/users/user-info', {
                    headers: {
                        'access': `${token}`
                    }
                });
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <Box sx={{ padding: 2 }}>
            <Typography variant="h6" gutterBottom>
                계정 관리
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                <Avatar sx={{ width: 56, height: 56, marginRight: 2 }}></Avatar>
                <Box>
                    <Typography variant="h6">{user.email}</Typography>
                    <Typography variant="p">{user.phoneNumber}</Typography>

                </Box>
            </Box>
            <List>
                <ListItem button>
                    <ListItemIcon>
                        <PhoneIcon />
                    </ListItemIcon>
                    <ListItemText primary="휴대폰 번호 변경" />
                    <IconButton edge="end">
                        <ArrowForwardIosIcon />
                    </IconButton>
                </ListItem>
                <Divider />
                <ListItem button>
                    <ListItemIcon>
                        <ExitToAppIcon sx={{ color: 'red' }} />
                    </ListItemIcon>
                    <ListItemText primary="회원 탈퇴" sx={{ color: 'red' }} />
                    <IconButton edge="end">
                        <ArrowForwardIosIcon />
                    </IconButton>
                </ListItem>
            </List>
        </Box>
    );
};

export default UserInfo;