import React, { useState } from "react";
import { Box, Button, TextField, Typography, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { registerAccount } from "../../api/payment/accountApi";

const AccountRegisterPage = () => {
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const navigate = useNavigate();

  const handleBankNameChange = (event) => {
    setBankName(event.target.value);
  };

  const handleAccountNumberChange = (event) => {
    setAccountNumber(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      const result = await registerAccount(bankName, accountNumber);
      console.log("서버 응답:", result);
      navigate(-1); // 이전 페이지로 돌아가기
      // 성공 메시지 또는 추가적인 처리
    } catch (error) {
      console.error("서버 요청 중 오류 발생:", error);
      // 오류 메시지 또는 처리
    }
  };

  return (
    <Container>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="60vh"
      >
        <Typography variant="h4" gutterBottom>
          계좌 정보를 입력하세요
        </Typography>
        <Box
          component="form"
          sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%", maxWidth: 400 }}
        >
          <TextField
            label="은행 이름"
            variant="outlined"
            fullWidth
            value={bankName}
            onChange={handleBankNameChange}
          />
          <TextField
            label="계좌 번호"
            variant="outlined"
            fullWidth
            value={accountNumber}
            onChange={handleAccountNumberChange}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
          >
            입력 완료
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default AccountRegisterPage;
