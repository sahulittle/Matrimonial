import React, { useState } from 'react';
import { FiMail, FiMessageSquare, FiSearch } from 'react-icons/fi';
// Helper to format date and calculate relative time
const RenewList = () => {
  const [renewals, setRenewals] = useState([
    { id: 1, userName: 'John Doe', packageName: 'Premium', startDate: '2024-01-15', endDate: '2024-02-15', mobile: '123-456-7890' },
    { id: 2, userName: 'Jane Smith', packageName: 'Basic', startDate: '2024-01-20', endDate: '2024-02-20', mobile: '987-654-3210' },
  ]);

  const [searchName, setSearchName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const filteredRenewals = renewals.filter(renewal => {
    const userMatch = renewal.userName.toLowerCase().includes(searchName.toLowerCase());
    const startDateMatch = startDate ? renewal.startDate >= startDate : true;
    const endDateMatch = endDate ? renewal.endDate <= endDate : true;

    return userMatch && startDateMatch && endDateMatch;
  });

  return (
    <div className="container mx-auto p-4 ">
      <div className=''>
        <h1 className="text-2xl font-semibold mb-4">Package Renewal List</h1>
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
              className="w-full px-3 py-2 border rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            /> <span>-</span>
            <input type="date" className="w-full px-3 py-2 border rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b text-left">ID</th>
                <th className="py-2 px-4 border-b text-left">User Name</th>
                <th className="py-2 px-4 border-b text-left">Package Name</th>
                <th className="py-2 px-4 border-b text-left">Start Date</th>
                <th className="py-2 px-4 border-b text-left">End Date</th>
                <th className="py-2 px-4 border-b text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRenewals.map((renewal) => (
                <tr key={renewal.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{renewal.id}</td>
                  <td className="py-2 px-4 border-b">{renewal.userName}</td>
                  <td className="py-2 px-4 border-b">{renewal.packageName}</td>
                  <td className="py-2 px-4 border-b">{renewal.startDate}</td>
                  <td className="py-2 px-4 border-b">{renewal.endDate}</td>
                  <td className="py-2 px-4 border-b">
                    <div className="flex gap-2">
                      <button
                        className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-3 rounded focus:outline-none focus:shadow-outline"
                        onClick={() => {
                          alert(`Send email to ${renewal.userName}`);
                        }}
                      >
                        <FiMail className="inline-block mr-1" />
                        Email
                      </button>
                      <button
                        className="bg-green-500 hover:bg-green-700 text-white py-1 px-3 rounded focus:outline-none focus:shadow-outline"
                        onClick={() => {
                          alert(`Send SMS to ${renewal.userName} at ${renewal.mobile}`);
                        }}
                      >
                        <FiMessageSquare className="inline-block mr-1" />
                        SMS
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredRenewals.length === 0 && (
            <div className="text-center py-4">
              <p className="text-gray-500">No renewals found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RenewList;
