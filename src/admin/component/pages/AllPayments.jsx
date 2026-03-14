import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiEye, FiX, FiCheckCircle, FiClock, FiXCircle, FiLoader, FiChevronRight } from 'react-icons/fi';

// Helper to format date and calculate relative time
const formatInitiated = (isoDate) => {
    const date = new Date(isoDate);
    const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    const formattedTime = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const diffInMonths = Math.floor(diffInDays / 30.44);
    const diffInYears = Math.floor(diffInDays / 365.25);

    let relativeTime = 'just now';
    if (diffInYears > 0) {
        relativeTime = `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
    } else if (diffInMonths > 0) {
        relativeTime = `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
    } else if (diffInDays > 0) {
        relativeTime = `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }

    return {
        full: `${formattedDate} ${formattedTime}`,
        relative: relativeTime
    };
};

const AllPayments = () => {
    const [usernameSearch, setUsernameSearch] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const paymentsPerPage = 15;

    const names = useMemo(() => [
        "James Smith", "Maria Garcia", "Robert Johnson", "Mary Williams", "Michael Brown", "Patricia Jones", "David Miller", "Jennifer Davis",
        "William Rodriguez", "Linda Martinez", "Richard Hernandez", "Elizabeth Lopez", "Joseph Gonzalez", "Susan Wilson", "Thomas Anderson", "Jessica Thomas",
        "Charles Taylor", "Sarah Moore", "Christopher Jackson", "Karen Martin", "Daniel Lee", "Nancy Perez", "Matthew Thompson", "Lisa White",
        "Anthony Harris", "Betty Sanchez", "Mark Clark", "Dorothy Ramirez", "Donald Lewis", "Sandra Robinson", "Steven Walker", "Ashley Young",
        "Paul Allen", "Kimberly King", "Andrew Wright", "Donna Scott", "Joshua Torres", "Carol Nguyen", "Kevin Hill", "Michelle Flores",
        "Brian Green", "Emily Adams", "George Nelson", "Helen Carter", "Edward Mitchell", "Amanda Perez", "Ronald Roberts", "Melissa Turner",
        "Timothy Phillips", "Deborah Campbell", "Jason Parker", "Stephanie Evans", "Jeffrey Edwards", "Rebecca Collins", "Ryan Stewart", "Laura Morris",
        "Jacob Rogers", "Sharon Reed", "Gary Cook", "Cynthia Morgan", "Nicholas Bell", "Kathleen Murphy", "Eric Bailey", "Amy Rivera",
        "Jonathan Cooper", "Shirley Richardson", "Stephen Cox", "Angela Howard", "Larry Ward", "Brenda Torres", "Justin Peterson", "Pamela Gray",
        "Scott Ramirez", "Nicole James", "Brandon Watson", "Emma Brooks", "Benjamin Kelly", "Rachel Sanders", "Samuel Price", "Catherine Bennett",
        "Gregory Wood", "Heather Barnes", "Frank Ross", "Diane Henderson", "Patrick Coleman", "Teresa Jenkins", "Walter Perry", "Evelyn Powell",
        "Dennis Long", "Christina Patterson", "Jerry Hughes", "Judith Flores", "Tyler Washington", "Martha Simmons", "Aaron Foster", "Cheryl Butler",
        "Henry Hughes", "Janet Washington", "Adam Simmons", "Joyce Foster", "Peter Butler", "Debra Hughes", "Willie Washington", "Frances Simmons",
        ...Array.from({ length: 100 }, (_, i) => `User ${i + 101}`) // Add more names to reach 200
    ], []);

    // Mock data for 200 payments
    const payments = useMemo(() => {
        const statuses = ['Successful', 'Pending', 'Rejected', 'Initiated'];
        return Array.from({ length: 200 }, (_, i) => {
            const userName = names[i];
            const userUsername = userName.toLowerCase().replace(/\s/g, '');
            const initiatedDate = new Date(Date.now() - i * 1000 * 60 * 60 * 12 * (Math.random() * 10 + 1));
            const amount = (Math.random() * 5000 + 500);
            const status = statuses[i % statuses.length];

            return {
                id: i + 1,
                gateway: 'Bank Wire',
                transactionId: `TXN${Date.now() - i * 100000}`,
                initiated: initiatedDate.toISOString(),
                user: { name: userName, username: userUsername, avatar: `https://i.pravatar.cc/150?u=${userUsername}` },
                amount: amount.toFixed(2),
                conversion: '1 USD = 83.25 INR',
                status: status,
                details: {
                    'Transaction Number': `TXN${Date.now() - i * 100000}`,
                    'Gateway Name': 'Bank Wire',
                    'Amount': `₹${amount.toFixed(2)}`,
                    'Payable': `₹${(amount * 1.02).toFixed(2)}`,
                    'Conversion Rate': '1 USD = 83.25 INR',
                    'Status': status,
                    'Initiated At': initiatedDate.toLocaleString(),
                    'User': `${userName} (@${userUsername})`
                }
            };
        });
    }, [names]);

    const paymentStats = useMemo(() => {
        const stats = {
            successful: { total: 0, count: 0, icon: <FiCheckCircle />, color: 'green', link: '/admin/payments/successful' },
            pending: { total: 0, count: 0, icon: <FiClock />, color: 'yellow', link: '/admin/payments/pending' },
            rejected: { total: 0, count: 0, icon: <FiXCircle />, color: 'red', link: '/admin/payments/rejected' },
            initiated: { total: 0, count: 0, icon: <FiLoader />, color: 'blue', link: '/admin/payments/initiated' },
        };
        payments.forEach(p => {
            const statusKey = p.status.toLowerCase();
            if (stats[statusKey]) {
                stats[statusKey].total += parseFloat(p.amount);
                stats[statusKey].count++;
            }
        });
        return stats;
    }, [payments]);

    const filteredPayments = useMemo(() => payments.filter(payment => {
        const userMatch = payment.user.name.toLowerCase().includes(usernameSearch.toLowerCase()) ||
                          payment.user.username.toLowerCase().includes(usernameSearch.toLowerCase());
        const paymentDate = new Date(payment.initiated);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;
        if (start) start.setHours(0, 0, 0, 0);
        if (end) end.setHours(23, 59, 59, 999);
        const dateMatch = (!start || paymentDate >= start) && (!end || paymentDate <= end);
        return userMatch && dateMatch;
    }), [payments, usernameSearch, startDate, endDate]);

    // Pagination logic
    const indexOfLastPayment = currentPage * paymentsPerPage;
    const indexOfFirstPayment = indexOfLastPayment - paymentsPerPage;
    const currentPayments = filteredPayments.slice(indexOfFirstPayment, indexOfLastPayment);
    const totalPages = Math.ceil(filteredPayments.length / paymentsPerPage);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const openModal = (payment) => {
        setSelectedPayment(payment);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedPayment(null);
    };

    const statusConfig = {
        Successful: { className: 'bg-green-100 text-green-700' },
        Pending: { className: 'bg-yellow-100 text-yellow-700' },
        Rejected: { className: 'bg-red-100 text-red-700' },
        Initiated: { className: 'bg-blue-100 text-blue-700' },
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h4 className="text-2xl font-bold text-gray-800">Payment History</h4>
                <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                    <div className="relative w-full md:w-64"><input type="text" placeholder="Search by username..." value={usernameSearch} onChange={(e) => { setUsernameSearch(e.target.value); setCurrentPage(1); }} className="w-full pl-10 pr-4 py-2 border rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500" /><FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" /></div>
                    <div className="flex items-center gap-2"><input type="date" value={startDate} onChange={(e) => { setStartDate(e.target.value); setCurrentPage(1); }} className="w-full px-3 py-2 border rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500" /><span>-</span><input type="date" value={endDate} onChange={(e) => { setEndDate(e.target.value); setCurrentPage(1); }} className="w-full px-3 py-2 border rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500" /></div>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {Object.entries(paymentStats).map(([key, value]) => (
                    <Link to={value.link} key={key} className={`bg-white p-6 rounded-lg shadow-md flex items-center justify-between hover:shadow-lg transition-shadow border-l-4 border-${value.color}-500`}>
                        <div className="flex items-center space-x-4">
                            <div className={`text-3xl text-${value.color}-500`}>{value.icon}</div>
                            <div>
                                <p className="text-gray-500 text-sm font-medium uppercase">{key} Payments</p>
                                <p className="text-2xl font-bold text-gray-800">₹{value.total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                            </div>
                        </div>
                        <FiChevronRight className="text-gray-400" />
                    </Link>
                ))}
            </div>

            {/* Payments Table */}
            <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase">Gateway | Transaction</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase">Initiated</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase">User</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase">Amount</th>
                                <th className="py-3 px-4 text-center text-sm font-semibold text-gray-600 uppercase">Status</th>
                                <th className="py-3 px-4 text-center text-sm font-semibold text-gray-600 uppercase">Action</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-700">
                            {currentPayments.map((payment) => {
                                const initiatedTime = formatInitiated(payment.initiated);
                                return (
                                    <tr key={payment.id} className="border-b border-gray-200 hover:bg-gray-50">
                                        <td className="py-3 px-4"><p className="font-medium text-gray-800">{payment.gateway}</p><p className="text-sm text-gray-500">{payment.transactionId}</p></td>
                                        <td className="py-3 px-4"><p className="font-medium">{initiatedTime.full}</p><p className="text-sm text-gray-500">{initiatedTime.relative}</p></td>
                                        <td className="py-3 px-4"><div className="flex items-center"><img src={payment.user.avatar} alt={payment.user.name} className="w-10 h-10 rounded-full mr-4" /><div><p className="font-medium text-gray-800">{payment.user.name}</p><p className="text-sm text-gray-500">@{payment.user.username}</p></div></div></td>
                                        <td className="py-3 px-4"><p className="font-bold text-gray-800">₹{payment.amount}</p></td>
                                        <td className="py-3 px-4 text-center"><span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusConfig[payment.status]?.className}`}>{payment.status}</span></td>
                                        <td className="py-3 px-4 text-center"><button onClick={() => openModal(payment)} className="flex items-center justify-center mx-auto bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600"><FiEye className="mr-1" /> Details</button></td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (<div className="flex justify-center items-center mt-6"><button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="px-4 py-2 mx-1 border rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">Previous</button><span className="px-4 py-2">Page {currentPage} of {totalPages}</span><button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className="px-4 py-2 mx-1 border rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">Next</button></div>)}
            </div>

            {/* Details Modal */}
            {isModalOpen && selectedPayment && (<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"><div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg"><div className="flex justify-between items-center mb-4 border-b pb-4"><h4 className="text-xl font-bold text-gray-800">Payment Details</h4><button onClick={closeModal} className="text-gray-500 hover:text-gray-800"><FiX size={24} /></button></div><div className="space-y-3">{Object.entries(selectedPayment.details).map(([key, value]) => (<div key={key} className="flex justify-between border-b py-2"><p className="font-semibold text-gray-600">{key}</p><p className="text-gray-800 text-right">{value}</p></div>))}</div><div className="mt-6 flex justify-end"><button type="button" onClick={closeModal} className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300">Close</button></div></div></div>)}
        </div>
    );
};

export default AllPayments;