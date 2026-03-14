import React from 'react';

const Server = () => {
  const serverInfo = [
    { name: 'PHP Version', value: '8.3.30' },
    { name: 'Server Software', value: 'LiteSpeed' },
    { name: 'Server IP Address', value: '51.195.7.173' },
    { name: 'Server Protocol', value: 'HTTP/1.1' },
    { name: 'HTTP Host', value: 'script.viserlab.com' },
    { name: 'Server Port', value: '443' },
  ];

  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
      <h4 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">Server Information</h4>
      <div className="space-y-4">
        {serverInfo.map((info, index) => (
          <div key={index} className="flex justify-between items-center bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
            <p className="font-semibold text-gray-700">{info.name}</p>
            <p className="font-mono text-gray-900 bg-gray-200 px-3 py-1 rounded-md">{info.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Server;