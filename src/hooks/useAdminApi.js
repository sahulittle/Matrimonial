/**
 * Admin API Hooks
 */

import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import {
  adminDashboardApi,
  adminUserApi,
  adminPaymentApi,
  adminReportApi,
  adminTicketApi,
} from "../services/api";

// =============== DASHBOARD HOOK ===============
export const useDashboard = () => {
  const [stats, setStats] = useState(null);
  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(false);

  const getStats = useCallback(async () => {
    try {
      setLoading(true);
      const response = await adminDashboardApi.getStats();
      setStats(response.stats);
      return response.stats;
    } catch (error) {
      toast.error(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const getGraphData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await adminDashboardApi.getGraphData();
      setGraphData(response.data);
      return response.data;
    } catch (error) {
      toast.error(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return { stats, graphData, loading, getStats, getGraphData };
};

// =============== USER MANAGEMENT HOOK ===============
export const useAdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });

  const getAllUsers = useCallback(
    async (role = "user", status = "all", search = "", page = 1) => {
      try {
        setLoading(true);
        const response = await adminUserApi.getAllUsers(
          role,
          status,
          search,
          page,
        );
        setUsers(response.users);
        setPagination(response.pagination);
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

  const getUserDetails = useCallback(async (userId) => {
    try {
      const response = await adminUserApi.getUserDetails(userId);
      return response.user;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  }, []);

  const banUser = useCallback(async (userId, reason) => {
    try {
      const response = await adminUserApi.banUser(userId, reason);
      toast.success("User banned successfully");
      return response.user;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  }, []);

  const unbanUser = useCallback(async (userId) => {
    try {
      const response = await adminUserApi.unbanUser(userId);
      toast.success("User unbanned successfully");
      return response.user;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  }, []);

  const verifyEmail = useCallback(async (userId) => {
    try {
      await adminUserApi.verifyEmail(userId);
      toast.success("Email verified");
    } catch (error) {
      toast.error(error.message);
    }
  }, []);

  const verifyPhone = useCallback(async (userId) => {
    try {
      await adminUserApi.verifyPhone(userId);
      toast.success("Phone verified");
    } catch (error) {
      toast.error(error.message);
    }
  }, []);

  const verifyKYC = useCallback(async (userId) => {
    try {
      await adminUserApi.verifyKYC(userId);
      toast.success("KYC verified");
    } catch (error) {
      toast.error(error.message);
    }
  }, []);

  const addNotes = useCallback(async (userId, notes) => {
    try {
      await adminUserApi.addNotes(userId, notes);
      toast.success("Notes added");
    } catch (error) {
      toast.error(error.message);
    }
  }, []);

  const deleteUser = useCallback(async (userId) => {
    try {
      await adminUserApi.deleteUser(userId);
      toast.success("User deleted");
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (error) {
      toast.error(error.message);
    }
  }, []);

  return {
    users,
    loading,
    pagination,
    getAllUsers,
    getUserDetails,
    banUser,
    unbanUser,
    verifyEmail,
    verifyPhone,
    verifyKYC,
    addNotes,
    deleteUser,
  };
};

// =============== PAYMENT MANAGEMENT HOOK ===============
export const useAdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [packages, setPackages] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });

  const getAllPayments = useCallback(
    async (status = "all", userId = "", page = 1) => {
      try {
        setLoading(true);
        const response = await adminPaymentApi.getAllPayments(
          status,
          userId,
          page,
        );
        setPayments(response.payments);
        setPagination(response.pagination);
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

  const getAllPackages = useCallback(async () => {
    try {
      setLoading(true);
      const response = await adminPaymentApi.getAllPackages();
      setPackages(response.packages);
      return response.packages;
    } catch (error) {
      toast.error(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const createPackage = useCallback(async (data) => {
    try {
      const response = await adminPaymentApi.createPackage(data);
      setPackages((prev) => [...prev, response.package]);
      toast.success("Package created successfully");
      return response.package;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  }, []);

  const updatePackage = useCallback(async (packageId, data) => {
    try {
      const response = await adminPaymentApi.updatePackage(packageId, data);
      setPackages((prev) =>
        prev.map((p) => (p._id === packageId ? response.package : p)),
      );
      toast.success("Package updated successfully");
      return response.package;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  }, []);

  const deletePackage = useCallback(async (packageId) => {
    try {
      await adminPaymentApi.deletePackage(packageId);
      setPackages((prev) => prev.filter((p) => p._id !== packageId));
      toast.success("Package deleted successfully");
    } catch (error) {
      toast.error(error.message);
    }
  }, []);

  const markPaymentCompleted = useCallback(async (paymentId) => {
    try {
      await adminPaymentApi.markPaymentCompleted(paymentId);
      toast.success("Payment marked as completed");
    } catch (error) {
      toast.error(error.message);
    }
  }, []);

  const refundPayment = useCallback(async (paymentId) => {
    try {
      await adminPaymentApi.refundPayment(paymentId);
      toast.success("Payment refunded");
    } catch (error) {
      toast.error(error.message);
    }
  }, []);

  const getPaymentStats = useCallback(async () => {
    try {
      const response = await adminPaymentApi.getPaymentStats();
      setStats(response.stats);
      return response.stats;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  }, []);

  return {
    payments,
    packages,
    stats,
    loading,
    pagination,
    getAllPayments,
    getAllPackages,
    createPackage,
    updatePackage,
    deletePackage,
    markPaymentCompleted,
    refundPayment,
    getPaymentStats,
  };
};

// =============== REPORT MANAGEMENT HOOK ===============
export const useAdminReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });

  const getAllReports = useCallback(async (status = "all", page = 1) => {
    try {
      setLoading(true);
      const response = await adminReportApi.getAllReports(status, page);
      setReports(response.reports);
      setPagination(response.pagination);
      return response;
    } catch (error) {
      toast.error(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const getReportDetails = useCallback(async (reportId) => {
    try {
      const response = await adminReportApi.getReportDetails(reportId);
      return response.report;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  }, []);

  const resolveReport = useCallback(async (reportId, adminNotes, action) => {
    try {
      const response = await adminReportApi.resolveReport(
        reportId,
        adminNotes,
        action,
      );
      toast.success("Report resolved");
      return response.report;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  }, []);

  const dismissReport = useCallback(async (reportId, adminNotes) => {
    try {
      const response = await adminReportApi.dismissReport(reportId, adminNotes);
      toast.success("Report dismissed");
      return response.report;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  }, []);

  return {
    reports,
    loading,
    pagination,
    getAllReports,
    getReportDetails,
    resolveReport,
    dismissReport,
  };
};

// =============== TICKET MANAGEMENT HOOK ===============
export const useAdminTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });

  const getAllTickets = useCallback(
    async (status = "all", category = "", page = 1) => {
      try {
        setLoading(true);
        const response = await adminTicketApi.getAllTickets(
          status,
          category,
          page,
        );
        setTickets(response.tickets);
        setPagination(response.pagination);
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

  const getTicketDetails = useCallback(async (ticketId) => {
    try {
      const response = await adminTicketApi.getTicketDetails(ticketId);
      return response.ticket;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  }, []);

  const assignTicket = useCallback(async (ticketId) => {
    try {
      const response = await adminTicketApi.assignTicket(ticketId);
      toast.success("Ticket assigned");
      return response.ticket;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  }, []);

  const addAdminReply = useCallback(
    async (ticketId, message, attachments = []) => {
      try {
        const response = await adminTicketApi.addAdminReply(
          ticketId,
          message,
          attachments,
        );
        toast.success("Reply added");
        return response.ticket;
      } catch (error) {
        toast.error(error.message);
        throw error;
      }
    },
    [],
  );

  const closeTicket = useCallback(async (ticketId) => {
    try {
      const response = await adminTicketApi.closeTicket(ticketId);
      toast.success("Ticket closed");
      return response.ticket;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  }, []);

  const getTicketStats = useCallback(async () => {
    try {
      const response = await adminTicketApi.getTicketStats();
      setStats(response.stats);
      return response.stats;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  }, []);

  return {
    tickets,
    stats,
    loading,
    pagination,
    getAllTickets,
    getTicketDetails,
    assignTicket,
    addAdminReply,
    closeTicket,
    getTicketStats,
  };
};
