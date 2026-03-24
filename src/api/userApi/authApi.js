import axios from "axios";

const API = `${import.meta.env.VITE_API_URL}/users/auth`;

// ================= REGISTER USER =================
export const registerUser = async (data) => {
  try {
    const res = await axios.post(`${API}/register`, data);

    return res.data; // ✅ IMPORTANT
  } catch (error) {
    throw error.response?.data || { message: "Server error" };
  }
};

// ================= LOGIN USER =================
export const loginUser = async (data) => {
  const res = await axios.post(`${API}/login`, data, {
    withCredentials: true, // ✅ ADD THIS
  });

  return res.data;
};

// ================= CAPTCHA =================
export const getCaptcha = async () => {
  const res = await axios.get(`${API}/captcha`, {
    withCredentials: true, // ✅ needed for session captcha
  });

  return res.data;
};
