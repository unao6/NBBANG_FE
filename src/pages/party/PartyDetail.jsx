import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPartyById } from '../../api/party/partyApi'; // API 함수 import
import { getOttImage } from '../../components/OttImage.js'; // OTT 이미지 함수 import
import { IconButton } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const PartyDetail = () => {
  const { partyId } = useParams(); // URL 파라미터로부터 partyId를 가져옴
  const [partyDetails, setPartyDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAccountInfo, setShowAccountInfo] = useState(false); // 계정 정보를 보여줄지 여부를 상태로 관리
  const [showFinalSettlement, setShowFinalSettlement] = useState(false); // 최종 정산 금액 표시 여부를 상태로 관리
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPartyDetails = async () => {
      try {
        const response = await getPartyById(partyId); // API 호출
        console.log(response);
        setPartyDetails(response.data); // 서버에서 받아온 데이터를 상태로 설정
      } catch (error) {
        console.error('파티 세부 정보를 불러오는 중 오류 발생:', error);
      } finally {
        setLoading(false); // 데이터를 불러온 후 로딩 상태 해제
      }
    };

    fetchPartyDetails();
  }, [partyId]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">로딩 중...</div>;
  }

  if (!partyDetails) {
    return <div className="min-h-screen flex items-center justify-center">파티 정보를 불러오지 못했습니다.</div>;
  }

  const ottImage = getOttImage(partyDetails.ottName);

  const toggleShowAccountInfo = () => {
    setShowAccountInfo(!showAccountInfo);
  };

  const toggleFinalSettlement = () => {
    setShowFinalSettlement(!showFinalSettlement);
  };

  const maskString = (str) => {
    return str.replace(/./g, '•');
  };

  const serviceFee = 500;
  const leaderServiceFee = 200;// 예시로 설정한 수수료 값
  const individualShare = partyDetails.ottPrice / partyDetails.capacity; // 모든 파티원들이 균등하게 나누어 내는 금액
  const leaderSettlement = individualShare * (partyDetails.capacity - 1) - leaderServiceFee;

  const handleSettingsClick = () => {
    if (partyDetails.isLeader) {
      navigate(`/party-settings/${partyId}`, { state: { partyDetails } }); // 리더용 설정 페이지로 이동
    } else {

      navigate(`/party-settings-user/${partyId}`, { state: { partyDetails } }); // 사용자용 설정 페이지로 이동
    }
  };

  return (
    <main className="container mx-auto mt-8 px-4 md:px-0">
      {/* Back and Settings Buttons */}
      <div className="flex justify-between mb-6">
        <IconButton
          aria-label="back"
          onClick={() => navigate(-1)} // 뒤로가기
        >
          <ArrowBackIcon />
        </IconButton>
        <IconButton
          aria-label="settings"
          onClick={handleSettingsClick} // 설정 페이지로 이동
        >
          <SettingsIcon />
        </IconButton>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Header */}
        <div className="flex items-center mb-6">
          <img src={ottImage} alt={partyDetails.ottName} className="w-16 h-16 mr-4" />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{partyDetails.ottName} 파티</h1>
            <p className="text-sm text-gray-500">
              {partyDetails.isLeader ? "파티장으로 이용중" : "파티원으로 이용중"}
            </p>
          </div>
        </div>

        {/* Member List */}
        <div className="mb-6">
          <div className="flex justify-evenly items-center mb-4">
            <div className="text-center">
              <p className="text-gray-600 text-sm">파티장 자리</p>
              <img src={ottImage} alt="Profile" className="w-16 h-16 rounded-full mx-auto" />
              <p className="text-center text-sm mt-2 text-gray-800">{partyDetails.leaderNickname}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-600 text-sm">파티원 자리</p>
              <div className="flex justify-evenly">
                {partyDetails.members.map(member => (
                  <div key={member.id} className="text-center mr-4">
                    <img src={ottImage} alt={member.nickname} className="w-16 h-16 rounded-full mx-auto" />
                    <p className="text-sm mt-2 text-gray-800">{member.partyMemberNickname}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Settlement Info */}
        <div className="bg-gray-100 p-4 rounded-lg mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-2">정산안내</h2>
          <div className="flex justify-between items-center mb-2">
            <div className="text-gray-800 font-semibold">{partyDetails.ottName}</div>
            <div className="text-gray-800 font-bold">{partyDetails.ottPrice.toLocaleString()}원/월</div>
          </div>
          <div className="flex items-center mb-4">
            <div
              className="bg-blue-500 text-white p-2 w-1/4 text-center rounded-l-lg">{(individualShare).toLocaleString()}</div>
            <div
              className="bg-yellow-400 text-white p-2 w-1/4 text-center">{(individualShare).toLocaleString()}</div>
            <div
              className="bg-yellow-400 text-white p-2 w-1/4 text-center">{(individualShare).toLocaleString()}</div>
            <div
              className="bg-yellow-400 text-white p-2 w-1/4 text-center rounded-r-lg">{(individualShare).toLocaleString()}</div>
          </div>

          <div className="flex justify-between items-center">
            <div className="text-blue-500 flex items-center">
              <div className="w-4 h-4 bg-blue-500 mr-2"></div>
              내 1/4 부담금
            </div>
            <div className="text-gray-800">{(partyDetails.ottPrice / 4).toLocaleString()}원/월</div>
          </div>
          <div className="flex justify-between items-center mt-2">
            <div className="text-yellow-400 flex items-center">
              <div className="w-4 h-4 bg-yellow-400 mr-2"></div>
              파티원 3명의 몫
            </div>
            <div className="text-gray-800">{(partyDetails.ottPrice - (partyDetails.ottPrice / 4)).toLocaleString()}원/월
            </div>
          </div>

          {/* Final Settlement Button */}
          <button
            className="bg-gray-200 p-2 rounded mt-4 w-full text-center text-gray-700"
            onClick={toggleFinalSettlement}
          >
            수수료 및 정산,결제금액 보기
          </button>

          {/* Final Settlement Display */}
          {showFinalSettlement && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800">최종 정산,결제 금액</h3>
              {partyDetails.isLeader ? (
                <>
                  <p className="text-gray-700 mt-2">
                    수수료: <span style={{ textDecoration: 'line-through' }}>{serviceFee.toLocaleString()}원</span> {' '}
                    <span>{'200원'}</span>
                  </p>
                  <p className="text-gray-700 mt-2">최종 정산 금액: {leaderSettlement.toLocaleString()}원/월</p>
                </>
              ) : (
                <>
                  <p className="text-gray-700 mt-2">수수료: {serviceFee.toLocaleString()}원</p>
                  <p className="text-gray-700 mt-2">최종 결제 금액: {(individualShare + serviceFee).toLocaleString()}원/월</p>
                </>
              )}
        </div>
        )}
      </div>

      {/* Account Info */}
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-xl font-bold text-gray-800 mb-2">{partyDetails.ottName} ID/PW</h2>
          <p className="text-sm text-gray-500 mb-4">계정 정보는 변경하지 않도록 유의해주세요</p>
          <div className="flex items-center justify-between mb-4">
            <div className="text-gray-800">ID</div>
            <div
              className="text-gray-800">{showAccountInfo ? partyDetails.ottAccountId : maskString(partyDetails.ottAccountId)}</div>
            <button className="text-blue-500" onClick={toggleShowAccountInfo}>
              {showAccountInfo ? '숨기기' : '표시'}
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-gray-800">PW</div>
            <div
              className="text-gray-800">{showAccountInfo ? partyDetails.ottAccountPassword : maskString(partyDetails.ottAccountPassword)}</div>
            <button className="text-blue-500" onClick={toggleShowAccountInfo}>
              {showAccountInfo ? '숨기기' : '표시'}
            </button>
          </div>
        </div>
      </div>

    </main>
  );
};

export default PartyDetail;
