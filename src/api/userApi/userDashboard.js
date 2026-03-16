import axios from "axios";

const API = "http://localhost:5003/api/users/dashboard";

// Dashboard stats
export const getDashboardStats = async () => {
  const res = await axios.get(`${API}/stats`, { withCredentials: true });
  return res.data;
};

// Recommended profiles
export const getRecommendedProfiles = async () => {
  const res = await axios.get(`${API}/recommended`, { withCredentials: true });
  return res.data;
};

// New matches today
export const getNewMatches = async () => {
  const res = await axios.get(`${API}/new-matches`, { withCredentials: true });
  return res.data;
};

// New interests
export const getNewInterests = async () => {
  const res = await axios.get(`${API}/interests`, { withCredentials: true });
  return res.data;
};

// Visitors
export const getVisitors = async () => {
  const res = await axios.get(`${API}/visitors`, { withCredentials: true });
  return res.data;
};

// Track profile visit
export const trackVisit = async (profileId) => {
  const res = await axios.post(
    `${API}/visit/${profileId}`,
    {},
    { withCredentials: true },
  );
  return res.data;
};
