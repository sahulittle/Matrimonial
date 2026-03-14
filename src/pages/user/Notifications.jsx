import { useState, useEffect } from 'react'
import { Bell, Check, Trash2 } from 'lucide-react'
import NotificationItem from '../../components/ui/NotificationItem'
import {
  getUserNotifications,
  markAllNotificationsAsRead,
  removeNotificationStorage,
} from '../../utils/storage'
import { useAuth } from '../../context/AuthContext'

const Notifications = () => {
  const { user, refreshData } = useAuth()
  const [notifications, setNotifications] = useState([])
  const unreadCount = notifications.filter(n => !n.read).length

  useEffect(() => {
    if (user) {
      setNotifications(getUserNotifications(user.id))
    }
  }, [user])

  const handleMarkAllAsRead = () => {
    if (user?.id) {
      markAllNotificationsAsRead(user.id)
      setNotifications(getUserNotifications(user.id))
      refreshData()
    }
  }

  const handleRemoveNotification = (notificationId) => {
    if (user?.id) {
      removeNotificationStorage(user.id, notificationId)
      setNotifications(getUserNotifications(user.id))
      refreshData()
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-500">Stay updated with your activity</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <Check className="w-4 h-4" />
            Mark all as read
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center">
              <Bell className="w-5 h-5 text-pink-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{notifications.length}</p>
              <p className="text-sm text-gray-500">Total</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <Bell className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{unreadCount}</p>
              <p className="text-sm text-gray-500">Unread</p>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      {notifications.length > 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {notifications.map((notification) => (
            <NotificationItem 
              key={notification.id} 
              notification={notification} 
              onRemove={(id) => handleRemoveNotification(id)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
          <Bell className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Notifications</h3>
          <p className="text-gray-500">You're all caught up!</p>
        </div>
      )}
    </div>
  )
}

export default Notifications
