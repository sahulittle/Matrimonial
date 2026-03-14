import React from 'react';
import { FiCheckCircle, FiTrash2 } from 'react-icons/fi';

const Cache = () => {
  const cacheItems = [
    'Compiled views will be cleared',
    'Application cache will be cleared',
    'Route cache will be cleared',
    'Configuration cache will be cleared',
    'Compiled services and packages files will be removed',
    'Caches will be cleared',
  ];

  const handleClearCache = () => {
    // In a real application, you would make an API call here.
    // For now, we can just show an alert.
    alert('System cache cleared!');
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
      <h4 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">Clear System Cache</h4>
      
      <div className="space-y-4 mb-8">
        {cacheItems.map((item, index) => (
          <div key={index} className="flex items-center text-gray-700">
            <FiCheckCircle className="text-green-500 mr-3 flex-shrink-0" size={20} />
            <p>{item}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-6">
        <button
          onClick={handleClearCache}
          className="flex items-center bg-red-600 text-white px-8 py-3 rounded-lg shadow-md hover:bg-red-700 transition-colors font-semibold"
        >
          <FiTrash2 className="mr-2" /> Click to Clear
        </button>
      </div>
    </div>
  );
};

export default Cache;