import useUserStore from '../../store/useUserStore.js';
import axiosInterceptors from "../axiosInterceptors.js";

// 유저 정보 가져오기
// export const fetchUserInfo = async () => {
//   try {
//     const response = await axiosInterceptors.get('/api/users/user-info');

//     if (response.status === 200) {
//       const userData = response.data;
//       useUserStore.getState().setUser(userData);
//     } else {
//       console.error('Failed to fetch user info');
//     }
//   } catch (error) {
//     console.error('Error fetching user info:', error.response ? error.response.data : error.message);
//   }
// };

export const fetchUserInfo = async () => {
  try {
    // API 요청 전 콘솔 로그 추가
    console.log('Fetching user info...');
    const response = await axiosInterceptors.get('/api/users/user-info');
    
    // 응답 상태 코드와 데이터 확인
    console.log('Response:', response);

    if (response.status === 200) {
      const userData = response.data;
      console.log('User data:', userData);
      useUserStore.getState().setUser(userData);
      return userData; // userData를 반환하도록 변경
    } else {
      console.error('Failed to fetch user info');
    }
  } catch (error) {
    console.error('Error fetching user info:', error.response ? error.response.data : error.message);
  }
};
