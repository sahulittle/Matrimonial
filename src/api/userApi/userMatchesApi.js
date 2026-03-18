import axios from "axios";

const API = "http://localhost:5003/api/users/dashboard";

// ✅ helper to get token
const getAuthHeader = () => {
  const token = localStorage.getItem("authToken");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// ✅ Dashboard stats
export const getDashboardStats = async () => {
  const res = await axios.get(`${API}/stats`, getAuthHeader());
  return res?.data || {};
};

// ✅ Recommended profiles
export const getRecommendedProfiles = async () => {
  const res = await axios.get(`${API}/recommended`, getAuthHeader());
  return Array.isArray(res?.data) ? res.data : [];
};

// ✅ New matches today
export const getNewMatches = async () => {
  const res = await axios.get(`${API}/new-matches`, getAuthHeader());
  return Array.isArray(res?.data) ? res.data : [];
};

export const getNearMatches = async () => {
  const res = await axios.get(`${API}/near-matches`, getAuthHeader());
  return Array.isArray(res?.data) ? res.data : [];
};

export const getActiveUsers = async () => {
  const res = await axios.get(`${API}/active-users`, getAuthHeader());
  return Array.isArray(res?.data) ? res.data : [];
};

// ✅ New interests
export const getNewInterests = async () => {
  const res = await axios.get(`${API}/interests`, getAuthHeader());
  return Array.isArray(res?.data) ? res.data : [];
};

// ✅ Visitors
export const getVisitors = async () => {
  const res = await axios.get(`${API}/visitors`, getAuthHeader());
  return Array.isArray(res?.data) ? res.data : [];
};

// ✅ Track profile visit
export const trackVisit = async (profileId) => {
  const res = await axios.post(
    `${API}/visit/${profileId}`,
    {},
    getAuthHeader(),
  );
  return res?.data || {};
};
