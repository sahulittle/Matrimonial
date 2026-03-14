import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FiLogIn, FiBell, FiSlash, FiCreditCard, FiHeart, FiEye, FiImage } from 'react-icons/fi';

const ToggleBar = ({ title, value, onChange }) => {
  return (
    <div className="w-[320px]">
      <p className="mb-2 font-medium text-gray-700">{title}</p>

      <div
        onClick={() => onChange(!value)}
        className={`relative h-11 rounded-md flex items-center justify-center text-white font-semibold cursor-pointer transition-all duration-300 ${
          value ? "bg-green-500" : "bg-red-500"
        }`}
      >
        {value ? "Verified" : "Unverified"}

        <div
          className={`absolute top-1 w-2.5 h-9 bg-slate-900 rounded transition-all duration-300 ${
            value ? "right-1" : "left-1"
          }`}
        ></div>
      </div>
    </div>
  );
};

// Mock data source, should be the same as in ActiveUsers.jsx
const existingUsers = [
    { id: 1, firstName: 'John', lastName: 'Doe', username: 'johndoe', email: 'john.doe@example.com', mobile: '123-456-7890', country: 'USA', joined: '2023-01-15', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d', address: '123 Main St', city: 'Anytown', state: 'Anystate', zip: '12345', emailVerified: true, mobileVerified: false, kycVerified: true },
    { id: 2, firstName: 'Jane', lastName: 'Smith', username: 'janesmith', email: 'jane.smith@example.com', mobile: '987-654-3210', country: 'Canada', joined: '2023-02-20', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', address: '456 Oak Ave', city: 'Someville', state: 'Somestate', zip: '54321', emailVerified: false, mobileVerified: true, kycVerified: false },
    { id: 3, firstName: 'Sam', lastName: 'Wilson', username: 'samwilson', email: 'sam.wilson@example.com', mobile: '555-555-5555', country: 'UK', joined: '2023-03-10', avatar: 'https://i.pravatar.cc/150?u=a04258114e29026702d', address: '789 Pine Ln', city: 'Otherplace', state: 'Otherstate', zip: '67890', emailVerified: true, mobileVerified: true, kycVerified: true },
    { id: 4, firstName: 'Banned', lastName: 'User 1', username: 'banned1', email: 'banned1@example.com', mobile: '111-222-3333', country: 'USA', joined: '2022-12-01', avatar: 'https://i.pravatar.cc/150?u=banned1', address: '1 Banned Way', city: 'Banville', state: 'Banstate', zip: '00000', emailVerified: false, mobileVerified: false, kycVerified: false },
    { id: 5, firstName: 'Banned', lastName: 'User 2', username: 'banned2', email: 'banned2@example.com', mobile: '444-555-6666', country: 'Germany', joined: '2023-01-01', avatar: 'https://i.pravatar.cc/150?u=banned2', address: '2 Banned St', city: 'Banburg', state: 'Banland', zip: '11111', emailVerified: true, mobileVerified: false, kycVerified: false },
    { id: 6, firstName: 'Unverified', lastName: 'Email 1', username: 'unverified1', email: 'unverified1@example.com', mobile: '777-888-9999', country: 'Australia', joined: '2023-04-05', avatar: 'https://i.pravatar.cc/150?u=unverified1', address: '3 Unverified Rd', city: 'Unverified City', state: 'Unverified State', zip: '22222', emailVerified: false, mobileVerified: true, kycVerified: true },
    { id: 7, firstName: 'Pending', lastName: 'KYC 1', username: 'pendingkyc1', email: 'pendingkyc1@example.com', mobile: '123-123-1234', country: 'India', joined: '2023-05-10', avatar: 'https://i.pravatar.cc/150?u=pendingkyc1', address: '4 Pending Plaza', city: 'Pendington', state: 'Pending State', zip: '33333', emailVerified: true, mobileVerified: true, kycVerified: false },
    { id: 8, firstName: 'Pending', lastName: 'KYC 2', username: 'pendingkyc2', email: 'pendingkyc2@example.com', mobile: '456-456-4567', country: 'Brazil', joined: '2023-05-12', avatar: 'https://i.pravatar.cc/150?u=pendingkyc2', address: '5 Pending Ave', city: 'Pendingville', state: 'Pending State', zip: '44444', emailVerified: true, mobileVerified: true, kycVerified: false },
];

const generateUsers = (count, startId) => {
    const users = [];
    const countries = ['USA', 'Canada', 'UK', 'Australia', 'India', 'Germany', 'Brazil', 'Japan', 'France', 'Nigeria'];
    for (let i = 1; i <= count; i++) {
        const userId = startId + i - 1;
        const joinDate = new Date(new Date() - Math.random() * 365 * 24 * 60 * 60 * 1000);
        users.push({
            id: userId,
            firstName: `User`,
            lastName: `${userId}`,
            username: `user${userId}`,
            email: `user${userId}@example.com`,
            mobile: `${Math.floor(100 + Math.random() * 900)}-${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`,
            country: countries[i % countries.length],
            joined: joinDate.toISOString().split('T')[0],
            avatar: `https://i.pravatar.cc/150?u=user${userId}`,
            address: `${userId} Mockingbird Lane`,
            city: `Mockville`,
            state: `Mock-a-chusetts`,
            zip: `${String(Math.floor(10000 + Math.random() * 90000))}`,
            emailVerified: Math.random() > 0.2,
            mobileVerified: Math.random() > 0.3,
            kycVerified: Math.random() > 0.5,
        });
    }
    return users;
};

const allUsers = [...existingUsers, ...generateUsers(92, 9)];

const UserDetail = () => {
    const { userId } = useParams();
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Find the user from the mock data source
        const foundUser = allUsers.find(u => u.id === parseInt(userId));
        if (foundUser) {
            setUser(foundUser);
        }
    }, [userId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser(prev => ({ ...prev, [name]: value }));
    };

    const handleToggle = (field) => {
        setUser(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const stats = [
        { title: 'Active Package', value: 'Premium', icon: <FiCreditCard className="text-blue-500" /> },
        { title: 'Remaining Interest', value: '145', icon: <FiHeart className="text-red-500" /> },
        { title: 'Remaining Contact View', value: '298', icon: <FiEye className="text-green-500" /> },
        { title: 'Remaining Image Upload', value: '8', icon: <FiImage className="text-purple-500" /> },
    ];

    if (!user) {
        return <div className="text-center text-xl font-bold">Loading user details...</div>;
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h4 className="text-2xl font-bold text-gray-800">User Detail - {user.firstName} {user.lastName}</h4>
                <button className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-colors">
                    <FiLogIn className="mr-2" /> Login as User
                </button>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
                        <div className="text-3xl">{stat.icon}</div>
                        <div>
                            <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
                            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
                <button className="flex items-center bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">
                    <FiLogIn className="mr-2" /> Logins
                </button>
                <button className="flex items-center bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">
                    <FiBell className="mr-2" /> Notification
                </button>
                <button className="flex items-center bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
                    <FiSlash className="mr-2" /> Ban User
                </button>
            </div>

            {/* User Information Form */}
            <div className="bg-white p-8 rounded-lg shadow-md">
                <h4 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">Information of {user.firstName} {user.lastName}</h4>
                <form>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                            <input type="text" name="firstName" value={user.firstName} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                            <input type="text" name="lastName" value={user.lastName} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input type="email" name="email" value={user.email} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                            <input type="text" name="mobile" value={user.mobile} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                            <input type="text" name="address" value={user.address} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                            <input type="text" name="city" value={user.city} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                            <input type="text" name="state" value={user.state} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Zip/Postal</label>
                            <input type="text" name="zip" value={user.zip} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                            <input type="text" name="country" value={user.country} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500" />
                        </div>
                    </div>

                    <div className="flex gap-6 p-6">
                        <ToggleBar title="Email Verification" value={user.emailVerified} onChange={() => handleToggle('emailVerified')} />
                        <ToggleBar title="Mobile Verification" value={user.mobileVerified} onChange={() => handleToggle('mobileVerified')} />
                        <ToggleBar title="KYC" value={user.kycVerified} onChange={() => handleToggle('kycVerified')} />
                    </div>

                    <div className="mt-8 flex justify-end">
                        <button
                            type="submit"
                            className="bg-pink-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-pink-700"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserDetail;