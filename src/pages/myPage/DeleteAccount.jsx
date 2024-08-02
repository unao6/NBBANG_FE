import React from 'react';
import { Box, Button, Typography, Card, CardContent } from '@mui/material';

const DeleteAccount = () => {
    const handleDeleteAccount = () => {
        // 회원 탈퇴 로직을 여기에 추가하세요
        console.log("회원 탈퇴하기 버튼 클릭됨");
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                backgroundColor: '#f3f4f6',
                padding: '16px',
            }}
        >
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
                        N/BBANG에 등록된 모든 정보가 삭제돼요.<br />
                        이용중·정산 전인 파티가 있으면 회원탈퇴가 불가해요.
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