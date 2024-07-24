import React, { useState } from "react";

const KakaoPayCardRegister = () => {
  const [isAgreed, setIsAgreed] = useState(false);

  const handleAgreementChange = () => {
    setIsAgreed(!isAgreed);
  };

  return (
    <div className="h-screen flex flex-col justify-between bg-gray-100">
      <div className="bg-white p-8 shadow-md w-full max-w-2xl mx-auto mt-16 rounded">
        <h2 className="text-2xl font-bold mb-4">엔빵 카드등록</h2>
        <div className="mb-6">
          <h3 className="text-lg font-semibold">자동결제</h3>
          <p className="text-3xl font-bold text-black mt-1">100원</p>
          <p className="text-sm text-gray-500 mt-1">2024.07.24</p>
        </div>
        <div className="mb-4 p-4 bg-gray-100 rounded">
          <p className="text-sm text-gray-700">
            결제 금액 <span className="font-bold">100원</span>은 정상카드 확인
            완료 이후 바로 취소됩니다.
          </p>
          <p className="text-sm text-gray-700 mt-2">
            카카오페이 카드결제만 가능합니다.
            <br />
            <span className="text-xs text-gray-500">
              카카오페이 머니결제 및 충전은 불가능합니다.
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
              자동결제 서비스 이용에 동의 합니다.
            </span>
          </label>
        </div>
      </div>

      <div className="bg-white p-8 shadow-md w-full max-w-2xl mx-auto mt-4 rounded">
        <h3 className="text-sm font-bold mb-2">모두 동의합니다.</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-gray-700">
            전자금융거래 이용약관 <span className="text-blue-500">보기</span>
          </li>
          <li className="text-sm text-gray-700">
            개인정보수집 및 이용동의 <span className="text-blue-500">보기</span>
          </li>
          <li className="text-sm text-gray-700">
            개인(신용)정보 제 3자 제공 및 위탁동의{" "}
            <span className="text-blue-500">보기</span>
          </li>
        </ul>
      </div>

      <div className="p-8 bg-white shadow-md w-full max-w-2xl mx-auto mt-4 rounded">
        <button
          disabled={!isAgreed}
          className={`w-full py-3 rounded ${
            isAgreed
              ? "bg-green-500 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          동의하고 넘어가기
        </button>
      </div>
    </div>
  );
};

export default KakaoPayCardRegister;
