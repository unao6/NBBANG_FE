import React, { useState } from "react";

import { useNavigate } from "react-router-dom";

const Payment = () => {
  const [paymentMethod, setPaymentMethod] = useState("kakao");
  const navigate = useNavigate();

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    if (method === "kakao") {
      navigate("/payment/kakaopay/register");
    } else if (method === "card") {
      navigate("/payment/card/register");
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-4">파티매칭</h2>
        <div className="mb-6">
          <h3 className="text-lg font-semibold">
            ChatGPT 파티의 결제 정보를 확인해주세요
          </h3>
          <p className="mt-2 text-xl font-bold text-accent">월 5,000원</p>
        </div>
        <div className="mb-4 p-4 bg-gray-100 rounded">
          <h4 className="text-md font-semibold">카드 결제일</h4>
          <p className="mt-1 text-md text-gray-700">파티 매칭 완료일</p>
          <p className="mt-2 text-sm text-red-500">
            지금 결제되지 않아요! 파티 매칭이 완료되면 결제가 진행되며, 파티에
            문제 발생 시 100% 환불해드려요.
          </p>
        </div>
        <div className="mb-6">
          <h4 className="text-md font-semibold mb-2">결제수단</h4>
          <div className="flex space-x-4">
            <button
              className={`flex-1 py-2 rounded ${
                paymentMethod === "kakao" ? "bg-yellow-400" : "bg-gray-200"
              }`}
              onClick={() => handlePaymentMethodChange("kakao")}
            >
              카카오페이
            </button>
            <button
              className={`flex-1 py-2 rounded ${
                paymentMethod === "card" ? "bg-yellow-400" : "bg-gray-200"
              }`}
              onClick={() => handlePaymentMethodChange("card")}
            >
              체크/신용카드
            </button>
          </div>
          <p className="mt-2 text-sm text-gray-700">
            {paymentMethod === "kakao"
              ? "현대카드로 통한 카카오페이 결제는 준비 중이에요."
              : "카드 결제 정보 입력 페이지로 이동합니다."}
          </p>
        </div>
        <div className="mt-8 text-center">
          <button className="bg-primary hover:bg-accent text-white py-2 px-4 rounded">
            파티매칭 시작하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default Payment;
