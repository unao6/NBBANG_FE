import useUserStore from '../../store/useUserStore.js';
import axiosInterceptors from "../axiosInterceptors.js";

export const fetchUserInfo = async () => {
  try {
    console.log('Fetching user info...');
    const response = await axiosInterceptors.get('/api/users/user-info');

    if (response.status === 200) {
      const userData = response.data;
      useUserStore.getState().setUser(userData);
      console.log('유저 정보를 성공적으로 가져왔습니다.', userData);
      return userData;
    } else {
      console.error('유저 정보 가져오기 실패');
      return null; // 에러가 발생하면 null을 반환
    }
  } catch (error) {
    console.error('유저 정보를 가져오던 중 에러 발생:', error.response ? error.response.data : error.message);
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
