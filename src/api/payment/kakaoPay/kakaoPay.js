import axios from "axios";

const baseUrl = process.env.REACT_APP_API_BASE_URL;
const kakaoUrl = `${baseUrl}/api/payment/kakaopay`;

export const createKakaoPay = async (userId) => {
    const response = await axios.post(`${kakaoUrl}/create`, null, {
        params: {
            userId: userId,
        },
    });
  return response.data;
};

export const approveKakaoPay = async (data) => {
  const response = await axios.post(`${kakaoUrl}/approve`, data);
  return response.data;
};
