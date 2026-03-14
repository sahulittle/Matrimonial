import React, { useState } from 'react';
import { FiSearch, FiEye, FiX } from 'react-icons/fi';

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

const NotificationHistory = () => {
    const [usernameSearch, setUsernameSearch] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const notificationsPerPage = 15;

    const names = [
        "James Smith", "Maria Garcia", "Robert Johnson", "Mary Williams", "Michael Brown", "Patricia Jones", "David Miller", "Jennifer Davis",
        "William Rodriguez", "Linda Martinez", "Richard Hernandez", "Elizabeth Lopez", "Joseph Gonzalez", "Susan Wilson", "Thomas Anderson", "Jessica Thomas",
        "Charles Taylor", "Sarah Moore", "Christopher Jackson", "Karen Martin", "Daniel Lee", "Nancy Perez", "Matthew Thompson", "Lisa White",
        "Anthony Harris", "Betty Sanchez", "Mark Clark", "Dorothy Ramirez", "Donald Lewis", "Sandra Robinson", "Steven Walker", "Ashley Young",
        "Paul Allen", "Kimberly King", "Andrew Wright", "Donna Scott", "Joshua Torres", "Carol Nguyen", "Kevin Hill", "Michelle Flores",
        "Brian Green", "Emily Adams", "George Nelson", "Helen Carter", "Edward Mitchell", "Amanda Perez", "Ronald Roberts", "Melissa Turner",
        "Timothy Phillips", "Deborah Campbell"
    ];

    const subjects = ["Welcome to the Platform!", "Your Profile has been updated", "New Message Received", "Package Expiration Reminder", "Special Offer Just For You"];

    // Mock data for 50 notification history entries
    const notificationHistory = Array.from({ length: 50 }, (_, i) => {
        const userName = names[i % names.length];
        const userUsername = userName.toLowerCase().replace(/\s/g, '');
        const notificationDate = new Date(Date.now() - i * 1000 * 60 * 60 * (Math.random() * 18 + 1));
        const subject = subjects[i % subjects.length];

        return {
            id: i + 1,
            user: { name: userName, username: userUsername, avatar: `https://i.pravatar.cc/150?u=${userUsername}` },
            sent: 'Email',
            sender: 'Admin',
            subject: subject,
            date: notificationDate.toISOString(),
            details: `This is the full notification message for the subject: "${subject}". It was sent to ${userName}. Thank you for your attention.`
        };
    });

    const filteredHistory = notificationHistory.filter(notification => {
        const userMatch = notification.user.name.toLowerCase().includes(usernameSearch.toLowerCase()) ||
                          notification.user.username.toLowerCase().includes(usernameSearch.toLowerCase());

        const notificationDate = new Date(notification.date);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        if (start) start.setHours(0, 0, 0, 0);
        if (end) end.setHours(23, 59, 59, 999);

        const dateMatch = (!start || notificationDate >= start) && (!end || notificationDate <= end);

        return userMatch && dateMatch;
    });

    // Pagination logic
    const indexOfLastLog = currentPage * notificationsPerPage;
    const indexOfFirstLog = indexOfLastLog - notificationsPerPage;
    const currentLogs = filteredHistory.slice(indexOfFirstLog, indexOfLastLog);
    const totalPages = Math.ceil(filteredHistory.length / notificationsPerPage);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const openModal = (notification) => {
        setSelectedNotification(notification);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedNotification(null);
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-md">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h4 className="text-2xl font-bold text-gray-800">Notification History</h4>
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

            {/* Notification History Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase">User</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase">Sent</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase">Sender</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase">Subject</th>
                            <th className="py-3 px-4 text-center text-sm font-semibold text-gray-600 uppercase">Action</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700">
                        {currentLogs.map((notification) => (
                                <tr key={notification.id} className="border-b border-gray-200 hover:bg-gray-50">
                                    <td className="py-3 px-4"><div className="flex items-center"><img src={notification.user.avatar} alt={notification.user.name} className="w-10 h-10 rounded-full mr-4" /><div><p className="font-medium text-gray-800">{notification.user.name}</p><p className="text-sm text-gray-500">@{notification.user.username}</p></div></div></td>
                                    <td className="py-3 px-4">{notification.sent}</td>
                                    <td className="py-3 px-4">{notification.sender}</td>
                                    <td className="py-3 px-4 font-medium">{notification.subject}</td>
                                    <td className="py-3 px-4 text-center"><button onClick={() => openModal(notification)} className="flex items-center justify-center mx-auto bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600"><FiEye className="mr-1" /> Details</button></td>
                                </tr>
                            ))}
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

            {/* Details Modal */}
            {isModalOpen && selectedNotification && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"><div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl"><div className="flex justify-between items-center mb-4 border-b pb-4"><h4 className="text-xl font-bold text-gray-800">Notification Details</h4><button onClick={closeModal} className="text-gray-500 hover:text-gray-800"><FiX size={24} /></button></div><div><h5 className="font-bold text-lg mb-2">{selectedNotification.subject}</h5><div className="grid grid-cols-2 gap-4 mb-4 text-sm"><p className="text-gray-600"><strong>To:</strong> {selectedNotification.user.name}</p><p className="text-gray-600"><strong>From:</strong> {selectedNotification.sender}</p><p className="text-gray-600"><strong>Sent Via:</strong> {selectedNotification.sent}</p><p className="text-gray-600"><strong>Date:</strong> {formatDate(selectedNotification.date).full}</p></div><p className="text-gray-700 bg-gray-50 p-4 rounded-md">{selectedNotification.details}</p></div><div className="mt-6 flex justify-end"><button type="button" onClick={closeModal} className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300">Close</button></div></div></div>
            )}
        </div>
    );
};

export default NotificationHistory;