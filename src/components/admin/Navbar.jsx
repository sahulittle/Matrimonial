import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaBell, FaCog, FaUserCircle, FaAngleDown, FaSignOutAlt, FaKey, FaUser } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../hooks/useApi';

const Navbar = ({ onHamburger, collapsed, onToggleCollapse }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const notificationsRef = useRef(null);
  const { logout } = useAuth();

  const { notifications, unreadCount, getNotifications, getUnreadCount, markAsRead, markAllAsRead } = useNotifications();

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Load notifications on mount
  useEffect(() => {
    getNotifications().catch(() => {});
    getUnreadCount().catch(() => {});

    // Listen to AdminLayout custom events dispatched from socket handlers
    const handler = (e) => {
      const data = e?.detail || e;
      // Refresh notifications list and unread count
      getNotifications().catch(() => {});
      getUnreadCount().catch(() => {});
    };

    window.addEventListener("socket:notification:new", handler);
    return () => window.removeEventListener("socket:notification:new", handler);
  }, []);

  return (
    <nav className="bg-white shadow-md px-6 py-3 fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Left Side: Hamburger + Logo */}
        <div className="flex items-center gap-3">
          <button onClick={onHamburger} className="p-2 rounded-md text-gray-700 hover:text-pink-600 lg:hidden" aria-label="Open menu">
            <FaSearch className="hidden" />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <Link to="/admin/dashboard" className="text-2xl font-bold text-pink-600">
            AdminPanel
          </Link>

          <button onClick={onToggleCollapse} className="hidden lg:inline-flex p-2 rounded-md text-gray-600 hover:text-pink-600" aria-label="Toggle collapse sidebar">
            {/* {collapsed ? 'Expand' : 'Collapse'} */}
          </button>
        </div>

        {/* Center: Search Bar */}
        <div className="relative w-1/3 hidden md:block">
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 border rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>

        {/* Right Side: Icons and Profile */}
        <div className="flex items-center space-x-6">
          {/* Notifications */}
          <div className="relative" ref={notificationsRef}>
            <button
              className="text-gray-600 hover:text-pink-600 relative"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              aria-haspopup="true"
            >
              <FaBell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">{unreadCount}</span>
              )}
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-2 z-50 border">
                <div className="flex items-center justify-between px-4 py-2 border-b">
                  <div className="font-semibold">Notifications</div>
                  <div className="text-sm">
                    <button className="text-pink-600 text-sm" onClick={() => { markAllAsRead().catch(()=>{}); getUnreadCount().catch(()=>{}); }}>Mark all read</button>
                  </div>
                </div>
                <div className="max-h-64 overflow-auto">
                  {notifications && notifications.length > 0 ? (
                    notifications.map((n) => (
                      <div key={n._id} className={`px-4 py-2 text-sm flex items-start gap-2 hover:bg-gray-50 ${n.isRead ? 'text-gray-600' : 'text-gray-800'}`}>
                        <div className="w-2 h-2 mt-2 rounded-full bg-pink-500" />
                        <div className="flex-1">
                          <div className="font-medium">{n.title}</div>
                          <div className="text-xs text-gray-500">{n.message}</div>
                          <div className="text-xs text-gray-400">{new Date(n.createdAt).toLocaleString()}</div>
                        </div>
                        {!n.isRead && (
                          <button className="text-pink-600 text-xs ml-2" onClick={() => { markAsRead(n._id).catch(()=>{}); getUnreadCount().catch(()=>{}); }}>Mark</button>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-4 text-sm text-gray-500">No notifications</div>
                  )}
                </div>
                <div className="border-t mt-2">
                  <Link to="/admin/notifications" onClick={() => setNotificationsOpen(false)} className="block px-4 py-2 text-center text-sm text-pink-600 hover:bg-gray-100">View all</Link>
                </div>
              </div>
            )}
          </div>
          {/* <button className="text-gray-600 hover:text-pink-600 hidden sm:inline-block">
            <FaCog size={20} />
          </button> */}

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
                {/* <Link to="/admin/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setDropdownOpen(false)}>
                  <FaUser className="mr-3" /> Profile
                </Link> */}
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