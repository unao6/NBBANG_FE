import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  deleteAccountInfo,
  getAccountInfo,
} from "../../api/payment/accountApi";

import AccountRegisterModal from "./fragments/AccountRegisterModal";
import { getBankImage } from "../../components/BankImage";

const AccountMyPage = () => {
  const [accountInfo, setAccountInfo] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchAccountInfo = async () => {
    try {
      const data = await getAccountInfo(); // userId 제거
      setAccountInfo(data);
    } catch (error) {
      console.error("Error fetching account info:", error);
    }
  };

  useEffect(() => {
    fetchAccountInfo(); // userId 제거
  }, []);

  const handleRegisterOrChange = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleDelete = async () => {
    try {
      await deleteAccountInfo(); // userId 제거
      setAccountInfo(null);
    } catch (error) {
      console.error("Error deleting account info:", error);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "24px",
        bgcolor: "#F7FAFC",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        maxWidth: "500px",
        margin: "auto",
        marginTop: "32px",
      }}
    >
      <Typography
        variant="h6"
        sx={{  marginBottom: "16px", fontWeight: "bold" }}
      >
        다음 계좌로 매달 안전히 정산해드려요
      </Typography>
      <Card
        sx={{
          display: "flex",
          alignItems: "center",
          padding: "16px",
          bgcolor: "#FFFFFF",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          width: "100%",
          marginBottom: "24px",
        }}
      >
        {accountInfo ? (
          <>
            <img
              src={getBankImage(accountInfo.bankName)}
              alt={accountInfo.bankName}
              style={{ width: "48px", height: "48px", marginRight: "16px" }}
            />
            <CardContent sx={{ flex: 1 }}>
              <Typography variant="h6" fontWeight="bold">
                {accountInfo.bankName}
              </Typography>
              <Typography variant="body1" sx={{ color: "gray" }}>
                {accountInfo.accountNumber}
              </Typography>
            </CardContent>
            <Button
              onClick={handleRegisterOrChange}
              sx={{ color: "#504EEE", fontWeight: "bold" }}
            >
              변경
            </Button>
          </>
        ) : (
          <CardContent sx={{ flex: 1, textAlign: "center" }}>
            <Typography variant="body1" sx={{ color: "gray" }}>
              등록된 계좌가 없습니다.
            </Typography>
          </CardContent>
        )}
      </Card>
      <Button
        onClick={accountInfo ? handleDelete : handleRegisterOrChange}
        sx={{ color: "primary.main", fontWeight: "bold", marginBottom: "8px" }}
      >
        {accountInfo ? "등록된 계좌 삭제하기" : "계좌 등록하기"}
      </Button>
      <AccountRegisterModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSubmitSuccess={fetchAccountInfo}
      />
    </Box>
  );
};

export default AccountMyPage;
