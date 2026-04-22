import axios from "axios";

// ================= BASE URL =================
const BASE_URL = `${import.meta.env.VITE_API_URL}/users`;

// ================= TOKEN HELPER =================
const getToken = () => localStorage.getItem("authToken");

// ================= AUTH HEADER =================
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

// ================= AUTH APIs =================

// REGISTER
export const registerUser = async (data) => {
  try {
    const res = await axios.post(`${BASE_URL}/auth/register`, data);
    return res.data;
  } catch (error) {
    throw error.response?.data || { message: "Server error" };
  }
};

// LOGIN
export const loginUser = async (data) => {
  try {
    const res = await axios.post(`${BASE_URL}/auth/login`, data);
    return res.data;
  } catch (error) {
    throw error.response?.data || { message: "Server error" };
  }
};

// CAPTCHA
export const getCaptcha = async () => {
  const res = await axios.get(`${BASE_URL}/auth/captcha`, {
    withCredentials: true,
  });
  return res.data;
};

// ================= PROFILE / SEARCH =================

// SEARCH PROFILES
export const searchProfiles = async (filters = {}) => {
  try {
    const params = {
      minAge: filters.ageRange?.[0],
      maxAge: filters.ageRange?.[1],
      gender: filters.gender,
      religion: filters.religion,
      caste: filters.caste,
      education: filters.education,
      location: filters.location,
    };

    const res = await axios.get(`${BASE_URL}/search`, {
      ...authHeader(),
      params,
    });

    return res.data;
  } catch (error) {
    throw error.response?.data || { message: "Search failed" };
  }
};

// VIEW PROFILE
export const viewProfile = async (profileId) => {
  try {
    const res = await axios.get(
      `${BASE_URL}/profile/${profileId}`,
      authHeader(),
    );
    return res.data.profile;
  } catch (error) {
    throw error.response?.data || { message: "Failed to load profile" };
  }
};

// ================= MATCH / USER ACTIONS =================

// GET MATCHES
export const getMatches = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/matches`, authHeader());
    return res.data.matches;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch matches" };
  }
};

// BLOCK USER
export const blockUser = async (blockedUserId) => {
  try {
    const res = await axios.post(
      `${BASE_URL}/block`,
      { blockedUserId },
      authHeader(),
    );
    return res.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to block user" };
  }
};

// UNBLOCK USER
export const unblockUser = async (blockedUserId) => {
  try {
    const res = await axios.post(
      `${BASE_URL}/unblock`,
      { blockedUserId },
      authHeader(),
    );
    return res.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to unblock user" };
  }
};

// GET BLOCKED USERS
export const getBlockedUsers = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/blocked-users`, authHeader());
    return res.data.blockedUsers;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Failed to fetch blocked users",
      }
    );
  }
};

// ================= DASHBOARD =================

const DASHBOARD = `${BASE_URL}/dashboard`;

// PROFILE
export const getUserProfile = async () => {
  try {
    const res = await axios.get(
      `${BASE_URL}/profile`, // ✅ correct endpoint
      authHeader(),
    );
    return res.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch profile" };
  }
};
// ================= COUNTRIES / STATES (external public API) =================
// Uses https://countriesnow.space API to fetch states and cities for a country
export const getStatesByCountry = async (country) => {
  try {
    const res = await axios.post(
      "https://countriesnow.space/api/v0.1/countries/states",
      { country },
    );

    const states = res?.data?.data?.states;
    if (Array.isArray(states)) return states.map((s) => (s?.name ? s.name : s));

    // fallback if API returns array directly
    return Array.isArray(res?.data?.data) ? res.data.data : [];
  } catch (error) {
    console.error("Failed to fetch states", error?.response || error);
    return [];
  }
};

export const getCitiesByCountryState = async (country, state) => {
  try {
    const res = await axios.post(
      "https://countriesnow.space/api/v0.1/countries/state/cities",
      { country, state },
    );

    const cities = res?.data?.data || res?.data?.cities;
    return Array.isArray(cities) ? cities : [];
  } catch (error) {
    console.error("Failed to fetch cities", error?.response || error);
    return [];
  }
};
export const updateUserProfile = async (data) => {
  try {
    const res = await axios.put(
      `${BASE_URL}/profile`, // ✅ correct
      data,
      authHeader(),
    );
    return res.data;
  } catch (error) {
    throw error.response?.data || { message: "Update failed" };
  }
};

// STATS
export const getDashboardStats = async () => {
  const res = await axios.get(`${DASHBOARD}/stats`, authHeader());
  return res?.data || {};
};

// RECOMMENDED
export const getRecommendedProfiles = async () => {
  const res = await axios.get(`${DASHBOARD}/recommended`, authHeader());
  return Array.isArray(res?.data) ? res.data : [];
};

// NEW MATCHES
export const getNewMatches = async () => {
  const res = await axios.get(`${DASHBOARD}/new-matches`, authHeader());
  return Array.isArray(res?.data) ? res.data : [];
};

// NEAR MATCHES
export const getNearMatches = async () => {
  const res = await axios.get(`${DASHBOARD}/near-matches`, authHeader());
  return Array.isArray(res?.data) ? res.data : [];
};

// ACTIVE USERS
export const getActiveUsers = async () => {
  const res = await axios.get(`${DASHBOARD}/active-users`, authHeader());
  return Array.isArray(res?.data) ? res.data : [];
};
export const getUserById = async (id) => {
  const res = await axios.get(`${BASE_URL}/profile/${id}`, authHeader());
  // normalize response: controller may return { profile } or { user }
  return res.data.profile || res.data.user || res.data;
};
// INTERESTS
export const getNewInterests = async () => {
  const res = await axios.get(`${DASHBOARD}/interests`, authHeader());
  return Array.isArray(res?.data) ? res.data : [];
};

// VISITORS (shared)
export const getVisitors = async () => {
  const res = await axios.get(`${DASHBOARD}/visitors`, authHeader());
  return Array.isArray(res?.data) ? res.data : [];
};

// TRACK VISIT
export const trackVisit = async (profileId) => {
  try {
    const res = await axios.post(
      `${BASE_URL}/dashboard/visit/${profileId}`,
      {},
      authHeader(),
    );
    return res.data;
  } catch (error) {
    console.error("Track visit error:", error);
  }
};
export const toggleLike = async (profileId) => {
  return axios.post(
    `${BASE_URL}/dashboard/like/${profileId}`,
    {},
    authHeader(),
  );
};
// ================= SETTINGS =================

const SETTINGS = `${BASE_URL}/settings`;

// GET SETTINGS
export const getSettings = async () => {
  const res = await axios.get(SETTINGS, authHeader());
  return res.data;
};

// UPDATE SETTINGS
export const updateSettings = async (data) => {
  const res = await axios.put(SETTINGS, data, authHeader());
  return res.data;
};

// CHANGE PASSWORD
export const changePassword = async (data) => {
  const res = await axios.put(
    `${SETTINGS}/change-password`,
    data,
    authHeader(),
  );
  return res.data;
};

// DELETE ACCOUNT
export const deleteAccount = async () => {
  const res = await axios.delete(`${SETTINGS}/delete`, authHeader());
  return res.data;
};
// ================= INTEREST =================

// SEND INTEREST
export const sendInterest = async (data) => {
  try {
    const res = await axios.post(
      `${BASE_URL}/interests/send`,
      data,
      authHeader(),
    );
    return res.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to send interest" };
  }
};
// GET SENT INTERESTS
export const getSentInterests = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/interests/sent`, authHeader());
    return res.data.interests || [];
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch sent interests" };
  }
};

// GET RECEIVED
export const getReceivedInterests = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/interests/received`, authHeader());
    return res.data.interests || [];
  } catch (error) {
    throw (
      error.response?.data || { message: "Failed to fetch received interests" }
    );
  }
};

// ACCEPT
export const acceptInterest = async (interestId) => {
  try {
    const res = await axios.put(
      `${BASE_URL}/interests/${interestId}/accept`,
      {},
      authHeader(),
    );
    return res.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to accept interest" };
  }
};

// REJECT
export const rejectInterest = async (interestId) => {
  try {
    const res = await axios.put(
      `${BASE_URL}/interests/${interestId}/reject`,
      {},
      authHeader(),
    );
    return res.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to reject interest" };
  }
};

// CANCEL
export const cancelInterest = async (interestId) => {
  try {
    const res = await axios.delete(
      `${BASE_URL}/interests/${interestId}`,
      authHeader(),
    );
    return res.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to cancel interest" };
  }
};
// ================= SHORTLIST =================

// ADD TO SHORTLIST
export const addToShortlist = async (profileId) => {
  try {
    const res = await axios.post(
      `${BASE_URL}/shortlist/add`,
      { profileId },
      authHeader(),
    );
    return res.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to add shortlist" };
  }
};

// REMOVE FROM SHORTLIST
export const removeFromShortlist = async (profileId) => {
  try {
    const res = await axios.post(
      `${BASE_URL}/shortlist/remove`,
      { profileId },
      authHeader(),
    );
    return res.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to remove shortlist" };
  }
};

// GET SHORTLIST
export const getShortlist = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/shortlist`, authHeader());
    return res.data.shortlist || [];
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch shortlist" };
  }
};

// ================= PAYMENT =================

export const getPackages = async () => {
  return axios.get(`${BASE_URL}/payments/packages`);
};

export const createPaymentIntent = async (data) => {
  return axios.post(`${BASE_URL}/payments/create-intent`, data, authHeader());
};

export const confirmPayment = async (data) => {
  return axios.post(`${BASE_URL}/payments/confirm`, data, authHeader());
};

// PUBLIC SEARCH (no auth)
export const publicSearchProfiles = async (filters = {}) => {
  try {
    const params = {
      minAge: filters.ageRange?.[0] || filters.minAge,
      maxAge: filters.ageRange?.[1] || filters.maxAge,
      religion: filters.religion,
      caste: filters.caste,
      education: filters.education,
      location:
        filters.location ||
        (filters.state
          ? filters.state + (filters.city ? ", " + filters.city : "")
          : filters.city),
      gender: filters.gender,
      maritalStatus: filters.maritalStatus,
      profession: filters.profession,
      smoking: filters.smoking,
      drinking: filters.drinking,
    };

    const res = await axios.get(`${BASE_URL}/search/public`, {
      params,
    });

    return res.data;
  } catch (error) {
    throw error.response?.data || { message: "Search failed" };
  }
};

// ================= PHOTOS =================

const PHOTOS = `${BASE_URL}/photos`;

// UPLOAD PHOTOS
export const uploadPhotos = async (files, onUploadProgress) => {
  try {
    const form = new FormData();
    files.forEach((file) => form.append("photos", file));

    const res = await axios.post(`${PHOTOS}/upload`, form, {
      ...authHeader(),
      onUploadProgress,
    });

    return res.data;
  } catch (error) {
    throw error.response?.data || { message: "Photo upload failed" };
  }
};

// GET ALL PHOTOS
export const getPhotos = async () => {
  try {
    const res = await axios.get(PHOTOS, authHeader());
    return res.data.photos || [];
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch photos" };
  }
};

// SET PROFILE PHOTO
export const setProfilePhoto = async (photoId) => {
  try {
    const res = await axios.put(
      `${PHOTOS}/${photoId}/profile`,
      {},
      authHeader(),
    );
    return res.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to set profile photo" };
  }
};

// UPDATE PRIVACY
export const updatePhotoPrivacy = async (photoId, privacy) => {
  try {
    const res = await axios.put(
      `${PHOTOS}/${photoId}/privacy`,
      { privacy },
      authHeader(),
    );
    return res.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to update privacy" };
  }
};

// DELETE PHOTO
export const deletePhoto = async (photoId) => {
  try {
    const res = await axios.delete(`${PHOTOS}/${photoId}`, authHeader());
    return res.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to delete photo" };
  }
};

// REORDER PHOTOS
export const reorderPhotos = async (order) => {
  try {
    const res = await axios.put(`${PHOTOS}/reorder`, { order }, authHeader());
    return res.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to reorder photos" };
  }
};

// ================= PUBLIC SUCCESS STORIES =================
export const getPublicSuccessStories = async () => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/success-stories`,
    );

    return Array.isArray(res?.data) ? res.data : [];
  } catch (error) {
    console.error("Failed to fetch public success stories:", error);
    return [];
  }
};
