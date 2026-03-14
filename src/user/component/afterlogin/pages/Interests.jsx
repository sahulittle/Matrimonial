import { useState, useEffect } from 'react'
import { Heart, Send } from 'lucide-react'
import InterestCard from '../components/ui/InterestCard'
import { getInterestsForUser } from '../utils/storage'
import { useAuth } from '../../../../context/AuthContext'

const Interests = () => {
  const { user, refreshData } = useAuth()
  const [activeTab, setActiveTab] = useState('received')
  const [received, setReceived] = useState([])
  const [sent, setSent] = useState([])

  useEffect(() => {
    if (user) {
      const interests = getInterestsForUser(user.id)
      setReceived(interests.received || [])
      setSent(interests.sent || [])
    }
  }, [user, refreshData])

  const pendingReceived = received.filter(i => i.status === 'pending')
  const acceptedReceived = received.filter(i => i.status === 'accepted')
  const declinedReceived = received.filter(i => i.status === 'declined')

  const pendingSent = sent.filter(i => i.status === 'pending')
  const acceptedSent = sent.filter(i => i.status === 'accepted')

  const tabs = [
    { id: 'received', label: 'Received', count: received.length, icon: Heart },
    { id: 'sent', label: 'Sent', count: sent.length, icon: Send },
  ]

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 animate-fadeIn">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Interests</h1>
        <p className="text-gray-500">Manage your interest requests</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-1.5">
        <div className="flex gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg whitespace-nowrap transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md shadow-pink-500/20'
                    : 'text-gray-600 hover:bg-pink-50 hover:text-pink-600'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                <span className={`ml-1.5 px-2 py-0.5 rounded-md text-xs font-semibold ${
                  activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
                }`}>
                  {tab.count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-8">

        {/* RECEIVED TAB */}
        {activeTab === 'received' && (

          <>

            {pendingReceived.length > 0 && (
              <div>

                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Pending Requests ({pendingReceived.length})
                </h3>

                <div className="space-y-4">
                  {pendingReceived.map((interest) => (
                    <InterestCard
                      key={interest.id}
                      interest={interest}
                      onUpdate={refreshData}
                      type="received"
                    />
                  ))}
                </div>

              </div>
            )}

            {acceptedReceived.length > 0 && (
              <div>

                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Accepted Interests ({acceptedReceived.length})
                </h3>

                <div className="space-y-4">
                  {acceptedReceived.map((interest) => (
                    <InterestCard
                      key={interest.id}
                      interest={interest}
                      onUpdate={refreshData}
                      type="received"
                    />
                  ))}
                </div>

              </div>
            )}

            {declinedReceived.length > 0 && (
              <div>

                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Declined Interests ({declinedReceived.length})
                </h3>

                <div className="space-y-4">
                  {declinedReceived.map((interest) => (
                    <InterestCard
                      key={interest.id}
                      interest={interest}
                      onUpdate={refreshData}
                      type="received"
                    />
                  ))}
                </div>

              </div>
            )}

            {received.length === 0 && (
              <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">

                <Heart className="w-16 h-16 mx-auto text-gray-300 mb-4" />

                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Interests Yet
                </h3>

                <p className="text-gray-500">
                  You haven't received any interest requests
                </p>

              </div>
            )}

          </>

        )}

        {/* SENT TAB */}
        {activeTab === 'sent' && (

          <>

            {pendingSent.length > 0 && (
              <div>

                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Pending ({pendingSent.length})
                </h3>

                <div className="space-y-4">
                  {pendingSent.map((interest) => (
                    <InterestCard
                      key={interest.id}
                      interest={interest}
                      type="sent"
                    />
                  ))}
                </div>

              </div>
            )}

            {acceptedSent.length > 0 && (
              <div>

                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Accepted ({acceptedSent.length})
                </h3>

                <div className="space-y-4">

                  {acceptedSent.map((interest) => (
                    <InterestCard
                      key={interest.id}
                      interest={interest}
                      type="sent"
                    />
                  ))}

                </div>

              </div>
            )}

            {sent.length === 0 && (
              <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">

                <Send className="w-16 h-16 mx-auto text-gray-300 mb-4" />

                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Sent Interests
                </h3>

                <p className="text-gray-500">
                  Start connecting with profiles you like
                </p>

              </div>
            )}

          </>

        )}

      </div>

    </div>
  )
}

export default Interests