import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import {
  ArrowRight,
  Heart,
  MessageCircle,
  Eye,
  Star
} from 'lucide-react'
import MatchCard from '../components/ui/MatchCard';
import { useAuth } from '../../../../context/AuthContext';
import {
  getProfiles,
  getInterestsForUser,
  getConversationsForUser,
  getShortlistForUser,
  getVisitorsForUser
} from '../utils/storage';

const Dashboard = () => {
  const { user, profile, loading } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [received, setReceived] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [shortlistItems, setShortlistItems] = useState([]);
  const [visitors, setVisitors] = useState([]);

  useEffect(() => {
    if (!user) return;

    // Generate recommendations (all profiles except current user)
    const allProfiles = Object.values(getProfiles());
    setRecommendations(allProfiles.filter(p => String(p.id) !== String(user.id)));

    // Load data from localStorage
    const interests = getInterestsForUser(user.id);
    setReceived(interests.received);

    const userConversations = getConversationsForUser(user.id);
    setConversations(userConversations);

    const userShortlist = getShortlistForUser(user.id);
    setShortlistItems(userShortlist);

    const visitorData = getVisitorsForUser(user.id);
    setVisitors(visitorData);
  }, [user]);

  const pendingInterests = received.filter(i => i.status === 'pending')

  const stats = [
    {
      label: 'Profile Views',
      value: visitors.length,
      icon: Eye,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      label: 'Interests',
      value: received.length,
      icon: Heart,
      color: 'bg-pink-100 text-pink-600'
    },
    {
      label: 'Messages',
      value: conversations.reduce((s, c) => s + (c.unreadCount || 0), 0),
      icon: MessageCircle,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      label: 'Shortlisted',
      value: shortlistItems.length,
      icon: Star,
      color: 'bg-yellow-100 text-yellow-600'
    }
  ]

  if (loading || !user) {
    // Could show a loading state or redirect
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">

      {/* Welcome Card */}

      <div className="p-6 bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-100 rounded-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Welcome Back, {user.name}!
            </h1>
            <p className="text-gray-500 mt-1">
              Here's your daily match update
            </p>
          </div>

          <img
            src={user?.avatar || '/default-avatar.png'}
            alt={user?.name}
            className="w-14 h-14 rounded-full object-cover border-4 border-white"
          />
        </div>
      </div>

      {/* Stats Grid */}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">

        {stats.map((stat) => {

          const Icon = stat.icon

          return (
            <div key={stat.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">

              <div className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center mb-3`}>
                <Icon className="w-5 h-5" />
              </div>

              <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>

            </div>
          )
        })}

      </div>

      {/* Profile Completion */}

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">

        <div className="flex items-center justify-between mb-1">
          <h2 className="font-semibold text-gray-800">
            Profile Completion
          </h2>

          <span className="font-bold text-pink-600 text-lg">
            {profile?.profileCompleted || 0}%
          </span>
        </div>

        <div className="h-2.5 bg-gray-200 rounded-full mt-2">

          <div
            className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full transition-all duration-500"
            style={{ width: `${profile?.profileCompleted || 0}%` }}
          />

        </div>

        {profile?.profileCompleted < 100 && (

          <Link
            to="/afterlogin/profile"
            className="text-sm text-pink-600 mt-3 inline-flex items-center gap-1.5 font-medium hover:text-pink-700"
          >
            Complete your profile
            <ArrowRight className="w-4 h-4" />
          </Link>

        )}

      </div>

      <div className="grid lg:grid-cols-3 gap-6">

        {/* LEFT SIDE */}

        <div className="lg:col-span-2 space-y-6">

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">

            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-gray-800">
                New Matches Today
              </h2>

              <Link
                to="/afterlogin/matches"
                className="text-sm font-medium text-pink-600 hover:text-pink-700"
              >
                View All
              </Link>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6">

              {recommendations.slice(0, 6).map((profile) => (

                <div
                  key={profile.id}
                  className="shrink-0 w-52"
                >
                  <MatchCard profile={profile} layout="vertical" />
                </div>

              ))}

            </div>

          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">

            <div className="flex items-center justify-between mb-2">

              <h2 className="text-lg font-semibold text-gray-800">
                Recommended For You
              </h2>

              <Link
                to="/afterlogin/matches"
                className="text-sm font-medium text-pink-600 hover:text-pink-700"
              >
                View All
              </Link>

            </div>

            <div className="grid sm:grid-cols-2 gap-4">

              {recommendations.slice(0, 4).map((profile) => (

                <MatchCard
                  key={profile.id}
                  profile={profile}
                  layout="vertical"
                />

              ))}

            </div>

          </div>

        </div>

        {/* RIGHT SIDEBAR */}

        <div className="space-y-6">

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">

            <div className="flex items-center justify-between mb-2">

              <h2 className="font-semibold text-gray-800">
                New Interests
              </h2>

              <Link to="/afterlogin/interests" className="text-sm font-medium text-pink-600 hover:text-pink-700">
                View All
              </Link>

            </div>

            {pendingInterests.length > 0 ? (

              <div className="space-y-2 -mx-2">

                {pendingInterests.slice(0, 3).map((interest) => (

                  <Link
                    key={interest.id}
                    to="/afterlogin/interests"
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-pink-50 transition-colors"
                  >

                    <img
                      src={interest.profile?.avatar || "/default-avatar.png"}
                      alt={interest.profile?.name || 'User'}
                      className="w-10 h-10 rounded-full object-cover"
                    />

                    <div className="flex-1 min-w-0">

                      <p className="font-semibold text-gray-800 truncate">
                        {interest.profile?.name || 'Unknown User'}
                      </p>

                      <p className="text-sm text-gray-500">
                        {interest.profile?.age ? `${interest.profile.age} yrs` : ''}
                      </p>

                    </div>

                    <Heart className="w-4 h-4 text-pink-500" />

                  </Link>

                ))}

              </div>

            ) : (

              <div className="text-center py-6">
                <Heart className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                <p className="text-gray-500 text-sm">
                  No new interests
                </p>
              </div>

            )}

          </div>

          {/* Visitors */}

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">

            <div className="flex items-center justify-between mb-2">

              <h2 className="font-semibold text-gray-800">
                Profile Visitors
              </h2>

              <Link to="/afterlogin/visitors" className="text-sm font-medium text-pink-600 hover:text-pink-700">
                View All
              </Link>

            </div>

            {visitors.length > 0 ? (

              <div className="flex gap-4 overflow-x-auto pb-2 -mx-6 px-6">

                {visitors.slice(0, 5).map((visitor) => (

                  <Link
                    key={visitor.id}
                    to={`/afterlogin/profile/${visitor.id}`}
                    className="shrink-0 text-center group"
                  >

                    <img
                      src="https://cdn.dribbble.com/userupload/12012331/file/original-0d149e12db580c4cae321bad1ef47aa5.jpg?format=webp&resize=400x300&vertical=center"
                      alt={visitor.name}
                      className="w-14 h-14 rounded-full object-cover mb-1.5 border-2 border-transparent group-hover:border-pink-400 transition-all"
                    />

                    <p className="text-xs text-gray-700 truncate w-14">
                      {visitor.name.split(' ')[0]}
                    </p>

                  </Link>

                ))}

              </div>

            ) : (

              <div className="text-center py-6">
                <Eye className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                <p className="text-gray-500 text-sm">
                  No visitors yet
                </p>
              </div>

            )}

          </div>

        </div>

      </div>

    </div>
  )
}

export default Dashboard
