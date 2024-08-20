<<<<<<< HEAD
import axiosInterceptors from "../axiosInterceptors.js";

const bootPayUrl = `/api/bootpay`;

export const postCardInfo = async (data) => {
    try {
      const response = await axiosInterceptors.post(`${bootPayUrl}/card`, data);
      return response.data;
    } catch (error) {
      console.error('Error posting card info:', error);
      throw error;
    }
=======
import axiosInterceptors from "../axiosInterceptors.js";

const bootPayUrl = `/api/bootpay`;

export const postCardInfo = async (data) => {
    try {
      const response = await axiosInterceptors.post(`${bootPayUrl}/card`, data);
      return response.data;
    } catch (error) {
      console.error('Error posting card info:', error);
      throw error;
    }
>>>>>>> 8046e0d (fix: 30일 제한 해제)
  };