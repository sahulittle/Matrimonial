import React, { useState, useEffect } from "react";
import { FiMail, FiMessageSquare, FiSearch } from "react-icons/fi";
import { getRenewals } from "../../api/adminApi/adminApi";

const RenewList = () => {
  const [renewals, setRenewals] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // 🔍 Filter
  const filteredRenewals = renewals.filter((renewal) => {
    const userMatch = renewal.userName
      .toLowerCase()
      .includes(searchName.toLowerCase());

    return userMatch;
  });

  // 📡 API CALL
  const fetchRenewals = async () => {
    try {
      const res = await getRenewals({
        search: searchName,
        startDate,
        endDate,
      });

      setRenewals(res.renewals || []);
      console.log("Renewals fetched:", res.renewals);
    } catch (error) {
      console.error("Error fetching renewals:", error);
    }
  };

  useEffect(() => {
    fetchRenewals();
  }, []);

  useEffect(() => {
    fetchRenewals();
  }, [searchName, startDate, endDate]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Package Renewal List</h1>

      {/* 🔍 Filters */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search by user name..."
            className="w-full pl-10 pr-4 py-2 border rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="date"
            className="px-3 py-2 border rounded-full bg-gray-50"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <span>-</span>
          <input
            type="date"
            className="px-3 py-2 border rounded-full bg-gray-50"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      {/* 🎯 CARD UI */}
      <div className="space-y-4">
        {filteredRenewals.map((renewal) => {
          const start = new Date(renewal.startDate);
          const end = new Date(renewal.endDate);
          const today = new Date();

          const daysRemaining = Math.ceil(
            (end - today) / (1000 * 60 * 60 * 24),
          );

          const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

          return (
            <div
              key={renewal.id}
              className="flex flex-col md:flex-row md:items-center justify-between bg-white border rounded-lg shadow-sm p-4 gap-4"
            >
              {/* 👤 USER */}
              <div className="flex items-center gap-3">
                <img
                  src="https://i.pravatar.cc/40"
                  alt="user"
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-semibold text-gray-800">
                    {renewal.userName}
                  </p>
                  <p className="text-sm text-gray-500">
                    @{renewal.userName?.toLowerCase().replace(" ", "")}
                  </p>
                </div>
              </div>

              {/* 📦 PACKAGE */}
              <div className="text-center">
                <span className="px-3 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">
                  {renewal.packageName}
                </span>
                <p className="text-sm text-gray-500 mt-1">
                  {totalDays} Days Validity
                </p>
              </div>

              {/* 📅 TIMELINE */}
              <div className="text-center">
                <p className="text-sm text-gray-700">
                  {start.toDateString()} - {end.toDateString()}
                </p>
                <p className="text-sm text-orange-500 font-medium">
                  {daysRemaining > 0
                    ? `${daysRemaining} days remaining`
                    : "Expired"}
                </p>
              </div>

              {/* 💰 PRICE */}
              <div className="font-semibold text-gray-800">
                ₹{renewal.amount || "—"}
              </div>

              {/* ⚙️ ACTION */}
              <div className="flex gap-2">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white px-3 py-1 rounded"
                  onClick={() => alert(`Send email to ${renewal.userName}`)}
                >
                  <FiMail />
                </button>

                <button
                  className="bg-green-500 hover:bg-green-700 text-white px-3 py-1 rounded"
                  onClick={() => alert(`Send SMS to ${renewal.userName}`)}
                >
                  <FiMessageSquare />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ❌ EMPTY STATE */}
      {filteredRenewals.length === 0 && (
        <p className="text-center text-gray-500 py-4">No renewals found.</p>
      )}
    </div>
  );
};

export default RenewList;
