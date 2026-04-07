import React, { useState, useEffect } from "react";
import { FiSearch, FiEye, FiX } from "react-icons/fi";
import { getAllTickets, getTicketDetails } from "../../api/adminApi/adminApi";

// Helper to format date and calculate relative time
const formatDate = (isoDate) => {
  const date = new Date(isoDate || Date.now());
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

const ClosedTicket = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ticketsPerPage = 15;

  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getAllTickets({
          status: "closed",
          page: 1,
          limit: 100,
        });
        setTickets(res.tickets || []);
      } catch (err) {
        console.error("Error loading closed tickets:", err);
      }
    };
    fetch();
  }, []);

  const filteredTickets = tickets.filter((ticket) => {
    const subj = (ticket.subject || ticket.title || "").toLowerCase();
    const name =
      `${ticket.userId?.firstName || ""} ${ticket.userId?.lastName || ""}`.toLowerCase();
    return (
      subj.includes(searchTerm.toLowerCase()) ||
      name.includes(searchTerm.toLowerCase())
    );
  });

  // Pagination logic
  const indexOfLastTicket = currentPage * ticketsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
  const currentTickets = filteredTickets.slice(
    indexOfFirstTicket,
    indexOfLastTicket,
  );
  const totalPages = Math.ceil(filteredTickets.length / ticketsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const openModal = async (ticket) => {
    try {
      const res = await getTicketDetails(ticket._id || ticket.id);
      setSelectedTicket(res.ticket || ticket);
    } catch (err) {
      console.error("Error fetching ticket details:", err);
      setSelectedTicket(ticket);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTicket(null);
  };

  const priorityConfig = {
    High: { className: "bg-red-100 text-red-700" },
    Medium: { className: "bg-yellow-100 text-yellow-700" },
    Low: { className: "bg-green-100 text-green-700" },
  };

  const statusConfig = {
    Closed: { className: "bg-gray-100 text-gray-700" },
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h4 className="text-2xl font-bold text-gray-800">Closed Tickets</h4>
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search by subject or user..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 border rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Tickets Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase">
                Subject
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase">
                Submitted By
              </th>
              <th className="py-3 px-4 text-center text-sm font-semibold text-gray-600 uppercase">
                Status
              </th>
              <th className="py-3 px-4 text-center text-sm font-semibold text-gray-600 uppercase">
                Priority
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase">
                Last Reply
              </th>
              <th className="py-3 px-4 text-center text-sm font-semibold text-gray-600 uppercase">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {currentTickets.map((ticket) => {
              const lastReplyTime = formatDate(
                ticket.lastReply || ticket.updatedAt || ticket.createdAt,
              );
              return (
                <tr
                  key={ticket._id || ticket.id}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="py-3 px-4 font-medium text-gray-800">
                    {ticket.subject}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <img
                        src={
                          ticket.userId?.avatar || ticket.submittedBy?.avatar
                        }
                        alt={
                          ticket.userId?.firstName || ticket.submittedBy?.name
                        }
                        className="w-10 h-10 rounded-full mr-4"
                      />
                      <div>
                        <p className="font-medium text-gray-800">
                          {ticket.userId?.firstName
                            ? `${ticket.userId.firstName} ${ticket.userId.lastName || ""}`
                            : ticket.submittedBy?.name || "N/A"}
                        </p>
                        <p className="text-sm text-gray-500">
                          @
                          {(
                            ticket.userId?.username ||
                            ticket.submittedBy?.username ||
                            ""
                          ).toLowerCase()}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${statusConfig[ticket.status]?.className}`}
                    >
                      {ticket.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${priorityConfig[ticket.priority]?.className}`}
                    >
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-medium">{lastReplyTime.full}</p>
                    <p className="text-sm text-gray-500">
                      {lastReplyTime.relative}
                    </p>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => openModal(ticket)}
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
      {isModalOpen && selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4 border-b pb-4">
              <h4 className="text-xl font-bold text-gray-800">
                Ticket Details
              </h4>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-800"
              >
                <FiX size={24} />
              </button>
            </div>

            <div>
              <h5 className="font-bold text-lg mb-2">
                {selectedTicket.subject}
              </h5>
              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <p className="text-gray-600">
                  <strong>Submitted by:</strong>{" "}
                  {selectedTicket.userId?.firstName
                    ? `${selectedTicket.userId.firstName} ${selectedTicket.userId.lastName || ""}`
                    : selectedTicket.submittedBy?.name || "N/A"}
                </p>
                <p className="text-gray-600">
                  <strong>Last Reply:</strong>{" "}
                  {
                    formatDate(
                      selectedTicket.lastReply ||
                        selectedTicket.updatedAt ||
                        selectedTicket.createdAt,
                    ).full
                  }
                </p>
                <p className="text-gray-600">
                  <strong>Status:</strong>{" "}
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusConfig[selectedTicket.status]?.className}`}
                  >
                    {selectedTicket.status}
                  </span>
                </p>
                <p className="text-gray-600">
                  <strong>Priority:</strong>{" "}
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold ${priorityConfig[selectedTicket.priority]?.className}`}
                  >
                    {selectedTicket.priority}
                  </span>
                </p>
              </div>

              <p className="text-gray-700 bg-gray-50 p-4 rounded-md">
                {selectedTicket.details}
              </p>

              {/* Replies */}
              <div className="mt-6">
                <h6 className="font-semibold mb-3">Replies</h6>
                <div className="space-y-3 max-h-48 overflow-auto p-2 bg-gray-50 rounded">
                  {(selectedTicket.replies || []).map((r, idx) => (
                    <div key={idx} className="p-2 bg-white rounded shadow-sm">
                      <div className="text-sm text-gray-700">
                        <strong>
                          {r.senderType === "admin"
                            ? "Admin"
                            : r.senderName || "User"}
                        </strong>
                      </div>
                      <div className="text-sm text-gray-600">{r.message}</div>
                      <div className="text-xs text-gray-400">
                        {new Date(
                          r.createdAt || r.date || Date.now(),
                        ).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
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

export default ClosedTicket;
