import axios from "axios";

const ADMIN_API = "http://localhost:5003/api/admin";

// ================= ADMIN LOGIN =================
export const adminLogin = async (data) => {
  try {
    const res = await axios.post(`${ADMIN_API}/login`, data, {
      withCredentials: true,
    });

    return res.data;
  } catch (error) {
    throw error.response?.data || { message: "Server error" };
  }
};
