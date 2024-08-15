import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { getOttImage } from "../../components/OttImage.js";
import useOttStore from "../../store/ottStore";

const PartyLeaderStep = () => {
  const { ottId } = useParams();
  const { ottInfo, setOttInfo } = useOttStore();
  const [today] = useState(new Date());
  const [firstSettlementDate, setFirstSettlementDate] = useState(null);
  const [secondSettlementDate, setSecondSettlementDate] = useState(null);
  const [isTooltipVisibleFee, setIsTooltipVisibleFee] = useState(false);
  const [isTooltipVisibleIncome, setIsTooltipVisibleIncome] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!ottInfo) {
      setOttInfo(ottId);
    }

    const firstSettlement = new Date(today);
    firstSettlement.setMonth(today.getMonth() + 1);
    setFirstSettlementDate(firstSettlement);

    const secondSettlement = new Date(firstSettlement);
    secondSettlement.setMonth(firstSettlement.getMonth() + 1);
    setSecondSettlementDate(secondSettlement);
  }, [ottId, today, ottInfo, setOttInfo]);

  if (!ottInfo || !firstSettlementDate || !secondSettlementDate) {
    return <div>Loading...</div>;
  }

  const { name, price, capacity } = ottInfo;
  const pricePerMember = Math.floor(price / capacity);
  const fee = 200;
  const totalIncome = pricePerMember * (capacity - 1) - fee;
  const ottImage = getOttImage(name);

  const formatDate = (date) => {
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  const handleNextClick = () => {
    navigate(`/add-party/account-registration/${ottId}`);
  };

  return (
    <div className="min-h-full flex flex-col items-center bg-gray-50 p-2">
      <main className="w-full max-w-lg mx-auto mt-2 p-4 bg-white rounded shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          {name} 파티 생성
        </h2>

        {/* 파티원 자리 구성 */}
        <div className="flex justify-center mt-6">
          <div className="flex flex-col items-center">
            <div className="flex justify-between w-full mb-2">
              <span className="text-gray-700">내 자리</span>
              <span className="text-gray-700">파티원 자리</span>
            </div>
            <div className="flex mt-2 space-x-10">
              <img
                src={ottImage}
                alt="내 자리"
                className="w-14 h-14 object-contain"
              />
              {Array.from({ length: capacity - 1 }).map((_, index) => (
                <div key={index} className="flex flex-col items-center">
                  <img
                    src={ottImage}
                    alt={`파티원 ${index + 1}`}
                    className="w-14 h-14 object-contain"
                  />
                  <span className="text-primary text-xs mt-2">자동매칭</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* TIP 및 가격 정보 */}
        <div className="mt-4">
          <div className="mt-4 p-4 bg-white rounded-xl shadow-lg">
            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">
                {name} 프리미엄
              </span>
              <span className="font-semibold text-gray-700">
                {price.toLocaleString()}원/월
              </span>
            </div>
            <div className="mt-4">
              <div className="flex items-center">
                <div className="flex-1 h-3 mx-1 bg-primary rounded-full"></div>
                {Array.from({ length: capacity - 1 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex-1 h-3 mx-1 bg-secondary rounded-full"
                  ></div>
                ))}
              </div>
              <div className="flex justify-between mt-4 text-sm">
                <span className="text-primary">내 1/{capacity} 부담금</span>
                <span className="text-yellow-500">
                  파티원 {capacity - 1}명의 몫
                </span>
              </div>
              <div className="flex justify-between mt-2 text-lg font-bold">
                <span className="text-primary">
                  {pricePerMember.toLocaleString()}원/월
                </span>
                <span className="text-yellow-500">
                  {(pricePerMember * (capacity - 1)).toLocaleString()}원/월
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 수수료 및 정산 정보 */}
        <div className="mt-2 bg-white rounded-xl shadow-lg p-4">
          <div className="flex justify-between items-center relative">
            <div className="flex items-center">
              <span className="font-semibold text-gray-700">
                N/BBANG 수수료
              </span>
              <div
                className="relative ml-1 text-gray-500 cursor-pointer flex items-center"
                onMouseOver={() => setIsTooltipVisibleFee(true)}
                onMouseOut={() => setIsTooltipVisibleFee(false)}
              >
                <HelpOutlineIcon fontSize="small" />
                {isTooltipVisibleFee && (
                  <div className="absolute left-full ml-2 mt-[-1px] p-2 w-56 bg-gray-800 text-white text-xs rounded-lg shadow-lg z-10">
                    기존 수수료 500원 - 할인 금액 300원
                  </div>
                )}
              </div>
            </div>
            <div className="text-right">
              <span className="line-through text-gray-400 text-sm mr-2">
                500원
              </span>
              <span className="text-accent font-bold text-lg">200원</span>
              <p className="text-primary text-sm">*파티장 할인 적용완료</p>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-4 pt-4 relative">
            <div className="flex items-center">
              <span className="font-semibold text-gray-700">
                매월 정산받는 금액
              </span>
              <div
                className="relative ml-1 text-gray-500 cursor-pointer flex items-center"
                onMouseOver={() => setIsTooltipVisibleIncome(true)}
                onMouseOut={() => setIsTooltipVisibleIncome(false)}
              >
                <HelpOutlineIcon fontSize="small" />
                {isTooltipVisibleIncome && (
                  <div className="absolute left-full ml-2 mt-[-1px] p-2 w-64 bg-gray-800 text-white text-xs rounded-lg shadow-lg z-10">
                    파티원의 몫{" "}
                    {(pricePerMember * (capacity - 1)).toLocaleString()}원 -
                    수수료 200원
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-gray-500 text-sm">
                (파티원 {capacity - 1}명의 몫 - N/BBANG 수수료)
              </span>
              <span className="text-black font-bold text-lg">
                +{totalIncome.toLocaleString()}원
              </span>
            </div>
          </div>
        </div>

        {/* 정산 일자 정보 추가 */}
        <div className="mt-4 bg-white rounded-xl shadow-lg p-4">
          <h3 className="font-semibold text-gray-800 mb-4 text-base">
            {" "}
            {/* 폰트 크기 줄임 */}
            정산일자를 확인해주세요
          </h3>
          <div className="flex justify-between items-center mb-6">
            <div className="flex flex-col items-center">
              <span className="font-semibold text-sm">{formatDate(today)}</span>{" "}
              {/* 폰트 크기 줄임 */}
              <span className="text-gray-500 text-xs">파티 생성</span>{" "}
              {/* 폰트 크기 줄임 */}
            </div>
            <div className="flex flex-col items-center">
              <span className="font-semibold text-sm">
                {formatDate(firstSettlementDate)}
              </span>{" "}
              {/* 폰트 크기 줄임 */}
              <span className="text-gray-500 text-xs">첫 정산일</span>{" "}
              {/* 폰트 크기 줄임 */}
            </div>
            <div className="flex flex-col items-center">
              <span className="font-semibold text-sm">
                {formatDate(secondSettlementDate)}
              </span>{" "}
              {/* 폰트 크기 줄임 */}
              <span className="text-gray-500 text-xs">두 번째 정산일</span>{" "}
              {/* 폰트 크기 줄임 */}
            </div>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg shadow-inner">
            <div className="flex items-center">
              <span className="mr-2 text-base">🤔</span> {/* 폰트 크기 줄임 */}
              <span className="font-semibold text-gray-700 text-sm">
                {" "}
                {/* 폰트 크기 줄임 */}왜 {formatDate(firstSettlementDate)}이 첫
                정산일인가요?
              </span>
            </div>
            <p className="mt-2 text-xs text-gray-600">
              {" "}
              {/* 폰트 크기 줄임 */}- 한달간 계정이 안전하게 공유된 후
              정산해드려요.
            </p>
          </div>
        </div>

        {/* 다음 버튼 */}
        <button
          className="mt-8 bg-primary text-white py-3 px-8 rounded-full shadow-lg w-full hover:bg-accent transition-all duration-300"
          onClick={handleNextClick}
        >
          다음
        </button>
      </main>
    </div>
  );
};

export default PartyLeaderStep;
