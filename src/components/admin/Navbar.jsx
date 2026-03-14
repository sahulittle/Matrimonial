import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaBell, FaCog, FaUserCircle, FaAngleDown, FaSignOutAlt, FaKey, FaUser } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { logout } = useAuth();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <nav className="bg-white shadow-md px-6 py-3 fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Left Side: Logo */}
        <div className="flex items-center">
          <Link to="/admin/dashboard" className="text-2xl font-bold text-pink-600">
            AdminPanel
          </Link>
        </div>

        {/* Center: Search Bar */}
        <div className="relative w-1/3">
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 border rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>

        {/* Right Side: Icons and Profile */}
        <div className="flex items-center space-x-6">
          <button className="text-gray-600 hover:text-pink-600 relative">
            <FaBell size={20} />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
          </button>
          <button className="text-gray-600 hover:text-pink-600">
            <FaCog size={20} />
          </button>

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-2 focus:outline-none"
            >
              <FaUserCircle size={32} className="text-gray-600" />
              <span className="text-gray-700 font-medium hidden md:block">Admin Name</span>
              <FaAngleDown className={`text-gray-600 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
                <Link to="/admin/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setDropdownOpen(false)}>
                  <FaUser className="mr-3" /> Profile
                </Link>
                <Link to="/admin/change-password" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setDropdownOpen(false)}>
                  <FaKey className="mr-3" /> Password
                </Link>
                <div className="border-t my-1"></div>
                <button
                  type="button"
                  className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  onClick={() => {
                    setDropdownOpen(false);
                    logout();
                  }}
                >
                  <FaSignOutAlt className="mr-3" /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar