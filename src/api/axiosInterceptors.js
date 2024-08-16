import axios from 'axios';

const baseURL = process.env.REACT_APP_API_BASE_URL;

const axiosInterceptors = axios.create({
  baseURL: baseURL, // 기본 API URL
  withCredentials: true, // 쿠키를 포함하여 요청을 보냄
});

axiosInterceptors.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access');
    if (token) {
      config.headers['access'] = token; // 'access' 헤더에 토큰 추가
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInterceptors.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        console.log('Attempting to reissue token'); // 리이슈 토큰 시도 로그
        const response = await axios.post(
          `${baseURL}/api/reissue`,
          {}, // 요청 바디가 비어있다면 빈 객체 전달
          {
            withCredentials: true, // 쿠키를 포함하여 요청을 보냄
            headers: {
              'Content-Type': 'application/json', // 명시적으로 Content-Type 설정
            },
          }
        );

        const newAccessToken = response.headers['access'];
        console.log('New access token:', newAccessToken); // 새로운 액세스 토큰 로그
        localStorage.setItem('access', newAccessToken);

        originalRequest.headers['access'] = newAccessToken; // 'access' 헤더에 새로운 토큰 설정

        return axiosInterceptors(originalRequest);
      } catch (reissueError) {
        console.error('Reissue token failed:', reissueError); // 리이슈 토큰 실패 로그
        return Promise.reject(reissueError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInterceptors;