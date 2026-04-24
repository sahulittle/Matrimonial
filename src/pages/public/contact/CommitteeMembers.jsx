import React from "react";
import Footer from "../home/Footer";

const members = [
  {
    id: 1,
    name: "Mr. Ashok R. Barabde",
    role: "President / Trustee",
  },
  {
    id: 2,
    name: "Mr. Gajanan D. Nage",
    role: "Executive Trustee / General Secretary",
  },
  {
    id: 3,
    name: "Mr. Sanjeev S. Barabde",
    role: "Trustee / Treasurer",
  },
  {
    id: 4,
    name: "Adv. Navneet S. Bhojane",
    role: "Trustee / Vice President",
  },
  {
    id: 5,
    name: "Mr. Purushottam Ramkrushan Bhuyar",
    role: "Trustee",
  },
];

const CommitteeMembers = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 to-red-500 py-10 text-center text-white">
        <h1 className="text-2xl md:text-4xl font-bold">
          Committee Members
        </h1>
        <p className="mt-2 text-sm md:text-base opacity-90">
          Our trusted leadership team
        </p>
      </div>

      {/* Table / Cards */}
      <div className="max-w-5xl mx-auto px-4 py-10">
        
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border border-gray-300 bg-white shadow-lg rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border">#</th>
                <th className="p-3 border text-left">Name</th>
                <th className="p-3 border text-left">Designation</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.id} className="hover:bg-gray-50">
                  <td className="p-3 border text-center">{m.id}</td>
                  <td className="p-3 border font-medium">{m.name}</td>
                  <td className="p-3 border">{m.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {members.map((m) => (
            <div
              key={m.id}
              className="bg-white p-4 rounded-xl shadow border"
            >
              <p className="text-sm text-gray-500">#{m.id}</p>
              <h2 className="font-semibold text-lg">{m.name}</h2>
              <p className="text-gray-600 text-sm mt-1">{m.role}</p>
            </div>
          ))}
        </div>

      </div>

      <Footer />
    </div>
  );
};

export default CommitteeMembers;