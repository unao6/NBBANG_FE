import axios from "axios";

const baseUrl = process.env.REACT_APP_API_BASE_URL;
const paymentUrl = `${baseUrl}/api/payment`;

export const getPayments = async () => {
  return axios.get(`${paymentUrl}/list`);
};

export const getUserPayments = async (userId = 1) => {
  return axios.get(`${paymentUrl}/user/${userId}`);
};

export const getPaymentsByStatus = async (status) => {
  return axios.get(`${paymentUrl}/status/${status}`);
};

export const requestRefund = async (paymentId, refundData) => {
  return axios.post(`${paymentUrl}/${paymentId}/refund`, refundData);
};

export const getCardInfo = async (userId) => {
  try {
    const response = await axios.get(`${baseUrl}/api/card/info/${userId}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return null;
    }
    throw error;
  }
};

export const deleteCardInfo = async (userId) => {
  return axios.delete(`${baseUrl}/api/card/delete/${userId}`);
};
