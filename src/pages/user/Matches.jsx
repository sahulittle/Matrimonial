import React, { useState, useEffect } from "react";
import { Users, Sparkles, Clock, Heart } from "lucide-react";
import MatchCard from "../../components/ui/MatchCard";
import {
  getRecommendedProfiles,
  getNewMatches,
  getNearMatches,
} from "../../api/userApi/userApi";

import { useAuth } from "../../context/AuthContext";

const Matches = () => {
  const { profile: currentProfile } = useAuth();

  const [recommendations, setRecommendations] = useState([]);
  const [todayMatches, setTodayMatches] = useState([]);
  const [nearMatches, setNearMatches] = useState([]);
  const [received, setReceived] = useState([]);
  const [sent, setSent] = useState([]);
  const [activeTab, setActiveTab] = useState("new");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMatches = async () => {
      try {
        const recommended = await getRecommendedProfiles();
        const today = await getNewMatches();
        const near = await getNearMatches();

        setRecommendations(Array.isArray(recommended) ? recommended : []);
        setTodayMatches(Array.isArray(today) ? today : []);
        setNearMatches(Array.isArray(near) ? near : []);

        const sentRes = await getSentInterests();
        const receivedRes = await getReceivedInterests();

        setSent(Array.isArray(sentRes?.interests) ? sentRes.interests : []);
        setReceived(
          Array.isArray(receivedRes?.interests) ? receivedRes.interests : [],
        );
      } catch (error) {
        console.error("Match load error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMatches();
  }, []);

  // send interest
  const handleSendInterest = async (profileId) => {
    try {
      await sendInterest(profileId);

      setSent((prev) => [
        ...prev,
        { receiverId: { _id: profileId }, status: "pending" },
      ]);
    } catch (error) {
      console.error(error);
    }
  };

  // shortlist
  const handleShortlist = async (profileId) => {
    try {
      await toggleShortlist(profileId);
    } catch (error) {
      console.error(error);
    }
  };

  // check interest sent
  const isInterestSent = (profileId) => {
    return sent.some(
      (i) => i.receiverId?._id === profileId && i.status === "pending",
    );
  };

  // tabs
  const tabs = [
    { id: "new", label: "New Matches", count: recommendations.length },
    { id: "today", label: "Today's Matches", count: todayMatches.length },
    { id: "recommended", label: "Recommended", count: recommendations.length },
    { id: "nearme", label: "Near Me", count: nearMatches.length },
  ];

  const stats = [
    {
      label: "New",
      value: recommendations.length,
      color: "bg-pink-100 text-pink-600",
      icon: Sparkles,
    },
    {
      label: "Today's",
      value: todayMatches.length,
      color: "bg-blue-100 text-blue-600",
      icon: Clock,
    },
    {
      label: "Sent",
      value: sent.filter((i) => i.status === "pending").length,
      color: "bg-green-100 text-green-600",
      icon: Heart,
    },
    {
      label: "Accepted",
      value: received.filter((i) => i.status === "accepted").length,
      color: "bg-purple-100 text-purple-600",
      icon: Users,
    },
  ];

  // ✅ FIXED DISPLAY LOGIC
  let displayed = [];

  if (activeTab === "new") displayed = recommendations;
  if (activeTab === "today") displayed = todayMatches;
  if (activeTab === "recommended") displayed = recommendations;
  if (activeTab === "nearme") displayed = nearMatches;

  if (loading) {
    return <div className="p-10 text-center">Loading matches...</div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Your Matches</h1>
        <p className="text-gray-500 mt-1">
          Discover profiles based on your preferences.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 text-center hover:shadow-lg hover:-translate-y-1 transition-all"
            >
              <div
                className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center mx-auto mb-2`}
              >
                <Icon className="w-5 h-5" />
              </div>

              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-1.5">
        <div className="flex gap-2 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-lg whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white"
                  : "text-gray-600 hover:bg-pink-50 hover:text-pink-600"
              }`}
            >
              {tab.label}
              <span
                className={`ml-2 px-2 py-0.5 rounded-md text-xs ${
                  activeTab === tab.id ? "bg-white/20" : "bg-gray-200"
                }`}
              >
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
              key={profile._id}
              className="transform transition-all hover:scale-[1.03] hover:shadow-xl rounded-2xl"
            >
              <MatchCard
                profile={profile}
                layout="vertical"
                interestSent={isInterestSent(profile._id)}
                onInterest={() => handleSendInterest(profile._id)}
                onShortlist={() => handleShortlist(profile._id)}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 shadow-sm border text-center">
          <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-10 h-10 text-pink-400" />
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            No Matches Found
          </h3>

          <p className="text-gray-500 text-sm">
            Try adjusting your preferences to see more profiles.
          </p>
        </div>
      )}
    </div>
  );
};

export default Matches;
