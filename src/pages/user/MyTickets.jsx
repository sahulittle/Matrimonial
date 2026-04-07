import React, { useEffect, useState } from "react";
import { on, off } from "../../services/socketService";
import { Link } from "react-router-dom";
import { ticketApi } from "../../services/api";

// Modal & details support
const DetailsModal = ({
  ticket,
  onClose,
  onReply,
  replyText,
  setReplyText,
  replyLoading,
}) => {
  if (!ticket) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-bold">Ticket Details</h4>
          <button onClick={onClose} className="text-gray-600">
            Close
          </button>
        </div>

        <h5 className="font-semibold text-md mb-2">{ticket.subject}</h5>
        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
          <div>
            <strong>Submitted by:</strong>{" "}
            {ticket.userId?.firstName
              ? `${ticket.userId.firstName} ${ticket.userId.lastName || ""}`
              : "You"}
          </div>
          <div>
            <strong>Priority:</strong> {ticket.priority}
          </div>
          <div>
            <strong>Status:</strong> {ticket.status}
          </div>
          <div>
            <strong>Last Reply:</strong>{" "}
            {ticket.updatedAt
              ? new Date(ticket.updatedAt).toLocaleString()
              : new Date(ticket.createdAt).toLocaleString()}
          </div>
        </div>

        <div className="mb-4 bg-gray-50 p-3 rounded">{ticket.details}</div>

        <div className="mb-4">
          <h6 className="font-semibold mb-2">Replies</h6>
          <div className="space-y-3 max-h-60 overflow-y-auto p-1">
            {(ticket.replies || []).map((r, idx) => (
              <div
                key={idx}
                className={`p-3 rounded ${r.senderType === "admin" ? "bg-pink-50" : "bg-gray-100"}`}
              >
                <div className="text-xs text-gray-500">
                  {r.senderName || (r.senderType === "admin" ? "Admin" : "You")}{" "}
                  • {r.createdAt ? new Date(r.createdAt).toLocaleString() : ""}
                </div>
                <div className="mt-1">{r.message}</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            rows={3}
            className="w-full border p-2 rounded"
            placeholder="Write a reply..."
          />
          <div className="flex justify-end mt-2">
            <button
              onClick={onReply}
              disabled={replyLoading}
              className="bg-pink-600 text-white px-4 py-2 rounded"
            >
              {replyLoading ? "Sending..." : "Reply"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("pending");

  const load = async () => {
    try {
      setLoading(true);
      const res = await ticketApi.getTickets();
      // API returns { tickets }
      if (res?.tickets) setTickets(res.tickets);
      else if (res?.length) setTickets(res);
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [replyLoading, setReplyLoading] = useState(false);

  const openModal = async (ticket) => {
    try {
      const res = await ticketApi.getTicketDetails(ticket._id || ticket.id);
      setSelectedTicket(res.ticket || ticket);
      setIsModalOpen(true);
    } catch (err) {
      console.error("Failed to load ticket details:", err);
      setSelectedTicket(ticket);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTicket(null);
    setReplyText("");
  };

  // Listen for realtime replies so modal updates when admin replies
  useEffect(() => {
    const handleTicketReplied = (data) => {
      try {
        const payload = data.ticket || data;
        const reply = data.reply || data.reply || payload.reply;
        const ticketId =
          payload._id ||
          payload.id ||
          payload.ticketId ||
          (reply && reply.ticketId);
        if (!ticketId || !selectedTicket) return;
        const currentId = selectedTicket._id || selectedTicket.id;
        if (ticketId.toString() === currentId.toString()) {
          // If full ticket present, replace; otherwise append reply
          if (payload.replies && payload.replies.length >= 0) {
            setSelectedTicket(payload);
          } else if (reply) {
            setSelectedTicket((prev) => ({
              ...prev,
              replies: [...(prev.replies || []), reply],
            }));
          } else {
            // fallback: refetch details
            ticketApi
              .getTicketDetails(currentId)
              .then((res) => {
                if (res?.ticket) setSelectedTicket(res.ticket);
              })
              .catch(() => {});
          }
          // also refresh list to update statuses
          load();
        }
      } catch (e) {
        console.error("Error handling ticket:replied in MyTickets", e);
      }
    };

    on("ticket:replied", handleTicketReplied);
    return () => off("ticket:replied", handleTicketReplied);
  }, [selectedTicket]);

  const handleReply = async () => {
    if (!replyText.trim() || !selectedTicket) return;
    try {
      setReplyLoading(true);
      await ticketApi.addReply(
        selectedTicket._id || selectedTicket.id,
        replyText,
      );
      // refresh ticket details
      const res = await ticketApi.getTicketDetails(
        selectedTicket._id || selectedTicket.id,
      );
      setSelectedTicket(res.ticket || selectedTicket);
      // Also refresh list
      await load();
      setReplyText("");
    } catch (err) {
      console.error("Reply failed:", err);
      alert(err.message || "Failed to send reply");
    } finally {
      setReplyLoading(false);
    }
  };

  const filtered = tickets.filter((t) => t.status === tab);

  return (
    <div className="p-4 bg-white rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">My Support Tickets</h2>
        <Link to="/user/tickets/create" className="text-pink-600">
          Create Ticket
        </Link>
      </div>

      <div className="mb-4">
        <button
          className={`px-3 py-1 mr-2 ${tab === "pending" ? "bg-pink-600 text-white rounded" : ""}`}
          onClick={() => setTab("pending")}
        >
          Pending
        </button>
        <button
          className={`px-3 py-1 mr-2 ${tab === "answered" ? "bg-pink-600 text-white rounded" : ""}`}
          onClick={() => setTab("answered")}
        >
          Answered
        </button>
        <button
          className={`px-3 py-1 mr-2 ${tab === "closed" ? "bg-pink-600 text-white rounded" : ""}`}
          onClick={() => setTab("closed")}
        >
          Closed
        </button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          {filtered.length === 0 ? (
            <div>No tickets in this tab</div>
          ) : (
            <table className="w-full table-auto">
              <thead>
                <tr className="text-left">
                  <th className="p-2">Subject</th>
                  <th className="p-2">Priority</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Created</th>
                  <th className="p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => (
                  <tr key={t._id} className="border-t">
                    <td className="p-2">{t.subject}</td>
                    <td className="p-2">{t.priority}</td>
                    <td className="p-2">{t.status}</td>
                    <td className="p-2">
                      {new Date(t.createdAt).toLocaleString()}
                    </td>
                    <td className="p-2">
                      <button
                        onClick={() => openModal(t)}
                        className="bg-pink-600 text-white px-3 py-1 rounded"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
      {isModalOpen && (
        <DetailsModal
          ticket={selectedTicket}
          onClose={closeModal}
          onReply={handleReply}
          replyText={replyText}
          setReplyText={setReplyText}
          replyLoading={replyLoading}
        />
      )}
    </div>
  );
};

export default MyTickets;
