import axiosInterceptors from "../axiosInterceptors.js";

export const createOtt = (ottCreateRequest) => {
  return axiosInterceptors.post(`/api/admin/ott`, ottCreateRequest);
};

export const getAllOtt = () => {
  return axiosInterceptors.get(`/api/ott/all`);
};

export const getOttById = (ottId) => {
  return axiosInterceptors.get(`/api/ott/${ottId}`);
};

export const updateOtt = (ottUpdateRequest) => {
  return axiosInterceptors.put(`/api/admin/ott`, ottUpdateRequest);
};

export const deleteOtt = (ottId) => {
  return axiosInterceptors.delete(`/api/admin/ott/${ottId}`);
};
