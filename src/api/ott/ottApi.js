import axios from "axios";

const baseUrl = process.env.REACT_APP_API_BASE_URL;
const ottUrl = `${baseUrl}/api`;

export const createOtt = (ottCreateRequest) => {
  return axios.post(`${ottUrl}/admin/ott`, ottCreateRequest);
};

export const getAllOtt = () => {
  return axios.get(`${ottUrl}/ott/all`);
};

export const getOttById = (ottId) => {
  return axios.get(`${ottUrl}/ott/${ottId}`);
};

export const updateOtt = (ottUpdateRequest) => {
  return axios.put(`${ottUrl}/admin/ott`, ottUpdateRequest);
};

export const deleteOtt = (ottId) => {
  return axios.delete(`${ottUrl}/admin/ott/${ottId}`);
};
