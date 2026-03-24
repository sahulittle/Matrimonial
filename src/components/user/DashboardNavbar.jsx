import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import {
  Bell,
  MessageCircle,
  Heart,
  Search,
  Settings,
  LogOut,
  ChevronDown,
  Star,
  LayoutDashboard,
  Users,
  Eye,
  Menu,
  User,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
const NavbarIconButton = ({ icon: Icon, onClick, badge, className = "" }) => {
  return (
    <button
      onClick={onClick}
      className={`relative p-2 rounded-full text-white cursor-pointer hover:bg-white/10 transition-all duration-200 ${className}`}
    >
      <Icon className="w-5 h-5" />
      {badge > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold border-2 border-pink-600">
          {badge > 9 ? "9+" : badge}
        </span>
      )}
    </button>
  );
};

const Navbar = ({ toggleSidebar }) => {
  const { profile: currentProfile, logout, appData } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();
  const userMenuRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const {
    shortlistCount,
    unreadMessagesCount,
    pendingInterestsCount,
    unreadNotificationsCount: unreadCount,
    recommendationsCount,
  } = appData || {};

  const menuItems = [
    { path: "/user/dashboard", label: "Dashboard", icon: LayoutDashboard },
    {
      path: "/user/matches",
      label: "Matches",
      icon: Users,
      badge: recommendationsCount,
    },
    { path: "/user/visitors", label: "Visitors", icon: Eye },
    { path: "/user/settings", label: "Settings", icon: Settings },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/user/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const DropdownItem = ({ icon: Icon, label, to, onClick, isDanger }) => {
    const classes = `flex w-full items-center gap-3 px-4 py-2.5 text-sm rounded-md ${
      isDanger
        ? "text-red-600 hover:bg-red-50"
        : "text-gray-700 hover:bg-gray-100"
    }`;

    const handleClick = () => {
      setShowUserMenu(false);
      if (onClick) onClick();
    };

    return to ? (
      <Link to={to} onClick={handleClick} className={classes}>
        <Icon className="w-4 h-4" />
        {label}
      </Link>
    ) : (
      <button onClick={handleClick} className={classes}>
        <Icon className="w-4 h-4" />
        {label}
      </button>
    );
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <nav className="bg-gradient-to-r from-pink-600 to-rose-600 h-16">
        <div className="px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          {/* LEFT */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="lg:hidden text-white p-2"
            >
              <Menu className="w-6 h-6" />
            </button>

            <Link to="/user/dashboard" className="flex items-center gap-2">
              <div className="w-52 h-12 bg-white rounded-lg flex items-center justify-center shadow">
                <img
                  src="/logo-rmbg.png"
                  alt="MatriLab Logo"
                  className=" h-auto object-cover scale-125"
                />
              </div>
            </Link>
          </div>

          {/* SEARCH */}
          <form
            onSubmit={handleSearch}
            className="w-full max-w-lg hidden sm:block"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2 rounded-full bg-white outline-none"
              />
            </div>
          </form>

          {/* RIGHT */}
          <div className="flex items-center gap-2">
            <NavbarIconButton
              icon={Star}
              badge={shortlistCount}
              onClick={() => navigate("/user/shortlist")}
            />
            <NavbarIconButton
              icon={MessageCircle}
              badge={unreadMessagesCount}
              onClick={() => navigate("/user/messages")}
            />
            <NavbarIconButton
              icon={Heart}
              badge={pendingInterestsCount}
              onClick={() => navigate("/user/interests")}
            />
            <NavbarIconButton
              icon={Bell}
              badge={unreadCount}
              onClick={() => navigate("/user/notifications")}
            />

            {/* USER MENU */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-2 rounded-full hover:bg-white/10"
              >
                {currentProfile?.avatar ? (
                  <img
                    src={currentProfile?.avatar || "/default-avatar.png"}
                    alt={currentProfile?.name}
                    className="w-8 h-8 rounded-full object-cover border-2 border-white/50"
                  />
                ) : (
                  <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                    {currentProfile?.name?.charAt(0) || "U"}
                  </div>
                )}

                <ChevronDown className="text-white hidden sm:block" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl p-2">
                  <div className="px-2 py-2 border-b mb-2">
                    <p className="font-semibold">
                      {currentProfile?.name || "User"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {currentProfile?.email}
                    </p>
                  </div>

                  <DropdownItem
                    to="/user/profile"
                    label="My Profile"
                    icon={User}
                  />
                  <DropdownItem
                    to="/user/settings"
                    label="Settings"
                    icon={Settings}
                  />
                  <div className="h-px bg-gray-200 my-2"></div>
                  <DropdownItem
                    label="Logout"
                    icon={LogOut}
                    onClick={logout}
                    isDanger
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
