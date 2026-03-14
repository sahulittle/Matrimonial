import React from 'react'
import { Link } from 'react-router-dom'
import { Heart, MessageCircle, Eye, Check, CheckCheck, X } from 'lucide-react'
import { markNotificationAsReadStorage } from '../../utils/storage'
import { useAuth } from '../../../../../context/AuthContext'

const NotificationItem = ({ notification, onRemove }) => {
  const { user, refreshData } = useAuth()
  
  const getIcon = (type) => {
    switch (type) {
      case 'interest':
        return <Heart className="w-5 h-5 text-pink-500" />
      case 'accept':
      case 'interest_accepted':
        return <CheckCheck className="w-5 h-5 text-green-500" />
      case 'message':
        return <MessageCircle className="w-5 h-5 text-blue-500" />
      case 'visit':
      case 'profile_view':
        return <Eye className="w-5 h-5 text-purple-500" />
      default:
        return <Heart className="w-5 h-5 text-gray-500" />
    }
  }

  const getLink = (type, senderId) => {
    switch (type) {
      case 'interest':
      case 'accept':
      case 'interest_accepted':
        return `/afterlogin/profile/${senderId}`
      case 'message':
        return '/afterlogin/messages'
      case 'visit':
      case 'profile_view':
        return `/afterlogin/profile/${senderId}`
      default:
        return '/notifications'
    }
  }

  const formatTime = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now - date) / 1000)

    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`
    return date.toLocaleDateString()
  }

  const handleClick = (e) => {
    // Don't navigate if clicking remove button
    if (e.target.closest('.remove-btn')) return
    
    if (!notification.read && user?.id) {
      markNotificationAsReadStorage(user.id, notification.id)
      refreshData()
    }
  }

  const handleRemove = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (onRemove) {
      onRemove(notification.id)
    }
  }

  // Use senderId for profile link (from seeded data)
  const profileId = notification.senderId || notification.profile?.id

  return (
    <Link
      to={getLink(notification.type, profileId)}
      onClick={handleClick}
      className={`flex items-start gap-4 p-4 hover:bg-gray-50 transition-colors ${
        !notification.read ? 'bg-primary-50/50' : ''
      }`}
    >
      {/* Icon/Avatar */}
      <div className="relative shrink-0">
        {notification.senderAvatar || notification.profile?.avatar ? (
          <img
            src={notification.senderAvatar || notification.profile?.avatar}
            alt={notification.senderName || notification.profile?.name || 'User'}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
            {getIcon(notification.type)}
          </div>
        )}
        {notification.type === 'interest' && (
          <div className="absolute -bottom-1 -right-1 bg-pink-500 rounded-full p-1">
            <Heart className="w-3 h-3 text-white fill-current" />
          </div>
        )}
        {(notification.type === 'accept' || notification.type === 'interest_accepted') && (
          <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
            <Check className="w-3 h-3 text-white" />
          </div>
        )}
        {notification.type === 'message' && (
          <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
            <MessageCircle className="w-3 h-3 text-white" />
          </div>
        )}
        {(notification.type === 'visit' || notification.type === 'profile_view') && (
          <div className="absolute -bottom-1 -right-1 bg-purple-500 rounded-full p-1">
            <Eye className="w-3 h-3 text-white" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-800">
          <span className="font-semibold">{notification.senderName || notification.profile?.name || 'Someone'}</span>{' '}
          {notification.message}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {formatTime(notification.timestamp || notification.createdAt)}
        </p>
      </div>

      {/* Remove button */}
      {onRemove && (
        <button
          onClick={handleRemove}
          className="remove-btn p-1 hover:bg-gray-200 rounded-full transition-colors"
        >
          <X className="w-4 h-4 text-gray-400" />
        </button>
      )}

      {/* Unread indicator */}
      {!notification.read && (
        <div className="w-2.5 h-2.5 bg-primary-500 rounded-full shrink-0 mt-2" />
      )}
    </Link>
  )
}

export default NotificationItem
