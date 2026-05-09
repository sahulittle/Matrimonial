import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, Clock, Heart, MessageCircle } from "lucide-react";
import toast from "react-hot-toast";
import { 
  getVisitors, 
  toggleLike, 
  getSentInterests, 
  getDashboardStats 
} from "../../api/userApi/userApi";
import { useAuth } from "../../context/AuthContext";

const Visitors = () => {
  const { user } = useAuth();
  const isPremium = user?.subscriptionStatus === "active";
  const navigate = useNavigate();

  const [visitors, setVisitors] = useState([]);
  const [likedUsers, setLikedUsers] = useState([]);
  const [statsData, setStatsData] = useState({
    profileViews: 0,
    interests: 0,
    messages: 0,
    shortlisted: 0,
    sentInterests: 0
  });
  const [loading, setLoading] = useState(true);

  // If premium: show all. If not: show 0 unblurred, all blurred.
  const visibleVisitors = isPremium ? visitors : [];
  const lockedVisitors = isPremium ? [] : visitors;

  // 🔥 ADD THIS
  useEffect(() => {
    fetchVisitors();
  }, []); // OK for now (no issue), but better:

  const fetchVisitors = async () => {
    try {
      const [visitorData, sentRes, stats] = await Promise.all([
        getVisitors(),
        getSentInterests(),
        getDashboardStats()
      ]);

      const formatted = (visitorData || []).map((v) => ({
        id: v._id,
        name: v.fullName || "Unknown User",
        avatar: v.profilePhoto,
        profession: v.job || "Not specified",
        viewedAt: v.visitedAt,
        isLiked: v.isLiked || false,
      }));

      setVisitors(formatted);
      setStatsData({
        ...stats,
        sentInterests: Array.isArray(sentRes) ? sentRes.length : (sentRes?.interests?.length || 0)
      });
    } catch (error) {
      console.error("Error fetching visitors:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (id) => {
    try {
      const res = await toggleLike(id);

      // 🔥 update UI instantly
      setVisitors((prev) =>
        prev.map((v) => (v.id === id ? { ...v, isLiked: !v.isLiked } : v)),
      );

      // 🔥 update likedUsers list
      setLikedUsers((prev) =>
        prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
      );
    } catch (error) {
      console.error("Like error:", error);
    }
  };
  // Convert timestamp to readable time
  const formatTime = (time) => {
    if (!time) return "Recently";

    const date = new Date(time);
    if (isNaN(date.getTime())) return "Recently";

    const diff = Date.now() - date.getTime();
    
    // If the difference is negative or less than 1 minute
    if (diff < 60000) return "Just now";
    
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes} minutes ago`;
    if (hours < 24) return `${hours} hours ago`;

    return `${days} days ago`;
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 animate-fadeIn">
      {/* Header */}

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile Visitors</h1>

        <p className="text-gray-500">People who viewed your profile</p>
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
                {statsData.profileViews}
              </p>

              <p className="text-sm text-gray-500">Total Views</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center">
              <Heart className="w-5 h-5 text-pink-600" />
            </div>

            <div>
              <p className="text-2xl font-bold text-gray-900">
                {statsData.interests}
              </p>
              <p className="text-sm text-gray-500">Interests Rec.</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-blue-600" />
            </div>

            <div>
              <p className="text-2xl font-bold text-gray-900">
                {statsData.sentInterests}
              </p>
              <p className="text-sm text-gray-500">Sent Interest</p>
            </div>
          </div>
        </div>
      </div>

      {/* Visitors List */}

      {visitors.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* ✅ Visible Visitors */}
          {visibleVisitors.map((visitor) => (
            <div
              key={visitor.id}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-start gap-4">
                <Link to={`/user/user-details/${visitor.id}`}>
                  <img
                    src={visitor.avatar || "/default-avatar.jpg"}
                    alt={visitor.name}
                    className="w-16 h-16 rounded-xl object-cover border border-gray-200"
                  />
                </Link>

                <div className="flex-1">
                  <Link to={`/user/user-details/${visitor.id}`}>
                    <h3 className="font-semibold text-gray-900">
                      {visitor.name}
                    </h3>
                  </Link>

                  <p className="text-gray-500 text-sm">{visitor.profession}</p>

                  <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                    <Clock className="w-3 h-3" />
                    {formatTime(visitor.viewedAt)}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Link
                  to={`/user/user-details/${visitor.id}`}
                  className="flex-1 py-2.5 bg-pink-500 text-white rounded-xl text-sm text-center"
                >
                  View Profile
                </Link>

                <button
                  onClick={() => handleLike(visitor.id)}
                  className={`px-4 py-2.5 border-2 rounded-xl ${
                    visitor.isLiked
                      ? "bg-pink-500 text-white border-pink-500"
                      : "border-gray-200 text-gray-400"
                  }`}
                >
                  <Heart className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}

          {/* 🔒 Locked Visitors */}
          {!isPremium &&
            lockedVisitors.map((visitor, index) => (
              <div
                key={index}
                className="relative bg-white rounded-2xl p-6 shadow-sm border border-gray-100 overflow-hidden"
              >
                <div className="blur-sm">
                  <div className="flex items-start gap-4">
                    <img
                      src={visitor.avatar || "/default-avatar.jpg"}
                      className="w-16 h-16 rounded-xl object-cover"
                    />

                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {visitor.name}
                      </h3>
                      <p className="text-gray-500 text-sm">
                        {visitor.profession}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70">
                  <p className="text-sm font-semibold mb-2">
                    🔒 Upgrade to view
                  </p>

                  <button
                    onClick={() => navigate("/user/packages")}
                    className="px-4 py-2 bg-pink-500 text-white rounded-lg text-sm"
                  >
                    Upgrade
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
  );
};

export default Visitors;
