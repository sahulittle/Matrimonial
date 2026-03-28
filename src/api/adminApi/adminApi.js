import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_API_URL}/admin`;

const getToken = () => localStorage.getItem("authToken");

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

// ================= DASHBOARD APIs =================

// Get stats
export const getDashboardStats = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/dashboard/stats`, authHeader());
    return res.data;
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    throw error;
  }
};

// Get graph data
export const getGraphData = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/dashboard/graph-data`, authHeader());
    return res.data;
  } catch (error) {
    console.error("Error fetching graph data:", error);
    throw error;
  }
};
export const createPackage = async (data) => {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/admin/payments/packages`,
      data,
      authHeader()
    );
    return res.data;
  } catch (error) {
    console.error("Error creating package:", error);
    throw error;
  }
};

export const getAllPackages = async () => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/admin/payments/packages`,
      authHeader()
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching packages:", error);
    throw error;
  }
};

export const deletePackage = async (id) => {
  try {
    const res = await axios.delete(
      `${import.meta.env.VITE_API_URL}/admin/payments/packages/${id}`,
      authHeader()
    );
    return res.data;
  } catch (error) {
    console.error("Error deleting package:", error);
    throw error;
  }
};

export const togglePackageStatus = async (id) => {
  try {
    const res = await axios.patch(
      `${import.meta.env.VITE_API_URL}/admin/payments/packages/toggle/${id}`,
      {},
      authHeader()
    );
    return res.data;
  } catch (error) {
    console.error("Error toggling package status:", error);
    throw error;
  }
};
export const getActivePackages = async () => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/admin/payments/packages/active`,
      authHeader()
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching active packages:", error);
    throw error;
  }
};

// ================= USERS APIs =================

// Get all users
export const getAllUsers = async (params = {}) => {
  try {
    const res = await axios.get(`${BASE_URL}/users-admin`, {
      ...authHeader(),
      params,
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

// Get user details
export const getUserDetails = async (userId) => {
  const res = await axios.get(
    `${BASE_URL}/users-admin/${userId}`,
    authHeader()
  );
  return res.data;
};
export const updateUserDetails = async (userId, data) => {
  try {
    const res = await axios.put(
      `${BASE_URL}/users-admin/${userId}`,
      data,
      authHeader()
    );
    return res.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const toggleVerification = async (userId, data) => {
  try {
    const res = await axios.patch(
      `${BASE_URL}/users-admin/${userId}/toggle`,
      data,
      authHeader()
    );
    return res.data;
  } catch (error) {
    console.error("Error toggling verification:", error);
    throw error;
  }
};
// Ban user
export const banUser = async (userId, reason) => {
  const res = await axios.post(
    `${BASE_URL}/users-admin/${userId}/ban`,
    { reason },
    authHeader()
  );
  return res.data;
};

// Unban user
export const unbanUser = async (userId) => {
  const res = await axios.post(
    `${BASE_URL}/users-admin/${userId}/unban`,
    {},
    authHeader()
  );
  return res.data;
};

// Activate user
export const activateUser = async (userId) => {
  const res = await axios.post(
    `${BASE_URL}/users-admin/${userId}/activate`,
    {},
    authHeader()
  );
  return res.data;
};

// Deactivate user
export const deactivateUser = async (userId) => {
  const res = await axios.post(
    `${BASE_URL}/users-admin/${userId}/deactivate`,
    {},
    authHeader()
  );
  return res.data;
};

// Verify email
export const verifyEmail = async (userId) => {
  const res = await axios.post(
    `${BASE_URL}/users-admin/${userId}/verify-email`,
    {},
    authHeader()
  );
  return res.data;
};

// Verify phone
export const verifyPhone = async (userId) => {
  const res = await axios.post(
    `${BASE_URL}/users-admin/${userId}/verify-phone`,
    {},
    authHeader()
  );
  return res.data;
};

// Verify KYC
export const verifyKYC = async (userId) => {
  const res = await axios.post(
    `${BASE_URL}/users-admin/${userId}/verify-kyc`,
    {},
    authHeader()
  );
  return res.data;
};

// Add notes
export const addNotes = async (userId, notes) => {
  const res = await axios.put(
    `${BASE_URL}/users-admin/${userId}/notes`,
    { notes },
    authHeader()
  );
  return res.data;
};

// Delete user
export const deleteUser = async (userId) => {
  const res = await axios.delete(
    `${BASE_URL}/users-admin/${userId}`,
    authHeader()
  );
  return res.data;
};


// ================= PAYMENTS APIs =================

// Get all payments
export const getAllPayments = async (params = {}) => {
  try {
    const res = await axios.get(
      `${BASE_URL}/payments/payments`,
      {
        ...authHeader(),
        params,
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching payments:", error);
    throw error;
  }
};

// Get payment details
export const getPaymentDetails = async (paymentId) => {
  const res = await axios.get(
    `${BASE_URL}/payments/payments/${paymentId}`,
    authHeader()
  );
  return res.data;
};

// Mark payment completed
export const completePayment = async (paymentId) => {
  const res = await axios.post(
    `${BASE_URL}/payments/payments/${paymentId}/complete`,
    {},
    authHeader()
  );
  return res.data;
};

// Refund payment
export const refundPayment = async (paymentId) => {
  const res = await axios.post(
    `${BASE_URL}/payments/payments/${paymentId}/refund`,
    {},
    authHeader()
  );
  return res.data;
};

// Payment stats
export const getPaymentStats = async () => {
  const res = await axios.get(
    `${BASE_URL}/payments/payments/stats`,
    authHeader()
  );
  return res.data;
};
//  RENEWAL APIs 

export const getRenewals = async (params = {}) => {
  try {
    const res = await axios.get(
      `${BASE_URL}/payments/packages/renewals`,
      {
        ...authHeader(),
        params,
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching renewals:", error);
    throw error;
  }
};
// send notification
export const sendNotificationAPI = async (data) => {
  const res = await axios.post(
    `${BASE_URL}/notifications/send`,
    data,
    authHeader()
  );
  return res.data;
};
// get all intrests
export const getAllInterests = async (params = {}) => {
  const res = await axios.get(
    `${BASE_URL}/interests`,
    {
      ...authHeader(),
      params,
    }
  );
  return res.data;
};