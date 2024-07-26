import React, { useState } from "react";

const SignUp = () => {
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isCodeValid, setIsCodeValid] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isNicknameValid, setIsNicknameValid] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);

  const handleNicknameChange = (e) => setNickname(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handleVerificationCodeChange = (e) => setVerificationCode(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);

  const handleNicknameCheck = () => {
    // 닉네임 중복 확인 로직
    setIsNicknameValid(true);
  };

  const handleEmailCheck = () => {
    // 이메일 중복 확인 로직
    setIsEmailValid(true);
  };

  const handleSendVerificationCode = () => {
    // 이메일 인증 코드 전송 로직
    setIsCodeSent(true);
  };

  const handleVerifyCode = () => {
    // 인증 코드 확인 로직
    setEmailVerified(true);
    setIsCodeValid(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 회원가입 처리 로직
  };

  const isFormValid =
    isNicknameValid &&
    isEmailValid &&
    emailVerified &&
    password.length >= 6 &&
    password === confirmPassword;

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl font-bold mb-6">회원가입</h2>
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">닉네임</label>
          <div className="relative mt-1">
            <input
              type="text"
              value={nickname}
              onChange={handleNicknameChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="닉네임을 입력해주세요"
            />
            <button
              type="button"
              onClick={handleNicknameCheck}
              className="absolute inset-y-0 right-0 px-4 py-1 text-white bg-blue-500 rounded-r-md hover:bg-blue-600 focus:outline-none"
            >
              중복확인
            </button>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">이메일</label>
          <div className="relative mt-1">
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="이메일을 입력해주세요"
            />
            <button
              type="button"
              onClick={handleEmailCheck}
              className="absolute inset-y-0 right-0 px-4 py-1 text-white bg-blue-500 rounded-r-md hover:bg-blue-600 focus:outline-none"
            >
              중복확인
            </button>
          </div>
        </div>

        {isEmailValid && (
          <div className="mb-4">
            <button
              type="button"
              onClick={handleSendVerificationCode}
              className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              이메일 인증하기
            </button>
          </div>
        )}

        {isCodeSent && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">인증번호</label>
            <div className="relative mt-1">
              <input
                type="text"
                value={verificationCode}
                onChange={handleVerificationCodeChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="인증번호를 입력해주세요"
              />
              <button
                type="button"
                onClick={handleVerifyCode}
                className="absolute inset-y-0 right-0 px-4 py-1 text-white bg-blue-500 rounded-r-md hover:bg-blue-600 focus:outline-none"
              >
                인증하기
              </button>
            </div>
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">비밀번호</label>
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="비밀번호를 입력해주세요"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">비밀번호 확인</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="비밀번호를 다시 입력해주세요"
          />
        </div>

        <button
          type="submit"
          className={`w-full px-4 py-2 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-200 ${
            isFormValid ? "bg-green-500 hover:bg-green-600" : "bg-gray-400"
          }`}
          disabled={!isFormValid}
        >
          회원가입
        </button>
      </form>
      <div className="mt-4 text-center">
        <a href="/users/user-login" className="text-blue-500 hover:underline">이미 계정이 있으신가요? 로그인</a>
      </div>
    </div>
  );
};

export default SignUp;