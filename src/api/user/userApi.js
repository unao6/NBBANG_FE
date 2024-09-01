import useUserStore from '../../store/useUserStore.js';
import axiosInterceptors from "../axiosInterceptors.js";

// 유저 정보 가져오는 API
export const fetchUserInfo = async () => {
  try {
    console.log('Fetching user info...');
    const response = await axiosInterceptors.get('/api/users/user-info');

    if (response.status === 200) {
      const userData = response.data;
      console.log('유저 정보를 성공적으로 가져왔습니다.', userData);
      return userData;
    } else {
      console.error('유저 정보 가져오기 실패');
      return null;
    }
  } catch (error) {
    console.error('유저 정보를 가져오던 중 에러 발생:', error.response ? error.response.data : error.message);
    return null;
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

// 휴대폰 인증번호 전송 API
export const sendPhoneCertification = async (phoneNumber) => {
  return axiosInterceptors.post('/api/users/phone-certification', { phoneNumber });
};

// 인증번호 확인 API
export const verifyPhoneCertification = async (phoneNumber, randomNumber) => {
  return axiosInterceptors.post('/api/users/phone-check', { phoneNumber, randomNumber });
};

// 회원가입 API
export const signUpUser = (nickname, email, password, phoneNumber) => {
  return axiosInterceptors.post('/api/users/sign-up', {
    nickname,
    email,
    password,
    phoneCertificationRequestDto: {
      phoneNumber: phoneNumber
    }
  });
};

// 회원 탈퇴 API
export const deleteAccount = async (email) => {
  try {
    const response = await axiosInterceptors.delete(`/api/users/delete-account/${email}`);
    return response;
  } catch (error) {
    console.error('회원 탈퇴 실패:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// 휴대폰 번호 변경 API
export const changePhoneNumber = async (email, phoneNumber, randomNumber) => {
  try {
    const response = await axiosInterceptors.put('/api/users/change-phone-number', {
      email: email,
      newPhoneNumber: phoneNumber,
      randomNumber: randomNumber,
    });
    return response.data;
  } catch (error) {
    console.error('Error changing phone number:', error);
    throw error;
  }
};

// addPhoneNumber 함수는 동일한 방식으로 구현
export const addPhoneNumber = async (phoneNumber) => {
  try {
    const response = await axiosInterceptors.post('/api/auth/add-phone-number', {
      phoneNumber: phoneNumber, // 이제 phoneNumber만 전송
    });
    return response.data;
  } catch (error) {
    console.error('Error adding phone number:', error);
    throw error;
  }
};

// 활성 사용자 목록 가져오기
export const fetchActiveUsers = async () => {
  try {
    const response = await axiosInterceptors.get('/api/admin/active');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 비활성 사용자 목록 가져오기
export const fetchInactiveUsers = async () => {
  try {
    const response = await axiosInterceptors.get('/api/admin/inactive');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 사용자 계정 복구
export const restoreUserAccount = async (email) => {
  try {
    await axiosInterceptors.put(`/api/admin/restore-account/${email}`);
  } catch (error) {
    throw error;
  }
};

export const checkIfAdmin = async() => {
  const response = await axiosInterceptors.get('/api/role/check');
  return response.data;
}