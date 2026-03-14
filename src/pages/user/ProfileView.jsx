import { useParams, Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Users, 
  Heart, 
  MessageCircle, 
  Star,
  ArrowLeft
} from 'lucide-react'

import {
  getProfiles,
  getCurrentUser,
  getUserProfile,
  getShortlistForUser,
  addToShortlist,
  removeFromShortlist,
  getInterestsForUser,
  sendInterest,
  addVisitor,
} from '../../utils/storage'

const ProfileView = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [showPhoto, setShowPhoto] = useState(false)
  const [profile, setProfile] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)
  const [isShortlisted, setIsShortlisted] = useState(false)
  const [isInterestSent, setIsInterestSent] = useState(false)

  useEffect(() => {
    const user = getCurrentUser()
    if (user) {
      setCurrentUser(user)

      const allProfiles = getProfiles()
      const targetProfile = allProfiles[String(id)]

      if (targetProfile) {
        setProfile(targetProfile)

        // Add visitor if viewing someone else's profile
        if (String(user.id) !== String(id)) {
          addVisitor(id, getUserProfile(user.id))
        }

        // Check shortlist status
        const shortlist = getShortlistForUser(user.id)
        setIsShortlisted(shortlist.some(p => String(p.id) === String(id)))

        // Check interest status
        const { sent } = getInterestsForUser(user.id)
        setIsInterestSent(sent.some(i => String(i.receiverId) === String(id)))
      }
    }
  }, [id])

  const handleShortlist = () => {
    if (!currentUser || !profile) return
    if (isShortlisted) {
      removeFromShortlist(currentUser.id, profile.id)
      setIsShortlisted(false)
    } else {
      addToShortlist(currentUser.id, profile)
      setIsShortlisted(true)
    }
  }

  const handleSendInterest = () => {
    if (!currentUser || !profile || isInterestSent) return
    sendInterest({
      senderId: currentUser.id,
      receiverId: profile.id,
      profile
    })
    setIsInterestSent(true)
  }

  const handleMessage = () => {
    // Navigate to messages, passing the target user's ID in the state
    navigate('/user/messages', { state: { newConversationWith: profile.id } })
  }

  // Safe field access
  const details = [
    { icon: MapPin, label: 'Location', value: `${profile.location?.city || ''}, ${profile.location?.state || ''}, ${profile.location?.country || ''}` },
    { icon: Briefcase, label: 'Occupation', value: profile.education?.occupation || profile.profession || 'Not specified' },
    { icon: GraduationCap, label: 'Qualification', value: profile.education?.qualification || 'Not specified' },
    { icon: Users, label: 'Family Type', value: profile.family?.familyType || 'Not specified' },
  ]

  if (!profile) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-semibold">Profile not found</h2>
        <Link to="/user/matches" className="text-pink-600 hover:underline mt-2">
          Back to Matches
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 animate-fadeIn">

      {/* Back Button */}
      <Link 
        to="/user/matches"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Matches
      </Link>

      <div className="grid lg:grid-cols-3 gap-6">

        {/* LEFT COLUMN */}
        <div className="space-y-6">

          {/* Profile Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">

            <div className="relative inline-block mb-4">

              <img
                src={profile.avatar}
                alt={profile.name}
                onClick={() => setShowPhoto(true)}
                className="w-52 h-52 rounded-2xl object-cover mx-auto cursor-pointer hover:scale-105 transition"
              />

              {profile.compatibility && (
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  {profile.compatibility}% Match
                </div>
              )}

            </div>

            <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
            <p className="text-gray-500">{profile.age} years old</p>

            {/* Buttons */}
            <div className="flex justify-center gap-3 mt-6">

              <button
                onClick={handleSendInterest}
                disabled={isInterestSent}
                className={`flex-1 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                  isInterestSent
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:shadow-lg'
                }`}
              >
                <Heart className="w-5 h-5" />
                {isInterestSent ? 'Interest Sent' : 'Send Interest'}
              </button>

              <button
                onClick={handleShortlist}
                className={`p-3 rounded-xl border-2 transition-all ${
                  isShortlisted
                    ? 'border-primary-500 bg-primary-50 text-primary-600'
                    : 'border-gray-200 text-gray-400 hover:border-primary-500 hover:text-primary-600'
                }`}
              >
                <Star className={`w-5 h-5 ${isShortlisted ? 'fill-current' : ''}`} />
              </button>

            </div>

            {/* Message Button */}
            <button
              onClick={handleMessage}
              className="w-full mt-3 py-3 border-2 border-gray-200 rounded-xl font-medium text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              Message
            </button>

          </div>

          {/* Quick Details */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Details</h3>

            <div className="space-y-4">

              {details.map((detail) => {

                const Icon = detail.icon

                return (
                  <div key={detail.label} className="flex items-start gap-3">

                    <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary-600" />
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">{detail.label}</p>
                      <p className="font-medium text-gray-900">{detail.value}</p>
                    </div>

                  </div>
                )
              })}

            </div>
          </div>

        </div>

        {/* RIGHT CONTENT */}
        <div className="lg:col-span-2 space-y-6">

          {/* About */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">About</h3>
            <p className="text-gray-600 leading-relaxed">{profile.aboutMe}</p>
          </div>

          {/* Education */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Education & Career</h3>

            <div className="grid sm:grid-cols-2 gap-4">

              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-500">Qualification</p>
                <p className="font-medium text-gray-900">{profile.education?.qualification || 'Not specified'}</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-500">Occupation</p>
                <p className="font-medium text-gray-900">{profile.education?.occupation || profile.profession || 'Not specified'}</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-500">Company</p>
                <p className="font-medium text-gray-900">{profile.education?.company || 'Not specified'}</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-500">Income</p>
                <p className="font-medium text-gray-900">{profile.education?.income || 'Not specified'}</p>
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* PHOTO MODAL */}
      {showPhoto && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={() => setShowPhoto(false)}
        >
          <img
            src={profile.avatar}
            alt={profile.name}
            className="max-h-[80vh] rounded-xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

    </div>
  )
}

export default ProfileView
