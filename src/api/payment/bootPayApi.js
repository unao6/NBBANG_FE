import axiosInterceptors from "../axiosInterceptors.js";

const bootPayUrl = `/api/bootpay`;

export const postCardInfo = async (data) => {
  try {
    const response = await axiosInterceptors.post(`${bootPayUrl}/card`, data);
    return response.data;
  } catch (error) {
    console.error("Error posting card info:", error);
    throw error;
  }
};
