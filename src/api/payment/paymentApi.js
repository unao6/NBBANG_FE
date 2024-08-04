import axiosInterceptors from "../axiosInterceptors.js";

const paymentUrl = `/api/payment`;

export const getPayments = async () => {
  return axiosInterceptors.get(`${paymentUrl}/list`);
};

export const getUserPayments = async (userId = 1) => {
  return axiosInterceptors.get(`${paymentUrl}/user/${userId}`);
};

export const getPaymentsByStatus = async (status) => {
  return axiosInterceptors.get(`${paymentUrl}/status/${status}`);
};

export const requestRefund = async (paymentId, refundData) => {
  return axiosInterceptors.post(
    `${paymentUrl}/${paymentId}/refund`,
    refundData,
  );
};

export const getCardInfo = async (userId) => {
  try {
    const response = await axiosInterceptors.get(`/api/card/info/${userId}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return null;
    }
    throw error;
  }
};

export const deleteCardInfo = async (userId) => {
  return axiosInterceptors.delete(`/api/card/delete/${userId}`);
};
