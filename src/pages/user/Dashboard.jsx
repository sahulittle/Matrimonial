import React, { useEffect, useState } from "react";

import { ArrowRight, Heart, MessageCircle, Eye, Star } from "lucide-react";
import MatchCard from "../../components/ui/MatchCard";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import {
  getDashboardStats,
  getRecommendedProfiles,
  getNewMatches,
  getNewInterests,
  getVisitors,
  getNearMatches, // ✅ NEW
  getActiveUsers, // ✅ NEW
  getShortlist,
  removeFromShortlist,
  addToShortlist, // ✅ ADD THIS
} from "../../api/userApi/userApi";

const Dashboard = () => {
  const { user, profile, loading } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [received, setReceived] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [shortlistItems, setShortlistItems] = useState([]);
  const [visitors, setVisitors] = useState([]);
  const [statsData, setStatsData] = useState({
    profileViews: 0,
    interests: 0,
    messages: 0,
    shortlisted: 0,
  });
  const [newMatches, setNewMatches] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [nearMatches, setNearMatches] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [sentInterests, setSentInterests] = useState([]);
  const [shortlist, setShortlist] = useState([]);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const stats = await getDashboardStats();
        const recommendedRes = await getRecommendedProfiles();
        const newMatchesRes = await getNewMatches();
        const nearRes = await getNearMatches();
        const activeRes = await getActiveUsers();
        const interests = await getNewInterests();
        const visitorData = await getVisitors();
        const shortlistRes = await getShortlist();
        setShortlist(shortlistRes);

        setStatsData(stats);

        setRecommended(recommendedRes);
        setNewMatches(newMatchesRes);
        setNearMatches(nearRes);
        setActiveUsers(activeRes);

        setReceived(interests);
        setVisitors(visitorData);
        console.log(stats);
        console.log(recommendedRes);
        console.log(newMatchesRes);
        console.log(nearRes);
        console.log(activeRes);
        console.log(interests);
      } catch (error) {
        console.error("Dashboard load error:", error);
      }
    };

    loadDashboard();
  }, []);
  const handleShortlist = async (profileId, isShortlisted) => {
    try {
      if (isShortlisted) {
        await removeFromShortlist(profileId);
      } else {
        await addToShortlist(profileId);
      }

      const updated = await getShortlist();
      setShortlist(updated);
    } catch (err) {
      console.error("Shortlist error:", err);
    }
  };
  const pendingInterests = received.filter((i) => i.status === "pending");

  const stats = [
    {
      label: "Profile Views",
      value: statsData.profileViews,
      icon: Eye,
      color: "bg-purple-100 text-purple-600",
    },
    {
      label: "Interests",
      value: statsData.interests,
      icon: Heart,
      color: "bg-pink-100 text-pink-600",
    },
    {
      label: "Messages",
      value: statsData.messages,
      icon: MessageCircle,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Shortlisted",
      value: statsData.shortlisted,
      icon: Star,
      color: "bg-yellow-100 text-yellow-600",
    },
  ];

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
            <p className="text-gray-500 mt-1">Here's your daily match update</p>
          </div>

          <img
            src={user?.avatar || "/default-avatar.png"}
            alt={user?.name}
            className="w-14 h-14 rounded-full object-cover border-4 border-white"
          />
        </div>
      </div>

      {/* Stats Grid */}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div
                className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center mb-3`}
              >
                <Icon className="w-5 h-5" />
              </div>

              <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Profile Completion */}

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-semibold text-gray-800">Profile Completion</h2>

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
            to="/user/profile"
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
          {/* ================= NEW MATCHES ================= */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-gray-800">
                New Matches Today
              </h2>

              <Link
                to="/user/matches"
                className="text-sm font-medium text-pink-600 hover:text-pink-700"
              >
                View All
              </Link>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6">
              {Array.isArray(newMatches) && newMatches.length > 0 ? (
                newMatches.slice(0, 6).map((profile) => {
                  const age = profile.dateOfBirth
                    ? new Date().getFullYear() -
                      new Date(profile.dateOfBirth).getFullYear()
                    : "";

                  return (
                    <div key={profile._id} className="shrink-0 w-52">
                      <Link to={`/user-details/${profile._id}`}>
                        <MatchCard
                          profile={{
                            ...profile,
                            name: `${profile.firstName || ""} ${profile.lastName || ""}`,
                            image:
                              profile.profilePhoto ||
                              profile.photos?.[0] ||
                              "/default-avatar.png",
                            location: profile.jobLocation,
                            age,
                          }}
                          layout="vertical"
                        />
                      </Link>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-500 text-sm">No matches found</p>
              )}
            </div>
          </div>

          {/* ================= RECOMMENDED ================= */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-gray-800">
                Recommended For You
              </h2>

              <Link
                to="/user/matches"
                className="text-sm font-medium text-pink-600 hover:text-pink-700"
              >
                View All
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {Array.isArray(recommended) && recommended.length > 0 ? (
                recommended.slice(0, 4).map((profile) => {
                  const age = profile.dateOfBirth
                    ? new Date().getFullYear() -
                      new Date(profile.dateOfBirth).getFullYear()
                    : "";

                  const isShortlisted = shortlist.some(
                    (s) => s.userId?._id === profile._id,
                  );

                  return (
                    <Link
                      key={profile._id}
                      to={`/user-details/${profile._id}`}
                      state={{ profile }}
                      className="block"
                    >
                      <MatchCard
                        profile={{
                          ...profile,
                          name: `${profile.firstName || ""} ${
                            profile.lastName || ""
                          }`,
                          image:
                            profile.profilePhoto ||
                            profile.photos?.[0] ||
                            "/default-avatar.png",
                          location: profile.jobLocation,
                          age,
                        }}
                        layout="vertical"
                        isShortlisted={isShortlisted}
                        onShortlist={() =>
                          handleShortlist(profile._id, isShortlisted)
                        }
                      />
                    </Link>
                  );
                })
              ) : (
                <p className="text-gray-500 text-sm">No recommendations</p>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}

        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-semibold text-gray-800">New Interests</h2>

              <Link
                to="/user/interests"
                className="text-sm font-medium text-pink-600 hover:text-pink-700"
              >
                View All
              </Link>
            </div>

            {pendingInterests.slice(0, 3).map((interest) => {
              const user = interest.senderId;

              const age = user?.dateOfBirth
                ? new Date().getFullYear() -
                  new Date(user.dateOfBirth).getFullYear()
                : "";

              return (
                <Link
                  key={interest._id}
                  to="/user/interests"
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-pink-50 transition-colors"
                >
                  <img
                    src={user?.profilePhoto || "/default-avatar.png"}
                    alt={user?.firstName}
                    className="w-10 h-10 rounded-full object-cover"
                  />

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 truncate">
                      {user?.firstName} {user?.lastName}
                    </p>

                    <p className="text-sm text-gray-500">
                      {age ? `${age} yrs` : ""}
                    </p>
                  </div>

                  <Heart className="w-4 h-4 text-pink-500" />
                </Link>
              );
            })}
          </div>

          {/* Visitors */}

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-semibold text-gray-800">Profile Visitors</h2>

              <Link
                to="/user/visitors"
                className="text-sm font-medium text-pink-600 hover:text-pink-700"
              >
                View All
              </Link>
            </div>

            {visitors.length > 0 ? (
              <div className="flex gap-4 overflow-x-auto pb-2 -mx-6 px-6">
                {visitors.slice(0, 5).map((visitor) => (
                  <Link
                    key={visitor._id}
                    to={`/user-details/${visitor._id}`}
                    className="shrink-0 text-center group"
                  >
                    <img
                      src="https://cdn.dribbble.com/userupload/12012331/file/original-0d149e12db580c4cae321bad1ef47aa5.jpg?format=webp&resize=400x300&vertical=center"
                      alt={visitor.firstName}
                      className="w-14 h-14 rounded-full object-cover mb-1.5 border-2 border-transparent group-hover:border-pink-400 transition-all"
                    />

                    <p className="text-xs text-gray-700 truncate w-14">
                      {visitor.firstName.split(" ")[0]}
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <Eye className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                <p className="text-gray-500 text-sm">No visitors yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
