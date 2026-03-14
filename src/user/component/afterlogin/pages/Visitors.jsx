import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Eye, Clock, Heart, MessageCircle } from "lucide-react"
import { getVisitorsForUser } from "../utils/storage"
import { useAuth } from "../../../../context/AuthContext"

const Visitors = () => {
  const { user } = useAuth()
  const [visitors, setVisitors] = useState([])

  useEffect(() => {
    if (user) {
      const visitorData = getVisitorsForUser(user.id)
      setVisitors(visitorData)
    }
  }, [user])

  // Convert timestamp to readable time
  const formatTime = (time) => {

    if (!time) return "Recently"

    const diff = Date.now() - new Date(time).getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes} minutes ago`
    if (hours < 24) return `${hours} hours ago`

    return `${days} days ago`
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 animate-fadeIn">

      {/* Header */}

      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Profile Visitors
        </h1>

        <p className="text-gray-500">
          People who viewed your profile
        </p>
      </div>


      {/* Stats */}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">

            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <Eye className="w-5 h-5 text-purple-600" />
            </div>

            <div>
              <p className="text-2xl font-bold text-gray-900">
                {visitors.length}
              </p>

              <p className="text-sm text-gray-500">
                Total Views
              </p>
            </div>

          </div>
        </div>


        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">

            <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center">
              <Heart className="w-5 h-5 text-pink-600" />
            </div>

            <div>
              <p className="text-2xl font-bold text-gray-900">2</p>
              <p className="text-sm text-gray-500">Liked You</p>
            </div>

          </div>
        </div>


        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">

            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-blue-600" />
            </div>

            <div>
              <p className="text-2xl font-bold text-gray-900">1</p>
              <p className="text-sm text-gray-500">Sent Interest</p>
            </div>

          </div>
        </div>

      </div>


      {/* Visitors List */}

      {visitors.length > 0 ? (

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {visitors.map((visitor) => (

            <div
              key={visitor.id}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >

              <div className="flex items-start gap-4">

                {/* Avatar */}

                <Link to={`/profile/${visitor.id}`}>

                  <img
                    src={visitor.avatar || "/default-avatar.jpg"}
                    alt={visitor.name}
                    className="w-16 h-16 rounded-xl object-cover border border-gray-200"
                    onError={(e) => {
                      e.target.src = "/default-avatar.jpg"
                    }}
                  />

                </Link>


                {/* Visitor Info */}

                <div className="flex-1">

                  <Link
                    to={`/profile/${visitor.id}`}
                    className="block"
                  >
                    <h3 className="font-semibold text-gray-900 hover:text-primary-600">
                      {visitor.name}
                    </h3>
                  </Link>

                  <p className="text-gray-500 text-sm">
                    {visitor.profession}
                  </p>

                  <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                    <Clock className="w-3 h-3" />
                    {formatTime(visitor.viewedAt)}
                  </div>

                </div>

              </div>


              {/* Buttons */}

              <div className="flex gap-2 mt-4">

                <Link
                  to={`/profile/${visitor.id}`}
                  className="flex-1 py-2.5 bg-linear-to-r from-primary-500 to-primary-600 text-white rounded-xl font-medium text-center text-sm hover:shadow-lg hover:shadow-primary-500/25 transition-all"
                >
                  View Profile
                </Link>

                <button className="px-4 py-2.5 border-2 border-gray-200 rounded-xl text-gray-400 hover:border-primary-500 hover:text-primary-600 transition-colors">
                  <Heart className="w-5 h-5" />
                </button>

              </div>

            </div>

          ))}

        </div>

      ) : (

        <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">

          <Eye className="w-16 h-16 mx-auto text-gray-300 mb-4" />

          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Visitors Yet
          </h3>

          <p className="text-gray-500">
            Your profile is yet to be viewed by others
          </p>

        </div>

      )}

    </div>
  )
}

export default Visitors