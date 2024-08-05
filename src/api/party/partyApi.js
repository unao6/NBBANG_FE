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

export const getMyParty = () => {
  return axiosInterceptors.get('/api/my-party')
};

export const getPartyById = (partyId) => {
  return axiosInterceptors.get(`/api/party/${partyId}`)
};