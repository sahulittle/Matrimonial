import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  Star,
  MapPin,
  Briefcase,
  GraduationCap,
  Check,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import {
  getShortlistForUser,
  addToShortlist,
  removeFromShortlist,
  sendInterest,
  getInterestsForUser,
} from "../../utils/storage";

const MatchCard = ({ profile, layout = "horizontal" }) => {
  const { user: currentUser, refreshData } = useAuth();
  const [isShortlisted, setIsShortlisted] = useState(false);
  const [isInterestSent, setIsInterestSent] = useState(false);

  useEffect(() => {
    if (currentUser) {
      const shortlistItems = getShortlistForUser(currentUser.id);
      setIsShortlisted(
        shortlistItems.some((item) => String(item.id) === String(profile.id)),
      );

      const { sent } = getInterestsForUser(currentUser.id);
      setIsInterestSent(
        sent.some((i) => String(i.receiverId) === String(profile.id)),
      );
    }
  }, [profile.id, currentUser]);

  const handleShortlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!currentUser) return;

    if (isShortlisted) {
      removeFromShortlist(currentUser.id, profile.id);
      setIsShortlisted(false);
    } else {
      addToShortlist(currentUser.id, profile);
      setIsShortlisted(true);
    }
    refreshData(); // Refresh app data to update shortlist count in navbar
  };

  const handleSendInterest = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!currentUser || isInterestSent) return;

    sendInterest({
      senderId: currentUser.id,
      receiverId: profile.id,
      profile,
    });
    setIsInterestSent(true);
    refreshData(); // Refresh app data to update interest count in navbar
  };

  /* ---------------- Horizontal Layout ---------------- */

  if (layout === "horizontal") {
    return (
      <Link
        to={`/user/profile/${profile.id}`}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex overflow-hidden group cursor-pointer"
      >
        {/* Image */}

        <div className="w-28 h-full shrink-0 overflow-hidden relative">
          <img
            src={
              profile.avatar ||
              profile.image ||
              profile.profilePhoto ||
              profile.photos?.[0] ||
              "/default-avatar.png"
            }
            alt={profile.name}
            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
          />
        </div>

        {/* Details */}

        <div className="flex-1 p-4 flex flex-col justify-center min-w-0">
          <div className="flex items-start justify-between">
            <div className="min-w-0">
              <h3 className="font-semibold text-gray-800 text-base truncate">
                {profile.name}
              </h3>
              <p className="text-gray-500 text-sm">
                {profile.age} yrs, {profile.height || "5'6\""}
              </p>
            </div>

            {profile.compatibility && (
              <span className="bg-pink-100 text-pink-600 text-xs font-bold px-2 py-0.5 rounded-full ml-2 shrink-0">
                {profile.compatibility}% Match
              </span>
            )}
          </div>

          <div className="space-y-1.5 mt-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Briefcase className="w-4 h-4 text-gray-400 shrink-0" />
              <span className="truncate">
                {profile.education?.occupation ||
                  profile.profession ||
                  "Not specified"}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
              <span className="truncate">
                {profile.location?.city || "Not specified"},{" "}
                {profile.location?.state || ""}
              </span>
            </div>

            {profile.education?.qualification && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <GraduationCap className="w-4 h-4 text-gray-400 shrink-0" />
                <span className="truncate">
                  {profile.education.qualification}
                </span>
              </div>
            )}
          </div>
        </div>
      </Link>
    );
  }

  /* ---------------- Vertical Layout ---------------- */

  return (
    <Link
      to={`/user/profile/${profile.id}`}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group overflow-hidden cursor-pointer flex flex-col"
    >
      {/* Image Section */}

      <div className="relative h-48 overflow-hidden">
        <img
          src={
            profile.avatar ||
            profile.image ||
            profile.profilePhoto ||
            profile.photos?.[0] ||
            "/default-avatar.png"
          }
          alt={profile.name}
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
        />

        {/* Match Badge */}

        {profile.compatibility && (
          <div className="absolute top-2.5 right-2.5 bg-pink-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
            {profile.compatibility}% Match
          </div>
        )}

        {/* Shortlist Badge */}

        {isShortlisted && (
          <div className="absolute top-2.5 left-2.5 bg-yellow-400 p-1.5 rounded-full shadow">
            <Star className="w-3 h-3 text-white fill-current" />
          </div>
        )}

        {/* Gradient Overlay */}

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
          <h3 className="font-bold text-white text-base">{profile.name}</h3>
          <p className="text-white/90 text-sm">{profile.age} yrs</p>
        </div>
      </div>

      {/* Details */}

      <div className="p-3 flex-grow flex flex-col">
        <div className="space-y-1.5 mb-3 flex-grow">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Briefcase className="w-4 h-4 text-gray-400 shrink-0" />
            <span className="truncate">
              {profile.education?.occupation ||
                profile.profession ||
                "Not specified"}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
            <span className="truncate">
              {profile.location?.city || "Not specified"},{" "}
              {profile.location?.state || ""}
            </span>
          </div>
        </div>

        {/* Buttons */}

        <div className="flex gap-2 mt-auto">
          <button
            onClick={handleSendInterest}
            disabled={isInterestSent}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
              isInterestSent
                ? "bg-green-100 text-green-700 cursor-not-allowed"
                : "bg-pink-500 text-white hover:bg-pink-600 shadow-sm hover:shadow-md"
            }`}
          >
            {isInterestSent ? (
              <>
                <Check className="w-4 h-4" /> Sent
              </>
            ) : (
              <>
                <Heart className="w-4 h-4" /> Interest
              </>
            )}
          </button>

          <button
            onClick={handleShortlist}
            className={`p-2.5 rounded-lg border transition-all ${
              isShortlisted
                ? "border-yellow-400 bg-yellow-50 text-yellow-500"
                : "border-gray-200 text-gray-500 hover:border-yellow-400 hover:text-yellow-500"
            }`}
          >
            <Star
              className={`w-4 h-4 ${isShortlisted ? "fill-current" : ""}`}
            />
          </button>
        </div>
      </div>
    </Link>
  );
};

export default MatchCard;
