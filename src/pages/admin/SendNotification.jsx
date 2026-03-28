import React, { useState } from "react";
import { FiMail, FiSend } from "react-icons/fi";
import { sendNotificationAPI } from "../../api/adminApi/adminApi"; // ✅ API

const SendNotification = () => {
  const [message, setMessage] = useState("");

  // ✅ ADD STATES (no UI change)
  const [sentTo, setSentTo] = useState("All Users");
  const [startFrom, setStartFrom] = useState(0);
  const [perBatch, setPerBatch] = useState(500);
  const [coolingPeriod, setCoolingPeriod] = useState(5);
  const [loading, setLoading] = useState(false);

  // ✅ HANDLE SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await sendNotificationAPI({
        sentTo,
        message,
        startFrom,
        perBatch,
        coolingPeriod,
      });

      alert(res.message || "Notification sent");
    } catch (error) {
      console.error(error);
      alert("Failed to send notification");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h4 className="text-2xl font-bold text-gray-800 mb-6">
        Notification to Users
      </h4>

      {/* ✅ ONLY CHANGE: add onSubmit */}
      <form onSubmit={handleSubmit}>
        <div className="space-y-8">
          <div className="flex items-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <FiMail className="text-blue-500 mr-3" size={20} />
            <p className="text-sm text-blue-700">Send via Email</p>
          </div>

          {/* Being Sent To */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Being Sent To
            </label>
            <select
              value={sentTo}
              onChange={(e) => setSentTo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option>All Users</option>
              <option>Selected Users</option>
              <option>KYC Unverified User</option>
              <option>KYC Verified User</option>
            </select>
          </div>

          {/* Message */}
          <div className="pt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <div className="h-64">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full h-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                rows="10"
              />
            </div>
          </div>

          {/* Batching */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start From
              </label>
              <input
                type="number"
                value={startFrom}
                onChange={(e) => setStartFrom(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Per Batch
              </label>
              <input
                type="number"
                value={perBatch}
                onChange={(e) => setPerBatch(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cooling Period (in seconds)
              </label>
              <input
                type="number"
                value={coolingPeriod}
                onChange={(e) => setCoolingPeriod(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center bg-pink-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-pink-700 transition-colors"
            >
              <FiSend className="mr-2" />
              {loading ? "Sending..." : "Send Notification"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SendNotification;
