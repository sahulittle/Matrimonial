import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiSearch, FiEye } from "react-icons/fi";
import { getAllUsers } from "../../api/adminApi/adminApi";

const ActiveUsers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch users from backend
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getAllUsers({ status: "active" });
      setUsers(res.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ✅ Search filter
  const filteredUsers = users.filter(
    (user) =>
      `${user.firstName || ""} ${user.lastName || ""}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (user.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.username || "").toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h4 className="text-2xl font-bold text-gray-800">Active Users</h4>

        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search by user, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <p className="text-center text-gray-500">Loading users...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase">
                  User
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase">
                  Email-Mobile
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase">
                  Country
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase">
                  Joined At
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="text-gray-700">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <img
                          src={user.avatar || "https://i.pravatar.cc/150"}
                          alt={user.firstName}
                          className="w-10 h-10 rounded-full mr-4"
                        />
                        <div>
                          <p className="font-medium text-gray-800">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-sm text-gray-500">
                            @{user.username || "N/A"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <p className="font-medium">{user.email}</p>
                      <p className="text-sm text-gray-500">{user.phone}</p>
                    </td>

                    <td className="py-3 px-4">{user.country || "N/A"}</td>

                    <td className="py-3 px-4">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-3 px-4">
                      <Link
                        to={`/admin/users/detail/${user._id}`}
                        className="flex items-center justify-center bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600"
                      >
                        <FiEye className="mr-1" /> Details
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-500">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ActiveUsers;
