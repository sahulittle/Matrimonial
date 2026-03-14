import React from 'react';
import { FiMenu, FiCheckCircle } from 'react-icons/fi';

const Update = () => {
    const currentVersion = "2.3";

    return (
        <div className="bg-white p-8 rounded-lg shadow-md">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b pb-4">
                <h4 className="text-2xl font-bold text-gray-800">System Update</h4>
                <button className="flex items-center bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors mt-4 md:mt-0">
                    <FiMenu className="mr-2" /> Update Log
                </button>
            </div>

            {/* Update Status */}
            <div className="text-center py-12 bg-gray-50 rounded-lg">
                <div className="flex justify-center items-center mb-4">
                    <FiCheckCircle className="text-green-500 mr-3" size={48} />
                    <div>
                        <h1 className="text-5xl font-bold text-gray-800">{currentVersion}</h1>
                        <p className="text-sm text-gray-500 font-medium">Your Version</p>
                    </div>
                </div>
                <p className="max-w-2xl mx-auto text-gray-600 leading-relaxed mt-6">
                    You are currently using the latest version of the system. We are committed to continuous improvement and are actively developing the next version. Stay tuned for exciting new features and enhancements to be released soon!
                </p>
            </div>
        </div>
    );
};

export default Update;