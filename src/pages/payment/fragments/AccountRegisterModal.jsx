import {
  Box,
  Button,
  Container,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

import CloseIcon from "@mui/icons-material/Close";
import { registerAccount } from "../../../api/payment/accountApi";

const AccountRegisterModal = ({ open, onClose, onSubmitSuccess }) => {
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [error, setError] = useState(""); // 에러 메시지 상태 관리

  const handleBankNameChange = (event) => {
    setBankName(event.target.value);
  };

  const handleAccountNumberChange = (event) => {
    const value = event.target.value;

    // 숫자가 아닌 문자가 입력되면 경고 메시지 표시
    if (/^\d*$/.test(value)) {
      setAccountNumber(value);
      setError(""); // 숫자만 입력되면 에러 메시지 제거
    } else {
      setError("계좌번호는 숫자만 입력할 수 있습니다.");
    }
  };

  const handleSubmit = async () => {
    if (error || !accountNumber || !bankName) {
      // 오류가 있거나 필수 필드가 비어 있으면 제출하지 않음
      setError("모든 필드를 올바르게 입력해주세요.");
      return;
    }

    try {
      const result = await registerAccount(bankName, accountNumber);
      console.log("서버 응답:", result);

      onSubmitSuccess();
      onClose();
    } catch (error) {
      console.error("서버 요청 중 오류 발생:", error);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Container
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
        }}
      >
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          sx={{
            bgcolor: "background.paper",
            p: 4,
            borderRadius: 2,
            boxShadow: 24,
            width: "100%",
            maxWidth: 400,
            position: "relative",
          }}
        >
          <IconButton
            sx={{ position: "absolute", top: 8, right: 8 }}
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
            계좌 정보를 입력하세요
          </Typography>
          <Box
            component="form"
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              width: "100%",
            }}
          >
            <FormControl fullWidth>
              <InputLabel>은행 이름</InputLabel>
              <Select
                value={bankName}
                onChange={handleBankNameChange}
                label="은행 이름"
              >
                {[
                  "경남은행",
                  "광주은행",
                  "대구은행",
                  "부산은행",
                  "산림조합",
                  "새마을금고",
                  "수협은행",
                  "신한은행",
                  "신협은행",
                  "씨티은행",
                  "우리은행",
                  "우체국",
                  "저축은행",
                  "전북은행",
                  "제주은행",
                  "카카오뱅크",
                  "케이뱅크",
                  "토스뱅크",
                  "하나은행",
                  "한국투자증권",
                  "IBK기업은행",
                  "KB국민은행",
                  "KB증권",
                  "KDB산업은행",
                  "KEB외환은행",
                  "NH농협은행",
                  "NH투자증권",
                  "SBI저축은행",
                  "SC제일은행",
                ].map((bank) => (
                  <MenuItem key={bank} value={bank}>
                    {bank}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="계좌 번호"
              variant="outlined"
              fullWidth
              value={accountNumber}
              onChange={handleAccountNumberChange}
              error={!!error} // 에러가 있으면 에러 스타일 적용
              helperText={error} // 에러 메시지 표시
              inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
            />
            <Button
              variant="text"
              onClick={handleSubmit}
              sx={{
                color: "primary.main",
                fontWeight: "bold",
                marginBottom: "8px",
              }}
            >
              입력 완료
            </Button>
          </Box>
        </Box>
      </Container>
    </Modal>
  );
};

export default AccountRegisterModal;
