import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { ticketApi } from "../../services/api";
import { on, off } from "../../services/socketService";

const TicketDetails = () => {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef();

  const load = async () => {
    try {
      setLoading(true);
      const res = await ticketApi.getTicketDetails(id);
      if (res?.ticket) setTicket(res.ticket);
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to load ticket");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  useEffect(() => {
    const handleTicketReplied = (data) => {
      try {
        console.log("socket event ticket:replied received:", data);
        const incomingTicket = data.ticket || data;
        if (!incomingTicket) return;
        console.log(
          "incomingTicket:",
          incomingTicket._id || incomingTicket.id || incomingTicket.ticketId,
        );
        const incomingId =
          incomingTicket._id || incomingTicket.id || incomingTicket.ticketId;
        if (incomingId && incomingId.toString() === id.toString()) {
          // If incoming payload contains full ticket, replace it
          if (incomingTicket.replies && incomingTicket.replies.length >= 0) {
            setTicket(incomingTicket);
          } else if (data.reply) {
            // If server sent only a reply object, append it to existing replies
            setTicket((prev) => {
              if (!prev) return prev;
              const newReplies = [...(prev.replies || []), data.reply];
              return { ...prev, replies: newReplies };
            });
          } else {
            // fetch full ticket from server as fallback
            load();
          }
        }
      } catch (e) {
        console.error("Error handling ticket:replied event", e);
      }
    };

    on("ticket:replied", handleTicketReplied);
    return () => off("ticket:replied", handleTicketReplied);
  }, [id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [ticket]);

  const handleReply = async () => {
    if (!message) return;
    try {
      const res = await ticketApi.addReply(id, message);
      console.log("user reply response:", res);
      setMessage("");
      await load();
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to send reply");
    }
  };

  if (loading || !ticket) return <div>Loading...</div>;

  return (
    <div className="p-4 bg-white rounded shadow max-w-3xl">
      <h2 className="text-xl font-semibold mb-2">{ticket.subject}</h2>
      <div className="text-sm text-gray-600 mb-4">
        Priority: {ticket.priority} • Status: {ticket.status}
      </div>

      <div className="space-y-3 mb-4">
        {ticket.replies && ticket.replies.length === 0 && (
          <div className="p-3 bg-gray-50 rounded">{ticket.details}</div>
        )}

        {ticket.replies &&
          ticket.replies.map((r, idx) => (
            <div
              key={idx}
              className={`p-3 rounded ${r.senderType === "admin" ? "bg-pink-50 text-black" : "bg-gray-100"}`}
            >
              <div className="text-xs text-gray-500">
                {r.senderName} • {new Date(r.createdAt).toLocaleString()}
              </div>
              <div className="mt-1">{r.message}</div>
            </div>
          ))}

        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2">
        <input
          className="flex-1 border px-3 py-2 rounded"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your reply"
        />
        <button
          className="bg-pink-600 text-white px-4 py-2 rounded"
          onClick={handleReply}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default TicketDetails;
