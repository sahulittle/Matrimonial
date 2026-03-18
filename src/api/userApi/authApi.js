import axios from "axios";

const API = "http://localhost:5003/api/users/auth";

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
  try {
    const res = await axios.post(`${API}/login`, data);

    // ✅ OPTIONAL: store token here (or keep in AuthContext)
    // localStorage.setItem("authToken", res.data.token);

    return res.data;
  } catch (error) {
    throw error.response?.data || { message: "Server error" };
  }
};

// ================= CAPTCHA =================
export const getCaptcha = async () => {
  const res = await axios.get(`${API}/captcha`, {
    withCredentials: true, // ✅ needed for session captcha
  });

  return res.data;
};
