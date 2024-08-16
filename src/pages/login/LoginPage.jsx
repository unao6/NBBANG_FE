import React from "react";
import { useNavigate } from "react-router-dom";
import axiosInterceptors from "../../api/axiosInterceptors";

const Login = () => {
  const navigate = useNavigate();

  const handleEmailLogin = () => {
    navigate("/users/user-login");
  };

  const handleGoogleLogin = () => {
    window.location.href = `https://oauth2/authorization/google`;
  };

  const handleSignUpClick = () => {
    navigate("/users/sign-up");
  };

  return (
    <div className="flex flex-col items-center justify-start h-full">
      <div className="w-full max-w-md"> {/* Adjusted margin-top */}
        <button
          onClick={() => navigate("/")}
          className="p-1 pb-10 rounded"
        >
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
        <h1 className="text-4xl font-bold text-center mt-4">N/BBANG</h1>
        <p className="text-center text-gray-600 mt-2">안녕하세요</p>
        <div className="mt-6 flex flex-col justify-center items-center">
          <button
            onClick={handleEmailLogin}
            className="w-3/4 px-4 py-3 mb-3 text-white bg-primary rounded-lg focus:outline-none hover:bg-accent"
          >
            이메일로 시작하기
          </button>
          <button
            onClick={handleGoogleLogin}
            className="w-3/4 px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none hover:text-black"
          >
            Google 로그인
          </button>
        </div>
        <div className="mt-4 text-center">
          <span className="text-xs font-bold">엔빵 계정이 없으신가요? </span>
          <button
            onClick={handleSignUpClick}
            className="text-xs font-bold text-accent hover:underline cursor-pointer"
          >
            회원가입
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
