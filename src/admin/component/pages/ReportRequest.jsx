import React from 'react';
import { Bug } from 'lucide-react';
import { Headset } from 'lucide-react';

const ReportRequest = () => {
  // Mock data is empty as per the request "no user"
  const reports = [];

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h4 className="text-2xl font-bold text-gray-800">Your Listed Report & Request</h4>
        <div className="flex gap-4">
          <button className="flex items-center bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 transition-colors gap-2">
            <Bug  size={20}/> Report a Bug
          </button>
          <button className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition-colors gap-2">
           <Headset size={20}/> Request a Support
          </button>
        </div>
      </div>

      {/* Reports Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase">Type</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase">Message</th>
              <th className="py-3 px-4 text-center text-sm font-semibold text-gray-600 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {reports.length > 0 ? (
              reports.map((report, index) => (
                <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4">{report.type}</td>
                  <td className="py-3 px-4">{report.message}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold`}>
                      {report.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center py-10 text-gray-500">
                  Data not found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportRequest;