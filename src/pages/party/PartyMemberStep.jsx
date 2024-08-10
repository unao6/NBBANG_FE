import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { getAllOtt } from "../../api/ott/ottApi.js";
import { getCardInfo } from "../../api/payment/paymentApi.js";
import { getOttImage } from "../../components/OttImage.js";
import { partyMatching } from '../../api/party/partyApi';


const PartyMemberStep = () => {
  const { ottId } = useParams();
  const [ottInfo, setOttInfo] = useState(null);
  const [isAgreed, setIsAgreed] = useState(false);
  const [cardInfo, setCardInfo] = useState(null);
  const navigate = useNavigate();
  const userId = 1; // 실제 환경에서는 로그인된 사용자의 ID를 가져와야 함

  useEffect(() => {
    const fetchOttInfo = async () => {
      try {
        const response = await getAllOtt();
        const selectedOtt = response.data.find(
          (ott) => ott.ottId === parseInt(ottId),
        );
        setOttInfo(selectedOtt);
      } catch (error) {
        console.error("OTT 정보를 불러오는 중 오류 발생:", error);
      }
    };

    fetchOttInfo();
  }, [ottId]);

  const fetchCardInfo = async () => {
    try {
      const data = await getCardInfo(userId);
      console.log("Fetched card info:", data);
      setCardInfo(data);
    } catch (error) {
      console.error("카드 정보를 불러오는 중 오류 발생:", error);
    }
  };

  useEffect(() => {
    fetchCardInfo();
  }, [userId]);

  const handleAgreementChange = () => {
    setIsAgreed(!isAgreed);
  };

  const handleSubscription = async () => {
    if (ottInfo) {
      try {
        // partyMatching API 호출
        await partyMatching({ ottId: ottInfo.ottId });

        // API 호출이 성공하면 리디렉션
        navigate('/party-matching-success');
      } catch (error) {
        console.error("매칭 중 오류 발생:", error);
        // 오류 처리 (필요에 따라 사용자에게 알림 등)
      }
    }
  };

  const handleRegisterOrChange = () => {
    navigate("/mypage/payment");
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100">
      <main className="w-full flex flex-col items-center max-w-4xl mx-auto">
        {ottInfo && (
          <div className="mt-4 p-4 bg-white rounded-lg shadow-lg w-full">
            <div className="flex justify-between items-center">
              <div className="flex flex-col items-center">
                <img
                  src={getOttImage(ottInfo.name)}
                  alt={ottInfo.name}
                  className="w-20 h-20 mb-2"
                />
                <h3 className="text-blue-500 font-semibold">{ottInfo.name}</h3>
              </div>
              <div className="text-right flex flex-col items-end">
                <p className="text-gray-700 line-through">
                  월 {ottInfo.price.toLocaleString()}원
                </p>
                <p className="text-black-500 text-xl font-bold">
                  월{" "}
                  {Math.floor(
                    ottInfo.price / ottInfo.capacity,
                  ).toLocaleString()}
                  원
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 동의 섹션 */}
        <div className="bg-white p-8 shadow-md w-full max-w-2xl mx-auto mt-4 rounded">
          <h3 className="text-sm font-bold mb-2">모두 동의합니다.</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li className="text-sm text-gray-700">
              전자금융거래 이용약관 <span className="text-blue-500">보기</span>
            </li>
            <li className="text-sm text-gray-700">
              개인정보수집 및 이용동의{" "}
              <span className="text-blue-500">보기</span>
            </li>
            <li className="text-sm text-gray-700">
              개인(신용)정보 제 3자 제공 및 위탁동의{" "}
              <span className="text-blue-500">보기</span>
            </li>
          </ul>
          <div className="mt-4">
            <FormControlLabel
              control={
                <Checkbox
                  checked={isAgreed}
                  onChange={handleAgreementChange}
                  color="primary"
                />
              }
              label={
                <span className="text-sm text-gray-700">
                  자동결제 서비스 이용에 동의 합니다.
                </span>
              }
            />
          </div>
        </div>

        {/* 다음 버튼 */}
        <div className="w-full max-w-2xl mx-auto mt-4">
          <Button
            variant="contained"
            color="primary"
            className="w-full"
            onClick={handleSubscription}
            disabled={!isAgreed}
          >
            다음
          </Button>
        </div>

        {/* 카드 정보 섹션 */}
        <Box className="w-full bg-white rounded-lg shadow p-4 mt-4">
          <Typography variant="h6" component="div" gutterBottom>
            현재 결제수단 (변경 및 등록은 마이페이지에서 가능합니다)
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
                  variant="contained"
                  color="primary"
                  startIcon={<EditIcon />}
                  onClick={handleRegisterOrChange}
                >
                  결제 수단 변경
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
                    서비스를 이용하기 위해 결제 수단을 등록해 주세요.
                  </Typography>
                </CardContent>
              </Card>
              <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={handleRegisterOrChange}
                  sx={{ width: "50%" }}
                >
                  결제 수단 등록하기
                </Button>
              </Box>
            </>
          )}
        </Box>
      </main>
    </div>
  );
};

export default PartyMemberStep;
