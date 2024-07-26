import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import React, { useState } from "react";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const PaymentMypage = () => {
  const [cardRegistered, setCardRegistered] = useState(true); // 카드 등록 여부를 설정. 등록된 카드가 없다면 false로 설정
  const [cardInfo, setCardInfo] = useState({
    provider: "카카오페이",
    cardType: "간편결제",
  });

  const handleRegister = () => {
    // 카드 등록 로직 구현
  };

  const handleDelete = () => {
    setCardRegistered(false);
    // 카드 삭제 로직 구현
  };

  const handleChange = () => {
    // 카드 변경 로직 구현
  };

  return (
    <Box className="min-h-screen bg-gray-100 p-4">
      <Box className="max-w-lg mx-auto bg-white rounded-lg shadow p-4">
        <Typography variant="h6" component="div" gutterBottom>
          현재 결제수단
        </Typography>
        {cardRegistered ? (
          <Card className="my-4">
            <CardContent>
              <Typography variant="h5" component="div">
                {cardInfo.provider}
              </Typography>
              <Typography color="textSecondary">{cardInfo.cardType}</Typography>
            </CardContent>
            <Box className="flex justify-around p-4">
              <Button
                variant="contained"
                color="primary"
                startIcon={<EditIcon />}
                onClick={handleChange}
              >
                결제 수단 변경
              </Button>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<DeleteIcon />}
                onClick={handleDelete}
              >
                결제 수단 제거
              </Button>
            </Box>
          </Card>
        ) : (
          <Box className="text-center">
            <Typography color="textSecondary" gutterBottom>
              등록된 결제수단이 없습니다.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleRegister}
            >
              결제 수단 등록
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default PaymentMypage;
