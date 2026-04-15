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
    const res = await axios.get(
      `${BASE_URL}/dashboard/graph-data`,
      authHeader(),
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching graph data:", error);
    throw error;
  }
};
export const createPackage = async (data) => {
  try {
    const res = await axios.post(
      `${BASE_URL}/payments/packages`,
      data,
      authHeader(),
    );
    return res.data;
  } catch (error) {
    console.error("Error creating package:", error);
    throw error;
  }
};

export const getAllPackages = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/payments/packages`, authHeader());
    return res.data;
  } catch (error) {
    console.error("Error fetching packages:", error);
    throw error;
  }
};

export const deletePackage = async (id) => {
  try {
    const res = await axios.delete(
      `${BASE_URL}/payments/packages/${id}`,
      authHeader(),
    );
    return res.data;
  } catch (error) {
    console.error("Error deleting package:", error);
    throw error;
  }
};

export const togglePackageStatus = async (id) => {
  try {
    // backend expects POST to /admin/payments/packages/:packageId/toggle
    const res = await axios.post(
      `${BASE_URL}/packages/${id}/toggle`,
      {},
      authHeader(),
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
      `${BASE_URL}/payments/packages/active`,
      authHeader(),
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching active packages:", error);
    throw error;
  }
};
export const updatePackage = async (id, data) => {
  try {
    const res = await axios.put(
      `${BASE_URL}/payments/packages/${id}`,
      data,
      authHeader(),
    );
    return res.data;
  } catch (error) {
    console.error("Error updating package:", error);
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
    authHeader(),
  );
  return res.data;
};
export const updateUserDetails = async (userId, data) => {
  try {
    const res = await axios.put(
      `${BASE_URL}/users-admin/${userId}`,
      data,
      authHeader(),
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
      authHeader(),
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
    authHeader(),
  );
  return res.data;
};

// Unban user
export const unbanUser = async (userId) => {
  const res = await axios.post(
    `${BASE_URL}/users-admin/${userId}/unban`,
    {},
    authHeader(),
  );
  return res.data;
};

// Activate user
export const activateUser = async (userId) => {
  const res = await axios.post(
    `${BASE_URL}/users-admin/${userId}/activate`,
    {},
    authHeader(),
  );
  return res.data;
};

// Deactivate user
export const deactivateUser = async (userId) => {
  const res = await axios.post(
    `${BASE_URL}/users-admin/${userId}/deactivate`,
    {},
    authHeader(),
  );
  return res.data;
};

// Verify email
export const verifyEmail = async (userId) => {
  const res = await axios.post(
    `${BASE_URL}/users-admin/${userId}/verify-email`,
    {},
    authHeader(),
  );
  return res.data;
};

// Verify phone
export const verifyPhone = async (userId) => {
  const res = await axios.post(
    `${BASE_URL}/users-admin/${userId}/verify-phone`,
    {},
    authHeader(),
  );
  return res.data;
};

// Verify KYC
export const verifyKYC = async (userId) => {
  const res = await axios.post(
    `${BASE_URL}/users-admin/${userId}/verify-kyc`,
    {},
    authHeader(),
  );
  return res.data;
};

// Add notes
export const addNotes = async (userId, notes) => {
  const res = await axios.put(
    `${BASE_URL}/users-admin/${userId}/notes`,
    { notes },
    authHeader(),
  );
  return res.data;
};

// Delete user
export const deleteUser = async (userId) => {
  const res = await axios.delete(
    `${BASE_URL}/users-admin/${userId}`,
    authHeader(),
  );
  return res.data;
};

// ================= PAYMENTS APIs =================

// Get all payments
export const getAllPayments = async (params = {}) => {
  try {
    const res = await axios.get(`${BASE_URL}/payments/payments`, {
      ...authHeader(),
      params,
    });
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
    authHeader(),
  );
  return res.data;
};

// Mark payment completed
export const completePayment = async (paymentId) => {
  const res = await axios.post(
    `${BASE_URL}/payments/payments/${paymentId}/complete`,
    {},
    authHeader(),
  );
  return res.data;
};

// Refund payment
export const refundPayment = async (paymentId) => {
  const res = await axios.post(
    `${BASE_URL}/payments/payments/${paymentId}/refund`,
    {},
    authHeader(),
  );
  return res.data;
};

// Payment stats
export const getPaymentStats = async () => {
  const res = await axios.get(
    `${BASE_URL}/payments/payments/stats`,
    authHeader(),
  );
  return res.data;
};
//  RENEWAL APIs

export const getRenewals = async (params = {}) => {
  try {
    const res = await axios.get(`${BASE_URL}/payments/packages/renewals`, {
      ...authHeader(),
      params,
    });
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
    authHeader(),
  );
  return res.data;
};
// get all intrests
export const getAllInterests = async (params = {}) => {
  const res = await axios.get(`${BASE_URL}/interests`, {
    ...authHeader(),
    params,
  });
  return res.data;
};

// ================= REPORTS & TICKETS APIs =================

export const getAllReports = async (params = {}) => {
  try {
    const res = await axios.get(`${BASE_URL}/reports`, {
      ...authHeader(),
      params,
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching reports:", error);
    throw error;
  }
};

export const getReportDetails = async (reportId) => {
  try {
    const res = await axios.get(
      `${BASE_URL}/reports/${reportId}`,
      authHeader(),
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching report details:", error);
    throw error;
  }
};

export const resolveReport = async (reportId, data) => {
  try {
    const res = await axios.put(
      `${BASE_URL}/reports/${reportId}/resolve`,
      data,
      authHeader(),
    );
    return res.data;
  } catch (error) {
    console.error("Error resolving report:", error);
    throw error;
  }
};

export const dismissReport = async (reportId, data) => {
  try {
    const res = await axios.put(
      `${BASE_URL}/reports/${reportId}/dismiss`,
      data,
      authHeader(),
    );
    return res.data;
  } catch (error) {
    console.error("Error dismissing report:", error);
    throw error;
  }
};

// Tickets
export const getAllTickets = async (params = {}) => {
  try {
    const res = await axios.get(`${BASE_URL}/tickets`, {
      ...authHeader(),
      params,
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching tickets:", error);
    throw error;
  }
};

export const getTicketDetails = async (ticketId) => {
  try {
    const res = await axios.get(
      `${BASE_URL}/tickets/${ticketId}`,
      authHeader(),
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching ticket details:", error);
    throw error;
  }
};

export const assignTicket = async (ticketId) => {
  try {
    const res = await axios.post(
      `${BASE_URL}/tickets/${ticketId}/assign`,
      {},
      authHeader(),
    );
    return res.data;
  } catch (error) {
    console.error("Error assigning ticket:", error);
    throw error;
  }
};

export const addTicketReply = async (ticketId, data) => {
  try {
    const res = await axios.post(
      `${BASE_URL}/tickets/${ticketId}/reply`,
      data,
      authHeader(),
    );
    return res.data;
  } catch (error) {
    console.error("Error adding ticket reply:", error);
    throw error;
  }
};

export const closeTicket = async (ticketId) => {
  try {
    const res = await axios.put(
      `${BASE_URL}/tickets/${ticketId}/close`,
      {},
      authHeader(),
    );
    return res.data;
  } catch (error) {
    console.error("Error closing ticket:", error);
    throw error;
  }
};

export const getTicketStats = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/tickets/stats`, authHeader());
    return res.data;
  } catch (error) {
    console.error("Error fetching ticket stats:", error);
    throw error;
  }
};

// ================= SUCCESS STORIES =================

// GET ALL
export const getSuccessStories = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/success-stories`, authHeader());

    // ✅ Ensure always return array
    return Array.isArray(res.data) ? res.data : res.data?.stories || [];
  } catch (error) {
    console.error("Error fetching success stories:", error);
    return []; // ✅ prevent crash
  }
};

// CREATE
export const createSuccessStory = async (formData) => {
  try {
    const res = await axios.post(`${BASE_URL}/success-stories`, formData, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  } catch (error) {
    console.error("Error creating success story:", error);
    throw error.response?.data || { message: "Create failed" };
  }
};

// UPDATE
export const updateSuccessStory = async (id, formData) => {
  try {
    const res = await axios.put(`${BASE_URL}/success-stories/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  } catch (error) {
    console.error("Error updating success story:", error);
    throw error.response?.data || { message: "Update failed" };
  }
};

// DELETE
export const deleteSuccessStory = async (id) => {
  try {
    const res = await axios.delete(
      `${BASE_URL}/success-stories/${id}`,
      authHeader(),
    );

    return res.data;
  } catch (error) {
    console.error("Error deleting success story:", error);
    throw error.response?.data || { message: "Delete failed" };
  }
};

// ================= IGNORED PROFILES =================

export const getIgnoredProfiles = async (params = {}) => {
  try {
    const res = await axios.get(`${BASE_URL}/interests/ignored`, {
      ...authHeader(),
      params,
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching ignored profiles:", error);
    throw error;
  }
};
