import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, IconButton, TextField } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { updateOttAccount } from '../../api/party/partyApi'; // API 함수 import

const PartySettings = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { partyDetails } = location.state || {}; // 전송된 상태를 가져오고 없을 시 기본값 설정

  const [ottAccountId, setOttAccountId] = useState(partyDetails?.ottAccountId || '');
  const [ottAccountPassword, setOttAccountPassword] = useState(partyDetails?.ottAccountPassword || '');
  const partyId = partyDetails?.partyId; // partyId를 가져옴

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
      <IconButton
        aria-label="back"
        onClick={() => navigate(-1)} // 뒤로가기
      >
        <ArrowBackIcon />
      </IconButton>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4">{partyDetails.ottName} 공유 계정 설정</h1>
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
        <Button
          variant="contained"
          color="secondary"
          onClick={handlePartyDisband}
          fullWidth
        >
          파티 해체하기
        </Button>
      </div>
    </main>
  );
};

export default PartySettings;
