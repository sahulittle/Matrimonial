import { useState, useEffect, useRef } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"

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
} from "lucide-react"

import { useAuth } from "../../../../../context/AuthContext"

const NavbarIconButton = ({ icon: Icon, onClick, badge, className = "" }) => {
  return (
    <button
      onClick={onClick}
      className={`relative p-2 rounded-full text-white cursor-pointer hover:bg-white/10 transition-all duration-200 ${className}`}
    >
      <Icon className="w-5 h-5" />
      {badge > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold border-2 border-pink-600">
          {badge > 9 ? '9+' : badge}
        </span>
      )}
    </button>
  )
}

const Navbar = ({ toggleSidebar }) => {
  const { profile: currentProfile, logout, appData } = useAuth()

  const location = useLocation()
  const navigate = useNavigate()
  const userMenuRef = useRef(null)

  const [searchQuery, setSearchQuery] = useState("")
  const [showUserMenu, setShowUserMenu] = useState(false)

  // Click outside to close user menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Calculate badge counts
  const {
    shortlistCount,
    unreadMessagesCount,
    pendingInterestsCount,
    unreadNotificationsCount: unreadCount,
    recommendationsCount,
  } = appData || {}

  const menuItems = [
    { path: "/afterlogin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/afterlogin/matches", label: "Matches", icon: Users, badge: recommendationsCount },
    { path: "/afterlogin/visitors", label: "Visitors", icon: Eye },
    { path: "/afterlogin/settings", label: "Settings", icon: Settings }
  ]

  const handleLogout = () => {
    logout()
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/afterlogin/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const DropdownItem = ({ icon: Icon, label, to, onClick, isDanger }) => {
    const commonClasses = `flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors rounded-md ${
      isDanger
        ? 'text-red-600 hover:bg-red-50'
        : 'text-gray-700 hover:bg-gray-100'
    }`;

    const content = (
      <>
        <Icon className="w-4 h-4" />
        <span>{label}</span>
      </>
    );

    const handleClick = () => {
      setShowUserMenu(false);
      if (onClick) onClick();
    };

    if (to) {
      return (
        <Link to={to} onClick={handleClick} className={commonClasses}>
          {content}
        </Link>
      );
    }

    return (
      <button onClick={handleClick} className={commonClasses}>
        {content}
      </button>
    );
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      {/* MAIN PINK NAVBAR */}
      <nav className="bg-gradient-to-r from-pink-600 to-rose-600 h-16">
        <div className="px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center gap-4">
              {/* Hamburger Menu for mobile */}
              <button
                onClick={toggleSidebar}
                className="lg:hidden text-white p-2 -ml-2"
              >
                <Menu className="w-6 h-6" />
              </button>

              {/* LOGO */}
              <Link to="/afterlogin/dashboard" className="flex items-center gap-2 flex-shrink-0">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow">
                  <Heart className="w-6 h-6 text-pink-600" />
                </div>
                <span className="text-xl font-bold text-white tracking-tight hidden sm:inline">
                  MatriLab
                </span>
              </Link>
            </div>

            {/* SEARCH */}
            <div className="flex-1 flex justify-center px-6">
              <form
                onSubmit={handleSearch}
                className="w-full max-w-lg"
              >
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by ID, Name, etc."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 rounded-full text-sm bg-white/90 focus:bg-white outline-none focus:ring-2 focus:ring-white/50 transition-all"
                  />
                </div>
              </form>
            </div>

            {/* RIGHT ICONS & USER MENU */}
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="hidden sm:flex items-center gap-1">
                <NavbarIconButton
                  icon={Star}
                  badge={shortlistCount}
                  onClick={() => navigate('/afterlogin/shortlist')}
                />
                <NavbarIconButton
                  icon={MessageCircle}
                  badge={unreadMessagesCount}
                  onClick={() => navigate('/afterlogin/messages')}
                />
                <NavbarIconButton
                  icon={Heart}
                  badge={pendingInterestsCount}
                  onClick={() => navigate('/afterlogin/interests')}
                />
                <NavbarIconButton
                  icon={Bell}
                  badge={unreadCount}
                  onClick={() => navigate('/afterlogin/notifications')}
                />
              </div>

              {/* USER MENU */}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  <img
                    src={currentProfile?.avatar}
                    alt={currentProfile?.name}
                    className="w-8 h-8 rounded-full object-cover border-2 border-white/50"
                  />
                  <ChevronDown className="w-5 h-5 text-white hidden sm:block" />
                </button>

                {showUserMenu && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-2xl p-2 origin-top-right"
                  >
                    <div className="px-2 py-2 border-b border-gray-200 mb-2">
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {currentProfile?.name || 'User'}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {currentProfile?.email || 'user@example.com'}
                      </p>
                    </div>
                    <DropdownItem to="/afterlogin/profile" label="My Profile" icon={User} />
                    <DropdownItem to="/afterlogin/settings" label="Settings" icon={Settings} />
                    <div className="h-px bg-gray-200 my-2"></div>
                    <DropdownItem onClick={handleLogout} label="Logout" icon={LogOut} isDanger />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* SECOND NAVIGATION PANEL */}
      <div className="bg-white border-b border-gray-200 hidden lg:block">
        <div className="px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center -mb-px">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname.startsWith(item.path)

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors duration-200 ${
                    isActive
                      ? "border-pink-500 text-pink-600"
                      : "border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.badge > 0 && (
                    <span className="ml-1 px-2 py-0.5 text-xs font-semibold rounded-full bg-pink-100 text-pink-700">
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Navbar
