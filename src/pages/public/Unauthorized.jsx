import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

const Unauthorized = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full text-center">
                {/* Icon */}
                <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
                    <ShieldAlert className="w-10 h-10 text-red-500" />
                </div>

                {/* Title */}
                <h1 className="text-3xl font-bold text-gray-800 mb-3">
                    Access Denied
                </h1>

                {/* Message */}
                <p className="text-gray-500 mb-8 leading-relaxed">
                    You don't have permission to access this page.
                    Please contact your administrator if you believe this is an error.
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        to="/"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-pink-600 text-white rounded-lg font-medium hover:bg-pink-700 transition-colors shadow-lg shadow-pink-500/20"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Go to Home
                    </Link>
                    <Link
                        to="/login"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors border border-gray-200"
                    >
                        Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Unauthorized;
