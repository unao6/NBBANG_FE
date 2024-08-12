import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Card, CardContent, IconButton } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { fetchUserInfo, deleteAccount } from '../../api/user/userApi';

const DeleteAccount = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const userInfo = await fetchUserInfo();
        if (userInfo) {
          setUser(userInfo);
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
        navigate('/login'); // 인증이 필요한 경우 로그인 페이지로 이동
      }
    };

    loadUserInfo();
  }, [navigate]);

  const handleDeleteAccount = async () => {
    if (user && user.email) {
      try {
        await deleteAccount(user.email);
        alert('회원 탈퇴가 완료되었습니다.');
        localStorage.removeItem('access'); // 저장된 토큰 제거
        window.dispatchEvent(new Event('storage')); // 로컬 스토리지 변경 감지 이벤트를 수동으로 트리거
        navigate('/'); // 메인 화면으로 이동
      } catch (error) {
        console.error('회원 탈퇴에 실패했습니다:', error);
        alert('회원 탈퇴에 실패했습니다. 다시 시도해주세요.');
      }
    } else {
      alert('사용자 정보를 가져오는 데 실패했습니다.');
    }
  };

  const handleBackClick = () => {
    navigate(-1); // 이전 페이지로 이동
  };

  if (!user) return <div>Loading...</div>; // 사용자 정보가 로드될 때까지 로딩 표시

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100%',
        backgroundColor: '#f3f4f6',
        padding: '16px',
      }}
    >
      <IconButton onClick={handleBackClick} sx={{ alignSelf: 'flex-start', marginBottom: 2 }}>
        <ArrowBackIosIcon />
      </IconButton>
      <Typography variant="h6" gutterBottom>
        N/BBANG 계정 관리
      </Typography>
      <Card
        sx={{
          maxWidth: 400,
          width: '100%',
          textAlign: 'center',
          padding: '32px 16px',
          borderRadius: '16px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        }}
      >
        <CardContent>
          <Typography variant="h6" gutterBottom>
            정말로 회원탈퇴 하시겠어요?
          </Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            N/BBANG에 등록된 모든 정보가 삭제돼요.
            <br />
            이용 중·정산 전인 파티가 있으면 회원탈퇴가 불가해요.
          </Typography>
        </CardContent>
      </Card>
      <Button
        variant="contained"
        color="error"
        sx={{
          marginTop: 3,
          borderRadius: 50,
          padding: '12px 24px',
          fontSize: '16px',
          fontWeight: 'bold',
          maxWidth: 400,
          width: '100%',
        }}
        onClick={handleDeleteAccount}
      >
        회원 탈퇴하기
      </Button>
    </Box>
  );
};

export default DeleteAccount;