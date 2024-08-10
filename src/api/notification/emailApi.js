import axiosInterceptors from "../axiosInterceptors.js";

const notificationUrl = `/api/notification`;

export const sendEmail = async (email, subject, message) => {
  try {
      const response = await axiosInterceptors.post(`${notificationUrl}/email`, {
        email,
        subject,
        message,
      });
      return response.data;
  } catch (error) {
      console.error('Error in sendEmail:', error.response ? error.response.data : error.message);
      throw error;
  }
};