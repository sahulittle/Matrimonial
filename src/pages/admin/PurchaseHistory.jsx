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
            name: p.userId?.fullName || "",
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
    <div className="bg-white p-4 md:p-8 rounded-lg shadow-md">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h4 className="text-xl md:text-2xl font-bold text-gray-800">Purchase History</h4>
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search by user..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 border rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
          />
          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Mobile Card View (visible on small screens) */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {currentPurchases.length > 0 ? (
          currentPurchases.map((purchase) => {
            const purchaseTime = formatDate(purchase.buyingDate);
            return (
              <div key={purchase.id} className="bg-gray-50 p-4 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center">
                    <img 
                      src={purchase.user.avatar || "/default-avatar.jpg"} 
                      alt={purchase.user.name} 
                      className="w-10 h-10 rounded-full mr-3 border border-gray-200" 
                    />
                    <div className="overflow-hidden">
                      <p className="font-bold text-gray-800 truncate max-w-[180px]">
                        {purchase.user.name || "Unknown User"}
                      </p>
                      <p className="text-xs text-gray-400 truncate max-w-[180px]">
                        @{purchase.user.username || "unknown"}
                      </p>
                    </div>
                  </div>
                  <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    {purchase.package}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm border-t border-gray-100 pt-3">
                  <div>
                    <p className="text-gray-400 text-[10px] uppercase font-bold">Amount</p>
                    <p className="font-bold text-gray-900">₹{purchase.amount}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 text-[10px] uppercase font-bold">Date</p>
                    <p className="text-gray-700 text-xs">{purchaseTime.full}</p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-xl italic">
            No purchase records found.
          </div>
        )}
      </div>

      {/* Desktop Purchase History Table (hidden on small screens) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                User
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Package
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Buying Date
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Amount
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {currentPurchases.length > 0 ? (
              currentPurchases.map((purchase) => {
                const purchaseTime = formatDate(purchase.buyingDate);
                return (
                  <tr
                    key={purchase.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <img
                          src={purchase.user.avatar || "/default-avatar.jpg"}
                          alt={purchase.user.name}
                          className="w-10 h-10 rounded-full mr-3 border border-gray-100 shadow-sm"
                        />
                        <div className="overflow-hidden">
                          <p className="font-medium text-gray-800">
                            {purchase.user.name}
                          </p>
                          <p className="text-xs text-gray-400">
                            @{purchase.user.username}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-xs font-semibold">
                        {purchase.package}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <p className="font-medium text-gray-700">{purchaseTime.full}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {purchaseTime.relative}
                      </p>
                    </td>
                    <td className="py-3 px-4 font-bold text-gray-900">
                      ₹{purchase.amount}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-12 text-gray-400 italic">
                  No purchase records found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-8 gap-1 md:gap-2">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1.5 md:px-4 md:py-2 border rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium transition-colors"
          >
            Prev
          </button>
          <div className="flex items-center px-2 md:px-4 text-sm font-semibold text-gray-600">
            <span className="md:hidden">{currentPage}/{totalPages}</span>
            <span className="hidden md:inline">Page {currentPage} of {totalPages}</span>
          </div>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 md:px-4 md:py-2 border rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default PurchaseHistory;
