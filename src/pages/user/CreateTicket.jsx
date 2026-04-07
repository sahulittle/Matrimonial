import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ticketApi } from "../../services/api";

const CreateTicket = () => {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject || !description) {
      return alert("Please fill subject and description");
    }
    try {
      setLoading(true);
      await ticketApi.createTicket(subject, description, priority);
      alert("Ticket created successfully");
      navigate("/user/tickets");
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to create ticket");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Create Support Ticket</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="block mb-1">Subject</label>
          <input
            className="w-full border px-3 py-2 rounded"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Brief subject"
          />
        </div>

        <div className="mb-3">
          <label className="block mb-1">Description</label>
          <textarea
            className="w-full border px-3 py-2 rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
            placeholder="Describe your issue"
          />
        </div>

        <div className="mb-3">
          <label className="block mb-1">Priority</label>
          <select
            className="w-full border px-3 py-2 rounded"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option>Medium</option>
            <option>High</option>
            <option>Low</option>
          </select>
        </div>

        <div>
          <button
            type="submit"
            className="bg-pink-600 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Ticket"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTicket;
