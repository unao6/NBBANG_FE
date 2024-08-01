import axios from 'axios';

const axiosInterceptors = axios.create({
  baseURL: 'http://localhost:8080', // 기본 API URL
  withCredentials: true, // 쿠키를 포함하여 요청을 보냄
});

axiosInterceptors.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access');
    if (token) {
      config.headers['access'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInterceptors;
