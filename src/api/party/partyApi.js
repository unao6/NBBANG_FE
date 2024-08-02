import axiosInterceptors from "../axiosInterceptors.js";

export const createParty = (partyData) => {
  return axiosInterceptors.post(`/api/party`, partyData);
};

export const subscribeOtt = () => {
  return axiosInterceptors.get('/api/subscribed-otts')
};

export const partyMatching = (partyMatching) => {
  return axiosInterceptors.post('/api/matching', partyMatching)
};