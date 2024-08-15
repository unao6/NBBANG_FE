import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addPhoneNumber, sendPhoneCertification, verifyPhoneCertification } from '../../api/user/userApi';

const AddNumber = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [randomNumber, setRandomNumber] = useState('');
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const navigate = useNavigate();

  const handleSendVerificationCode = async () => {
    try {
      await sendPhoneCertification(phoneNumber);
      setIsVerificationSent(true);
      alert('인증번호가 발송되었습니다. 휴대폰을 확인해주세요.');
    } catch (error) {
      alert('인증번호 발송에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleVerifyCode = async () => {
    try {
      await verifyPhoneCertification(phoneNumber, randomNumber);
      setIsVerified(true);
      alert('휴대폰 인증이 완료되었습니다.');
    } catch (error) {
      alert('인증에 실패했습니다. 인증번호를 확인해주세요.');
    }
  };

  const handleSavePhoneNumber = async () => {
    if (isVerified) {  // 인증이 완료되었는지만 확인
      try {
        await addPhoneNumber(phoneNumber); // 이제 phoneNumber만 전달
        alert('휴대폰 번호가 성공적으로 추가되었습니다.');
        navigate('/mypage/user-info');
      } catch (error) {
        alert('휴대폰 번호 추가에 실패했습니다. 다시 시도해주세요.');
      }
    } else {
      alert('휴대폰 번호 인증을 완료해주세요.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-50">
      <div className="w-full max-w-md p-6">
        <button onClick={() => navigate('/')} className="p-1 rounded bg-gray-100">
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
        <h1 className="text-4xl font-bold text-center mt-4">전화번호 추가</h1>
        <p className="text-center text-gray-600 mt-2">전화번호를 입력하고 인증해주세요</p>
        <div className="mt-6">
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="휴대폰 번호를 - 없이 숫자만 입력해주세요"
            className="w-full px-4 py-3 mb-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
            required
          />
          <button
            onClick={handleSendVerificationCode}
            className="w-full px-4 py-3 mb-3 text-white bg-primary rounded-lg focus:outline-none"
            disabled={!phoneNumber}
          >
            {isVerificationSent ? '인증번호 재전송' : '인증번호 전송'}
          </button>
        </div>
        {isVerificationSent && (
          <div className="mt-6">
            <input
              type="text"
              value={randomNumber}
              onChange={(e) => setRandomNumber(e.target.value)}
              placeholder="인증번호를 입력해주세요"
              className="w-full px-4 py-3 mb-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
            <button
              onClick={handleVerifyCode}
              className="w-full px-4 py-3 mb-3 text-white bg-primary rounded-lg focus:outline-none"
            >
              인증 완료
            </button>
          </div>
        )}
        {isVerified && (
          <button
            onClick={handleSavePhoneNumber}
            className="w-full px-4 py-3 text-white bg-primary rounded-lg focus:outline-none"
          >
            전화번호 저장
          </button>
        )}
      </div>
    </div>
  );
};

export default AddNumber;