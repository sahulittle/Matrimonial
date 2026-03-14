import React, { useState } from 'react';
import { FiSearch } from 'react-icons/fi';

// Helper to format date and calculate relative time
const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    const formattedTime = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));

    let relativeTime = 'just now';
    if (diffInDays > 0) {
        relativeTime = `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    } else if (diffInHours > 0) {
        relativeTime = `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    }

    return {
        full: `${formattedDate} ${formattedTime}`,
        relative: relativeTime
    };
};

const LoginHistory = () => {
    const [usernameSearch, setUsernameSearch] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const logsPerPage = 15;

    const names = [
        "James Smith", "Maria Garcia", "Robert Johnson", "Mary Williams", "Michael Brown", "Patricia Jones", "David Miller", "Jennifer Davis",
        "William Rodriguez", "Linda Martinez", "Richard Hernandez", "Elizabeth Lopez", "Joseph Gonzalez", "Susan Wilson", "Thomas Anderson", "Jessica Thomas",
        "Charles Taylor", "Sarah Moore", "Christopher Jackson", "Karen Martin", "Daniel Lee", "Nancy Perez", "Matthew Thompson", "Lisa White",
        "Anthony Harris", "Betty Sanchez", "Mark Clark", "Dorothy Ramirez", "Donald Lewis", "Sandra Robinson", "Steven Walker", "Ashley Young",
        "Paul Allen", "Kimberly King", "Andrew Wright", "Donna Scott", "Joshua Torres", "Carol Nguyen", "Kevin Hill", "Michelle Flores",
        "Brian Green", "Emily Adams", "George Nelson", "Helen Carter", "Edward Mitchell", "Amanda Perez", "Ronald Roberts", "Melissa Turner",
        "Timothy Phillips", "Deborah Campbell"
    ];

    const browsers = ["Chrome on Windows", "Safari on macOS", "Firefox on Linux", "Edge on Windows", "Chrome on Android", "Safari on iOS"];
    const locations = ["New York, USA", "London, UK", "Tokyo, Japan", "Sydney, Australia", "Mumbai, India", "Berlin, Germany"];

    // Mock data for 50 login history entries
    const loginHistory = Array.from({ length: 50 }, (_, i) => {
        const userName = names[i % names.length];
        const userUsername = userName.toLowerCase().replace(/\s/g, '');
        const loginDate = new Date(Date.now() - i * 1000 * 60 * 60 * (Math.random() * 24 + 1));

        return {
            id: i + 1,
            user: { name: userName, username: userUsername, avatar: `https://i.pravatar.cc/150?u=${userUsername}` },
            loginAt: loginDate.toISOString(),
            ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
            location: locations[i % locations.length],
            browserOS: browsers[i % browsers.length],
        };
    });

    const filteredHistory = loginHistory.filter(log => {
        const userMatch = log.user.name.toLowerCase().includes(usernameSearch.toLowerCase()) ||
                          log.user.username.toLowerCase().includes(usernameSearch.toLowerCase());

        const logDate = new Date(log.loginAt);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        if (start) start.setHours(0, 0, 0, 0);
        if (end) end.setHours(23, 59, 59, 999);

        const dateMatch = (!start || logDate >= start) && (!end || logDate <= end);

        return userMatch && dateMatch;
    });

    // Pagination logic
    const indexOfLastLog = currentPage * logsPerPage;
    const indexOfFirstLog = indexOfLastLog - logsPerPage;
    const currentLogs = filteredHistory.slice(indexOfFirstLog, indexOfLastLog);
    const totalPages = Math.ceil(filteredHistory.length / logsPerPage);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="bg-white p-8 rounded-lg shadow-md">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h4 className="text-2xl font-bold text-gray-800">User Login History</h4>
                <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                    <div className="relative w-full md:w-64">
                        <input
                            type="text"
                            placeholder="Search by username..."
                            value={usernameSearch}
                            onChange={(e) => { setUsernameSearch(e.target.value); setCurrentPage(1); }}
                            className="w-full pl-10 pr-4 py-2 border rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500"
                        />
                        <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="date" value={startDate} onChange={(e) => { setStartDate(e.target.value); setCurrentPage(1); }} className="w-full px-3 py-2 border rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500" />
                        <span>-</span>
                        <input type="date" value={endDate} onChange={(e) => { setEndDate(e.target.value); setCurrentPage(1); }} className="w-full px-3 py-2 border rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500" />
                    </div>
                </div>
            </div>

            {/* Login History Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase">User</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase">Login At</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase">IP</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase">Location</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase">Browser | OS</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700">
                        {currentLogs.map((log) => {
                            const loginTime = formatDate(log.loginAt);
                            return (
                                <tr key={log.id} className="border-b border-gray-200 hover:bg-gray-50">
                                    <td className="py-3 px-4"><div className="flex items-center"><img src={log.user.avatar} alt={log.user.name} className="w-10 h-10 rounded-full mr-4" /><div><p className="font-medium text-gray-800">{log.user.name}</p><p className="text-sm text-gray-500">@{log.user.username}</p></div></div></td>
                                    <td className="py-3 px-4"><p className="font-medium">{loginTime.full}</p><p className="text-sm text-gray-500">{loginTime.relative}</p></td>
                                    <td className="py-3 px-4 font-mono">{log.ip}</td>
                                    <td className="py-3 px-4">{log.location}</td>
                                    <td className="py-3 px-4">{log.browserOS}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center mt-6">
                    <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="px-4 py-2 mx-1 border rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">Previous</button>
                    <span className="px-4 py-2">Page {currentPage} of {totalPages}</span>
                    <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className="px-4 py-2 mx-1 border rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">Next</button>
                </div>
            )}
        </div>
    );
};

export default LoginHistory;