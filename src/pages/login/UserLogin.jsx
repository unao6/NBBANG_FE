import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const navigate = useNavigate();

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    // 로그인 처리 로직 추가
  };

  const handleSignUpClick = () => {
    navigate("/users/sign-up");
  };

  const handleBackClick = () => {
    navigate("/login");
  };

  return (
    <div className="flex flex-col items-center justify-center h-full px-4 bg-white pt-[10px]">
      <div className="w-full max-w-md">
        <div className="flex items-center mb-6">
          <button onClick={handleBackClick} className="p-2 rounded-full bg-gray-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
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
          <h2 className="text-xl font-bold ml-4">이메일 로그인</h2>
        </div>
        <h2 className="text-2xl font-bold mb-6 text-left">이메일로 <br /> 로그인 하기</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">이메일</label>
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              onFocus={() => setIsEmailFocused(true)}
              onBlur={() => setIsEmailFocused(false)}
              className={`block w-full px-3 py-2 focus:outline-none focus:ring-0 border-b-2 ${isEmailFocused ? 'border-green-500' : 'border-gray-300'}`}
              placeholder="이메일을 입력해주세요"
              style={{
                border: 'none',
                borderBottom: isEmailFocused ? '2px solid #5bc490' : '2px solid #d3d3d3',
                backgroundColor: 'transparent'
              }}
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              onFocus={() => setIsPasswordFocused(true)}
              onBlur={() => setIsPasswordFocused(false)}
              className={`block w-full px-3 py-2 focus:outline-none focus:ring-0 border-b-2 ${isPasswordFocused ? 'border-green-500' : 'border-gray-300'}`}
              placeholder="비밀번호를 입력해주세요"
              style={{
                border: 'none',
                borderBottom: isPasswordFocused ? '2px solid #5bc490' : '2px solid #d3d3d3',
                backgroundColor: 'transparent'
              }}
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 text-gray-400 bg-gray-100 rounded focus:outline-none"
            disabled={!email || !password}
            style={{
              backgroundColor: email && password ? '#5bc490' : '#f1f1f1',
              color: email && password ? '#fff' : '#d3d3d3'
            }}
          >
            로그인
          </button>
        </form>
        <div className="mt-4 text-center">
          <span className="text-xs font-bold">엔빵 계정이 없으신가요? </span>
          <a onClick={handleSignUpClick} className="text-xs font-bold text-green-500 hover:underline cursor-pointer">
            회원가입
          </a>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;