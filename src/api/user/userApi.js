import useUserStore from '../../store/useUserStore.js';
import axiosInterceptors from "../axiosInterceptors.js";

// 유저 정보 가져오기
export const fetchUserInfo = async () => {
  try {
    const response = await axiosInterceptors.get('/api/users/user-info');

    if (response.status === 200) {
      const userData = response.data;
      useUserStore.getState().setUser(userData);
      return userData; // 유저 정보를 반환
    } else {
      console.error('Failed to fetch user info');
      return null; // 에러가 발생하면 null을 반환
    }
  } catch (error) {
    console.error('Error fetching user info:', error.response ? error.response.data : error.message);
    return null; // 에러가 발생하면 null을 반환
  }
};

// 이메일 인증 코드 전송 API
export const sendEmailCertification = (email) => {
  return axiosInterceptors.post("/api/users/email-certification", { email });
};

// 인증 코드를 확인하는 API
export const verifyCertificationCode = (email, certificationNumber) => {
  return axiosInterceptors.post("/api/users/check-certification", { email, certificationNumber });
};

// 닉네임 중복 확인 API
export const checkNicknameAvailability = (nickname) => {
  return axiosInterceptors.post("/api/users/check-nickname", { nickname });
};

// 이메일 중복 확인 API
export const checkEmailAvailability = (email) => {
  return axiosInterceptors.post("/api/users/check-email", { email });
};

// 회원가입 API
export const signUpUser = (nickname, email, password, phoneNumber) => {
  return axiosInterceptors.post("/api/users/sign-up", {
    nickname,
    email,
    password,
    phoneCerfiticationRequestDto: {
      phoneNumber: phoneNumber
    }
  });
};
