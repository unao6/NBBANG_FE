import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { IconButton, Button, TextField } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { updateOttAccount } from '../../api/party/partyApi'; // API 함수 import

const PartySettings = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { partyDetails } = location.state || {}; // 전송된 상태를 가져오고 없을 시 기본값 설정

  const [ottAccountId, setOttAccountId] = useState(partyDetails?.ottAccountId || '');
  const [ottAccountPassword, setOttAccountPassword] = useState(partyDetails?.ottAccountPassword || '');
  const partyId = partyDetails?.partyId; // partyId를 가져옴
  const leaderFee = 200;
  const settlementAmount = (partyDetails.ottPrice / partyDetails.capacity) * 3 - leaderFee;
  console.log(partyDetails);

  const formatDate = (dateArray) => {
    // 배열이 올바른지 확인 (year, month, day 요소가 있는지 확인)
    if (!Array.isArray(dateArray) || dateArray.length < 3) {
      return '유효하지 않은 날짜';
    }

    const [year, month, day] = dateArray; // 배열의 첫 3개 요소를 추출
    return `${year % 100}년 ${String(month).padStart(2, '0')}월 ${String(day).padStart(2, '0')}일`;
  };

  // partyDetails가 없을 경우 에러 처리
  if (!partyDetails) {
    return <div>파티 정보를 불러올 수 없습니다.</div>;
  }

  const handleAccountChange = async () => {
    try {
      const partyUpdateRequest = {
        ottAccountId,
        ottAccountPassword,
      };

      await updateOttAccount(partyId, partyUpdateRequest); // partyId를 함께 전달

      alert('계정 정보가 성공적으로 변경되었습니다.');
      navigate(-1); // 변경 후 이전 페이지로 이동
    } catch (error) {
      console.error('계정 정보를 변경하는 중 오류가 발생했습니다:', error);
      alert('계정 정보 변경 중 오류가 발생했습니다.');
    }
  };

  const handlePartyDisband = () => {
    // 파티 해체 로직
    console.log("파티 해체 로직 실행");
  };

  return (
    <main className="container mx-auto mt-8 px-4 md:px-0">
      {/* Back Button */}
      <IconButton
        aria-label="back"
        onClick={() => navigate(-1)} // 뒤로가기
      >
        <ArrowBackIcon />
      </IconButton>
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
            <div className="text-gray-800 font-semibold">파티생성 날짜</div>
            <div className="text-gray-800">{formatDate(partyDetails.createdAt)}</div>
          </div>
          <div className="flex justify-between items-center mb-2">
            <div className="text-gray-800 font-semibold">정산 일자</div>
            <div className="text-gray-800">{formatDate(partyDetails.settlementDate)}</div>
          </div>
          <div className="flex justify-between items-center mb-2">
            <div className="text-gray-800 font-semibold">정산 받는금액</div>
            <div className="text-gray-800">월 {settlementAmount.toLocaleString()}원</div>
          </div>
        </div>

        {/* Account Information Change */}
        <h2 className="text-xl font-bold mb-4">공유 계정 설정</h2>
        <div className="mb-4">
          <TextField
            label="OTT 계정 ID"
            value={ottAccountId}
            onChange={(e) => setOttAccountId(e.target.value)}
            fullWidth
            variant="outlined"
          />
        </div>
        <div className="mb-4">
          <TextField
            label="OTT 계정 비밀번호"
            value={ottAccountPassword}
            onChange={(e) => setOttAccountPassword(e.target.value)}
            fullWidth
            variant="outlined"
            type="password"
          />
        </div>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAccountChange}
          fullWidth
          sx={{ mb: 4 }}
        >
          계정 정보 변경하기
        </Button>
        <div className="space-y-4">
          <Button
            variant="outlined"
            color="primary"
            fullWidth
            onClick={() => console.log("정산계좌 변경하기 클릭됨")}
          >
            정산계좌 변경하기
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            fullWidth
            onClick={handlePartyDisband}
          >
            파티 해체하기
          </Button>
        </div>
      </div>
    </main>
  );
};

export default PartySettings;
