import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Snackbar,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { deleteCardInfo, getCardInfo } from "../../api/payment/paymentApi";

import AddIcon from "@mui/icons-material/Add";
import Container from "../../components/Container";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PaymentMethodModal from "./fragments/PaymentMethodModal";

const PaymentMypage = () => {
  const [cardInfo, setCardInfo] = useState(null);
  const [modalOpen, setModalOpen] = useState(false); // 모달 상태 관리
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Snackbar 상태 관리
  const [snackbarMessage, setSnackbarMessage] = useState(""); // Snackbar 메시지
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // Snackbar 알림 타입

  useEffect(() => {
    const fetchCardInfo = async () => {
      try {
        const data = await getCardInfo();
        console.log("Fetched card info:", data);
        setCardInfo(data);
      } catch (error) {
        console.error("카드 정보를 불러오는 중 오류 발생:", error);
      }
    };

    fetchCardInfo();
  }, []);

  const handleRegister = () => {
    // 모달을 여는 함수
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    // 모달을 닫는 함수
    setModalOpen(false);
  };

  const handleCloseSnackbar = () => {
    // Snackbar를 닫는 함수
    setSnackbarOpen(false);
  };

  const handleDelete = async () => {
    try {
      await deleteCardInfo();
      setCardInfo(null);
      setSnackbarMessage("결제 수단이 성공적으로 삭제되었습니다!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true); // 삭제 성공 시 Snackbar를 엽니다.
    } catch (error) {
      console.error("카드 삭제 중 오류 발생:", error);
      setSnackbarMessage("카드 삭제 중 오류가 발생했습니다.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleChange = () => {
    // 모달을 여는 함수 (카드 변경)
    setModalOpen(true);
  };

  const getButtonStyles = () => ({
    color: "primary.main",
    fontWeight: "bold",
    width: "40%", // 버튼 가로 사이즈 줄이기
  });

  return (
    <Container>
      <Box className="p-4 flex flex-col items-center">
        <Box className="w-full bg-white rounded-lg shadow p-4 mt:4">
          <Typography variant="h6" component="div" gutterBottom>
            현재 결제수단
          </Typography>
          {cardInfo ? (
            <>
              <Card
                className="my-4 mx-auto"
                sx={{
                  width: "300px",
                  height: "180px",
                  backgroundColor: "#ffff26",
                  position: "relative",
                }}
              >
                <CardContent>
                  <Typography variant="h5" component="div">
                    {cardInfo.issuerCorp || cardInfo.cardCompany}
                  </Typography>
                  <Typography
                    color="textSecondary"
                    sx={{ position: "absolute", bottom: 16, right: 16 }}
                  >
                    {cardInfo.cardType || cardInfo.cardNumber}
                  </Typography>
                </CardContent>
              </Card>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 2,
                  mt: 4,
                }}
              >
                <Button
                  variant="text"
                  startIcon={<EditIcon />}
                  onClick={handleChange}
                  sx={getButtonStyles()}
                >
                  결제 수단 변경
                </Button>
                <Button
                  variant="text"
                  startIcon={<DeleteIcon />}
                  onClick={handleDelete}
                  sx={getButtonStyles()}
                >
                  결제 수단 제거
                </Button>
              </Box>
            </>
          ) : (
            <>
              <Card
                className="my-4 mx-auto flex justify-center items-center"
                sx={{ width: "300px", height: "180px" }}
              >
                <CardContent>
                  <Typography variant="h6" component="div">
                    등록된 결제수단이 없어요
                  </Typography>
                  <Typography
                    color="textSecondary"
                    sx={{ fontSize: "0.875rem", marginTop: "8px" }}
                  >
                    N/BBANG 서비스 이용을 위해 결제 수단을 등록해 주세요.
                  </Typography>
                </CardContent>
              </Card>
              <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <Button
                  variant="text"
                  startIcon={<AddIcon />}
                  onClick={handleRegister}
                  sx={getButtonStyles()}
                >
                  결제 수단 등록하기
                </Button>
              </Box>
            </>
          )}
        </Box>
        <PaymentMethodModal open={modalOpen} onClose={handleCloseModal} />
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbarSeverity}
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default PaymentMypage;
