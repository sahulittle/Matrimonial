import React, { useEffect, useState, useRef } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/admin/Navbar";
import Sidebar from "../components/admin/Sidebar";
import toast from "react-hot-toast";
import { on, off } from "../services/socketService";

/**
 * AdminLayout - Layout wrapper for all admin pages
 * Contains admin Navbar + Sidebar + content area via Outlet
 */
const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const sidebarRef = useRef(null);
  useEffect(() => {
    // Ticket events
    const handleTicketNew = (data) => {
      toast.success("New ticket received");
      window.dispatchEvent(
        new CustomEvent("socket:ticket:new", { detail: data }),
      );
    };

    const handleTicketAssigned = (data) => {
      toast(`${data.assignedTo ? "Ticket assigned" : "Ticket updated"}`);
      window.dispatchEvent(
        new CustomEvent("socket:ticket:assigned", { detail: data }),
      );
    };

    const handleTicketReply = (data) => {
      toast.success("Ticket replied");
      window.dispatchEvent(
        new CustomEvent("socket:ticket:reply", { detail: data }),
      );
    };

    const handleTicketClosed = (data) => {
      toast.success("Ticket closed");
      window.dispatchEvent(
        new CustomEvent("socket:ticket:closed", { detail: data }),
      );
    };

    // Reports
    const handleReportNew = (data) => {
      toast.success("New report received");
      window.dispatchEvent(
        new CustomEvent("socket:report:new", { detail: data }),
      );
    };

    const handleReportResolved = (data) => {
      toast.success("Report updated");
      window.dispatchEvent(
        new CustomEvent("socket:report:resolved", { detail: data }),
      );
    };

    const handleReportDismissed = (data) => {
      toast.success("Report dismissed");
      window.dispatchEvent(
        new CustomEvent("socket:report:dismissed", { detail: data }),
      );
    };

    // Notifications
    const handleNotificationNew = (data) => {
      toast(`New notification`);
      window.dispatchEvent(
        new CustomEvent("socket:notification:new", { detail: data }),
      );
    };

    on("ticket:new", handleTicketNew);
    on("ticket:assigned", handleTicketAssigned);
    on("ticket:replyNotification", handleTicketReply);
    on("ticket:closedNotification", handleTicketClosed);
    on("report:new", handleReportNew);
    on("report:resolved", handleReportResolved);
    on("report:dismissed", handleReportDismissed);
    on("notification:new", handleNotificationNew);

    return () => {
      off("ticket:new", handleTicketNew);
      off("ticket:assigned", handleTicketAssigned);
      off("ticket:replyNotification", handleTicketReply);
      off("ticket:closedNotification", handleTicketClosed);
      off("report:new", handleReportNew);
      off("report:resolved", handleReportResolved);
      off("report:dismissed", handleReportDismissed);
      off("notification:new", handleNotificationNew);
    };
  }, []);

  // close on ESC
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") setSidebarOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar onHamburger={() => setSidebarOpen(true)} collapsed={collapsed} onToggleCollapse={() => setCollapsed((c) => !c)} />

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((c) => !c)}
        ref={sidebarRef}
      />

      {/* Overlay for mobile when sidebar open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <main className={`pt-24 ${collapsed ? "lg:pl-16" : "lg:pl-64"}`}>
        <div className="px-6 lg:px-8 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
