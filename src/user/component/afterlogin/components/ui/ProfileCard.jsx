import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Star, MapPin, Briefcase, GraduationCap } from 'lucide-react'
import {
  getCurrentUser,
  getShortlistForUser,
  addToShortlist,
  removeFromShortlist,
  sendInterest,
  getInterestsForUser,
} from '../../utils/storage'

const ProfileCard = ({ profile, showActions = true, size = 'md' }) => {
  const [isShortlisted, setIsShortlisted] = useState(false)
  const [isInterestSent, setIsInterestSent] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    const user = getCurrentUser()
    if (user) {
      setCurrentUser(user)
      const shortlistItems = getShortlistForUser(user.id)
      setIsShortlisted(
        shortlistItems.some((item) => String(item.id) === String(profile.id))
      )

      const { sent } = getInterestsForUser(user.id)
      setIsInterestSent(
        sent.some((i) => String(i.receiverId) === String(profile.id))
      )
    }
  }, [profile.id])

  const sizes = {
    sm: 'w-14 h-14',
    md: 'w-20 h-20',
    lg: 'w-28 h-28',
    xl: 'w-36 h-36'
  }

  const handleShortlist = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!currentUser) return

    if (isShortlisted) {
      removeFromShortlist(currentUser.id, profile.id)
      setIsShortlisted(false)
    } else {
      addToShortlist(currentUser.id, profile)
      setIsShortlisted(true)
    }
  }

  const handleSendInterest = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!currentUser || isInterestSent) return

    sendInterest({
      senderId: currentUser.id,
      receiverId: profile.id,
      profile,
    })
    setIsInterestSent(true)
  }

  return (
    <Link 
      to={`/profile/${profile.id}`}
      className="bg-white rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 group overflow-hidden"
    >
      {/* Image with zoom effect */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={profile.avatar}
          alt={profile.name}
          className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-300"
        />
        {profile.compatibility && (
          <div className="absolute top-2 right-2 bg-primary-500 text-white px-2 py-0.5 rounded text-xs font-semibold">
            {profile.compatibility}% Match
          </div>
        )}
        {isShortlisted && (
          <div className="absolute top-2 left-2 bg-yellow-500 p-1.5 rounded-lg">
            <Star className="w-3 h-3 text-white fill-current" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3">
        <h3 className="font-semibold text-gray-900 text-base mb-0.5">{profile.name}</h3>
        <p className="text-gray-500 text-xs mb-2">{profile.age} yrs, {profile.height || '5\'6"'}</p>

        <div className="space-y-1 mb-3">
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <Briefcase className="w-3.5 h-3.5 text-gray-400" />
            <span className="truncate">{profile.education?.occupation || profile.occupation}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <MapPin className="w-3.5 h-3.5 text-gray-400" />
            <span className="truncate">{profile.location?.city}, {profile.location?.state}</span>
          </div>
          {profile.education?.qualification && (
            <div className="flex items-center gap-1.5 text-xs text-gray-600">
              <GraduationCap className="w-3.5 h-3.5 text-gray-400" />
              <span className="truncate">{profile.education.qualification}</span>
            </div>
          )}
        </div>

        {showActions && (
          <div className="flex gap-1.5">
            <button
              onClick={handleSendInterest}
              disabled={isInterestSent}
              className={`flex-1 py-2 text-xs font-medium rounded-lg transition-colors ${
                isInterestSent
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-primary-500 text-white hover:bg-primary-600'
              }`}
            >
              {isInterestSent ? '✓ Sent' : '❤️ Interest'}
            </button>
            <button
              onClick={handleShortlist}
              className={`p-2 rounded-lg border transition-all ${
                isShortlisted
                  ? 'border-primary-500 bg-primary-50 text-primary-500'
                  : 'border-gray-200 text-gray-400 hover:border-primary-500 hover:text-primary-500'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${isShortlisted ? 'fill-current' : ''}`} />
            </button>
          </div>
        )}
      </div>
    </Link>
  )
}

export default ProfileCard
