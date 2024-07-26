import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const UserAuth = () => {
  const [name, setName] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isNameFocused, setIsNameFocused] = useState(false);
  const [isIdNumberFocused, setIsIdNumberFocused] = useState(false);
  const [isPhoneNumberFocused, setIsPhoneNumberFocused] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isCodeValid, setIsCodeValid] = useState(false);
  const [isAgreementVisible, setIsAgreementVisible] = useState(false);

  const navigate = useNavigate();

  const handleNameChange = (e) => setName(e.target.value);
  const handleIdNumberChange = (e) => setIdNumber(e.target.value);
  const handlePhoneNumberChange = (e) => setPhoneNumber(e.target.value);
  const handleVerificationCodeChange = (e) => setVerificationCode(e.target.value);

  const handleRequestVerificationCode = (e) => {
    e.preventDefault();
    // 인증번호 요청 로직
    setIsCodeSent(true);
  };

  const handleVerifyCode = (e) => {
    e.preventDefault();
    // 인증번호 확인 로직
    if (verificationCode === "1234") { // 여기서 1234는 테스트용 코드
      setIsCodeValid(true);
      setIsAgreementVisible(true);
    }
  };

  const handleAgreementSubmit = () => {
    // 회원가입 처리 로직
    navigate("/login");
  };

  return (
    <div className="flex flex-col items-center h-full bg-white">
      <div className="w-full max-w-md">
        <div className="flex items-center mb-6">
          <button onClick={() => navigate(-1)} className="p-1 rounded bg-gray-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h2 className="text-sm font-bold ml-2 text-center w-full">휴대폰 본인 인증</h2>
        </div>
        <h2 className="text-2xl font-bold mb-6 text-left">피클플러스 이용을 위해 <br /> 본인 인증을 해주세요</h2>
        <p className="text-gray-600 mb-6">안전하고 편리한 서비스 이용에 필요해요.</p>
        <form onSubmit={handleRequestVerificationCode}>
          <div className="mb-6">
            <label className={`block text-sm font-medium ${isNameFocused ? "text-green-500" : "text-gray-700"}`}>이름</label>
            <input
              type="text"
              value={name}
              onChange={handleNameChange}
              onFocus={() => setIsNameFocused(true)}
              onBlur={() => setIsNameFocused(false)}
              className={`block w-full px-3 py-2 focus:outline-none focus:ring-0 border-b-2 ${isNameFocused ? 'border-green-500' : 'border-gray-300'}`}
              placeholder="이름"
              style={{
                border: 'none',
                borderBottom: isNameFocused ? '2px solid #5bc490' : '2px solid #d3d3d3',
                backgroundColor: 'transparent'
              }}
            />
          </div>

          <div className="mb-6">
            <label className={`block text-sm font-medium ${isIdNumberFocused ? "text-green-500" : "text-gray-700"}`}>주민등록번호</label>
            <input
              type="text"
              value={idNumber}
              onChange={handleIdNumberChange}
              onFocus={() => setIsIdNumberFocused(true)}
              onBlur={() => setIsIdNumberFocused(false)}
              className={`block w-full px-3 py-2 focus:outline-none focus:ring-0 border-b-2 ${isIdNumberFocused ? 'border-green-500' : 'border-gray-300'}`}
              placeholder="주민등록번호"
              style={{
                border: 'none',
                borderBottom: isIdNumberFocused ? '2px solid #5bc490' : '2px solid #d3d3d3',
                backgroundColor: 'transparent'
              }}
            />
          </div>

          <div className="mb-6">
            <label className={`block text-sm font-medium ${isPhoneNumberFocused ? "text-green-500" : "text-gray-700"}`}>휴대폰번호</label>
            <input
              type="text"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              onFocus={() => setIsPhoneNumberFocused(true)}
              onBlur={() => setIsPhoneNumberFocused(false)}
              className={`block w-full px-3 py-2 focus:outline-none focus:ring-0 border-b-2 ${isPhoneNumberFocused ? 'border-green-500' : 'border-gray-300'}`}
              placeholder="휴대폰번호"
              style={{
                border: 'none',
                borderBottom: isPhoneNumberFocused ? '2px solid #5bc490' : '2px solid #d3d3d3',
                backgroundColor: 'transparent'
              }}
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 text-gray-400 bg-gray-100 rounded focus:outline-none"
            style={{
              backgroundColor: name && idNumber && phoneNumber ? '#5bc490' : '#f1f1f1',
              color: name && idNumber && phoneNumber ? '#fff' : '#d3d3d3'
            }}
          >
            인증번호 요청
          </button>
        </form>

        {isCodeSent && (
          <form onSubmit={handleVerifyCode} className="mt-4">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700">인증번호 입력</label>
              <input
                type="text"
                value={verificationCode}
                onChange={handleVerificationCodeChange}
                className="block w-full px-3 py-2 border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-green-500"
                placeholder="인증번호를 입력해주세요"
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-green-500 rounded focus:outline-none"
            >
              확인
            </button>
          </form>
        )}

        {isAgreementVisible && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg max-w-md w-full">
              <h2 className="text-xl font-bold mb-4">가입 시 필요한 약관에 동의해주세요</h2>
              <div className="mb-4">
                <input type="checkbox" id="agree-all" className="mr-2" />
                <label htmlFor="agree-all" className="text-sm font-medium">전체 동의하기</label>
              </div>
              <div className="mb-4">
                <input type="checkbox" id="agree1" className="mr-2" />
                <label htmlFor="agree1" className="text-sm font-medium">[필수] 피클플러스 서비스 이용약관</label>
              </div>
              <div className="mb-4">
                <input type="checkbox" id="agree2" className="mr-2" />
                <label htmlFor="agree2" className="text-sm font-medium">[필수] 개인정보처리 방침</label>
              </div>
              <div className="mb-4">
                <input type="checkbox" id="agree3" className="mr-2" />
                <label htmlFor="agree3" className="text-sm font-medium">[필수] 본인 확인 서비스 전체 동의</label>
              </div>
              <div className="mb-4">
                <input type="checkbox" id="agree4" className="mr-2" />
                <label htmlFor="agree4" className="text-sm font-medium">[선택] 프로모션 및 이벤트 수신</label>
              </div>
              <button
                onClick={handleAgreementSubmit}
                className="w-full px-4 py-2 text-white bg-green-500 rounded focus:outline-none"
              >
                동의하기
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserAuth;