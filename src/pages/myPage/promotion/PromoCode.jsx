import React, { useState } from "react";

const PromoCodePage = () => {
  const [promoCode, setPromoCode] = useState("");

  const handlePromoCodeChange = (event) => {
    setPromoCode(event.target.value);
  };

  const handlePromoCodeSubmit = () => {
    // 프로모션 코드 제출 로직 추가
    console.log("제출된 프로모션 코드:", promoCode);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex items-start justify-center mt-10">
        <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-lg">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              프로모션 코드 또는 전용 할인 코드를 입력해주세요.
            </h2>
            <p className="text-gray-600 text-m mt-2">
              발급 받은 코드를 정확하게 입력해 주세요! (영문 대/소문자 구별 필수)
            </p>
          </div>
          <form
            className="flex items-center"
            onSubmit={(e) => {
              e.preventDefault();
              handlePromoCodeSubmit();
            }}
          >
            <input
              type="text"
              className="flex-grow px-4 py-2 border border-primary rounded-l-md focus:outline-none focus:ring-0 focus:border-primary"
              placeholder="여기에 코드를 입력하십시오..."
              value={promoCode}
              onChange={handlePromoCodeChange}
            />
            <button
              type="submit"
              className="px-6 py-2 bg-primary border border-primary text-white font-semibold rounded-r-md hover:bg-accent"
            >
              적용
            </button>
          </form>
          <p className="text-sm text-gray-500 text-center mt-4">
            코드 입력 후 할인 혜택을 누리세요.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PromoCodePage;
