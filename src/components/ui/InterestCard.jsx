import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, Check, X, Clock, MapPin, Briefcase } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const InterestCard = ({
  interest,
  type = "received",
  onUpdate,
  onAccept,
  onReject,
}) => {
  const { user } = useAuth();

  // ✅ FIXED: get profile directly from API data
  const profile = type === "received" ? interest.senderId : interest.receiverId;

  const message = interest?.message;
  const status = interest?.status;
  const receivedAt = interest?.createdAt;

  const handleAccept = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return;

    if (onAccept) return onAccept(interest._id);
    if (onUpdate) return onUpdate(interest._id, "accepted");
  };

  const handleDecline = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return;

    if (onReject) return onReject(interest._id);
    if (onUpdate) return onUpdate(interest._id, "rejected");
  };

  const getStatusBadge = () => {
    switch (status) {
      case "accepted":
        return (
          <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
            <Check className="w-3 h-3" />
            Accepted
          </span>
        );
      case "rejected":
        return (
          <span className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
            <X className="w-3 h-3" />
            Declined
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        );
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diff === 0) return "Today";
    if (diff === 1) return "Yesterday";
    if (diff < 7) return `${diff} days ago`;

    return date.toLocaleDateString();
  };

  const age = profile?.dateOfBirth
    ? new Date().getFullYear() - new Date(profile.dateOfBirth).getFullYear()
    : "";

  const navigate = useNavigate();

  const handleOpenChat = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!profile?._id) return;
    navigate("/user/messages", { state: { newConversationWith: profile._id } });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all">
      <div className="flex gap-4 p-4">
        {/* Avatar */}
        <div className="relative shrink-0">
          <img
            src={
              profile?.profilePhoto ||
              profile?.photos?.[0] ||
              "/default-avatar.png"
            }
            alt={profile?.firstName || "User"}
            className="w-20 h-20 rounded-2xl object-cover"
          />

          {status === "accepted" && (
            <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
              <Check className="w-3 h-3 text-white" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <h3 className="font-semibold text-gray-900">
                <Link
                  to={`/user/user-details/${profile?._id || ""}`}
                  className="hover:underline"
                >
                  {profile?.firstName} {profile?.lastName}
                </Link>
              </h3>

              <p className="text-gray-500 text-sm">
                {age ? `${age} years` : ""}
              </p>
            </div>

            {getStatusBadge()}
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
            <span className="flex items-center gap-1">
              <Briefcase className="w-4 h-4" />
              {profile?.job || "Not specified"}
            </span>

            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {profile?.jobLocation || "Not specified"}
            </span>
          </div>

          {message && (
            <p className="text-sm text-gray-600 line-clamp-2 mb-3">
              "{message}"
            </p>
          )}

          <p className="text-xs text-gray-400">
            {type === "received" ? "Received" : "Sent"} {formatDate(receivedAt)}
          </p>
        </div>
      </div>

      {/* Actions */}
      {type === "received" && status === "pending" && (
        <div className="border-t border-gray-100 px-4 py-3 flex gap-3">
          <button
            onClick={handleAccept}
            className="flex-1 py-2.5 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            Accept
          </button>

          <button
            onClick={handleDecline}
            className="flex-1 py-2.5 border-2 border-gray-200 text-gray-600 rounded-xl font-medium hover:border-gray-300 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <X className="w-4 h-4" />
            Decline
          </button>
        </div>
      )}

      {status === "accepted" && (
        <div className="border-t border-gray-100 px-4 py-3 flex gap-3">
          <button
            onClick={handleOpenChat}
            className="flex-1 py-2.5 bg-linear-to-r from-primary-500 to-primary-600 text-white rounded-xl font-medium hover:shadow-md transition-colors flex items-center justify-center gap-2"
          >
            Chat
          </button>

          <div className="flex-1 flex items-center justify-center">
            <span className="text-sm text-green-600 font-semibold">
              Matched
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterestCard;
