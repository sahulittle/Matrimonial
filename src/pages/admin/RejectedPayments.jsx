import React, { useState, useEffect } from "react";
import { FiSearch, FiEye, FiX } from "react-icons/fi";
import { getAllPayments } from "../../api/adminApi/adminApi";
import { getAvatarFallback } from "../../utils/avatar";

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

const RejectedPayments = () => {
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
          status: "failed",
          page: 1,
          limit: 200,
        });
        const mapped = (res.payments || []).map((p) => ({
          ...p,
          id: p._id,
          gateway: p.paymentMethod || "Unknown",
          initiated: p.createdAt,
          user: {
            name: p.userId?.fullName || "Deleted User",
            username: p.userId?.email || "deleted",
            avatar: p.userId?.profilePhoto || p.userId?.image || getAvatarFallback(p.userId?.gender),
          },
          details: p.metadata || {
            "Transaction ID": p.transactionId || "",
            "Order ID": p.ccavenueOrderId || "",
            Amount: `₹${p.amount}`,
            Status: p.status,
            Reason: p.description || "No details provided",
          },
        }));
        setPayments(mapped);
      } catch (err) {
        console.error("Error loading rejected payments:", err);
      }
    };
    fetch();
  }, []);

  const filteredPayments = payments.filter((payment) => {
    const userMatch =
      (payment.user?.name || "")
        .toLowerCase()
        .includes(usernameSearch.toLowerCase()) ||
      (payment.user?.username || "")
        .toLowerCase()
        .includes(usernameSearch.toLowerCase());

    const paymentDate = new Date(payment.initiated);
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
    <div className="bg-white p-4 md:p-8 rounded-lg shadow-md">
      {/* Header */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-6 gap-4">
        <h4 className="text-xl md:text-2xl font-bold text-gray-800">Rejected Payments</h4>
        <div className="flex flex-col lg:flex-row gap-4 w-full xl:w-auto">
          <div className="relative w-full lg:w-64">
            <input
              type="text"
              placeholder="Search by user..."
              value={usernameSearch}
              onChange={(e) => {
                setUsernameSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
            />
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2 w-full lg:w-auto">
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full sm:w-auto px-3 py-2 border rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
            />
            <span className="hidden sm:inline">-</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full sm:w-auto px-3 py-2 border rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Mobile Card View (visible on small screens) */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {currentPayments.length > 0 ? (
          currentPayments.map((payment) => {
            const initiatedTime = formatInitiated(payment.initiated);
            return (
              <div key={payment.id} className="bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center">
                    <img 
                      src={payment.user.avatar} 
                      alt={payment.user.name} 
                      className="w-10 h-10 rounded-full mr-3 border border-gray-200" 
                    />
                    <div className="overflow-hidden">
                      <p className="font-bold text-gray-800 truncate max-w-[150px]">{payment.user.name}</p>
                      <p className="text-xs text-gray-500 truncate max-w-[150px]">@{payment.user.username}</p>
                    </div>
                  </div>
                  <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    {payment.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm border-t border-gray-100 pt-3">
                  <div>
                    <p className="text-gray-400 text-[10px] uppercase font-bold">Amount</p>
                    <p className="font-bold text-gray-900">₹{payment.amount}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-[10px] uppercase font-bold">Gateway</p>
                    <p className="text-gray-700">{payment.gateway}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-400 text-[10px] uppercase font-bold">Date</p>
                    <p className="text-gray-700">{initiatedTime.full}</p>
                  </div>
                </div>

                <button
                  onClick={() => openModal(payment)}
                  className="w-full mt-4 flex items-center justify-center bg-blue-50 text-blue-600 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-100 transition-colors border border-blue-100"
                >
                  <FiEye className="mr-2" /> View Details
                </button>
              </div>
            );
          })
        ) : (
          <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-lg">
            No rejected payments found.
          </div>
        )}
      </div>

      {/* Desktop Table View (hidden on small screens) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Gateway | Transaction
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Initiated
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                User
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Amount
              </th>
              <th className="py-3 px-4 text-center text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="py-3 px-4 text-center text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {currentPayments.length > 0 ? (
              currentPayments.map((payment) => {
                const initiatedTime = formatInitiated(payment.initiated);
                return (
                  <tr
                    key={payment.id}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <p className="font-medium text-gray-800">
                        {payment.gateway}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {payment.transactionId}
                      </p>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <p className="font-medium text-gray-700">{initiatedTime.full}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {initiatedTime.relative}
                      </p>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <img
                          src={payment.user.avatar}
                          alt={payment.user.name}
                          className="w-10 h-10 rounded-full mr-3 border border-gray-100 shadow-sm"
                        />
                        <div className="overflow-hidden">
                          <p className="font-medium text-gray-800 truncate max-w-[200px]">
                            {payment.user.name}
                          </p>
                          <p className="text-xs text-gray-400">
                            @{payment.user.username}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-bold text-gray-900">
                        ₹{payment.amount}
                      </p>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                        {payment.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => openModal(payment)}
                        className="inline-flex items-center justify-center bg-blue-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-600 shadow-sm transition-all active:scale-95"
                      >
                        <FiEye className="mr-1.5" /> Details
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-12 text-gray-500 italic">
                  No rejected payments found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-8 gap-1 md:gap-2">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1.5 md:px-4 md:py-2 border rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium transition-colors"
          >
            Prev
          </button>
          <div className="flex items-center px-2 md:px-4 text-sm font-semibold text-gray-600">
            <span className="md:hidden">{currentPage}/{totalPages}</span>
            <span className="hidden md:inline">Page {currentPage} of {totalPages}</span>
          </div>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 md:px-4 md:py-2 border rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium transition-colors"
          >
            Next
          </button>
        </div>
      )}

      {/* Details Modal */}
      {isModalOpen && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h4 className="text-xl font-bold text-gray-800">
                Payment Details
              </h4>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <FiX size={24} />
              </button>
            </div>
            <div className="space-y-4">
              {Object.entries(selectedPayment.details).map(([key, value]) => (
                <div key={key} className="flex flex-col sm:flex-row sm:justify-between border-b border-gray-50 py-3 gap-1">
                  <p className="font-semibold text-gray-500 text-xs uppercase tracking-wider">{key}</p>
                  <p className="text-gray-800 font-medium break-all sm:text-right">{value}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={closeModal}
                className="w-full sm:w-auto bg-gray-100 text-gray-700 px-8 py-2.5 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
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

export default RejectedPayments;
