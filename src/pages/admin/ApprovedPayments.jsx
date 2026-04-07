import React, { useState, useEffect } from "react";
import { FiSearch, FiEye, FiX } from "react-icons/fi";
import { getAllPayments } from "../../api/adminApi/adminApi";

// Helper to format date and calculate relative time
const formatInitiated = (isoDate) => {
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
  const diffInMonths = Math.floor(diffInDays / 30.44);
  const diffInYears = Math.floor(diffInDays / 365.25);

  let relativeTime = "just now";
  if (diffInYears > 0) {
    relativeTime = `${diffInYears} year${diffInYears > 1 ? "s" : ""} ago`;
  } else if (diffInMonths > 0) {
    relativeTime = `${diffInMonths} month${diffInMonths > 1 ? "s" : ""} ago`;
  } else if (diffInDays > 0) {
    relativeTime = `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  }

  return {
    full: `${formattedDate} ${formattedTime}`,
    relative: relativeTime,
  };
};

const ApprovedPayments = () => {
  const [usernameSearch, setUsernameSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const paymentsPerPage = 15;

  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getAllPayments({
          status: "success",
          page: 1,
          limit: 200,
        });
        setPayments(res.payments || []);
      } catch (err) {
        console.error("Error loading approved payments:", err);
      }
    };
    fetch();
  }, []);

  const filteredPayments = payments.filter((payment) => {
    const userName =
      `${payment.userId?.firstName || ""} ${payment.userId?.lastName || ""}`.toLowerCase();
    const username =
      payment.userId?.username || payment.userId?.email?.split("@")[0] || "";
    const userMatch =
      userName.includes(usernameSearch.toLowerCase()) ||
      username.includes(usernameSearch.toLowerCase());

    const paymentDate = new Date(payment.createdAt || payment.initiated);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    if (start) start.setHours(0, 0, 0, 0);
    if (end) end.setHours(23, 59, 59, 999);

    const dateMatch =
      (!start || paymentDate >= start) && (!end || paymentDate <= end);

    return userMatch && dateMatch;
  });

  // Pagination logic
  const indexOfLastPayment = currentPage * paymentsPerPage;
  const indexOfFirstPayment = indexOfLastPayment - paymentsPerPage;
  const currentPayments = filteredPayments.slice(
    indexOfFirstPayment,
    indexOfLastPayment,
  );
  const totalPages = Math.ceil(filteredPayments.length / paymentsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const openModal = (payment) => {
    setSelectedPayment(payment);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPayment(null);
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h4 className="text-2xl font-bold text-gray-800">Approved Payments</h4>
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

      {/* Payments Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase">
                Gateway | Transaction
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase">
                Initiated
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase">
                User
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase">
                Amount
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase">
                Conversion
              </th>
              <th className="py-3 px-4 text-center text-sm font-semibold text-gray-600 uppercase">
                Status
              </th>
              <th className="py-3 px-4 text-center text-sm font-semibold text-gray-600 uppercase">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {currentPayments.map((payment) => {
              const initiatedTime = formatInitiated(payment.initiated);
              return (
                <tr
                  key={payment.id}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="py-3 px-4">
                    <p className="font-medium text-gray-800">
                      {payment.gateway}
                    </p>
                    <p className="text-sm text-gray-500">
                      {payment.transactionId}
                    </p>
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-medium">{initiatedTime.full}</p>
                    <p className="text-sm text-gray-500">
                      {initiatedTime.relative}
                    </p>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <img
                        src={payment.user.avatar}
                        alt={payment.user.name}
                        className="w-10 h-10 rounded-full mr-4"
                      />
                      <div>
                        <p className="font-medium text-gray-800">
                          {payment.user.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          @{payment.user.username}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-bold text-gray-800">₹{payment.amount}</p>
                  </td>
                  <td className="py-3 px-4">{payment.conversion}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                      {payment.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => openModal(payment)}
                      className="flex items-center justify-center mx-auto bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600"
                    >
                      <FiEye className="mr-1" /> Details
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

      {/* Details Modal */}
      {isModalOpen && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
            <div className="flex justify-between items-center mb-4 border-b pb-4">
              <h4 className="text-xl font-bold text-gray-800">
                Payment Details
              </h4>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-800"
              >
                <FiX size={24} />
              </button>
            </div>
            <div className="space-y-3">
              {Object.entries(selectedPayment.details).map(([key, value]) => (
                <div key={key} className="flex justify-between border-b py-2">
                  <p className="font-semibold text-gray-600">{key}</p>
                  <p className="text-gray-800 text-right">{value}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={closeModal}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovedPayments;
