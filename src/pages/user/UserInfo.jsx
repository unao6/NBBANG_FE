import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Avatar, List, ListItem, ListItemIcon, ListItemText, Divider, IconButton } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { fetchUserInfo } from '../../api/user/userApi';

const UserInfo = () => {
  const [user, setUser] = useState({ nickname: '', phoneNumber: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchUserInfo();
        setUser({
          ...response,
          phoneNumber: formatPhoneNumber(response.phoneNumber)
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
  }, []);

  const formatPhoneNumber = (phoneNumber) => {
    if (phoneNumber.length === 11) {
      return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 7)}-${'*'.repeat(4)}`;
    } else if (phoneNumber.length === 10) {
      return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 6)}-${'*'.repeat(4)}`;
    } else {
      return phoneNumber;
    }
  };

  const handleDeleteAccountClick = () => {
    navigate('/mypage/delete-account');
  };

  const handleChangePhoneNumber = () => {
    navigate('/mypage/change-number');
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ marginTop: 1, marginBottom: 3, }}>
        계정 관리
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
        <Avatar sx={{ width: 56, height: 56, marginRight: 2 }}></Avatar>
        <Box>
          <Typography variant="h6">{user.nickname}</Typography>
          <Typography variant="body2">{user.phoneNumber}</Typography>
        </Box>
      </Box>
      <List>
        <ListItem button onClick={handleChangePhoneNumber}>
          <ListItemIcon>
            <PhoneIcon />
          </ListItemIcon>
          <ListItemText primary="휴대폰 번호 변경" />
          <IconButton edge="end">
            <ArrowForwardIosIcon />
          </IconButton>
        </ListItem>
        <Divider />
        <ListItem button onClick={handleDeleteAccountClick}>
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
