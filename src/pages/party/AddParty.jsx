import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';  // useNavigate와 useParams 훅 가져오기
import useOttStore from '../../store/ottStore';  // Zustand 스토어 import

const AddParty = () => {
  const { ottId } = useParams(); // URL 파라미터로 ottId 받아오기
  const { setOttInfo } = useOttStore();  // Zustand 스토어의 setOttInfo 함수 사용
  const [role, setRole] = useState('partyLeader'); // 기본적으로 파티장 선택
  const navigate = useNavigate(); // navigate 훅 초기화

  useEffect(() => {
    setOttInfo(ottId);  // OTT 정보를 Zustand 스토어에 설정
  }, [ottId, setOttInfo]);

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
  };

  const handleNextClick = () => {
    if (role === 'partyLeader') {
      navigate(`/party-leader-step/${ottId}`); // ottId를 포함하여 다음 페이지로 이동
    } else {
      navigate(`/party-member-step/${ottId}`); // 만약 파티원을 클릭하면 이와 같이 전달
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100">
      <main className="w-full max-w-lg mx-auto mt-8 p-4 bg-white rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold mb-4">이용 역할 선택</h2>
        <div className="flex justify-between items-center mb-4 gap-2">
          <div
            className={`flex flex-col items-center p-4 w-full rounded-lg cursor-pointer ${role === 'partyLeader' ? 'bg-green-100' : 'bg-gray-100'}`}
            onClick={() => handleRoleSelect('partyLeader')}
          >
            <span className="text-green-500 font-semibold mb-2">파티장</span>
            <span className="text-center">내 계정을 공유하고 싶어요</span>
          </div>
          <div
            className={`flex flex-col items-center p-4 w-full rounded-lg cursor-pointer ${role === 'partyMember' ? 'bg-green-100' : 'bg-gray-100'}`}
            onClick={() => handleRoleSelect('partyMember')}
          >
            <span className="text-green-500 font-semibold mb-2">파티원</span>
            <span className="text-center">계정을 공유받고 싶어요</span>
          </div>
        </div>

        {role === 'partyLeader' && (
          <>
            <h3 className="text-gray-700 font-bold mb-2">파티장 혜택</h3>
            <ul className="list-none mb-4">
              <li className="flex items-start mb-2">
                <span className="mr-2 text-green-500">✔</span>
                <span>50% 더 저렴한 이용</span>
              </li>
              <li className="flex items-start mb-2">
                <span className="mr-2 text-green-500">✔</span>
                <span>파티원이 구해지지 않아도 안심!</span>
              </li>
              <li className="flex items-start mb-2">
                <span className="mr-2 text-green-500">✔</span>
                <span>지금 즉시 시청 시작</span>
              </li>
              <li className="flex items-start mb-2">
                <span className="mr-2 text-green-500">✔</span>
                <span>매월 자동 정산 서비스 제공</span>
              </li>
            </ul>
          </>
        )}

        {role === 'partyMember' && (
          <>
            <h3 className="text-gray-700 font-bold mb-2">파티원 혜택</h3>
            <ul className="list-none mb-4">
              <li className="flex items-start mb-2">
                <span className="mr-2 text-green-500">✔</span>
                <span>공유받은 계정으로 부담없이 이용</span>
              </li>
              <li className="flex items-start mb-2">
                <span className="mr-2 text-green-500">✔</span>
                <span>언제든 남은 기간만큼 환불 가능</span>
              </li>
              <li className="flex items-start mb-2">
                <span className="mr-2 text-green-500">✔</span>
                <span>피클만의 제일 빠른 매칭 시스템</span>
              </li>
            </ul>
          </>
        )}

        <h3 className="text-gray-700 font-bold mb-2">공통 혜택</h3>
        <ul className="list-none mb-4">
          <li className="flex items-start mb-2">
            <span className="mr-2 text-green-500">✔</span>
            <span>시청 기록 · 내 정보 · 프라이버시 보호</span>
          </li>
          <li className="flex items-start mb-2">
            <span className="mr-2 text-green-500">✔</span>
            <span>KB 안전거래 서비스로 정산</span>
          </li>
          <li className="flex items-start mb-2">
            <span className="mr-2 text-green-500">✔</span>
            <span>연락이 필요하면 '안심 번호' 쪽지</span>
          </li>
        </ul>

        <button
          className="mt-4 bg-green-500 text-white py-2 px-8 rounded-full shadow-lg w-full"
          onClick={handleNextClick}
        >
          {role === 'partyLeader' ? '파티장으로 이용하기' : '파티원으로 이용하기'}
        </button>
      </main>
    </div>
  );
};

export default AddParty;
