import axiosInterceptors from "../../axiosInterceptors.js";

const kakaoUrl = `/api/payment/kakaopay`;

export const createKakaoPay = async () => {
  const response = await axiosInterceptors.post(`${kakaoUrl}/create`);
  return response.data;
};

export const approveKakaoPay = async (tid, pgToken) => {
  const response = await axiosInterceptors.post(`${kakaoUrl}/approve`, {
    tid,
    pg_token: pgToken,
  });
  return response.data;
};

export const cancelPayment = async (cancelRequest) => {
  console.log("Cancel Request Data:", cancelRequest); 
  return axiosInterceptors.post(`${kakaoUrl}/cancel`, cancelRequest);
};
