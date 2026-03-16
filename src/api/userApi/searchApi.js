import axios from "axios";

const API = "http://localhost:5003/api/users/search";

const getToken = () => localStorage.getItem("authToken");

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

// SEARCH PROFILES
export const searchProfiles = async (filters) => {
  const params = {
    minAge: filters.ageRange[0],
    maxAge: filters.ageRange[1],
    religion: filters.religion,
    caste: filters.caste,
    education: filters.education,
    location: filters.location,
  };

  const res = await axios.get(`${API}/search`, {
    ...authHeader(),
    params,
  });

  return res.data;
};

// GET MATCHES
export const getMatches = async () => {
  const res = await axios.get(`${API}/matches`, authHeader());
  return res.data.matches;
};

// VIEW PROFILE
export const viewProfile = async (profileId) => {
  const res = await axios.get(`${API}/profile/${profileId}`, authHeader());
  return res.data.profile;
};

// GET VISITORS
export const getVisitors = async () => {
  const res = await axios.get(`${API}/visitors`, authHeader());
  return res.data.visitors;
};

// BLOCK USER
export const blockUser = async (blockedUserId) => {
  const res = await axios.post(`${API}/block`, { blockedUserId }, authHeader());

  return res.data;
};

// UNBLOCK USER
export const unblockUser = async (blockedUserId) => {
  const res = await axios.post(
    `${API}/unblock`,
    { blockedUserId },
    authHeader(),
  );

  return res.data;
};

// GET BLOCKED USERS
export const getBlockedUsers = async () => {
  const res = await axios.get(`${API}/blocked-users`, authHeader());
  return res.data.blockedUsers;
};
