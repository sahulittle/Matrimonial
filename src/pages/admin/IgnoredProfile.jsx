import React, { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { getIgnoredProfiles } from "../../api/adminApi/adminApi";

const IgnoredProfile = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 15;
  const [ignoredProfiles, setIgnoredProfiles] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getIgnoredProfiles({ page: 1, limit: 200 });
        // res.ignoredProfiles (as implemented in backend)
        setIgnoredProfiles(res.ignoredProfiles || res.ignored || []);
      } catch (err) {
        console.error("Error loading ignored profiles:", err);
      }
    };
    fetch();
  }, []);

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

  const filteredIgnored = ignoredProfiles.filter((item) => {
    const userName =
      `${item.userId?.firstName || item.user?.firstName || ""} ${item.userId?.lastName || item.user?.lastName || ""}`
        .trim()
        .toLowerCase();
    const profileName =
      `${item.ignoredUserId?.firstName || item.ignoredUser?.firstName || ""} ${item.ignoredUserId?.lastName || item.ignoredUser?.lastName || ""}`
        .trim()
        .toLowerCase();
    return (
      userName.includes(searchTerm.toLowerCase()) ||
      profileName.includes(searchTerm.toLowerCase())
    );
  });

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentIgnored = filteredIgnored.slice(
    indexOfFirstUser,
    indexOfLastUser,
  );

  const totalPages = Math.ceil(filteredIgnored.length / usersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h4 className="text-2xl font-bold text-gray-800">Ignored Profile</h4>
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search by user or profile..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
            className="w-full pl-10 pr-4 py-2 border rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Ignored Profiles Table */}
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
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {currentIgnored.map((item, index) => {
              const user = item.userId || item.user || {};
              const profile = item.ignoredUserId || item.profile || {};
              return (
                <tr
                  key={
                    item._id || item.id || `${user._id}-${profile._id}-${index}`
                  }
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="py-3 px-4">{indexOfFirstUser + index + 1}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <img
                        src={
                          user.profilePhoto ||
                          user.avatar ||
                          `https://i.pravatar.cc/150?u=${user._id || user.username || index}`
                        }
                        alt={
                          user.firstName
                            ? `${user.firstName} ${user.lastName}`
                            : user.name
                        }
                        className="w-10 h-10 rounded-full mr-4"
                      />
                      <div>
                        <p className="font-medium text-gray-800">
                          {user.firstName
                            ? `${user.firstName} ${user.lastName}`
                            : user.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          @{user.username || (user.email || "").split("@")[0]}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <img
                        src={
                          profile.profilePhoto ||
                          profile.avatar ||
                          `https://i.pravatar.cc/150?u=${profile._id || profile.username || index}`
                        }
                        alt={
                          profile.firstName
                            ? `${profile.firstName} ${profile.lastName}`
                            : profile.name
                        }
                        className="w-10 h-10 rounded-full mr-4"
                      />
                      <div>
                        <p className="font-medium text-gray-800">
                          {profile.firstName
                            ? `${profile.firstName} ${profile.lastName}`
                            : profile.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          @
                          {profile.username ||
                            (profile.email || "").split("@")[0]}
                        </p>
                      </div>
                    </div>
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
    </div>
  );
};

export default IgnoredProfile;
