/**
 * Custom React Hooks for API calls
 */

import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import {
  searchApi,
  interestApi,
  messageApi,
  notificationApi,
  shortlistApi,
  paymentApi,
  ticketApi,
} from "../services/api";

// =============== SEARCH HOOK ===============
export const useSearch = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });

  const searchProfiles = useCallback(async (filters, page = 1, limit = 10) => {
    try {
      setLoading(true);
      const response = await searchApi.searchProfiles(filters, page, limit);
      setProfiles(response.profiles);
      setPagination(response.pagination);
      return response;
    } catch (error) {
      toast.error(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const getMatches = useCallback(async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      const response = await searchApi.getMatches(page, limit);
      setProfiles(response.matches);
      setPagination(response.pagination);
      return response;
    } catch (error) {
      toast.error(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const viewProfile = useCallback(async (profileId) => {
    try {
      const response = await searchApi.viewProfile(profileId);
      return response.profile;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  }, []);

  return {
    profiles,
    loading,
    pagination,
    searchProfiles,
    getMatches,
    viewProfile,
  };
};

// =============== INTEREST HOOK ===============
export const useInterest = () => {
  const [interests, setInterests] = useState({ sent: [], received: [] });
  const [loading, setLoading] = useState(false);

  const getReceivedInterests = useCallback(
    async (status = "pending", page = 1) => {
      try {
        setLoading(true);
        const response = await interestApi.getReceivedInterests(status, page);
        setInterests((prev) => ({ ...prev, received: response.interests }));
        return response;
      } catch (error) {
        toast.error(error.message);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const getSentInterests = useCallback(async (status = "pending", page = 1) => {
    try {
      setLoading(true);
      const response = await interestApi.getSentInterests(status, page);
      setInterests((prev) => ({ ...prev, sent: response.interests }));
      return response;
    } catch (error) {
      toast.error(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const sendInterest = useCallback(async (receiverId, message = "") => {
    try {
      const response = await interestApi.sendInterest(receiverId, message);
      toast.success("Interest sent successfully");
      return response.interest;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  }, []);

  const acceptInterest = useCallback(async (interestId) => {
    try {
      const response = await interestApi.acceptInterest(interestId);
      toast.success("Interest accepted");
      return response.interest;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  }, []);

  const rejectInterest = useCallback(async (interestId) => {
    try {
      await interestApi.rejectInterest(interestId);
      toast.success("Interest rejected");
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  }, []);

  return {
    interests,
    loading,
    getReceivedInterests,
    getSentInterests,
    sendInterest,
    acceptInterest,
    rejectInterest,
  };
};

// =============== MESSAGE HOOK ===============
export const useMessages = () => {
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);

  const getMessages = useCallback(async (otherUserId, page = 1) => {
    try {
      setLoading(true);
      const response = await messageApi.getMessages(otherUserId, page);
      setMessages(response.messages);
      return response;
    } catch (error) {
      toast.error(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const getConversations = useCallback(async () => {
    try {
      setLoading(true);
      const response = await messageApi.getConversations();
      setConversations(response.conversations);
      return response.conversations;
    } catch (error) {
      toast.error(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const sendMessage = useCallback(
    async (receiverId, content, attachments = []) => {
      try {
        const response = await messageApi.sendMessage(
          receiverId,
          content,
          attachments,
        );
        setMessages((prev) => [...prev, response.data]);
        return response.data;
      } catch (error) {
        toast.error(error.message);
        throw error;
      }
    },
    [],
  );

  return {
    messages,
    conversations,
    loading,
    getMessages,
    getConversations,
    sendMessage,
  };
};

// =============== NOTIFICATION HOOK ===============
export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const getNotifications = useCallback(async (page = 1, isRead = null) => {
    try {
      setLoading(true);
      const response = await notificationApi.getNotifications(page, 20, isRead);
      setNotifications(response.notifications);
      return response;
    } catch (error) {
      toast.error(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const getUnreadCount = useCallback(async () => {
    try {
      const response = await notificationApi.getUnreadCount();
      setUnreadCount(response.unreadCount);
      return response.unreadCount;
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  }, []);

  const markAsRead = useCallback(async (notificationId) => {
    try {
      await notificationApi.markAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === notificationId ? { ...n, isRead: true } : n,
        ),
      );
    } catch (error) {
      toast.error(error.message);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await notificationApi.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      toast.error(error.message);
    }
  }, []);

  return {
    notifications,
    unreadCount,
    loading,
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
  };
};

// =============== SHORTLIST HOOK ===============
export const useShortlist = () => {
  const [shortlist, setShortlist] = useState([]);
  const [loading, setLoading] = useState(false);

  const getShortlist = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const response = await shortlistApi.getShortlist(page);
      setShortlist(response.shortlist);
      return response;
    } catch (error) {
      toast.error(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const addToShortlist = useCallback(async (profileId) => {
    try {
      await shortlistApi.addToShortlist(profileId);
      toast.success("Added to shortlist");
    } catch (error) {
      toast.error(error.message);
    }
  }, []);

  const removeFromShortlist = useCallback(async (profileId) => {
    try {
      await shortlistApi.removeFromShortlist(profileId);
      setShortlist((prev) => prev.filter((p) => p._id !== profileId));
      toast.success("Removed from shortlist");
    } catch (error) {
      toast.error(error.message);
    }
  }, []);

  const reportUser = useCallback(
    async (reportedUserId, reason, description) => {
      try {
        await shortlistApi.reportUser(reportedUserId, reason, description);
        toast.success("Report submitted successfully");
      } catch (error) {
        toast.error(error.message);
      }
    },
    [],
  );

  return {
    shortlist,
    loading,
    getShortlist,
    addToShortlist,
    removeFromShortlist,
    reportUser,
  };
};

// =============== PAYMENT HOOK ===============
export const usePayment = () => {
  const [packages, setPackages] = useState([]);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [loading, setLoading] = useState(false);

  const getPackages = useCallback(async () => {
    try {
      setLoading(true);
      const response = await paymentApi.getPackages();
      setPackages(response.packages);
      return response.packages;
    } catch (error) {
      toast.error(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const getCurrentSubscription = useCallback(async () => {
    try {
      const response = await paymentApi.getCurrentSubscription();
      setCurrentSubscription(response.subscription);
      return response.subscription;
    } catch (error) {
      console.error("Error fetching subscription:", error);
    }
  }, []);

  const createPaymentIntent = useCallback(async (packageId, paymentMethod) => {
    try {
      const response = await paymentApi.createPaymentIntent(
        packageId,
        paymentMethod,
      );
      return response;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  }, []);

  const confirmPayment = useCallback(async (paymentId, transactionId) => {
    try {
      const response = await paymentApi.confirmPayment(
        paymentId,
        transactionId,
      );
      toast.success("Payment successful");
      return response;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  }, []);

  return {
    packages,
    currentSubscription,
    loading,
    getPackages,
    getCurrentSubscription,
    createPaymentIntent,
    confirmPayment,
  };
};

// =============== TICKET HOOK ===============
export const useTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);

  const getTickets = useCallback(async (status = null, page = 1) => {
    try {
      setLoading(true);
      const response = await ticketApi.getTickets(status, page);
      setTickets(response.tickets);
      return response;
    } catch (error) {
      toast.error(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const createTicket = useCallback(async (subject, description, category) => {
    try {
      const response = await ticketApi.createTicket(
        subject,
        description,
        category,
      );
      toast.success("Ticket created successfully");
      return response.ticket;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  }, []);

  const addReply = useCallback(async (ticketId, message, attachments = []) => {
    try {
      const response = await ticketApi.addReply(ticketId, message, attachments);
      return response.ticket;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  }, []);

  const closeTicket = useCallback(async (ticketId) => {
    try {
      await ticketApi.closeTicket(ticketId);
      toast.success("Ticket closed");
    } catch (error) {
      toast.error(error.message);
    }
  }, []);

  return { tickets, loading, getTickets, createTicket, addReply, closeTicket };
};
