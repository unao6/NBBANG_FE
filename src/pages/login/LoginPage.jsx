import React from "react";
import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();

  const handleEmailLogin = () => {
    navigate("/users/user-login");
  };

  const handleGoogleLoginSuccess = async (response) => {
    const { credential } = response;
    try {
      const res = await axios.post('/api/login/google', { token: credential });
      console.log('Login Successful:', res.data);
      // 이후 로직 추가 (예: 토큰 저장, 페이지 이동 등)
    } catch (error) {
      console.error('Login Failed:', error);
    }
  };

  const handleGoogleLoginFailure = (response) => {
    console.error('Login Failed:', response);
  };

  const handleSignUpClick = () => {
    navigate("/users/sign-up");
  };

  return (
    <GoogleOAuthProvider clientId="160290170469-uueuftilh1mt5cq8cig1nrjbl8naukb6.apps.googleusercontent.com">
      <div className="flex flex-col items-center justify-center h-Full bg-gray-50">
        <div className="w-full max-w-md p-6">
          <button onClick={() => navigate("/")} className="p-1 rounded bg-gray-100">
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
          <h1 className="text-4xl font-bold text-center mt-4">엔빵</h1>
          <p className="text-center text-gray-600 mt-2">안녕하세용</p>
          <div className="mt-6">
            <button
              onClick={handleEmailLogin}
              className="w-full px-4 py-3 mb-3 text-white bg-green-500 rounded-lg focus:outline-none"
            >
              이메일로 시작하기
            </button>
            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={handleGoogleLoginFailure}
              text="signin_with"
              shape="rectangular"
              theme="outline"
              className="w-full px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none"
            />
          </div>
          <div className="mt-4 text-center">
            <span className="text-xs font-bold">엔빵 계정이 없으신가요? </span>
            <a onClick={handleSignUpClick} className="text-xs font-bold text-green-500 hover:underline cursor-pointer">
              회원가입
            </a>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;