import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignUp = () => {
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isNicknameFocused, setIsNicknameFocused] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] = useState(false);

  const navigate = useNavigate();

  const handleNicknameChange = (e) => setNickname(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);

  const handleNicknameCheck = async () => {
    // 닉네임 중복 확인 로직
    try {
      const response = await axios.post("http://localhost:8080/api/users/check-nickname", { nickname });
      if (response.data.isValid) {
        alert("사용 가능한 닉네임입니다.");
      } else {
        alert("이미 사용 중인 닉네임입니다.");
      }
    } catch (error) {
      console.error("Nickname check failed:", error);
    }
  };

  const handleEmailCheck = async () => {
    // 이메일 중복 확인 로직
    try {
      const response = await axios.post("http://localhost:8080/api/users/check-email", { email });
      if (response.data.isValid) {
        alert("사용 가능한 이메일입니다.");
      } else {
        alert("이미 사용 중인 이메일입니다.");
      }
    } catch (error) {
      console.error("Email check failed:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // 회원가입 처리 로직
    try {
      await axios.post("http://localhost:8080/api/users/sign-up", {
        nickname,
        email,
        password,
      });
      navigate("/login");
    } catch (error) {
      console.error("Sign up failed:", error);
    }
  };

  const handleBackClick = () => {
    navigate("/login");
  };

  const isFormValid =
    nickname &&
    email &&
    password.length >= 6 &&
    password === confirmPassword;

  return (
    <div className="flex flex-col items-center h-full bg-white">
      <div className="w-full max-w-md">
        <div className="flex items-center mb-6">
          <button onClick={handleBackClick} className="p-1 rounded bg-gray-100">
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
          <h2 className="text-sm font-bold ml-2 text-center w-full">회원가입</h2>
        </div>
        <h2 className="text-2xl font-bold mb-6 text-left">회원가입</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className={`block text-sm font-medium ${isNicknameFocused ? "text-green-500" : "text-gray-700"}`}>닉네임</label>
            <div className="relative">
              <input
                type="text"
                value={nickname}
                onChange={handleNicknameChange}
                onFocus={() => setIsNicknameFocused(true)}
                onBlur={() => setIsNicknameFocused(false)}
                className={`block w-full px-3 py-2 focus:outline-none focus:ring-0 border-b-2 ${isNicknameFocused ? 'border-green-500' : 'border-gray-300'}`}
                placeholder="닉네임을 입력해주세요"
                style={{
                  border: 'none',
                  borderBottom: isNicknameFocused ? '2px solid #5bc490' : '2px solid #d3d3d3',
                  backgroundColor: 'transparent'
                }}
              />
              <button
                type="button"
                onClick={handleNicknameCheck}
                className="absolute inset-y-0 right-0 px-4 py-1 text-white bg-green-500 rounded-r-md hover:bg-blue-600 focus:outline-none"
              >
                중복확인
              </button>
            </div>
          </div>

          <div className="mb-6">
            <label className={`block text-sm font-medium ${isEmailFocused ? "text-green-500" : "text-gray-700"}`}>이메일</label>
            <div className="relative">
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
              <button
                type="button"
                onClick={handleEmailCheck}
                className="absolute inset-y-0 right-0 px-4 py-1 text-white bg-green-500 rounded-r-md hover:bg-blue-600 focus:outline-none"
              >
                중복확인
              </button>
            </div>
          </div>

          <div className="mb-6">
            <label className={`block text-sm font-medium ${isPasswordFocused ? "text-green-500" : "text-gray-700"}`}>비밀번호</label>
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

          <div className="mb-6">
            <label className={`block text-sm font-medium ${isConfirmPasswordFocused ? "text-green-500" : "text-gray-700"}`}>비밀번호 확인</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              onFocus={() => setIsConfirmPasswordFocused(true)}
              onBlur={() => setIsConfirmPasswordFocused(false)}
              className={`block w-full px-3 py-2 focus:outline-none focus:ring-0 border-b-2 ${isConfirmPasswordFocused ? 'border-green-500' : 'border-gray-300'}`}
              placeholder="비밀번호를 다시 입력해주세요"
              style={{
                border: 'none',
                borderBottom: isConfirmPasswordFocused ? '2px solid #5bc490' : '2px solid #d3d3d3',
                backgroundColor: 'transparent'
              }}
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 text-gray-400 bg-gray-100 rounded focus:outline-none"
            disabled={!isFormValid}
            style={{
              backgroundColor: isFormValid ? '#5bc490' : '#f1f1f1',
              color: isFormValid ? '#fff' : '#d3d3d3'
            }}
          >
            본인인증
          </button>
        </form>
        <div className="mt-4 text-center">
          <span className="text-xs font-bold">이미 계정이 있으신가요? </span>
          <a onClick={() => navigate("/login")} className="text-xs font-bold text-green-500 hover:underline cursor-pointer">
            로그인
          </a>
        </div>
      </div>
    </div>
  );
};

export default SignUp;