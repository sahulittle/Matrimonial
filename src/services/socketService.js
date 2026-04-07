/**
 * Socket.IO Service - Real-time communication
 */

import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5002";

let socket = null;
let eventListeners = {};

/**
 * Initialize socket connection
 */
export const initSocket = (userId, isAdmin = false) => {
  if (socket && socket.connected) {
    console.log("Socket already connected");
    return socket;
  }

  socket = io(SOCKET_URL, {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
    transports: ["websocket", "polling"],
  });

  socket.on("connect", () => {
    console.log("✅ Socket connected");

    // Join user's personal room on server (backend expects user:join/admin:join)
    if (isAdmin) {
      socket.emit("admin:join", { userId });
    } else {
      socket.emit("user:join", { userId });
      // Notify server that this user is online so status map/db can be updated
      socket.emit("user:online", { userId });
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected");
  });

  // Try to notify server explicitly before the page unloads
  const beforeUnloadHandler = () => {
    try {
      if (socket && socket.connected) {
        socket.emit("user:offline", { userId });
      }
    } catch (e) {
      /* ignore */
    }
  };

  window.addEventListener("beforeunload", beforeUnloadHandler);

  // cleanup removal when socket disconnects via disconnectSocket
  socket._beforeUnloadHandler = beforeUnloadHandler;

  socket.on("error", (error) => {
    console.error("Socket error:", error);
  });

  return socket;
};

/**
 * Disconnect socket
 */
export const disconnectSocket = () => {
  if (socket && socket.connected) {
    if (socket._beforeUnloadHandler) {
      window.removeEventListener("beforeunload", socket._beforeUnloadHandler);
      delete socket._beforeUnloadHandler;
    }
    socket.disconnect();
    socket = null;
  }
};

/**
 * Get socket instance
 */
export const getSocket = () => socket;

/**
 * Register custom event listener
 */
export const on = (event, callback) => {
  if (!socket) {
    console.warn("Socket not initialized");
    return;
  }

  if (!eventListeners[event]) {
    eventListeners[event] = [];
  }

  eventListeners[event].push(callback);
  socket.on(event, callback);
};

/**
 * Unregister event listener
 */
export const off = (event, callback) => {
  if (!socket) return;
  socket.off(event, callback);

  if (eventListeners[event]) {
    eventListeners[event] = eventListeners[event].filter(
      (cb) => cb !== callback,
    );
  }
};

/**
 * Emit event
 */
export const emit = (event, data) => {
  if (!socket || !socket.connected) {
    console.warn(`Socket not ready. Cannot emit: ${event}`);
    return;
  }
  socket.emit(event, data);
};

// =============== MESSAGING EVENTS ===============

export const sendMessage = (
  senderId,
  receiverId,
  content,
  attachments = [],
) => {
  emit("message:send", { senderId, receiverId, content, attachments });
};

export const onMessageReceived = (callback) => {
  on("message:receive", callback);
};

export const onMessageDelivered = (callback) => {
  on("message:delivered", callback);
};

export const sendTypingIndicator = (senderId, receiverId) => {
  emit("message:typing", { senderId, receiverId });
};

export const sendStopTyping = (senderId, receiverId) => {
  emit("message:stopTyping", { senderId, receiverId });
};

export const onTypingIndicator = (callback) => {
  on("message:typing", callback);
};

// =============== INTEREST EVENTS ===============

export const sendInterest = (senderId, receiverId, message = "") => {
  emit("interest:send", { senderId, receiverId, message });
};

export const onInterestReceived = (callback) => {
  on("interest:received", callback);
};

export const acceptInterest = (senderId, receiverId) => {
  emit("interest:accept", { senderId, receiverId });
};

export const rejectInterest = (receiverId) => {
  emit("interest:reject", { receiverId });
};

export const onInterestAccepted = (callback) => {
  on("interest:accepted", callback);
};

export const onInterestRejected = (callback) => {
  on("interest:rejected", callback);
};

// =============== MATCH EVENTS ===============

export const onMatchCreated = (callback) => {
  on("match:created", callback);
};

// =============== NOTIFICATION EVENTS ===============

export const sendNotification = (
  userId,
  type,
  title,
  message,
  relatedUserId,
) => {
  emit("notification:send", { userId, type, title, message, relatedUserId });
};

export const onNotificationReceived = (callback) => {
  on("notification:new", callback);
};

export const markNotificationRead = (notificationId) => {
  emit("notification:read", { notificationId });
};

// =============== VISITOR EVENTS ===============

export const notifyProfileView = (viewedUserId, visitingUserId) => {
  emit("profile:view", { viewedUserId, visitingUserId });
};

export const onVisitorNotified = (callback) => {
  on("visitor:new", callback);
};

// =============== USER STATUS EVENTS ===============

export const updateUserStatus = (userId, status) => {
  emit("user:status", { userId, status });
};

export const onUserStatusChanged = (callback) => {
  on("user:statusChange", callback);
};

export const onUserOnline = (callback) => {
  on("user:online", callback);
};

export const onUserOffline = (callback) => {
  on("user:offline", callback);
};

// =============== ADMIN EVENTS ===============

export const onNewReport = (callback) => {
  on("report:new", callback);
};

export const onNewTicket = (callback) => {
  on("ticket:new", callback);
};

export const reportCreated = (data) => {
  emit("report:created", data);
};

export const ticketCreated = (data) => {
  emit("ticket:created", data);
};

// =============== CLEANUP ===============

export const removeAllListeners = () => {
  Object.keys(eventListeners).forEach((event) => {
    eventListeners[event].forEach((callback) => {
      socket.off(event, callback);
    });
  });
  eventListeners = {};
};
