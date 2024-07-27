import React, { useState } from "react";

import { useNavigate } from "react-router-dom";

const GeneralCardRegister = () => {
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [password, setPassword] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const navigate = useNavigate();

  const handleCardNumberChange = (e) => {
    setCardNumber(e.target.value);
    validateForm();
  };

  const handleExpiryDateChange = (e) => {
    setExpiryDate(e.target.value);
    validateForm();
  };

  const handleBirthDateChange = (e) => {
    setBirthDate(e.target.value);
    validateForm();
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    validateForm();
  };

  const validateForm = () => {
    setIsFormValid(cardNumber && expiryDate && birthDate && password);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 카드 등록 처리 로직을 여기에 추가합니다.
    console.log("Card registered");
    navigate("/payment/success"); // 결제 성공 페이지로 이동합니다.
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <button onClick={() => navigate(-1)} className="text-gray-600">
            &#8592;
          </button>
          <h2 className="text-xl font-bold">체크/신용카드 등록</h2>
        </div>
        <h3 className="text-lg font-semibold mb-4">
          파티 이용료 결제를 위한 카드를 등록해주세요
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              카드 번호
            </label>
            <input
              type="text"
              value={cardNumber}
              onChange={handleCardNumberChange}
              placeholder="0000 0000 0000 0000"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              maxLength="16"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              유효기간
            </label>
            <input
              type="text"
              value={expiryDate}
              onChange={handleExpiryDateChange}
              placeholder="MM / YY"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              maxLength="5"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              생년월일
            </label>
            <input
              type="text"
              value={birthDate}
              onChange={handleBirthDateChange}
              placeholder="YYYYMMDD"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              maxLength="8"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              비밀번호
            </label>
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="비밀번호 앞 2자리"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              maxLength="2"
            />
          </div>
          <button
            type="submit"
            className={`w-full py-2 rounded ${
              isFormValid
                ? "bg-green-500 text-white hover:bg-green-600"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            disabled={!isFormValid}
          >
            결제카드 등록
          </button>
        </form>
      </div>
    </div>
  );
};

export default GeneralCardRegister;
