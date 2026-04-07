import React, { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { adminUserApi } from "../../services/api";
import { useNavigate } from "react-router-dom";

// Helper to format date and calculate relative time
const formatDate = (isoDate) => {
  const date = new Date(isoDate);
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));

  let relativeTime = "just now";
  if (diffInDays > 0) {
    relativeTime = `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  } else if (diffInHours > 0) {
    relativeTime = `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  }

  return {
    full: `${formattedDate} ${formattedTime}`,
    relative: relativeTime,
  };
};

const LoginHistory = () => {
  const [usernameSearch, setUsernameSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 15;

  const [loginHistory, setLoginHistory] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchHistory = async (page = 1) => {
    try {
      setLoading(true);
      const res = await adminUserApi.getAllUsers(
        "user",
        "all",
        usernameSearch,
        page,
        logsPerPage,
      );
      // API expected to return users with lastLoginAt and loginCount
      setLoginHistory(res.users || []);
      setTotalPages(res.pagination?.pages || 1);
      setCurrentPage(res.pagination?.page || page);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // refetch when search changes
    const t = setTimeout(() => fetchHistory(1), 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usernameSearch]);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    fetchHistory(pageNumber);
  };

  const navigate = useNavigate();

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h4 className="text-2xl font-bold text-gray-800">User Login History</h4>
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search by username..."
              value={usernameSearch}
              onChange={(e) => {
                setUsernameSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 border rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <span>-</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 border rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
        </div>
      </div>

      {/* Login History Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase">
                User
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase">
                Last Login
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase">
                Login Count
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase">
                Email
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {loading && (
              <tr>
                <td colSpan={5} className="p-4 text-center">
                  Loading...
                </td>
              </tr>
            )}
            {!loading && loginHistory.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-center">
                  No records found
                </td>
              </tr>
            )}
            {loginHistory.map((user) => {
              const loginTime = user.lastLoginAt
                ? formatDate(user.lastLoginAt)
                : { full: "Never", relative: "" };
              return (
                <tr
                  key={user._id}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <img
                        src={
                          user.profilePhoto ||
                          user.image ||
                          `https://i.pravatar.cc/150?u=${user._id}`
                        }
                        alt={user.firstName}
                        className="w-10 h-10 rounded-full mr-4"
                      />
                      <div>
                        <p className="font-medium text-gray-800">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-sm text-gray-500">
                          @{user.username || user.email?.split("@")[0]}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-medium">{loginTime.full}</p>
                    <p className="text-sm text-gray-500">
                      {loginTime.relative}
                    </p>
                  </td>
                  <td className="py-3 px-4">{user.loginCount || 0}</td>
                  <td className="py-3 px-4">{user.email}</td>
                  <td className="py-3 px-4">
                    <button
                      className="px-3 py-1 bg-blue-600 text-white rounded"
                      onClick={() =>
                        navigate(`/admin/users/detail/${user._id}`)
                      }
                    >
                      View
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 mx-1 border rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 mx-1 border rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default LoginHistory;
