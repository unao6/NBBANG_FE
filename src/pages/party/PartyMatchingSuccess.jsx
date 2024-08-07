import React from 'react';
import { Box, Button, Typography, Card, CardContent } from "@mui/material";
import { useNavigate } from 'react-router-dom';

const PartyMatchingSuccess = () => {
  const navigate = useNavigate();

  const handleConfirm = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100">
      <Box className="w-full flex flex-col items-center max-w-3xl mx-auto mt-10"> {/* 박스 크기 확대 */}
        <Card className="p-8 bg-white rounded-lg shadow-lg"> {/* 카드 패딩 증가 */}
          <CardContent>
            <Box className="flex justify-center mb-8"> {/* 이미지 아래의 여백 증가 */}
              <img
                src="/assets/imgs/success.png"
                alt="Party Matching Success"
                className="w-48 h-48" // 이미지 크기 확대
              />
            </Box>
            <Typography variant="h4" component="h1" className="text-center font-bold mb-6"> {/* 제목 텍스트 크기 확대 */}
              파티 매칭이 시작되었어요!
            </Typography>
            <Typography className="text-gray-700 text-center mb-6" variant="h6"> {/* 본문 텍스트 크기 확대 */}
              파티 매칭이 완료되면 결제가 진행되며<br />
              이메일과 휴대폰 문자로 알려드려요.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleConfirm}
              sx={{ fontSize: '1.2rem', padding: '0.75rem' }} // 버튼 크기 확대
            >
              확인
            </Button>
          </CardContent>
        </Card>
        <Box className="mt-8"> {/* 카드 아래의 여백 증가 */}
        </Box>
      </Box>
    </div>
  );
};

export default PartyMatchingSuccess;
