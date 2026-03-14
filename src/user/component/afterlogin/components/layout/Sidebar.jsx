import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../../../../context/AuthContext'

import {
  LayoutDashboard, 
  Users, 
  Search, 
  Heart, 
  MessageCircle, 
  Star, 
  User, 
  Settings, 
  X,
  Eye
} from 'lucide-react'

const Sidebar = ({ isOpen, onClose }) => {
  const { appData } = useAuth()
  const location = useLocation()
  const {
    recommendationsCount,
    pendingInterestsCount: pendingInterests,
    unreadMessagesCount: unreadMessages,
    shortlistCount,
  } = appData || {}

  const menuItems = [
    { 
      path: '/afterlogin/dashboard',
      label: 'Dashboard', 
      icon: LayoutDashboard,
      badge: null
    },
    { 
      path: '/afterlogin/matches',
      label: 'Matches', 
      icon: Users,
      badge: recommendationsCount > 0 ? recommendationsCount : null
    },
    { 
      path: '/afterlogin/search',
      label: 'Search', 
      icon: Search,
      badge: null
    },
    { 
      path: '/afterlogin/interests',
      label: 'Interests', 
      icon: Heart,
      badge: pendingInterests > 0 ? pendingInterests : null
    },
    { 
      path: '/afterlogin/messages',
      label: 'Messages', 
      icon: MessageCircle,
      badge: unreadMessages > 0 ? unreadMessages : null
    },
    { 
      path: '/afterlogin/shortlist',
      label: 'Shortlist', 
      icon: Star,
      badge: shortlistCount > 0 ? shortlistCount : null
    },
    { 
      path: '/afterlogin/visitors',
      label: 'Visitors', 
      icon: Eye,
      badge: null
    },
    { 
      path: '/afterlogin/profile',
      label: 'My Profile', 
      icon: User,
      badge: null
    },
    { 
      path: '/afterlogin/settings',
      label: 'Settings', 
      icon: Settings,
      badge: null
    },
  ]

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed top-0 left-0 h-full w-[260px] bg-white border-r border-gray-200 z-40
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo and close button container */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 flex-shrink-0">
            <Link to="/afterlogin/dashboard" className="flex items-center gap-3" onClick={onClose}>
              <div className="w-9 h-9 bg-pink-600 rounded-lg flex items-center justify-center shadow-md shadow-pink-500/20">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-800 tracking-tight">
                MatriLab
              </span>
            </Link>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 lg:hidden"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={`
                    group flex items-center gap-3.5 px-4 py-2.5 rounded-lg transition-all duration-200
                    ${isActive 
                      ? 'bg-pink-50 text-pink-600 font-semibold' 
                      : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 transition-colors ${isActive ? 'text-pink-500' : 'text-gray-400 group-hover:text-gray-500'}`} />
                  <span className="flex-1 text-sm">{item.label}</span>
                  {item.badge && (
                    <span className={`
                      ml-auto px-2 py-0.5 text-xs font-bold rounded-full
                      ${isActive 
                        ? 'bg-pink-600 text-white' 
                        : 'bg-gray-200 text-gray-700'}
                    `}>
                      {item.badge > 99 ? '99+' : item.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Premium Card */}
          <div className="mt-auto p-4">
            <div className="bg-gradient-to-tr from-pink-50 to-rose-50 border border-pink-100 rounded-xl p-4 text-center">
              <h4 className="font-semibold text-gray-800">Go Premium</h4>
              <p className="text-xs text-gray-500 mt-1 mb-4">Unlock more features and get more matches!</p>
              <Link to="/packages" onClick={onClose} className="block w-full py-2 bg-pink-500 text-white rounded-lg text-sm font-medium shadow-lg shadow-pink-500/20 hover:bg-pink-600 transition-all">
                Upgrade
              </Link>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
