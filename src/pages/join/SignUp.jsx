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

  const [nicknameMessage, setNicknameMessage] = useState("");
  const [isNicknameValid, setIsNicknameValid] = useState(false);

  const [emailMessage, setEmailMessage] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);

  const [certificationNumber, setVerificationCode] = useState("");
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [isVerificationSuccess, setIsVerificationSuccess] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState("");

  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [passwordMessage, setPasswordMessage] = useState("");
  const [isPasswordMatch, setIsPasswordMatch] = useState(true);

  const navigate = useNavigate();

  const validateEmail = (email) => {
    // 이메일 형식 정규식
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePassword = (password) => {
    // 비밀번호가 영어와 숫자를 포함하여 8자 이상인지 확인
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return regex.test(password);
  };

  const handleNicknameChange = (e) => setNickname(e.target.value);
  const handleEmailChange = (e) => {
    const emailInput = e.target.value;
    setEmail(emailInput);

    if (validateEmail(emailInput)) {
      setEmailMessage("");
      setIsEmailValid(true);
    } else {
      setEmailMessage("유효한 이메일 주소를 입력하세요.");
      setIsEmailValid(false);
    }
  };

const handleSendVerificationCode = async () => {
  try {
    await axios.post("http://localhost:8080/api/users/email-certification", { email });
    setIsVerificationSent(true);
    alert("인증 이메일이 발송되었습니다. 이메일을 확인해 주세요.");
  } catch (error) {
    console.error("Email verification failed:", error);
    alert("이메일 인증에 실패했습니다. 다시 시도해 주세요.");
  }
};

const handleVerificationCodeChange = (e) => {
  setVerificationCode(e.target.value);
};

  const handleVerifyCode = async () => {
    try {
      const response = await axios.post("http://localhost:8080/api/users/check-certification", { email, certificationNumber });
      if (response.status === 200) {
        setIsVerificationSuccess(true);
        setVerificationMessage("이메일 인증이 완료되었습니다.");
      } else {
        setIsVerificationSuccess(false);
        setVerificationMessage("인증 코드가 올바르지 않습니다.");
      }
    } catch (error) {
      console.error("Verification failed:", error);
      setIsVerificationSuccess(false);
      setVerificationMessage("인증 코드가 올바르지 않습니다.");
    }
  };

const handlePasswordChange = (e) => {
    const passwordInput = e.target.value;
    setPassword(passwordInput);

    // 비밀번호 유효성 검사: 영어와 숫자를 포함하고 8자 이상인지 확인
    if (!validatePassword(passwordInput)) {
      setIsPasswordValid(false);
      setPasswordMessage("비밀번호는 영어와 숫자를 포함하여 8자 이상이어야 합니다.");
    } else {
      setIsPasswordValid(true);
      setPasswordMessage("");
    }

    // 비밀번호와 확인 비밀번호가 일치하는지 확인
    if (confirmPassword && passwordInput !== confirmPassword) {
      setIsPasswordMatch(false);
      setPasswordMessage("비밀번호가 일치하지 않습니다.");
    } else if (confirmPassword && validatePassword(passwordInput)) {
      setIsPasswordMatch(true);
      setPasswordMessage("");
    }
};

const handleConfirmPasswordChange = (e) => {
    const confirmPasswordInput = e.target.value;
    setConfirmPassword(confirmPasswordInput);

    // 비밀번호와 확인 비밀번호가 일치하는지 확인
    if (password && confirmPasswordInput !== password) {
      setIsPasswordMatch(false);
      setPasswordMessage("비밀번호가 일치하지 않습니다.");
    } else {
      setIsPasswordMatch(true);
      setPasswordMessage("");
    }
};

  const handleNicknameCheck = async () => {
    try {
      const response = await axios.post("http://localhost:8080/api/users/check-nickname", { nickname });
      if (response.data === true) {  // 사용 가능한 경우
        setNicknameMessage("사용 가능한 닉네임입니다.");
        setIsNicknameValid(true);
      } else {  // 이미 사용 중인 경우
        setNicknameMessage("이미 사용 중인 닉네임입니다.");
        setIsNicknameValid(false);
      }
    } catch (error) {
      console.error("Nickname check failed:", error);
      setNicknameMessage("이미 사용 중인 닉네임입니다.");
      setIsNicknameValid(false);
    }
  };

  const handleEmailCheck = async () => {
    try {
      const response = await axios.post("http://localhost:8080/api/users/check-email", { email });
      if (response.data === true) {  // 사용 가능한 경우
        setEmailMessage("사용 가능한 이메일입니다.");
        setIsEmailValid(true);
      } else {  // 이미 사용 중인 경우
        setEmailMessage("이미 사용 중인 이메일입니다.");
        setIsEmailValid(false);
      }
    } catch (error) {
      console.error("Email check failed:", error);
      setEmailMessage("이미 사용 중인 이메일입니다.");
      setIsEmailValid(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    password.length >= 8 &&
    isPasswordValid && // 비밀번호가 유효한지 확인
    isPasswordMatch && // 비밀번호와 확인 비밀번호가 일치하는지 확인
    isNicknameValid &&
    isEmailValid &&
    isVerificationSuccess;

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
            {nicknameMessage && (
              <p className={`text-sm mt-2 ${isNicknameValid ? 'text-green-500' : 'text-red-500'}`}>
                {nicknameMessage}
              </p>
            )}
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
                disabled={!isEmailValid}
              >
                중복확인
              </button>
            </div>
            {emailMessage && (
              <p className={`text-sm mt-2 ${isEmailValid ? 'text-green-500' : 'text-red-500'}`}>
                {emailMessage}
              </p>
            )}
          </div>

                    {!isVerificationSent && (
                      <div className="mb-6">
                        <button
                          type="button"
                          onClick={handleSendVerificationCode}
                          className="w-full px-4 py-2 text-white bg-green-700 rounded focus:outline-none hover:bg-green-800"
                        >
                          인증번호 전송
                        </button>
                      </div>
                    )}

                    {isVerificationSent && (
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700">인증번호</label>
                        <input
                          type="text"
                          value={certificationNumber}
                          onChange={handleVerificationCodeChange}
                          className="block w-full px-3 py-2 border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-green-500"
                          placeholder="인증번호를 입력해주세요"
                        />
                        <button
                          type="button"
                          onClick={handleVerifyCode}
                          className="w-full mt-4 px-4 py-2 text-white bg-green-500 rounded focus:outline-none hover:bg-green-600"
                        >
                          인증 완료
                        </button>
                        {verificationMessage && (
                          <p className={`text-sm mt-2 ${isVerificationSuccess ? 'text-green-500' : 'text-red-500'}`}>
                            {verificationMessage}
                          </p>
                        )}
                      </div>
                    )}

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
        {passwordMessage && (
          <p className={`text-sm mt-2 ${isPasswordValid ? 'text-green-500' : 'text-red-500'}`}>
            {passwordMessage}
          </p>
        )}
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