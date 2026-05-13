import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FiLogIn, FiUsers, FiChevronRight, FiCreditCard, FiHeart, FiEye, FiImage } from "react-icons/fi";
import toast from "react-hot-toast";
import { getUserDetails, banUser, unbanUser } from "../../api/adminApi/adminApi";
import { on, off } from "../../services/socketService";
import { getAvatarFallback } from "../../utils/avatar";

// Simple RelatedTabs component (renders populated relations from admin GET)
const RelatedTabs = ({ user }) => {
  const [active, setActive] = useState("matches");

  const renderProfileItem = (u) => {
    if (!u) return null;
    const person = u.userId || u; // support both shapes
    const avatar = person.profilePhoto || (person.photos && person.photos.find(p=>p.isProfile)?.url) || person.image || getAvatarFallback(person.gender);
    return (
      <div className="bg-white rounded-lg shadow-sm p-3 hover:shadow-md transition-shadow">
        <div className="flex items-center gap-3">
          <img src={avatar} className="w-14 h-14 rounded-full object-cover" />
          <div className="flex-1">
            <div className="font-medium text-gray-800">{person.fullName}</div>
            <div className="text-xs text-gray-500">{person.email || person.phone || "-"}</div>
          </div>
          <div className="text-pink-500">
            <FiChevronRight />
          </div>
        </div>
      </div>
    );
  };

  const list = (key) => {
    const arr = user[key] || [];
    if (arr.length === 0) return <div className="p-6 text-center text-gray-500">No items</div>;
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {arr.map((it) => (
          <div key={(it.userId && it.userId._id) || it._id}>{renderProfileItem(it)}</div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <div className="flex flex-wrap gap-3 items-center mb-4">
        <button onClick={() => setActive("matches")} className={`flex items-center gap-2 px-4 py-2 rounded-full ${active==='matches'?'bg-pink-600 text-white shadow':'bg-gray-100 text-gray-700'}`}>
          <FiUsers /> Matches {user.matches?.length > 0 && <span className="ml-2 text-xs bg-white/20 px-2 py-0.5 rounded-full">{user.matches.length}</span>}
        </button>
        <button onClick={() => setActive("shortlist")} className={`flex items-center gap-2 px-4 py-2 rounded-full ${active==='shortlist'?'bg-pink-600 text-white shadow':'bg-gray-100 text-gray-700'}`}>
          <FiHeart /> Shortlist {user.shortlist?.length > 0 && <span className="ml-2 text-xs bg-white/20 px-2 py-0.5 rounded-full">{user.shortlist.length}</span>}
        </button>
        <button onClick={() => setActive("visitors")} className={`flex items-center gap-2 px-4 py-2 rounded-full ${active==='visitors'?'bg-pink-600 text-white shadow':'bg-gray-100 text-gray-700'}`}>
          <FiEye /> Visitors {user.visitors?.length > 0 && <span className="ml-2 text-xs bg-white/20 px-2 py-0.5 rounded-full">{user.visitors.length}</span>}
        </button>

        {/* Link to dedicated related users page */}
        {/* <Link to={`/admin/users/related/${user._id}`} className="ml-auto inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700">
          View Related Details
        </Link> */}
      </div>

      <div>
        {active === "matches" && list("matches")}
        {active === "shortlist" && list("shortlist")}
        {active === "visitors" && list("visitors")}
      </div>
    </div>
  );
};

const UserDetail = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    try {
      const res = await getUserDetails(userId);
      // normalize avatar selection
      const u = res.user || {};
      const avatar =
        u.profilePhoto ||
        (Array.isArray(u.photos) && u.photos.find((p) => p.isProfile)?.url) ||
        u.image ||
        null;
      setUser({ ...u, avatar });
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  useEffect(() => {
    fetchUser();

    const handleUserStatus = (payload) => {
      // payload may contain userId
      if (!payload) return;
      if (payload.userId && payload.userId.toString() === userId.toString()) {
        fetchUser();
      }
    };

    const handlePaymentUpdated = (payload) => {
      // payment updates may include userId
      if (!payload) return fetchUser();
      const uId = payload.userId || payload.user || payload.userId?.toString();
      if (!uId) return fetchUser();
      if (uId.toString() === userId.toString()) fetchUser();
    };

    const handleDashboard = () => fetchUser();

    on("user:status", handleUserStatus);
    on("user:online", handleUserStatus);
    on("user:offline", handleUserStatus);
    on("payment:updated", handlePaymentUpdated);
    on("dashboard:graphUpdated", handleDashboard);

    return () => {
      off("user:status", handleUserStatus);
      off("user:online", handleUserStatus);
      off("user:offline", handleUserStatus);
      off("payment:updated", handlePaymentUpdated);
      off("dashboard:graphUpdated", handleDashboard);
    };
  }, [userId]);

  // (no inline edit form on this page by design)
  const stats = [
    // derive real values from user object
    {
      title: "Active Package",
      value: user?.subscriptionPlan || "—",
      icon: <FiCreditCard className="text-blue-500" />,
    },
    {
      title: "Remaining Interest",
      value:
        user?.remainingInterests ??
        user?.subscriptionFeatures?.interestExpress ??
        0,
      icon: <FiHeart className="text-red-500" />,
    },
    {
      title: "Remaining Contact View",
      value:
        user?.remainingViews ?? user?.subscriptionFeatures?.contactViews ?? 0,
      icon: <FiEye className="text-green-500" />,
    },
    {
      title: "Remaining Image Upload",
      value:
        user?.remainingUploads ?? user?.subscriptionFeatures?.imageUploads ?? 0,
      icon: <FiImage className="text-purple-500" />,
    },
  ];

  if (!user) {
    return (
      <div className="text-center text-xl font-bold">
        Loading user details...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src={user.avatar || getAvatarFallback(user.gender)} alt="avatar" className="w-20 h-20 rounded-full object-cover" />
          <div>
            <h2 className="text-2xl font-bold">{user.fullName}</h2>
            <p className="text-sm text-gray-500">{user.username || ""}</p>
            <p className="text-sm text-gray-600">{user.email || ""} • {user.phone || ""}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* <button className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-colors">
            <FiLogIn className="mr-2" /> Login as User
          </button> */}

          {user.isBanned ? (
            <button onClick={async () => { try { const res = await unbanUser(userId); setUser(res.user); toast.success('User unbanned'); } catch(e){console.error(e)} }} className="bg-green-600 text-white px-4 py-2 rounded">Unban</button>
          ) : (
            <button onClick={async () => { try { const res = await banUser(userId, 'Admin action'); setUser(res.user); toast.success('User banned'); } catch(e){console.error(e)} }} className="bg-red-600 text-white px-4 py-2 rounded">Ban</button>
          )}
        </div>
      </div>

      {/* Related tabs */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <RelatedTabs user={user} />
      </div>
    </div>
  );
};

export default UserDetail;
