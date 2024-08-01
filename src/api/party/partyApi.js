import axiosInterceptors from "../axiosInterceptors.js";

export const createParty = (partyData) => {
  return axiosInterceptors.post(`/api/party`, partyData);
};