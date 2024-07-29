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
  const userId = 1; // 사용자의 ID를 설정합니다. 실제로는 로그인된 사용자의 ID를 가져와야 합니다.
  const [cardInfo, setCardInfo] = useState(null);
  const [modalOpen, setModalOpen] = useState(false); // 모달 상태 관리
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Snackbar 상태 관리

  useEffect(() => {
    const fetchCardInfo = async () => {
      try {
        const data = await getCardInfo(userId);
        setCardInfo(data);
      } catch (error) {
        console.error("카드 정보를 불러오는 중 오류 발생:", error);
      }
    };

    fetchCardInfo();
  }, [userId]);

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
      await deleteCardInfo(userId);
      setCardInfo(null);
      setSnackbarOpen(true); // 삭제 성공 시 Snackbar를 엽니다.
    } catch (error) {
      console.error("카드 삭제 중 오류 발생:", error);
    }
  };

  const handleChange = () => {
    // 모달을 여는 함수 (카드 변경)
    setModalOpen(true);
  };

  return (
    <Container>
      <Box className="p-4 flex flex-col items-center">
        <Box className="w-full bg-white rounded-lg shadow p-4 mt-4">
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
                  backgroundColor: "#8EF740",
                  position: "relative",
                }}
              >
                <CardContent>
                  <Typography variant="h5" component="div">
                    {cardInfo.issuerCorp}
                  </Typography>
                  <Typography
                    color="textSecondary"
                    sx={{ position: "absolute", bottom: 16, right: 16 }}
                  >
                    {cardInfo.cardType}
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
            </>
          ) : (
            <>
              <Card
                className="my-4 mx-auto flex justify-center items-center"
                sx={{ width: "300px", height: "180px" }}
              >
                <CardContent>
                  <Typography variant="h5" component="div">
                    등록된 결제수단이 없어요
                  </Typography>
                  <Typography color="textSecondary" className="mb-4">
                    피클플러스 서비스 이용을 위해 결제 수단을 등록해 주세요.
                  </Typography>
                </CardContent>
              </Card>
              <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={handleRegister}
                  sx={{ width: "50%" }}
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
            severity="success"
            sx={{ width: "100%" }}
          >
            결제 수단이 성공적으로 삭제되었습니다!
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default PaymentMypage;
