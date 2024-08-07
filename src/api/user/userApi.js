import useUserStore from '../../store/useUserStore.js';
import axiosInterceptors from "../axiosInterceptors.js";

export const fetchUserInfo = async () => {
  try {
    console.log('Fetching user info...');
    const response = await axiosInterceptors.get('/api/users/user-info');

    if (response.status === 200) {
      const userData = response.data;
      useUserStore.getState().setUser(userData);
      return userData;
    } else {
      console.error('유저 정보 가져오기 실패');
    }
  } catch (error) {
    console.error('유저 정보를 가져오던 중 에러 발생:', error.response ? error.response.data : error.message);
  }
};
