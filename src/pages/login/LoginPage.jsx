import React from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();

  const handleEmailLoginClick = () => {
    navigate("/users/user-login");
  };

  const handleGoogleLoginClick = () => {
    // 구글 로그인 처리 로직 추가
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-white px-4">
      <div className="w-full max-w-md">
        <button className="text-left mb-4" onClick={() => navigate("/")}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
        </button>

        <div className="text-center text-lg font-medium text-gray-700 mb-8">
          대충 로그인 페이지 소개말
        </div>

        <button
          onClick={handleEmailLoginClick}
          className="w-full px-4 py-2 text-white bg-yellow-500 rounded-lg flex items-center justify-center mb-4"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6 mr-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 3.75L7.5 12l9 8.25"
            />
          </svg>
          이메일로 시작하기
        </button>
        <button
          onClick={handleGoogleLoginClick}
          className="w-full px-4 py-2 text-green-500 bg-gray-100 rounded-lg flex items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6 mr-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 3.75L16.5 12l-8.25 8.25"
            />
          </svg>
          구글 계정으로 시작하기
        </button>
      </div>
    </div>
  );
};

export default LoginPage;