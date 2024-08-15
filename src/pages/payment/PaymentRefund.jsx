import React, { useEffect, useState } from "react";
import { getMyPartyAsMember, partyMemberWithdraw } from "../../api/party/partyApi"; // 새로운 API 임포트

import { getOttImage } from "../../components/OttImage.js";
import { getRefundInfo } from "../../api/payment/paymentApi";

const PaymentRefund = () => {
  const [myParties, setMyParties] = useState([]);
  const [selectedPartyId, setSelectedPartyId] = useState(null);
  const [refundInfo, setRefundInfo] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const fetchMyPartyData = async () => {
      try {
        const response = await getMyPartyAsMember(); // getMyParty -> getMyPartyAsMember로 변경
        setMyParties(response.data);
      } catch (error) {
        console.error("파티 정보를 불러오는 중 오류 발생:", error);
      }
    };

    fetchMyPartyData();
  }, []);

  const handlePartyClick = async (partyId) => {
    if (selectedPartyId === partyId) {
      setIsExpanded(!isExpanded);
    } else {
      setSelectedPartyId(partyId);
      setIsExpanded(true);
      try {
        const data = await getRefundInfo(partyId);
        setRefundInfo({
          ...data,
          amountUsed: Math.floor(data.amountUsed), // 소수점 이하 절삭
        });
      } catch (error) {
        console.error("Failed to fetch refund info:", error);
        setRefundInfo(null);
      }
    }
  };

  const handleRefundRequest = async () => {
    if (!selectedPartyId) return;

    try {
      await partyMemberWithdraw(selectedPartyId);
      alert("환불 요청이 성공적으로 처리되었습니다.");

      // 파티 정보를 다시 불러와서 최신화
      const response = await getMyPartyAsMember(); // getMyParty -> getMyPartyAsMember로 변경
      setMyParties(response.data);

      // 상태 초기화
      setRefundInfo(null);
      setSelectedPartyId(null);
      setIsExpanded(false);
    } catch (error) {
      console.error("Failed to request refund:", error);
      alert("환불 요청에 실패했습니다.");
    }
  };

  return (
    <main className="container mx-auto mt-8 px-4 md:px-0">
      {/* 페이지 제목 및 안내 문구 */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">환불 페이지</h1>
        <p className="text-gray-700">환불을 원하시는 파티를 선택해 주세요.</p>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {myParties.length > 0 ? (
          myParties.map((party) => (
            <div key={party.partyId}>
              <div
                className="flex items-center justify-between p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                onClick={() => handlePartyClick(party.partyId)}
              >
                <div className="flex items-center">
                  <img
                    src={getOttImage(party.name)}
                    alt={party.name}
                    className="w-12 h-12 object-contain rounded-full mr-4"
                  />
                  <div>
                    <h3 className="text-base font-bold text-gray-800">
                      {party.name} 파티
                    </h3>
                  </div>
                </div>
                <span
                  className={`text-gray-400 transform transition-transform duration-200 ${
                    selectedPartyId === party.partyId && isExpanded
                      ? "rotate-180"
                      : "rotate-0"
                  }`}
                >
                  &#9660;
                </span>
              </div>

              {selectedPartyId === party.partyId &&
                isExpanded &&
                refundInfo && (
                  <div className="bg-gray-50 p-6 border-b transition-colors duration-200">
                    <div className="flex items-center mb-4">
                      <h3 className="text-lg font-semibold">환불 정보</h3>
                      <div className="ml-2 relative group">
                        <span className="text-primary cursor-pointer">ℹ️</span>
                        <div className="absolute left-0 top-full mt-1 w-56 p-2 bg-gray-800 text-white text-xs rounded hidden group-hover:block">
                          월단위 결제이기 때문에 1일 이용료가 조금씩 변동될 수
                          있습니다.
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-md text-gray-700">결제 금액:</p>
                        <p className="text-xl font-bold text-gray-900">
                          {refundInfo.paymentAmount}원
                        </p>
                      </div>
                      <div>
                        <p className="text-md text-gray-700">1일 이용 금액:</p>
                        <p className="text-xl font-bold text-gray-900">
                          {refundInfo.oneDayPrice}원
                        </p>
                      </div>
                      <div>
                        <p className="text-md text-gray-700">사용된 금액:</p>
                        <p className="text-xl font-bold text-gray-900">
                          {refundInfo.amountUsed}원
                        </p>
                      </div>
                      <div>
                        <p className="text-md text-gray-700">수수료:</p>
                        <p className="text-xl font-bold text-gray-900">
                          {refundInfo.fee}원
                        </p>
                      </div>
                      <div>
                        <p className="text-md text-gray-700">이용 일수:</p>
                        <p className="text-xl font-bold text-gray-900">
                          {refundInfo.daysUsed}일
                        </p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-md text-gray-700">환불 금액:</p>
                        <p className="text-2xl font-bold text-accent">
                          {refundInfo.refundAmount}원
                        </p>
                      </div>
                    </div>

                    {/* 환불 금액 계산식 추가 */}
                    <div className="mt-4 bg-gray-100 p-4 rounded-lg">
                      <h4 className="text-md font-semibold text-gray-800 mb-2">
                        환불 금액 계산식:
                      </h4>
                      <p className="text-sm text-gray-700">
                        <strong>{refundInfo.paymentAmount}원</strong> (결제
                        금액) - <strong>{refundInfo.fee}원</strong> (수수료) -{" "}
                        <strong>{refundInfo.oneDayPrice}원</strong> (1일 이용
                        금액) × <strong>{refundInfo.daysUsed}일</strong> (이용
                        일수) = <strong>{refundInfo.refundAmount}원</strong>{" "}
                        (환불 금액)
                      </p>
                    </div>

                    <p className="mt-4 text-sm text-red-500">
                      환불 금액을 다시 한 번 정확히 확인해주세요!
                    </p>

                    <div className="mt-6 text-center">
                      <button
                        className="bg-primary hover:bg-accent text-white py-2 px-4 rounded"
                        onClick={handleRefundRequest}
                      >
                        환불 신청하기
                      </button>
                    </div>
                  </div>
                )}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600 p-4">
            이용 중인 파티가 없습니다.
          </p>
        )}
      </div>
    </main>
  );
};

export default PaymentRefund;
