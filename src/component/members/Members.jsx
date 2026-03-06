import React, { useEffect, useState } from 'react';

const Members = () => {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const storedMembers = JSON.parse(localStorage.getItem('members')) || [];
    setMembers(storedMembers);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 mt-18">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-10">
          Our Members
        </h2>
        {members.length === 0 ? (
          <p className="text-center text-gray-500">No members found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map((member, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">
                      {member.firstName} {member.lastName}
                    </h3>
                    <span className="px-3 py-1 text-xs font-semibold text-pink-600 bg-pink-100 rounded-full">
                      {member.job}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    {member.birthName && <p><span className="font-medium">Birth Name:</span> {member.birthName}</p>}
                    <p><span className="font-medium">Birth Time / Height:</span> {member.birthTime} / {member.height}</p>
                    <p><span className="font-medium">Education:</span> {member.education}</p>
                    <p><span className="font-medium">Income:</span> {member.annualIncome}</p>
                    <p><span className="font-medium">Complexion:</span> {member.complexion}</p>
                    <p><span className="font-medium">Blood Group:</span> {member.bloodGroup}</p>
                    <div className="border-t border-gray-200 pt-2 mt-2">
                        <p className="font-medium text-gray-800 mb-1">Family Details:</p>
                        <p><span className="font-medium">Father:</span> {member.fatherName} ({member.fatherJob})</p>
                        <p><span className="font-medium">Mother:</span> {member.motherName} ({member.motherJob})</p>
                        <p><span className="font-medium">Siblings:</span> {member.siblings}</p>
                        {member.paternalUncleName && <p><span className="font-medium">Paternal Uncle:</span> {member.paternalUncleName} ({member.paternalUncleJob || 'N/A'})</p>}
                        {member.maternalUncleName && <p><span className="font-medium">Maternal Uncle:</span> {member.maternalUncleName} ({member.maternalUncleJob || 'N/A'})</p>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Members;