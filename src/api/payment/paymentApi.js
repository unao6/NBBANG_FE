import axios from "axios";

const baseUrl = process.env.REACT_APP_API_BASE_URL;
const paymentUrl = `${baseUrl}/api/payment`;

export const getPayments = async () => {
  return axios.get(`${paymentUrl}/list`);
};

export const getUserPayments = async (userId = 1) => {
  return axios.get(`${paymentUrl}/user/${userId}`);
};
