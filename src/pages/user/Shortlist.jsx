import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Star, Trash2, MapPin, Briefcase } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

// ✅ API
import { getShortlist, removeFromShortlist } from "../../api/userApi/userApi";

const Shortlist = () => {
  const { user, refreshData } = useAuth();
  const [shortlistItems, setShortlistItems] = useState([]);

  // ✅ LOAD FROM API
  useEffect(() => {
    const loadShortlist = async () => {
      try {
        const res = await getShortlist();

        console.log("SHORTLIST DATA:", res); // debug

        // ✅ FIX: remove null userId items
        const validData = res.filter((item) => item?.userId);

        setShortlistItems(validData);
      } catch (err) {
        console.error("Error fetching shortlist:", err);
      }
    };

    if (user) loadShortlist();
  }, [user]);

  // ✅ REMOVE FROM API
  const handleRemove = async (profileId) => {
    try {
      await removeFromShortlist(profileId);

      const updated = await getShortlist();

      // ✅ apply filter again
      const validData = updated.filter((item) => item?.userId);

      setShortlistItems(validData);

      refreshData();
    } catch (err) {
      console.error("Remove error:", err);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Shortlist</h1>
        <p className="text-gray-500">Profiles you have shortlisted</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Star className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {shortlistItems.length}
              </p>
              <p className="text-sm text-gray-500">Shortlisted</p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      {shortlistItems.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {shortlistItems.map((item) => {
            const profile = item.userId;

            const age = profile?.dateOfBirth
              ? new Date().getFullYear() -
                new Date(profile.dateOfBirth).getFullYear()
              : "";

            return (
              <div
                key={profile?._id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all"
              >
                {/* Image */}
                <div className="relative h-48">
                  <img
                    src={
                      profile?.profilePhoto ||
                      profile?.photos?.[0] ||
                      "/default-avatar.png"
                    }
                    alt={profile?.firstName}
                    className="w-full h-full object-cover"
                  />

                  <div className="absolute top-3 left-3 bg-yellow-500 p-2 rounded-full">
                    <Star className="w-4 h-4 text-white fill-current" />
                  </div>

                  <button
                    onClick={() => handleRemove(profile?._id)}
                    className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-4">
                  <Link
                    to={`/user/user-details/${profile?._id}`}
                    className="block"
                  >
                    <h3 className="font-semibold text-gray-900 text-lg mb-1">
                      {profile?.firstName} {profile?.lastName}
                    </h3>

                    <p className="text-gray-500 text-sm mb-3">
                      {age} years old
                    </p>
                  </Link>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Briefcase className="w-4 h-4 text-gray-400" />
                      <span>
                        {profile?.profession ||
                          profile?.education?.occupation ||
                          "Not specified"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>
                        {profile?.location?.city || "N/A"},{" "}
                        {profile?.location?.state || ""}
                      </span>
                    </div>
                  </div>

                  <Link
                    to={`/user/user-details/${profile?._id}`}
                    className="block w-full py-2.5 bg-linear-to-r from-primary-500 to-primary-600 text-white rounded-xl font-medium text-center hover:shadow-lg hover:shadow-primary-500/25 transition-all"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
          <Star className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Shortlisted Profiles
          </h3>
          <p className="text-gray-500 mb-6">
            Start exploring profiles and shortlist your favorites
          </p>

          {/* ✅ FIX: Now this WILL show */}
          <Link
            to="/user/search"
            className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-primary-500 to-primary-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-primary-500/25 transition-all"
          >
            Browse Profiles
          </Link>
        </div>
      )}
    </div>
  );
};

export default Shortlist;
