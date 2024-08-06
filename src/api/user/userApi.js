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