import axiosInterceptors from "../axiosInterceptors.js";

export const createParty = (partyData) => {
  return axiosInterceptors.post(`/api/party`, partyData);
};

export const subscribeOtt = () => {
  return axiosInterceptors.get("/api/subscribed-otts");
};

export const partyMatching = (partyMatching) => {
  return axiosInterceptors.post("/api/matching", partyMatching);
};

export const getMyParty = () => {
  return axiosInterceptors.get("/api/my-party");
};

export const getMyPartyAsMember = () => {
  return axiosInterceptors.get("/api/my-party-member");
};

export const getPartyByAdmin = (page = 0, size = 5) => {
  return axiosInterceptors.get("/api/admin/party", {
    params: {
      page: page,
      size: size,
    },
  });
};

export const searchPartyByEmail = (email, page = 0, size = 5) => {
  return axiosInterceptors.get("/api/admin/party-search", {
    params: {
      email: email,
      page: page,
      size: size,
    },
  });
};

export const partyBreakUp = (partyId) => {
  return axiosInterceptors.delete(`/api/party-breakup/${partyId}`);
};

export const partyMemberWithdraw = (partyId) => {
  return axiosInterceptors.delete(`/api/party-withdraw/${partyId}`);
};

export const getPartyById = (partyId) => {
  return axiosInterceptors.get(`/api/party/${partyId}`);
};

export const updateOttAccount = (partyId, partyUpdateRequest) => {
  return axiosInterceptors.put(`/api/party/${partyId}`, partyUpdateRequest);
};
