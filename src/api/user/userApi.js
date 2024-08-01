import useUserStore from '../../store/useUserStore.js';
import axiosInterceptors from "../axiosInterceptors.js";

// 유저 정보 가져오기
export const fetchUserInfo = async () => {
  try {
    const response = await axiosInterceptors.get('/api/users/user-info');

    if (response.status === 200) {
      const userData = response.data;
      useUserStore.getState().setUser(userData);
    } else {
      console.error('Failed to fetch user info');
    }
  } catch (error) {
    console.error('Error fetching user info:', error.response ? error.response.data : error.message);
  }
};
