import React from 'react'
import { Link } from 'react-router-dom'
import { Heart, Check, X, Clock, MapPin, Briefcase } from 'lucide-react'
import { updateInterestStatus } from '../../utils/storage'
import { useAuth } from '../../context/AuthContext'

const InterestCard = ({ interest, type = 'received', onUpdate }) => {
  const { user } = useAuth()

  const profiles = JSON.parse(localStorage.getItem("profiles")) || {}

  // Resolve profile - use senderId for received, receiverId for sent
  const getProfile = () => {
    // For received interests, show the sender
    // For sent interests, show the receiver
    const profileId = type === 'received' ? interest.senderId : interest.receiverId
    
    // Convert to string since localStorage keys are strings
    const profile = profiles[String(profileId)]
    if (profile) return profile
    
    return { id: profileId, name: 'Unknown', age: '', avatar: '/default-avatar.png' }
  }

  const profile = getProfile()
  const message = interest?.message
  const status = interest?.status
  const receivedAt = interest?.receivedAt || interest?.timestamp
  const sentAt = interest?.sentAt || interest?.timestamp

  const handleAccept = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!user) return
    updateInterestStatus(user.id, interest.id, 'accepted')
    if (onUpdate) onUpdate()
  }

  const handleDecline = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!user) return
    updateInterestStatus(user.id, interest.id, 'declined')
    if (onUpdate) onUpdate()
  }

  const getStatusBadge = () => {
    switch (status) {
      case 'accepted':
        return (
          <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
            <Check className="w-3 h-3" />
            Accepted
          </span>
        )
      case 'declined':
        return (
          <span className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
            <X className="w-3 h-3" />
            Declined
          </span>
        )
      default:
        return (
          <span className="flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        )
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''

    const date = new Date(dateString)
    const now = new Date()
    const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24))

    if (diff === 0) return 'Today'
    if (diff === 1) return 'Yesterday'
    if (diff < 7) return `${diff} days ago`

    return date.toLocaleDateString()
  }

  return (
    <Link
      to={`/profile/${profile?.id || ''}`}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all"
    >
      <div className="flex gap-4 p-4">

        {/* Avatar */}
        <div className="relative shrink-0">
          <img
            src={profile?.avatar || "/default-avatar.png"}
            alt={profile?.name || "User"}
            className="w-20 h-20 rounded-2xl object-cover"
          />

          {status === 'accepted' && (
            <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
              <Check className="w-3 h-3 text-white" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">

          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <h3 className="font-semibold text-gray-900">
                {profile?.name || "Unknown"}
              </h3>

              <p className="text-gray-500 text-sm">
                {profile?.age || ""} years
              </p>
            </div>

            {getStatusBadge()}
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">

            <span className="flex items-center gap-1">
              <Briefcase className="w-4 h-4" />
              {profile?.profession || profile?.education?.occupation || "Not specified"}
            </span>

            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {profile?.location?.city || "Not specified"}
            </span>

          </div>

          {message && (
            <p className="text-sm text-gray-600 line-clamp-2 mb-3">
              "{message}"
            </p>
          )}

          <p className="text-xs text-gray-400">
            {type === 'received' ? 'Received' : 'Sent'} {formatDate(receivedAt || sentAt)}
          </p>

        </div>

      </div>

      {/* Actions */}
      {type === 'received' && status === 'pending' && (
        <div className="border-t border-gray-100 px-4 py-3 flex gap-3">

          <button
            onClick={handleAccept}
            className="flex-1 py-2.5 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            Accept
          </button>

          <button
            onClick={handleDecline}
            className="flex-1 py-2.5 border-2 border-gray-200 text-gray-600 rounded-xl font-medium hover:border-gray-300 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <X className="w-4 h-4" />
            Decline
          </button>

        </div>
      )}
    </Link>
  )
}

export default InterestCard
