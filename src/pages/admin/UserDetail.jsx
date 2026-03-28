import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  FiLogIn,
  FiBell,
  FiSlash,
  FiCreditCard,
  FiHeart,
  FiEye,
  FiImage,
} from "react-icons/fi";
import toast from "react-hot-toast";
import {
  getUserDetails,
  updateUserDetails,
  toggleVerification,
  banUser,
  unbanUser,
} from "../../api/adminApi/adminApi";
const ToggleBar = ({ title, value, onChange }) => {
  return (
    <div className="w-[320px]">
      <p className="mb-2 font-medium text-gray-700">{title}</p>

      <div
        onClick={() => onChange()}
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

const UserDetail = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getUserDetails(userId);
        setUser(res.user);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggle = async (field) => {
    try {
      const res = await toggleVerification(userId, {
        field,
        value: !user[field],
      });

      setUser(res.user);
    } catch (err) {
      console.error("Toggle error:", err);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await updateUserDetails(userId, user);
      setUser(res.user);
      
      toast.success("User updated successfully");
    } catch (error) {
      console.error("Update error:", error);
    }
  };
  const stats = [
    {
      title: "Active Package",
      value: "Premium",
      icon: <FiCreditCard className="text-blue-500" />,
    },
    {
      title: "Remaining Interest",
      value: "145",
      icon: <FiHeart className="text-red-500" />,
    },
    {
      title: "Remaining Contact View",
      value: "298",
      icon: <FiEye className="text-green-500" />,
    },
    {
      title: "Remaining Image Upload",
      value: "8",
      icon: <FiImage className="text-purple-500" />,
    },
  ];

  if (!user) {
    return (
      <div className="text-center text-xl font-bold">
        Loading user details...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h4 className="text-2xl font-bold text-gray-800">
          User Detail - {user.firstName} {user.lastName}
        </h4>
        <button className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-colors">
          <FiLogIn className="mr-2" /> Login as User
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4"
          >
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
        {user.isBanned ? (
          <button
            onClick={async () => {
              try {
                const res = await unbanUser(userId);
                setUser(res.user);
                toast.success("User unbanned");
              } catch (err) {
                console.error(err);
              }
            }}
            className="flex items-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
          >
            Unban User
          </button>
        ) : (
          <button
            onClick={async () => {
              try {
                const res = await banUser(userId, "Admin action");
                setUser(res.user);
                toast.success("User banned");
              } catch (err) {
                console.error(err);
              }
            }}
            className="flex items-center bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Ban User
          </button>
        )}
      </div>

      {/* User Information Form */}
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h4 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">
          Information of {user.firstName} {user.lastName}
        </h4>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={user.firstName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={user.lastName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={user.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mobile Number
              </label>
              <input
                type="text"
                name="mobile"
                value={user.mobile}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={user.address}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                type="text"
                name="city"
                value={user.city}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State
              </label>
              <input
                type="text"
                name="state"
                value={user.state}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Zip/Postal
              </label>
              <input
                type="text"
                name="zip"
                value={user.zip}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <input
                type="text"
                name="country"
                value={user.country}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
          </div>

          <div className="flex gap-6 p-6">
            <ToggleBar
              title="Email Verification"
              value={user.isEmailVerified}
              onChange={() => handleToggle("isEmailVerified")}
            />

            <ToggleBar
              title="Mobile Verification"
              value={user.isPhoneVerified}
              onChange={() => handleToggle("isPhoneVerified")}
            />

            <ToggleBar
              title="KYC"
              value={user.isKycVerified}
              onChange={() => handleToggle("isKycVerified")}
            />
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
