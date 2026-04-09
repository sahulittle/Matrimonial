/**
 * API Service - Base configuration and common request functions
 */

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5002/api";

/**
 * Generic fetch wrapper with error handling
 */
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  const config = {
    credentials: "include", // Send cookies with requests for session persistence
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  // Add auth token if available
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Request failed" }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error.message);
    throw error;
  }
};

export const api = {
  get: (endpoint) => apiRequest(endpoint, { method: "GET" }),
  post: (endpoint, data) =>
    apiRequest(endpoint, { method: "POST", body: JSON.stringify(data) }),
  put: (endpoint, data) =>
    apiRequest(endpoint, { method: "PUT", body: JSON.stringify(data) }),
  delete: (endpoint) => apiRequest(endpoint, { method: "DELETE" }),
};

// =============== USER AUTH API ===============
export const userAuthApi = {
  register: (data) => api.post("/users/auth/register", data),
  login: (email, password, captcha) =>
    api.post("/users/auth/login", { emailOrPhone: email, password, captcha }),
  getCaptcha: async () => {
    const url = `${API_BASE_URL}/users/auth/captcha`;
    const response = await fetch(url, {
      method: "GET",
      credentials: "include", // Send cookies with request
    });
    if (!response.ok) {
      throw new Error("Failed to load captcha");
    }
    // Return SVG text directly (not JSON)
    return await response.text();
  },
};

// =============== USER PROFILE API ===============
export const userProfileApi = {
  getProfile: () => api.get("/users/profile"),
  updateProfile: (data) => api.put("/users/profile", data),
  updateFamilyInfo: (data) => api.put("/users/profile/family", data),
  updatePreferences: (data) => api.put("/users/profile/preferences", data),
  addPhotos: (photoUrl) => api.post("/users/profile/photos", { photoUrl }),
  deletePhoto: (photoId) => api.delete(`/users/profile/photos/${photoId}`),
  changePassword: (currentPassword, newPassword) =>
    api.post("/users/profile/change-password", {
      currentPassword,
      newPassword,
    }),
  getNotificationPreferences: () =>
    api.get("/users/profile/notifications/preferences"),
  updateNotificationPreferences: (prefs) =>
    api.put("/users/profile/notifications/preferences", prefs),
};

// =============== SEARCH API ===============
export const searchApi = {
  searchProfiles: (filters, page = 1, limit = 10) => {
    const params = new URLSearchParams({ ...filters, page, limit });
    return api.get(`/users/search/search?${params}`);
  },
  getMatches: (page = 1, limit = 10) =>
    api.get(`/users/search/matches?page=${page}&limit=${limit}`),
  viewProfile: (profileId) => api.get(`/users/search/profile/${profileId}`),
  getVisitors: (page = 1, limit = 10) =>
    api.get(`/users/search/visitors?page=${page}&limit=${limit}`),
  blockUser: (blockedUserId) =>
    api.post("/users/search/block", { blockedUserId }),
  unblockUser: (blockedUserId) =>
    api.post("/users/search/unblock", { blockedUserId }),
  getBlockedUsers: () => api.get("/users/search/blocked-users"),
};

// =============== INTEREST API ===============
export const interestApi = {
  sendInterest: (receiverId, message = "") =>
    api.post("/users/interests/send", { receiverId, message }),
  getReceivedInterests: (status = "pending", page = 1, limit = 10) =>
    api.get(
      `/users/interests/received?status=${status}&page=${page}&limit=${limit}`,
    ),
  getSentInterests: (status = "pending", page = 1, limit = 10) =>
    api.get(
      `/users/interests/sent?status=${status}&page=${page}&limit=${limit}`,
    ),
  acceptInterest: (interestId) =>
    api.put(`/users/interests/${interestId}/accept`, {}),
  rejectInterest: (interestId) =>
    api.put(`/users/interests/${interestId}/reject`, {}),
  cancelInterest: (interestId) => api.delete(`/users/interests/${interestId}`),
};

// =============== MESSAGE API ===============
export const messageApi = {
  sendMessage: (receiverId, content, attachments = []) =>
    api.post("/users/messages/send", { receiverId, content, attachments }),
  editMessage: (messageId, content) =>
    api.put(`/users/messages/${messageId}`, { content }),
  sendMessageMultipart: async (receiverId, content, files = []) => {
    const url = `${API_BASE_URL}/users/messages/send`;
    const form = new FormData();
    form.append("receiverId", receiverId);
    form.append("content", content || "");
    files.forEach((file) => form.append("attachments", file));

    const token = localStorage.getItem("authToken");

    const res = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: token
        ? {
          Authorization: `Bearer ${token}`,
        }
        : {},
      body: form,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Upload failed' }));
      throw new Error(err.message || 'Upload failed');
    }

    return await res.json();
  },
  getMessages: (otherUserId, page = 1, limit = 20) =>
    api.get(
      `/users/messages?otherUserId=${otherUserId}&page=${page}&limit=${limit}`,
    ),
  getConversations: () => api.get("/users/messages/conversations"),
  deleteMessage: (messageId) => api.delete(`/users/messages/${messageId}`),
  markAsRead: (messageId) => api.put(`/users/messages/${messageId}/read`, {}),
};

// =============== NOTIFICATION API ===============
export const notificationApi = {
  getNotifications: (page = 1, limit = 20, isRead = null) => {
    let url = `/users/notifications?page=${page}&limit=${limit}`;
    if (isRead !== null) url += `&isRead=${isRead}`;
    return api.get(url);
  },
  markAsRead: (notificationId) =>
    api.put(`/users/notifications/${notificationId}/read`, {}),
  markAllAsRead: () => api.put("/users/notifications/read-all", {}),
  deleteNotification: (notificationId) =>
    api.delete(`/users/notifications/${notificationId}`),
  getUnreadCount: () => api.get("/users/notifications/unread/count"),
};

// =============== SHORTLIST API ===============
export const shortlistApi = {
  addToShortlist: (profileId) =>
    api.post("/users/shortlist/add", { profileId }),
  removeFromShortlist: (profileId) =>
    api.post("/users/shortlist/remove", { profileId }),
  getShortlist: (page = 1, limit = 10) =>
    api.get(`/users/shortlist?page=${page}&limit=${limit}`),
  ignoreProfile: (profileId) =>
    api.post("/users/shortlist/ignore", { profileId }),
  reportUser: (reportedUserId, reason, description) =>
    api.post("/users/shortlist/report", {
      reportedUserId,
      reason,
      description,
    }),
};

// =============== PAYMENT API ===============
export const paymentApi = {
  getPackages: () => api.get("/users/payments/packages"),
  createPaymentIntent: (packageId, paymentMethod) =>
    api.post("/users/payments/create-intent", { packageId, paymentMethod }),
  confirmPayment: (paymentId, transactionId) =>
    api.post("/users/payments/confirm", { paymentId, transactionId }),
  getPaymentHistory: (page = 1, limit = 10) =>
    api.get(`/users/payments/history?page=${page}&limit=${limit}`),
  getCurrentSubscription: () => api.get("/users/payments/subscription"),
  cancelSubscription: () => api.post("/users/payments/subscription/cancel", {}),
};

// =============== TICKET API ===============
export const ticketApi = {
  createTicket: (subject, description, priority = "Medium") =>
    api.post("/users/tickets", { subject, details: description, priority }),
  getTickets: (status = null, page = 1, limit = 10) => {
    let url = `/users/tickets?page=${page}&limit=${limit}`;
    if (status) url += `&status=${status}`;
    return api.get(url);
  },
  getTicketDetails: (ticketId) => api.get(`/users/tickets/${ticketId}`),
  addReply: (ticketId, message, attachments = []) =>
    api.post(`/users/tickets/${ticketId}/reply`, { message, attachments }),
  closeTicket: (ticketId) => api.put(`/users/tickets/${ticketId}/close`, {}),
};

// =============== ADMIN AUTH API ===============
export const adminAuthApi = {
  login: (email, password) => api.post("/admin/login", { email, password }),
};

// =============== ADMIN DASHBOARD API ===============
export const adminDashboardApi = {
  getStats: () => api.get("/admin/dashboard/stats"),
  getGraphData: () => api.get("/admin/dashboard/graph-data"),
};

// =============== ADMIN USER API ===============
export const adminUserApi = {
  getAllUsers: (
    role = "user",
    status = "all",
    search = "",
    page = 1,
    limit = 20,
  ) => {
    let url = `/admin/users?role=${role}&status=${status}&page=${page}&limit=${limit}`;
    if (search) url += `&search=${search}`;
    return api.get(url);
  },
  getUserDetails: (userId) => api.get(`/admin/users/${userId}`),
  banUser: (userId, reason) =>
    api.post(`/admin/users/${userId}/ban`, { reason }),
  unbanUser: (userId) => api.post(`/admin/users/${userId}/unban`, {}),
  deactivateUser: (userId) => api.post(`/admin/users/${userId}/deactivate`, {}),
  activateUser: (userId) => api.post(`/admin/users/${userId}/activate`, {}),
  verifyEmail: (userId) => api.post(`/admin/users/${userId}/verify-email`, {}),
  verifyPhone: (userId) => api.post(`/admin/users/${userId}/verify-phone`, {}),
  verifyKYC: (userId) => api.post(`/admin/users/${userId}/verify-kyc`, {}),
  addNotes: (userId, notes) =>
    api.put(`/admin/users/${userId}/notes`, { notes }),
  deleteUser: (userId) => api.delete(`/admin/users/${userId}`),
};

// =============== ADMIN PAYMENT API ===============
export const adminPaymentApi = {
  getAllPayments: (status = "all", userId = "", page = 1, limit = 20) => {
    let url = `/admin/payments?status=${status}&page=${page}&limit=${limit}`;
    if (userId) url += `&userId=${userId}`;
    return api.get(url);
  },
  getPaymentDetails: (paymentId) => api.get(`/admin/payments/${paymentId}`),
  markPaymentCompleted: (paymentId) =>
    api.post(`/admin/payments/${paymentId}/complete`, {}),
  refundPayment: (paymentId) =>
    api.post(`/admin/payments/${paymentId}/refund`, {}),
  getPaymentStats: () => api.get("/admin/payments/stats"),
  createPackage: (data) => api.post("/admin/packages", data),
  getAllPackages: () => api.get("/admin/packages"),
  updatePackage: (packageId, data) =>
    api.put(`/admin/packages/${packageId}`, data),
  deletePackage: (packageId) => api.delete(`/admin/packages/${packageId}`),
};

// =============== ADMIN REPORT API ===============
export const adminReportApi = {
  getAllReports: (status = "all", page = 1, limit = 20) =>
    api.get(`/admin/reports?status=${status}&page=${page}&limit=${limit}`),
  getReportDetails: (reportId) => api.get(`/admin/reports/${reportId}`),
  resolveReport: (reportId, adminNotes, action) =>
    api.put(`/admin/reports/${reportId}/resolve`, { adminNotes, action }),
  dismissReport: (reportId, adminNotes) =>
    api.put(`/admin/reports/${reportId}/dismiss`, { adminNotes }),
};

// =============== ADMIN TICKET API ===============
export const adminTicketApi = {
  getAllTickets: (status = "all", category = "", page = 1, limit = 20) => {
    let url = `/admin/tickets?status=${status}&page=${page}&limit=${limit}`;
    if (category) url += `&category=${category}`;
    return api.get(url);
  },
  getTicketDetails: (ticketId) => api.get(`/admin/tickets/${ticketId}`),
  assignTicket: (ticketId) => api.post(`/admin/tickets/${ticketId}/assign`, {}),
  addAdminReply: (ticketId, message, attachments = []) =>
    api.post(`/admin/tickets/${ticketId}/reply`, { message, attachments }),
  closeTicket: (ticketId) => api.put(`/admin/tickets/${ticketId}/close`, {}),
  getTicketStats: () => api.get("/admin/tickets/stats"),
};

// =============== ADMIN RELIGION API ===============
export const adminReligionApi = {
  list: () => api.get('/admin/religions'),
  create: (name) => api.post('/admin/religions', { name }),
  remove: (id) => api.delete(`/admin/religions/${id}`),
};

// =============== ADMIN PAGES API ===============
// Provides simple endpoints for dynamic page content like the About page
export const adminPagesApi = {
  // Expecting a GET returning { content: '...' } or similar
  getAbout: () => api.get('/admin/pages/about'),
  // Update about page content: { content }
  updateAbout: (content) => api.put('/admin/pages/about', { content }),
};

// =============== USER DATA API ===============
export const userDataApi = {
  getReligions: () => api.get('/users/religions'),
};

// =============== ADMIN SETTINGS API ===============
export const adminSettingsApi = {
  list: () => api.get('/admin/settings'),
  update: (data) => api.put('/admin/settings', data),
};

export default api;
