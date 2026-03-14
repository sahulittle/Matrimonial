import React, { useState, useEffect } from 'react'
import { Users, MapPin, Sparkles, Clock, Heart } from 'lucide-react'
import MatchCard from '../../components/ui/MatchCard'
import {
  getProfiles,
  getInterestsForUser,
} from '../../utils/storage'
import { useAuth } from '../../context/AuthContext'

const Matches = () => {
  const { user, profile: currentProfile } = useAuth()
  const [recommendations, setRecommendations] = useState([])
  const [received, setReceived] = useState([])
  const [sent, setSent] = useState([])
  const [activeTab, setActiveTab] = useState('new')

  useEffect(() => {
    if (!user) return

    const allProfiles = Object.values(getProfiles())
    setRecommendations(allProfiles.filter(p => String(p.id) !== String(user.id)))

    const interests = getInterestsForUser(user.id)
    setReceived(interests.received || [])
    setSent(interests.sent || [])
  }, [user])

  // count how many recommendations share the same city/state as the user
  const nearCount = recommendations.filter(p => {
    if (!currentProfile?.location || !p.location) return false
    return (
      p.location.city === currentProfile.location.city &&
      p.location.state === currentProfile.location.state
    )
  }).length

  const tabs = [
    { id: 'new', label: 'New Matches', count: recommendations.length },
    { id: 'today', label: "Today's Matches", count: recommendations.length },
    { id: 'recommended', label: 'Recommended', count: recommendations.length },
    { id: 'nearme', label: 'Near Me', count: nearCount },
  ]

  const stats = [
    { label: 'New', value: recommendations.length, color: 'bg-pink-100 text-pink-600', icon: Sparkles },
    { label: "Today's", value: recommendations.length, color: 'bg-blue-100 text-blue-600', icon: Clock },
    { label: 'Sent', value: sent.filter(i => i.status === 'pending').length, color: 'bg-green-100 text-green-600', icon: Heart },
    { label: 'Accepted', value: received.filter(i => i.status === 'accepted').length, color: 'bg-purple-100 text-purple-600', icon: Users },
  ]

  // determine which profiles to show depending on the selected tab
  const displayed =
    activeTab === 'nearme'
      ? recommendations.filter(p => {
          if (!currentProfile?.location || !p.location) return false
          return (
            p.location.city === currentProfile.location.city &&
            p.location.state === currentProfile.location.state
          )
        })
      : recommendations

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Your Matches</h1>
        <p className="text-gray-500 mt-1">Discover profiles based on your preferences.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div 
              key={stat.label} 
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center mx-auto mb-2`}>
                <Icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
            </div>
          )
        })}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-1.5">
        <div className="flex gap-2 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-lg whitespace-nowrap transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md shadow-pink-500/20'
                  : 'text-gray-600 hover:bg-pink-50 hover:text-pink-600'
              }`}
            >
              {tab.label}
              <span className={`ml-2 px-2 py-0.5 rounded-md text-xs font-semibold ${
                activeTab === tab.id ? 'bg-white/20 text-black' : 'bg-gray-200 text-gray-700'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Matches Grid */}
      {displayed.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {displayed.map((profile) => (
            <div 
              key={profile.id} 
              className="transform transition-all duration-300 hover:scale-[1.03] hover:shadow-xl rounded-2xl"
            >
              <MatchCard profile={profile} layout="vertical" />
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
          <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-10 h-10 text-pink-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Matches Found</h3>
          <p className="text-gray-500 text-sm">Try adjusting your preferences to see more profiles.</p>
        </div>
      )}
    </div>
  )
}

export default Matches
