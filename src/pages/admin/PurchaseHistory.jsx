import React, { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { getAllPayments } from "../../api/adminApi/adminApi";

// Helper to format date and calculate relative time
const formatDate = (isoDate) => {
  const date = new Date(isoDate);
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

const PurchaseHistory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const purchasesPerPage = 15;

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
  ];

  const packages = [
    { name: "Basic", price: 499 },
    { name: "Premium", price: 1299 },
    { name: "VIP", price: 4999 },
  ];

  const [purchaseHistory, setPurchaseHistory] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getAllPayments({
          status: "success",
          page: 1,
          limit: 200,
        });
        const items = (res.payments || []).map((p) => ({
          id: p._id,
          user: {
            name: `${p.userId?.firstName || ""} ${p.userId?.lastName || ""}`.trim(),
            username: p.userId?.username || p.userId?.email?.split("@")[0],
            avatar: p.userId?.profilePhoto,
          },
          package: p.packageName,
          buyingDate: p.createdAt,
          amount: p.amount,
        }));
        setPurchaseHistory(items);
      } catch (err) {
        console.error("Error loading purchase history:", err);
      }
    };
    fetch();
  }, []);

  const filteredHistory = purchaseHistory.filter(
    (log) =>
      log.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.username.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Pagination logic
  const indexOfLastPurchase = currentPage * purchasesPerPage;
  const indexOfFirstPurchase = indexOfLastPurchase - purchasesPerPage;
  const currentPurchases = filteredHistory.slice(
    indexOfFirstPurchase,
    indexOfLastPurchase,
  );
  const totalPages = Math.ceil(filteredHistory.length / purchasesPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h4 className="text-2xl font-bold text-gray-800">Purchase History</h4>
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search by username..."
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

      {/* Purchase History Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase">
                User
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase">
                Package
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase">
                Buying Date
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase">
                Amount
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {currentPurchases.map((purchase) => {
              const purchaseTime = formatDate(purchase.buyingDate);
              return (
                <tr
                  key={purchase.id}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <img
                        src={purchase.user.avatar}
                        alt={purchase.user.name}
                        className="w-10 h-10 rounded-full mr-4"
                      />
                      <div>
                        <p className="font-medium text-gray-800">
                          {purchase.user.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          @{purchase.user.username}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-medium">{purchase.package}</td>
                  <td className="py-3 px-4">
                    <p className="font-medium">{purchaseTime.full}</p>
                    <p className="text-sm text-gray-500">
                      {purchaseTime.relative}
                    </p>
                  </td>
                  <td className="py-3 px-4 font-bold text-gray-800">
                    ₹{purchase.amount}
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

export default PurchaseHistory;
