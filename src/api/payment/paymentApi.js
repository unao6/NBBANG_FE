import axiosInterceptors from "../axiosInterceptors.js";

const paymentUrl = `/api/payment`;

export const getPayments = async () => {
  return axiosInterceptors.get(`${paymentUrl}/list`);
};

export const getUserPayments = async () => {
  return axiosInterceptors.get(`${paymentUrl}/user`);
};

export const getPaymentsByStatus = async (status) => {
  return axiosInterceptors.get(`${paymentUrl}/status/${status}`);
};

// 환불 요청 일단 payment 테이블만 변경
export const requestRefund = async (ottId) => {
  try {
    const response = await axiosInterceptors.post(`${paymentUrl}/refund/${ottId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCardInfo = async () => {
  try {
    const response = await axiosInterceptors.get(`/api/card/info`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return null;
    }
    throw error;
  }
};

export const deleteCardInfo = async () => {
  return axiosInterceptors.delete(`/api/card/delete`);
};
