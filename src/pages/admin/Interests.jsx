import React, { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { getAllInterests } from "../../api/adminApi/adminApi";

const Interests = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 15;

  // ✅ NEW STATES
  const [interests, setInterests] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // ✅ FETCH API
  const fetchInterests = async () => {
    try {
      setLoading(true);

      const res = await getAllInterests({
        search: searchTerm,
        page: currentPage,
        limit: usersPerPage,
      });

      setInterests(res.interests || []);
      setTotalPages(res.pagination?.pages || 1);
    } catch (error) {
      console.error("Error fetching interests:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ CALL API
  useEffect(() => {
    fetchInterests();
  }, [searchTerm, currentPage]);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h4 className="text-2xl font-bold text-gray-800">User Interests</h4>
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search by user or profile..."
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

      {/* Interests Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <p className="text-center py-6">Loading...</p>
        ) : (
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase">
                  S.N
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase">
                  User
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase">
                  Profile
                </th>
                <th className="py-3 px-4 text-center text-sm font-semibold text-gray-600 uppercase">
                  Accept Status
                </th>
              </tr>
            </thead>

            <tbody className="text-gray-700">
              {interests.length > 0 ? (
                interests.map((interest, index) => (
                  <tr
                    key={interest._id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    {/* SERIAL */}
                    <td className="py-3 px-4">
                      {index + 1 + (currentPage - 1) * usersPerPage}
                    </td>

                    {/* USER */}
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <img
                          src={
                            interest.senderId?.profilePhoto ||
                            "https://i.pravatar.cc/150"
                          }
                          alt={interest.senderId?.firstName}
                          className="w-10 h-10 rounded-full mr-4"
                        />
                        <div>
                          <p className="font-medium text-gray-800">
                            {interest.senderId?.firstName}{" "}
                            {interest.senderId?.lastName}
                          </p>
                          <p className="text-sm text-gray-500">
                            @{interest.senderId?.username}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* PROFILE */}
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <img
                          src={
                            interest.receiverId?.profilePhoto ||
                            "https://i.pravatar.cc/150"
                          }
                          alt={interest.receiverId?.firstName}
                          className="w-10 h-10 rounded-full mr-4"
                        />
                        <div>
                          <p className="font-medium text-gray-800">
                            {interest.receiverId?.firstName}{" "}
                            {interest.receiverId?.lastName}
                          </p>
                          <p className="text-sm text-gray-500">
                            @{interest.receiverId?.username}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* STATUS */}
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          interest.status === "accepted"
                            ? "bg-green-100 text-green-700"
                            : interest.status === "rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {interest.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-6 text-gray-500">
                    No interests found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
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

export default Interests;
