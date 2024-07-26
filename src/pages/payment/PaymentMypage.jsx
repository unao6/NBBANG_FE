import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

import AddIcon from "@mui/icons-material/Add";
import Container from "../../components/Container";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PaymentMethodModal from "./fragments/PaymentMethodModal";
import { getCardInfo } from "../../api/payment/paymentApi";

const PaymentMypage = () => {
  const userId = 1; // 사용자의 ID를 설정합니다. 실제로는 로그인된 사용자의 ID를 가져와야 합니다.
  const [cardInfo, setCardInfo] = useState(null);
  const [modalOpen, setModalOpen] = useState(false); // 모달 상태 관리

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

  const handleDelete = () => {
    // 카드 삭제 로직 구현
    setCardInfo(null);
  };

  const handleChange = () => {
    // 카드 변경 로직 구현
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
                sx={{ width: "300px", height: "180px" }}
              >
                <CardContent>
                  <Typography variant="h5" component="div">
                    {cardInfo.issuerName}
                  </Typography>
                  <Typography color="textSecondary">
                    {cardInfo.cardType}
                  </Typography>
                </CardContent>
              </Card>
              <Box
                sx={{ display: "flex", justifyContent: "space-around", mt: 4 }}
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
      </Box>
    </Container>
  );
};

export default PaymentMypage;
