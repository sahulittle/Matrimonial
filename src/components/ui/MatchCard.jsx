import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  Star,
  MapPin,
  Briefcase,
  GraduationCap,
  Check,
  MessageCircle,
  Phone,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import {
  addToShortlist,
  removeFromShortlist,
  getShortlist,
  sendInterest,
  getSentInterests,
} from "../../api/userApi/userApi";

const MatchCard = ({ profile, layout = "horizontal" }) => {
  const { user: currentUser, refreshData } = useAuth();

  const [isShortlisted, setIsShortlisted] = useState(false);
  const [interestStatus, setInterestStatus] = useState(null);
  // null | "pending" | "accepted"

  useEffect(() => {
    const loadData = async () => {
      if (!currentUser) return;

      try {
        // shortlist
        const shortlist = await getShortlist();
        setIsShortlisted(
          shortlist.some((item) => item.userId?._id === profile._id),
        );

        // interests
        const sent = await getSentInterests();
        const found = sent.find((i) => i.receiverId?._id === profile._id);

        if (found) {
          setInterestStatus(found.status);
        }
      } catch (err) {
        console.error(err);
      }
    };

    loadData();
  }, [profile._id, currentUser]);

  const handleShortlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!currentUser) return;

    try {
      if (isShortlisted) {
        await removeFromShortlist(profile._id);
        setIsShortlisted(false);
      } else {
        await addToShortlist(profile._id);
        setIsShortlisted(true);
      }

      refreshData();
    } catch (err) {
      console.error("Shortlist error:", err);
    }
  };

  const handleSendInterest = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!currentUser || interestStatus) return;

    try {
      await sendInterest({
        receiverId: profile._id,
        message: "Hi, I'm interested in your profile",
      });

      setInterestStatus("pending");
      refreshData();
    } catch (err) {
      console.error("Interest error:", err);
    }
  };

  /* ---------------- Horizontal Layout ---------------- */

  if (layout === "horizontal") {
    return (
      <Link
        to={`/user/profile/${profile._id}`}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex overflow-hidden group"
      >
        <div className="w-28 h-full overflow-hidden">
          <img
            src={
              profile.avatar ||
              profile.image ||
              profile.profilePhoto ||
              profile.photos?.[0] ||
              "/default-avatar.png"
            }
            alt={profile.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 p-4">
          <h3 className="font-semibold">{profile.name}</h3>
          <p className="text-sm text-gray-500">{profile.age} yrs</p>
        </div>
      </Link>
    );
  }

  /* ---------------- Vertical Layout ---------------- */

  return (
    <Link
      to={`/user/profile/${profile._id}`}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all flex flex-col overflow-hidden"
    >
      {/* IMAGE */}
      <div className="relative h-48">
        <img
          src={
            profile.avatar ||
            profile.image ||
            profile.profilePhoto ||
            profile.photos?.[0] ||
            "/default-avatar.png"
          }
          alt={profile.name}
          className="w-full h-full object-cover"
        />

        {/* MATCHED BADGE */}
        {interestStatus === "accepted" && (
          <div className="absolute bottom-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
            Matched
          </div>
        )}

        {/* SHORTLIST BADGE */}
        {isShortlisted && (
          <div className="absolute top-2 left-2 bg-yellow-400 p-1 rounded-full">
            <Star className="w-3 h-3 text-white fill-current" />
          </div>
        )}
      </div>

      {/* DETAILS */}
      <div className="p-3 flex flex-col gap-3">
        <h3 className="font-semibold">{profile.name}</h3>
        <p className="text-sm text-gray-500">{profile.age} yrs</p>

        {/* BUTTONS */}
        <div className="flex flex-col gap-2">
          {/* MAIN BUTTON */}
          <button
            onClick={handleSendInterest}
            disabled={interestStatus === "pending"}
            className={`w-full py-2 rounded-lg flex items-center justify-center gap-2 ${
              interestStatus === "accepted"
                ? "bg-blue-500 text-white"
                : interestStatus === "pending"
                  ? "bg-green-100 text-green-700"
                  : "bg-pink-500 text-white"
            }`}
          >
            {interestStatus === "accepted" ? (
              <>
                <MessageCircle className="w-4 h-4" /> Chat
              </>
            ) : interestStatus === "pending" ? (
              <>
                <Check className="w-4 h-4" /> Sent
              </>
            ) : (
              <>
                <Heart className="w-4 h-4" /> Interest
              </>
            )}
          </button>

          {/* AFTER MATCH */}
          {interestStatus === "accepted" && (
            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  alert("Call feature coming soon 📞");
                }}
                className="flex-1 py-2 bg-gray-100 rounded-lg flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" /> Call
              </button>

              <button
                onClick={handleShortlist}
                className={`p-2 rounded-lg ${
                  isShortlisted ? "bg-yellow-100 text-yellow-500" : ""
                }`}
              >
                <Star
                  className={`w-4 h-4 ${isShortlisted ? "fill-current" : ""}`}
                />
              </button>
            </div>
          )}

          {/* BEFORE MATCH */}
          {interestStatus !== "accepted" && (
            <button
              onClick={handleShortlist}
              className={`p-2 rounded-lg border ${
                isShortlisted ? "bg-yellow-100 text-yellow-500" : ""
              }`}
            >
              <Star
                className={`w-4 h-4 ${isShortlisted ? "fill-current" : ""}`}
              />
            </button>
          )}
        </div>
      </div>
    </Link>
  );
};

export default MatchCard;
