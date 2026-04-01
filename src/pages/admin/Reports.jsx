import React, { useState, useEffect } from "react";
import { FiSearch, FiEye, FiSlash, FiX } from "react-icons/fi";
import { banUser, getAllUsers } from "../../api/adminApi/adminApi";
import toast from "react-hot-toast";
const Reports = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 15;
  const [reports, setReports] = useState([]);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isBanModalOpen, setIsBanModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [banReason, setBanReason] = useState("");

  const names = [
    "James Smith",
    "Maria Garcia",
    "Robert Johnson",
    "Mary Williams",
    "Michael Brown",
    "Patricia Jones",
    "David Miller",
    "Jennifer Davis",
    "William Rodriguez",
    "Linda Martinez",
    "Richard Hernandez",
    "Elizabeth Lopez",
    "Joseph Gonzalez",
    "Susan Wilson",
    "Thomas Anderson",
    "Jessica Thomas",
    "Charles Taylor",
    "Sarah Moore",
    "Christopher Jackson",
    "Karen Martin",
    "Daniel Lee",
    "Nancy Perez",
    "Matthew Thompson",
    "Lisa White",
    "Anthony Harris",
    "Betty Sanchez",
    "Mark Clark",
    "Dorothy Ramirez",
    "Donald Lewis",
    "Sandra Robinson",
    "Steven Walker",
    "Ashley Young",
    "Paul Allen",
    "Kimberly King",
    "Andrew Wright",
    "Donna Scott",
    "Joshua Torres",
    "Carol Nguyen",
    "Kevin Hill",
    "Michelle Flores",
    "Brian Green",
    "Emily Adams",
    "George Nelson",
    "Helen Carter",
    "Edward Mitchell",
    "Amanda Perez",
    "Ronald Roberts",
    "Melissa Turner",
    "Timothy Phillips",
    "Deborah Campbell",
    "Jason Parker",
    "Stephanie Evans",
    "Jeffrey Edwards",
    "Rebecca Collins",
    "Ryan Stewart",
    "Laura Morris",
    "Jacob Rogers",
    "Sharon Reed",
    "Gary Cook",
    "Cynthia Morgan",
    "Nicholas Bell",
    "Kathleen Murphy",
    "Eric Bailey",
    "Amy Rivera",
    "Jonathan Cooper",
    "Shirley Richardson",
    "Stephen Cox",
    "Angela Howard",
    "Larry Ward",
    "Brenda Torres",
    "Justin Peterson",
    "Pamela Gray",
    "Scott Ramirez",
    "Nicole James",
    "Brandon Watson",
    "Emma Brooks",
    "Benjamin Kelly",
    "Rachel Sanders",
    "Samuel Price",
    "Catherine Bennett",
    "Gregory Wood",
    "Heather Barnes",
    "Frank Ross",
    "Diane Henderson",
    "Patrick Coleman",
    "Teresa Jenkins",
    "Walter Perry",
    "Evelyn Powell",
    "Dennis Long",
    "Christina Patterson",
    "Jerry Hughes",
    "Judith Flores",
    "Tyler Washington",
    "Martha Simmons",
    "Aaron Foster",
    "Cheryl Butler",
    "Henry Hughes",
    "Janet Washington",
    "Adam Simmons",
    "Joyce Foster",
    "Peter Butler",
    "Debra Hughes",
    "Willie Washington",
    "Frances Simmons",
  ];
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getAllUsers();

        // convert users → reports format
        const formatted = res.users.map((user, i) => ({
          id: user._id,
          user: {
            name: `${user.firstName} ${user.lastName}`,
            username: user.email?.split("@")[0] || "user",
            avatar: `https://i.pravatar.cc/150?u=${user._id}`,
          },
          profile: {
            _id: user._id,
            name: `${user.firstName} ${user.lastName}`,
            username: user.email?.split("@")[0] || "user",
            avatar: `https://i.pravatar.cc/150?u=${user._id}`,
          },
          title: "User Report", // default
          details: `Report related to ${user.firstName}`,
        }));

        setReports(formatted);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const filteredReports = reports.filter(
    (report) =>
      (report.user.name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (report.profile.name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      report.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentReports = filteredReports.slice(
    indexOfFirstUser,
    indexOfLastUser,
  );
  const totalPages = Math.ceil(filteredReports.length / usersPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const openDetailsModal = (report) => {
    setSelectedReport(report);
    setIsDetailsModalOpen(true);
  };

  const openBanModal = (report) => {
    setSelectedReport(report);
    setIsBanModalOpen(true);
  };

  const closeModal = () => {
    setIsDetailsModalOpen(false);
    setIsBanModalOpen(false);
    setSelectedReport(null);
    setBanReason("");
  };

  const handleBanSubmit = async (e) => {
    e.preventDefault();

    try {
      await banUser(selectedReport.profile._id, banReason);
      toast.success("User banned & email sent");
      closeModal();
    } catch (error) {
      console.error(error);
      toast.error("Failed to ban user");
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h4 className="text-2xl font-bold text-gray-800">Reports</h4>
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search by user, profile, or title..."
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

      {/* Reports Table */}
      <div className="overflow-x-auto">
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
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase">
                Title
              </th>
              <th className="py-3 px-4 text-center text-sm font-semibold text-gray-600 uppercase">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {currentReports.map((report, index) => (
              <tr
                key={report.id}
                className="border-b border-gray-200 hover:bg-gray-50"
              >
                <td className="py-3 px-4">{indexOfFirstUser + index + 1}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center">
                    <img
                      src={report.user.avatar}
                      alt={report.user.name}
                      className="w-10 h-10 rounded-full mr-4"
                    />
                    <div>
                      <p className="font-medium text-gray-800">
                        {report.user.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        @{report.user.username}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center">
                    <img
                      src={report.profile.avatar}
                      alt={report.profile.name}
                      className="w-10 h-10 rounded-full mr-4"
                    />
                    <div>
                      <p className="font-medium text-gray-800">
                        {report.profile.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        @{report.profile.username}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">{report.title}</td>
                <td className="py-3 px-4 text-center">
                  <div className="flex justify-center items-center gap-2">
                    <button
                      onClick={() => openDetailsModal(report)}
                      className="flex items-center bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600"
                    >
                      <FiEye className="mr-1" /> Details
                    </button>
                    <button
                      onClick={() => openBanModal(report)}
                      className="flex items-center bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600"
                    >
                      <FiSlash className="mr-1" /> Ban
                    </button>
                  </div>
                </td>
              </tr>
            ))}
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
      {isDetailsModalOpen && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
            <div className="flex justify-between items-center mb-4 border-b pb-4">
              <h4 className="text-xl font-bold text-gray-800">
                Report Details
              </h4>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-800"
              >
                <FiX size={24} />
              </button>
            </div>
            <div>
              <h5 className="font-bold text-lg mb-2">{selectedReport.title}</h5>
              <p className="text-gray-600 mb-2">
                <strong>Reported by:</strong> {selectedReport.user.name} (@
                {selectedReport.user.username})
              </p>
              <p className="text-gray-600 mb-4">
                <strong>Reported profile:</strong> {selectedReport.profile.name}{" "}
                (@{selectedReport.profile.username})
              </p>
              <p className="text-gray-700">{selectedReport.details}</p>
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

      {/* Ban Modal */}
      {isBanModalOpen && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-5 sm:p-8 rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-xl font-bold text-gray-800">Ban User</h4>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-800"
              >
                <FiX size={24} />
              </button>
            </div>
            <form onSubmit={handleBanSubmit}>
              <p className="text-gray-600 mb-4">
                If you ban this user ({selectedReport.profile.name}), he/she
                won't be able to access his/her dashboard.
              </p>
              <div>
                <label
                  htmlFor="banReason"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Reason
                </label>
                <textarea
                  id="banReason"
                  name="banReason"
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                  required
                  className="w-full h-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  rows="4"
                />
              </div>
              <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-red-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-red-700"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
