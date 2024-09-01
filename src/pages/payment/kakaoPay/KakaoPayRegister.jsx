import React, { useState } from "react";

import { createKakaoPay } from "../../../api/payment/kakaoPay/kakaoPayApi";
import usePaymentStore from "../../../store/usePaymentStore";

const KakaoPayCardRegister = () => {
  const [isAgreed, setIsAgreed] = useState(false);
  const setTid = usePaymentStore((state) => state.setTid);

  const handleAgreementChange = () => {
    setIsAgreed(!isAgreed);
  };

  const handleSubmit = async () => {
    if (isAgreed) {
      try {
        const response = await createKakaoPay();
        console.log("KakaoPay response:", response);

        // 응답값 확인
        if (response && response.next_redirect_pc_url) {
          const { tid, next_redirect_pc_url } = response;
          console.log("next_redirect_pc_url:", next_redirect_pc_url); //url 넘어왔나 확인
          setTid(tid); // Zustand에 tid 저장
          console.log("tid 넘어왔나 확인", tid); // tid 잘 넘어왔나 확인

          window.location.href = next_redirect_pc_url; // 여기서 리디렉션 수행
        } else {
          console.error("응답값 이상", response); // 응답값이 유효하지 않을 때
        }
      } catch (error) {
        console.error("Error creating KakaoPay subscription:", error);
      }
    }
  };

  return (
    <div className="flex flex-col justify-center items-center bg-gray-100 flex-grow">
      <div className="bg-white p-8 shadow-md w-full max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">N/BBANG 카카오페이 카드등록</h2>
        
        <div className="mb-4 p-4 bg-gray-100 rounded">
          <p className="text-sm text-gray-700 mt-2">
            카카오페이 카드등록만 가능합니다.
            <br />
            <span className="text-xs text-gray-500">
              카카오페이 머니 등록 및 충전은 불가능합니다.
            </span>
          </p>
        </div>
        <div className="mt-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              className="form-checkbox"
              checked={isAgreed}
              onChange={handleAgreementChange}
            />
            <span className="ml-2 text-sm text-gray-700">
              서비스 이용에 동의 합니다.
            </span>
          </label>
        </div>
      </div>

      <div className="bg-white p-8 shadow-md w-full max-w-2xl mx-auto mt-2">
        <h3 className="text-sm font-bold mb-2">모두 동의합니다.</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-gray-700">
            전자금융거래 이용약관 <span className="text-primary">보기</span>
          </li>
          <li className="text-sm text-gray-700">
            개인정보수집 및 이용동의 <span className="text-primary">보기</span>
          </li>
          <li className="text-sm text-gray-700">
            개인(신용)정보 제 3자 제공 및 위탁동의{" "}
            <span className="text-primary">보기</span>
          </li>
        </ul>
      </div>

      <div className="p-8 bg-white shadow-md w-full max-w-2xl mx-auto mt-2">
        <button
          disabled={!isAgreed}
          className={`w-full py-3 rounded ${
            isAgreed
              ? "bg-primary text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          onClick={handleSubmit}
        >
          동의하고 넘어가기
        </button>
      </div>
    </div>
  );
};

export default KakaoPayCardRegister;
