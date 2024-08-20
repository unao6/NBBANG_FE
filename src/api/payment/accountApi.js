import axiosInterceptors from "../axiosInterceptors.js";

export const getAccountInfo = async () => {
  try {
    const response = await axiosInterceptors.get(`/api/account/info`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return null;
    }
    throw error;
  }
};

export const registerAccount = async (bankName, accountNumber) => {
  try {
    const response = await axiosInterceptors.post('/api/account/register', {
      bankName,
      accountNumber,
    });
    return response.data;
  } catch (error) {
    console.error('Error registering account:', error);
    throw error;
  }
};

export const deleteAccountInfo = async () => {
  return axiosInterceptors.delete(`/api/account/delete`);
};
