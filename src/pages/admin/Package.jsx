import React, { useState, useMemo } from 'react';
import { FiSearch, FiEye, FiMail, FiCalendar, FiAlertCircle, FiClock } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

// Helper to format date
const formatDate = (isoDate) => {
    return new Date(isoDate).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
};

const Package = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const names = [
        "James Smith", "Maria Garcia", "Robert Johnson", "Mary Williams", "Michael Brown", "Patricia Jones", 
        "David Miller", "Jennifer Davis", "William Rodriguez", "Linda Martinez", "Richard Hernandez", 
        "Elizabeth Lopez", "Joseph Gonzalez", "Susan Wilson", "Thomas Anderson", "Jessica Thomas"
    ];

    // Mock data generation
    const allSubscribers = useMemo(() => {
        return Array.from({ length: 50 }, (_, i) => {
            const userName = names[i % names.length];
            const userUsername = userName.toLowerCase().replace(/\s/g, '');
            const validity = [30, 90, 365][i % 3];
            const price = [499, 1299, 4999][i % 3];
            
            // Generate expiry dates: some within 15 days, some further out
            const daysUntilExpiry = Math.floor(Math.random() * 30); // 0 to 29 days
            const endingDate = new Date();
            endingDate.setDate(endingDate.getDate() + daysUntilExpiry);
            
            const startedDate = new Date(endingDate);
            startedDate.setDate(startedDate.getDate() - validity);

            return {
                id: i + 1,
                user: { 
                    id: i + 1, 
                    name: userName, 
                    username: userUsername, 
                    avatar: `https://i.pravatar.cc/150?u=${userUsername}${i}` 
                },
                packageName: ['Basic', 'Premium', 'VIP'][i % 3],
                startedAt: startedDate.toISOString(),
                endingAt: endingDate.toISOString(),
                validity: validity,
                price: price
            };
        });
    }, []);

    // Filter for packages expiring in exactly 15 days or less
    const expiringSoon = useMemo(() => {
        const today = new Date();
        return allSubscribers.filter(pkg => {
            const expiry = new Date(pkg.endingAt);
            const diffTime = expiry - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            const matchesSearch = pkg.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                pkg.user.username.toLowerCase().includes(searchTerm.toLowerCase());

            return diffDays >= 0 && diffDays <= 15 && matchesSearch;
        });
    }, [allSubscribers, searchTerm]);

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = expiringSoon.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(expiringSoon.length / itemsPerPage);

    const handleSendReminder = (username) => {
        toast.success(`Expiry reminder email sent to @${username}`);
    };

  return (
    <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-lg shadow-sm">
            <div>
                <h4 className="text-2xl font-bold text-gray-800">Expiring Packages</h4>
                <p className="text-gray-500 text-sm flex items-center mt-1">
                    <FiAlertCircle className="mr-1 text-orange-500" /> 
                    Showing users whose membership expires within the next 15 days
                </p>
            </div>
            
            <div className="relative w-full md:w-80">
                <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    className="w-full pl-10 pr-4 py-2 border rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                />
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Package Details</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Timeline</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Price</th>
                            <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {currentItems.length > 0 ? currentItems.map((pkg) => {
                            const daysLeft = Math.ceil((new Date(pkg.endingAt) - new Date()) / (1000 * 60 * 60 * 24));
                            
                            return (
                                <tr key={pkg.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <img className="h-10 w-10 rounded-full object-cover border-2 border-pink-100" src={pkg.user.avatar} alt="" />
                                            <div className="ml-4">
                                                <div className="text-sm font-bold text-gray-900">{pkg.user.name}</div>
                                                <div className="text-sm text-gray-500">@{pkg.user.username}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                            {pkg.packageName}
                                        </span>
                                        <div className="text-xs text-gray-500 mt-1 flex items-center">
                                            <FiClock className="mr-1" /> {pkg.validity} Days Validity
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-700 font-medium flex items-center">
                                            <FiCalendar className="mr-2 text-gray-400" /> {formatDate(pkg.startedAt)} - {formatDate(pkg.endingAt)}
                                        </div>
                                        <div className={`text-xs mt-1 font-semibold ${daysLeft <= 5 ? 'text-red-500' : 'text-orange-500'}`}>
                                            {daysLeft === 0 ? 'Expires today' : `${daysLeft} days remaining`}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-bold text-gray-800">
                                        ₹{pkg.price.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                        <div className="flex justify-center items-center gap-3">
                                            <Link 
                                                to={`/admin/users/detail/${pkg.user.id}`} 
                                                className="text-blue-600 hover:text-blue-900 bg-blue-50 p-2 rounded-lg transition-colors"
                                                title="View User Details"
                                            >
                                                <FiEye size={18} />
                                            </Link>
                                            <button 
                                                onClick={() => handleSendReminder(pkg.user.username)}
                                                className="text-pink-600 hover:text-pink-900 bg-pink-50 p-2 rounded-lg transition-colors"
                                                title="Send Email Reminder"
                                            >
                                                <FiMail size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        }) : (
                            <tr>
                                <td colSpan="5" className="px-6 py-10 text-center text-gray-500 italic">No packages expiring in the next 15 days matching your search.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="bg-white px-4 py-4 flex items-center justify-between border-t border-gray-200 sm:px-6">
                    <div className="flex-1 flex justify-center items-center gap-4">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <span className="text-sm text-gray-700 font-medium">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
};

export default Package;