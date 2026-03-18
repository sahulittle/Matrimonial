import axios from "axios";

const API = "http://localhost:5003/api/users/settings";

const getAuthHeader = () => {
  const token = localStorage.getItem("authToken");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// GET SETTINGS
export const getSettings = async () => {
  const res = await axios.get(API, getAuthHeader());
  return res.data;
};

// SAVE SETTINGS
export const updateSettings = async (data) => {
  const res = await axios.put(API, data, getAuthHeader());
  return res.data;
};

// CHANGE PASSWORD
export const changePassword = async (data) => {
  const res = await axios.put(`${API}/change-password`, data, getAuthHeader());
  return res.data;
};