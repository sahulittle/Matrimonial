import React from 'react';

const Application = () => {
  const appInfo = [
    { name: 'Matrilab Version', value: '2.3' },
    { name: 'ViserAdmin Version', value: '5.1.16' },
    { name: 'Laravel Version', value: '11.46.0' },
    { name: 'Timezone', value: 'UTC' },
  ];

  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
      <h4 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">Application Information</h4>
      <div className="space-y-4">
        {appInfo.map((info, index) => (
          <div key={index} className="flex justify-between items-center bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
            <p className="font-semibold text-gray-700">{info.name}</p>
            <p className="font-mono text-gray-900 bg-gray-200 px-3 py-1 rounded-md">{info.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Application;