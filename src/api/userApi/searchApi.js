import axios from "axios";

const API = "http://localhost:5003/api/users";

// ✅ Get token safely
const getToken = () => localStorage.getItem("authToken");

// ✅ Auth header with safety
const authHeader = () => {
  const token = getToken();

  if (!token) {
    console.warn("No auth token found");
  }

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// ================= SEARCH PROFILES =================
export const searchProfiles = async (filters = {}) => {
  try {
    const params = {
      minAge: filters.ageRange?.[0],
      maxAge: filters.ageRange?.[1],
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
  } catch (error) {
    console.error("Search error:", error);
    throw error.response?.data || { message: "Search failed" };
  }
};

// ================= GET MATCHES =================
export const getMatches = async () => {
  try {
    const res = await axios.get(`${API}/matches`, authHeader());
    return res.data.matches;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch matches" };
  }
};

// ================= VIEW PROFILE =================
export const viewProfile = async (profileId) => {
  try {
    const res = await axios.get(`${API}/profile/${profileId}`, authHeader());
    return res.data.profile;
  } catch (error) {
    throw error.response?.data || { message: "Failed to load profile" };
  }
};

// ================= GET VISITORS =================
export const getVisitors = async () => {
  try {
    const res = await axios.get(`${API}/visitors`, authHeader());
    return res.data.visitors;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch visitors" };
  }
};

// ================= BLOCK USER =================
export const blockUser = async (blockedUserId) => {
  try {
    const res = await axios.post(
      `${API}/block`,
      { blockedUserId },
      authHeader(),
    );
    return res.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to block user" };
  }
};

// ================= UNBLOCK USER =================
export const unblockUser = async (blockedUserId) => {
  try {
    const res = await axios.post(
      `${API}/unblock`,
      { blockedUserId },
      authHeader(),
    );
    return res.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to unblock user" };
  }
};

// ================= GET BLOCKED USERS =================
export const getBlockedUsers = async () => {
  try {
    const res = await axios.get(`${API}/blocked-users`, authHeader());
    return res.data.blockedUsers;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch blocked users" };
  }
};
