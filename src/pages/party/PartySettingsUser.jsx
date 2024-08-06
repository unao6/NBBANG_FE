import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { IconButton, Button } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const PartySettingsUser = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { partyDetails } = location.state || {}; // 전송된 상태를 가져오고 없을 시 기본값 설정


  const partyMemberFee = 500;
  const paymentAmount = (partyDetails.ottPrice / partyDetails.capacity) + partyMemberFee;
  // 날짜 형식을 변환하는 함수
  const formatDate = (dateArray) => {
    if (!Array.isArray(dateArray) || dateArray.length < 3) {
      return '유효하지 않은 날짜';
    }
    const [year, month, day] = dateArray; // 배열의 첫 3개 요소를 추출
    return `${year % 100}년 ${String(month).padStart(2, '0')}월 ${String(day).padStart(2, '0')}일`;
  };

  const calculateOneMonthLater = (dateArray) => {
    if (!Array.isArray(dateArray) || dateArray.length < 3) {
      return '유효하지 않은 날짜';
    }
    const [year, month, day] = dateArray;
    const date = new Date(year, month - 1, day); // Date 객체 생성
    date.setMonth(date.getMonth() + 1); // 한 달 더하기
    return formatDate([date.getFullYear(), date.getMonth() + 1, date.getDate()]);
  };

  if (!partyDetails) {
    return <div>파티 정보를 불러올 수 없습니다.</div>;
  }

  return (
    <main className="container mx-auto mt-8 px-4 md:px-0">
      {/* Back Button */}
      <IconButton
        aria-label="back"
        onClick={() => navigate(-1)} // 뒤로가기
      >
        <ArrowBackIcon />
      </IconButton>

      {/* Party Details */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4">OTT 파티 설정</h1>

        {/* Party Information */}
        <div className="bg-gray-100 p-4 rounded-lg mb-6">
          <h2 className="text-xl font-bold mb-2">파티 정보</h2>
          <div className="flex justify-between items-center mb-2">
            <div className="text-gray-800 font-semibold">OTT 종류</div>
            <div className="text-gray-800">{partyDetails.ottName}</div>
          </div>
          <div className="flex justify-between items-center mb-2">
            <div className="text-gray-800 font-semibold">파티가입 날짜</div>
            <div className="text-gray-800">{formatDate(partyDetails.createdAt)}</div>
          </div>
          <div className="flex justify-between items-center mb-2">
            <div className="text-gray-800 font-semibold">결제 일자</div>
            <div className="text-gray-800">{formatDate(partyDetails.settlementDate)}</div>
          </div>
          <div className="flex justify-between items-center mb-2">
            <div className="text-gray-800 font-semibold">결제 금액</div>
            <div className="text-gray-800">월 {paymentAmount.toLocaleString()}원</div>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-4">
          <Button
            variant="outlined"
            color="primary"
            fullWidth
            onClick={() => console.log("결제카드 변경하기 클릭됨")}
          >
            결제카드 변경하기
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            fullWidth
            onClick={() => console.log("파티 탈퇴하기 클릭됨")}
          >
            파티 탈퇴하기
          </Button>
        </div>

        {/* Notice */}
        <div className="bg-gray-200 p-4 rounded-lg mt-6">
          <div className="flex items-center">
            <div className="mr-2">✔</div>
            <div className="text-gray-800 text-sm">
              잦은 파티탈퇴 발생 시 파티장님에게 부담이 되기 때문에 파티탈퇴는 최초 가입 한달 뒤인 {calculateOneMonthLater(partyDetails.createdAt)}부터 가능해요.
              <br />
              결제일에 탈퇴해도 전액 환불이 가능하니 걱정하지 마세요!
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PartySettingsUser;
