// PartyLeaderStep.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import useOttStore from '../../store/ottStore';  // Zustand 스토어 import
import { getOttImage } from '../../components/OttImage.js';

const PartyLeaderStep = () => {
  const { ottId } = useParams(); // URL 파라미터로 ottId 받아오기
  const { ottInfo, setOttInfo } = useOttStore(); // Zustand 스토어의 상태와 함수 사용
  const [today] = useState(new Date()); // 오늘 날짜를 상태로 관리
  const [firstSettlementDate, setFirstSettlementDate] = useState(null);
  const [secondSettlementDate, setSecondSettlementDate] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!ottInfo) {
      setOttInfo(ottId);  // OTT 정보를 Zustand 스토어에 설정
    }

    // 첫 정산일과 두 번째 정산일 계산
    const firstSettlement = new Date(today);
    firstSettlement.setMonth(today.getMonth() + 1);
    setFirstSettlementDate(firstSettlement);

    const secondSettlement = new Date(firstSettlement);
    secondSettlement.setMonth(firstSettlement.getMonth() + 1);
    setSecondSettlementDate(secondSettlement);

  }, [ottId, today, ottInfo, setOttInfo]);

  if (!ottInfo || !firstSettlementDate || !secondSettlementDate) {
    // 데이터가 로드될 때까지 로딩 상태를 표시
    return <div>Loading...</div>;
  }

  const { name, price, capacity } = ottInfo; // OTT 정보 구조 분해 할당
  const pricePerMember = Math.floor(price / capacity); // 파티원 당 가격 계산
  const fee = 200; // 예시로 정한 수수료
  const totalIncome = (pricePerMember * (capacity - 1)) - fee; // 총 수입 계산

  const ottImage = getOttImage(name);

  // 날짜를 YYYY년 MM월 DD일 형식으로 변환하는 함수
  const formatDate = (date) => {
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  const handleNextClick = () => {
    navigate(`/add-party/account-registration/${ottId}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100">
      <main className="w-full max-w-lg mx-auto mt-8 p-4 bg-white rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold mb-4">{name} 파티 생성</h2>

        {/* 파티원 자리 구성 */}
        <div className="flex justify-center mt-4">
          <div className="flex flex-col items-center">
            <div className="flex justify-between w-full">
              <span>내 자리</span>
              <span>파티원 자리</span>
            </div>
            <div className="flex mt-2 space-x-2">
              <img src={ottImage} alt="내 자리" className="w-16 h-16" />
              {Array.from({ length: capacity - 1 }).map((_, index) => (
                <div key={index} className="flex flex-col items-center">
                  <img src={ottImage} alt={`파티원 ${index + 1}`} className="w-16 h-16" />
                  <span className="text-green-500 text-xs mt-1">자동매칭</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* TIP 및 가격 정보 */}
        <div className="mt-6">
          <div className="bg-gray-100 p-2 rounded-lg">
          </div>
          <div className="mt-4 p-4 bg-white rounded-lg shadow-lg">
            <div className="flex justify-between">
              <span className="font-semibold">{name} 프리미엄</span>
              <span>{price.toLocaleString()}원/월</span>
            </div>
            <div className="mt-2">
              <div className="flex items-center">
                <div className="flex-1 h-2 mx-1 bg-blue-500"></div>
                {Array.from({ length: capacity - 1 }).map((_, index) => (
                  <div key={index} className="flex-1 h-2 mx-1 bg-yellow-500"></div>
                ))}
              </div>
              <div className="flex justify-between mt-2 text-sm">
                <span className="text-blue-500">내 1/{capacity} 부담금</span>
                <span className="text-yellow-500">파티원 {capacity - 1}명의 몫</span>
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-blue-500">{pricePerMember.toLocaleString()}원/월</span>
                <span className="text-yellow-500">{(pricePerMember * (capacity - 1)).toLocaleString()}원/월</span>
              </div>
            </div>
          </div>
        </div>

        {/* 수수료 및 정산 정보 */}
        <div className="mt-6 bg-white rounded-lg shadow-lg p-4">
          <div className="flex justify-between">
            <span>N/BBANG 수수료</span>
            <div className="text-right">
              <span className="line-through text-gray-500 mr-2">500원</span>
              <span className="text-black">- 200원</span>
              <p className="text-green-500 text-sm">*파티장 할인 적용완료</p>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-2 pt-2">
            <span className="font-semibold">매월 정산받는 금액</span>
            <div className="flex justify-between">
              <span className="text-gray-500">(파티원 {capacity - 1}명의 몫 - N/BBANG 수수료)</span>
              <span className="text-black font-bold">+{totalIncome.toLocaleString()}원</span>
            </div>
          </div>
        </div>

        {/* 정산 일자 정보 추가 */}
        <div className="mt-6 bg-white rounded-lg shadow-lg p-4">
          <h3 className="font-semibold mb-4">정산일자를 확인해주세요</h3>
          <div className="flex justify-between items-center mb-4">
            <div className="flex flex-col items-center">
              <span>{formatDate(today)}</span>
              <span className="font-semibold">파티생성</span>
              <span className="text-gray-500">오늘</span>
            </div>
            <div className="flex flex-col items-center">
              <span>{formatDate(firstSettlementDate)}</span>
              <span className="font-semibold">자동정산</span>
              <span className="text-gray-500">첫 정산</span>
            </div>
            <div className="flex flex-col items-center">
              <span>{formatDate(secondSettlementDate)}</span>
              <span className="font-semibold">자동정산</span>
            </div>
          </div>
          <div className="bg-gray-100 p-2 rounded-lg">
            <div className="flex items-center">
              <span className="mr-2">🤔</span>
              <span className="font-semibold">왜 {formatDate(firstSettlementDate)}이 첫 정산일인가요?</span>
            </div>
            <p className="mt-2 text-sm">- 한달간 계정이 안전하게 공유된 후 정산해드려요.</p>
          </div>
        </div>

        {/* 다음 버튼 */}
        <button
          className="mt-6 bg-green-500 text-white py-2 px-8 rounded-full shadow-lg w-full"
          onClick={handleNextClick}
        >
          다음
        </button>
      </main>
    </div>
  );
};

export default PartyLeaderStep;
