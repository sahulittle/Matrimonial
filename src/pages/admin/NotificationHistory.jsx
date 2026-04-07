import React, { useEffect, useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import { notificationApi } from "../../services/api";

const NotificationHistory = () => {
  const [notifications, setNotifications] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const load = async (p = 1) => {
    try {
      setLoading(true);
      const res = await notificationApi.getNotifications(p, limit);
      setNotifications(res.notifications || res.data || []);
      setPage(res.pagination?.page || p);
      setTotalPages(res.pagination?.pages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(1);

    const handleSocketNew = (e) => {
      const data = e.detail;
      // prepend incoming notification
      setNotifications((prev) => [data.notification || data, ...prev]);
    };

    window.addEventListener("socket:notification:new", handleSocketNew);
    return () =>
      window.removeEventListener("socket:notification:new", handleSocketNew);
  }, []);

  const markAsRead = async (id) => {
    try {
      await notificationApi.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)),
      );
    } catch (err) {
      console.error(err);
    }
  };

  const remove = async (id) => {
    try {
      await notificationApi.deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const markAll = async () => {
    try {
      await notificationApi.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-2xl font-bold">Notification History</h4>
        <div className="flex items-center gap-2">
          <button
            onClick={() => load(1)}
            className="px-3 py-2 bg-gray-100 rounded"
          >
            Refresh
          </button>
          <button
            onClick={markAll}
            className="px-3 py-2 bg-blue-600 text-white rounded"
          >
            Mark all read
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left">Message</th>
              <th className="py-3 px-4 text-left">Date</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={4} className="p-4 text-center">
                  Loading...
                </td>
              </tr>
            )}
            {!loading && notifications.length === 0 && (
              <tr>
                <td colSpan={4} className="p-4 text-center">
                  No notifications
                </td>
              </tr>
            )}
            {notifications.map((n) => (
              <tr
                key={n._id}
                className={`border-b hover:bg-gray-50 ${n.isRead ? "" : "bg-white"}`}
              >
                <td className="py-3 px-4">
                  {n.message || n.title || JSON.stringify(n.payload || {})}
                </td>
                <td className="py-3 px-4">
                  {new Date(
                    n.createdAt || n.created_at || n.date,
                  ).toLocaleString()}
                </td>
                <td className="py-3 px-4">{n.isRead ? "Read" : "Unread"}</td>
                <td className="py-3 px-4">
                  {!n.isRead && (
                    <button
                      onClick={() => markAsRead(n._id)}
                      className="mr-2 px-2 py-1 bg-green-600 text-white rounded"
                    >
                      Mark read
                    </button>
                  )}
                  <button
                    onClick={() => remove(n._id)}
                    className="px-2 py-1 bg-red-100 text-red-600 rounded flex items-center gap-2"
                  >
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center items-center mt-6 gap-2">
        <button
          disabled={page <= 1}
          onClick={() => load(page - 1)}
          className="px-3 py-2 border rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => load(page + 1)}
          className="px-3 py-2 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default NotificationHistory;
