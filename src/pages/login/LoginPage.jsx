import React from "react";
import { useNavigate } from "react-router-dom";
import axiosInterceptors from "../../api/axiosInterceptors";

const Login = () => {
  const navigate = useNavigate();

  const handleEmailLogin = () => {
    navigate("/users/user-login");
  };

  const handleGoogleLogin = () => {
    const googleLoginUrl = `${axiosInterceptors.defaults.baseURL}/oauth2/authorization/google`;
    const newWindow = window.open(
      googleLoginUrl,
      "_blank",
      "width=500,height=600"
    );

    const interval = setInterval(() => {
      if (newWindow.closed) {
        clearInterval(interval);
        navigate("/redirect");
      }
    }, 500);
  };

  const handleSignUpClick = () => {
    navigate("/users/sign-up");
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-50">
      <div className="w-full max-w-md p-6">
        <button
          onClick={() => navigate("/")}
          className="p-1 rounded bg-gray-100"
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
        <div className="mt-6">
          <button
            onClick={handleEmailLogin}
            className="w-full px-4 py-3 mb-3 text-white bg-green-500 rounded-lg focus:outline-none"
          >
            이메일로 시작하기
          </button>
          <button
            onClick={handleGoogleLogin}
            className="w-full px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none"
          >
            Google 로그인
          </button>
        </div>
        <div className="mt-4 text-center">
          <span className="text-xs font-bold">엔빵 계정이 없으신가요? </span>
          <button
            onClick={handleSignUpClick}
            className="text-xs font-bold text-green-500 hover:underline cursor-pointer"
          >
            회원가입
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;