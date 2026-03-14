import React from 'react';
import { FiUsers, FiUserCheck, FiMail, FiSmartphone, FiPackage, FiHeart, FiUserX, FiFlag } from 'react-icons/fi';
import { FaMoneyBillWave, FaHourglassHalf, FaTimesCircle, FaFileInvoiceDollar } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const StatCard = ({ icon, title, value, color }) => (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
        <div className={`text-3xl p-3 rounded-full ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-gray-500 text-sm font-medium">{title}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);

const Dashboard = () => {
    const stats = [
        { title: 'Total Users', value: '1,234', icon: <FiUsers />, color: 'bg-blue-100 text-blue-600' },
        { title: 'Active Users', value: '987', icon: <FiUserCheck />, color: 'bg-green-100 text-green-600' },
        { title: 'Email Unverified', value: '123', icon: <FiMail />, color: 'bg-yellow-100 text-yellow-600' },
        { title: 'Mobile Unverified', value: '246', icon: <FiSmartphone />, color: 'bg-orange-100 text-orange-600' },
        { title: 'Total Payment', value: '$5,432', icon: <FaMoneyBillWave />, color: 'bg-teal-100 text-teal-600' },
        { title: 'Pending Payment', value: '$321', icon: <FaHourglassHalf />, color: 'bg-purple-100 text-purple-600' },
        { title: 'Rejected Payment', value: '$109', icon: <FaTimesCircle />, color: 'bg-red-100 text-red-600' },
        { title: 'Payment Charge', value: '$54', icon: <FaFileInvoiceDollar />, color: 'bg-indigo-100 text-indigo-600' },
        { title: 'Purchased Package', value: '45', icon: <FiPackage />, color: 'bg-pink-100 text-pink-600' },
        { title: 'Total Interests', value: '5,678', icon: <FiHeart />, color: 'bg-rose-100 text-rose-600' },
        { title: 'Ignored Profiles', value: '345', icon: <FiUserX />, color: 'bg-slate-100 text-slate-600' },
        { title: 'Reports', value: '23', icon: <FiFlag />, color: 'bg-amber-100 text-amber-600' },
    ];

    const browserData = [
        { name: 'Chrome', logins: 4000 },
        { name: 'Firefox', logins: 3000 },
        { name: 'Safari', logins: 2000 },
        { name: 'Edge', logins: 2780 },
        { name: 'Other', logins: 1890 },
    ];

    const osData = [
        { name: 'Windows', value: 400 },
        { name: 'macOS', value: 300 },
        { name: 'Linux', value: 150 },
        { name: 'Android', value: 200 },
        { name: 'iOS', value: 250 },
    ];

    const countryData = [
        { name: 'USA', logins: 3500 },
        { name: 'India', logins: 4800 },
        { name: 'UK', logins: 1500 },
        { name: 'Canada', logins: 2100 },
        { name: 'Australia', logins: 1800 },
    ];

    const PIE_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    return (
        <div className="space-y-8">
            {/* Statistic Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <StatCard key={index} {...stat} />
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Login by Browser */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Login By Browser (Last 30 days)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={browserData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '0.5rem' }}
                                labelStyle={{ fontWeight: 'bold' }}
                            />
                            <Legend iconType="circle" iconSize={10} />
                            <Bar dataKey="logins" fill="#8884d8" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Login by OS */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Login By OS (Last 30 days)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={osData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                                {osData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '0.5rem' }}
                            />
                            <Legend iconType="circle" iconSize={10} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Login by Country */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Login By Country (Last 30 days)</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={countryData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '0.5rem' }}
                            labelStyle={{ fontWeight: 'bold' }}
                        />
                        <Legend iconType="circle" iconSize={10} />
                        <Bar dataKey="logins" fill="#22c55e" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default Dashboard