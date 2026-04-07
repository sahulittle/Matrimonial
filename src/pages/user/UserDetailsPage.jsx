import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  getUserById,
  trackVisit,
  getSentInterests,
} from "../../api/userApi/userApi";
import { emit, on, off, getSocket } from "../../services/socketService";
import { useAuth } from "../../context/AuthContext";
const UserDetailsPage = () => {
  const [activeTab, setActiveTab] = useState("details");
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [sentInterest, setSentInterest] = useState(null);
  const [isOnline, setIsOnline] = useState(false);
  const [lastActive, setLastActive] = useState(null);
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const age = user?.dateOfBirth
    ? Math.floor(
        (new Date() - new Date(user.dateOfBirth)) /
          (1000 * 60 * 60 * 24 * 365.25),
      )
    : "";

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const profile = await getUserById(id);
        setUser(profile);

        // ✅ TRACK VISIT HERE
        const visitedKey = `visited_${id}`;

        if (!sessionStorage.getItem(visitedKey)) {
          await trackVisit(id);
          sessionStorage.setItem(visitedKey, "true");
        }
      } catch (err) {
        console.error(err);
      }
    };

    const fetchSentInterest = async () => {
      try {
        const res = await getSentInterests();
        const interests = res.interests || res || [];
        const match = Array.isArray(interests)
          ? interests.find(
              (it) => it.receiverId === id || it.receiverId?._id === id,
            )
          : null;
        if (match) setSentInterest(match);
      } catch (err) {
        console.error("Failed to fetch sent interests", err);
      }
    };

    if (id) {
      fetchUser();
      fetchSentInterest();
    }

    // ===== Socket: request status and listen for updates =====
    let interval = null;
    let registered = false;

    const registerStatusListeners = () => {
      // avoid double register
      if (registered) return;

      try {
        // ask server for the user's current status
        emit("user:getStatus", { userId: id });

        const onStatus = (data) => {
          if (!data) return;
          if (String(data.userId) === String(id)) {
            setIsOnline(Boolean(data.isOnline || data.status === "online"));
            setLastActive(data.lastActive || data.timestamp || null);
          }
        };

        const onStatusChanged = (data) => {
          if (!data) return;
          if (String(data.userId) === String(id)) {
            setIsOnline(data.status === "online");
            setLastActive(data.lastActive || data.timestamp || null);
          }
        };

        on("user:status", onStatus);
        on("user:statusChanged", onStatusChanged);

        registered = true;

        // cleanup function for these listeners
        const cleanup = () => {
          off("user:status", onStatus);
          off("user:statusChanged", onStatusChanged);
        };

        // attach cleanup to effect return by setting a property
        registerStatusListeners.cleanup = cleanup;
      } catch (e) {
        // ignore silently
      }
    };

    // If socket is ready, register immediately; otherwise poll until ready (max ~5s)
    if (getSocket() && getSocket().connected) {
      registerStatusListeners();
    } else {
      let attempts = 0;
      interval = setInterval(() => {
        attempts += 1;
        if (getSocket() && getSocket().connected) {
          registerStatusListeners();
          clearInterval(interval);
        } else if (attempts > 25) {
          // give up after ~5s
          clearInterval(interval);
        }
      }, 200);
    }

    return () => {
      if (interval) clearInterval(interval);
      if (registerStatusListeners.cleanup) registerStatusListeners.cleanup();
    };
  }, [id]);

  const formatDateShort = (dateStr) => {
    try {
      const d = new Date(dateStr);
      const today = new Date();
      if (
        d.getFullYear() === today.getFullYear() &&
        d.getMonth() === today.getMonth() &&
        d.getDate() === today.getDate()
      ) {
        return "Today";
      }
      return d.toLocaleDateString(undefined, {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch (e) {
      return "";
    }
  };

  const formatLastSeen = (ts) => {
    if (!ts) return "";
    try {
      const d = new Date(ts);
      const diff = Date.now() - d.getTime();
      const mins = Math.floor(diff / (1000 * 60));
      if (mins < 1) return "just now";
      if (mins < 60) return `${mins} min${mins > 1 ? "s" : ""} ago`;
      const hours = Math.floor(mins / 60);
      if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
      const days = Math.floor(hours / 24);
      if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
      return d.toLocaleDateString();
    } catch (e) {
      return "";
    }
  };

  // ---------------- Contact action handlers ----------------
  const handleCallClick = () => {
    if (!currentUser || currentUser.subscriptionStatus !== "active") {
      setShowUpgradeModal(true);
      return;
    }

    const phone = user?.phone;
    if (!phone) {
      // no phone to call
      setShowUpgradeModal(true);
      return;
    }

    // open native dialer
    window.location.href = `tel:${phone}`;
  };

  const handleWhatsAppClick = () => {
    if (!currentUser || currentUser.subscriptionStatus !== "active") {
      setShowUpgradeModal(true);
      return;
    }

    const phone = user?.phone;
    if (!phone) {
      setShowUpgradeModal(true);
      return;
    }

    // normalize phone digits
    const digits = phone.replace(/[^0-9+]/g, "");
    // If no country code and 10 digits, assume India (91)
    let waNumber = digits;
    const plain = digits.replace(/^\+/, "");
    if (!plain.startsWith("91") && plain.length === 10) {
      waNumber = `91${plain}`;
    }

    const url = `https://wa.me/${waNumber}`;
    window.open(url, "_blank");
  };

  const handleChatClick = () => {
    if (!currentUser || currentUser.subscriptionStatus !== "active") {
      setShowUpgradeModal(true);
      return;
    }

    const targetId = user?._id || id;
    navigate("/user/messages", { state: { newConversationWith: targetId } });
  };
  return (
    <div className="bg-gradient-to-br from-[#fdfbfb] to-[#ebedee] min-h-screen p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6">
        {/* LEFT SIDEBAR */}
        <div className="col-span-3 space-y-6">
          {/* PROFILE CARD */}
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-white/40 overflow-hidden">
            <img
              src={user?.profilePhoto || "https://via.placeholder.com/300"}
              alt="profile"
              className="w-full h-64 object-cover"
            />

            <div className="p-4">
              <div className="flex items-center gap-2 text-emerald-600 text-sm font-semibold">
                {/* ✔ Verified profile */}
              </div>

              {/* Removed claims about Govt. ID / phone verification. Show member info instead. */}
              <p className="text-xs text-gray-500 mt-2">
                Member since{" "}
                {user?.createdAt ? formatDateShort(user.createdAt) : "—"}
              </p>

              {/* <button className="mt-3 text-xs font-medium text-pink-600 hover:text-pink-700 transition">
                Get Your Blue Tick →
              </button> */}
            </div>
          </div>

          {/* SUCCESS STORY */}
          {/* <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-white/40 p-3">
            <img
              src={user?.profilePhoto || "https://via.placeholder.com/300"}
              className="rounded-xl mb-2"
              alt=""
            />
            <p className="text-xs font-semibold text-gray-800">
              Sathish & Charmila
            </p>
            <p className="text-xs text-gray-500">
              Now everything, no everything...
            </p>
          </div> */}
        </div>

        {/* MAIN CONTENT */}
        <div className="col-span-9 space-y-6">
          {/* TOP CARD */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/40 p-5 flex justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                {user?.firstName} {user?.lastName}
              </h2>

              <div className="flex gap-4 text-xs text-gray-500 mt-1">
                {isOnline ? (
                  <span className="text-emerald-500 font-medium">
                    ● Online now
                  </span>
                ) : (
                  <span className="text-gray-400">
                    ● Offline
                    {lastActive ? (
                      <span className="ml-2 text-xs text-gray-500">
                        (last seen {formatLastSeen(lastActive)})
                      </span>
                    ) : null}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-x-8 mt-4 text-sm text-gray-700">
                <p>
                  <span className="font-semibold text-gray-800">Age:</span>{" "}
                  {age ? `${age} yrs,` : "Not specified"}
                  <span className="mx-3 font-semibold text-gray-800">
                    Height:
                  </span>
                  {user?.height || "Not specified"}
                </p>

                <p>
                  <span className="font-semibold text-gray-800">
                    Marital Status:
                  </span>{" "}
                  {user?.maritalStatus || "Not specified"}
                </p>

                <p>
                  <span className="font-semibold text-gray-800">
                    Job Location:
                  </span>{" "}
                  {user?.jobLocation || user?.city || "Not specified"}
                </p>

                <p>
                  <span className="font-semibold text-gray-800">State:</span>{" "}
                  {user?.state || user?.jobLocation || "Not specified"}
                </p>

                <p>
                  <span className="font-semibold text-gray-800">Religion:</span>{" "}
                  {user?.religion || "Not specified"},
                  <span className="mx-3 font-semibold text-gray-800">
                    Caste:
                  </span>{" "}
                  {user?.caste || "Not specified"}
                </p>

                <p>
                  <span className="font-semibold text-gray-800">Job:</span>{" "}
                  {user?.job || "Not specified"}
                </p>

                <p>
                  <span className="font-semibold text-gray-800">
                    Education:
                  </span>{" "}
                  {user?.education || "Not specified"}
                </p>
              </div>

              {sentInterest ? (
                <p className="text-xs text-gray-400 mt-3">
                  Invitation sent on {formatDateShort(sentInterest.createdAt)}
                </p>
              ) : null}
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col gap-3 items-end">
              <button
                onClick={() => handleCallClick()}
                className="px-4 py-1.5 rounded-lg border border-gray-300 text-xs hover:bg-gray-100 transition"
              >
                📞 Call
              </button>

              <button
                onClick={() => handleWhatsAppClick()}
                className="px-4 py-1.5 rounded-lg text-white text-xs bg-gradient-to-r from-emerald-500 to-green-600 shadow hover:scale-105 transition"
              >
                WhatsApp
              </button>

              <button
                onClick={() => handleChatClick()}
                className="px-4 py-1.5 rounded-lg text-white text-xs bg-gradient-to-r from-pink-500 to-rose-500 shadow hover:scale-105 transition"
              >
                Marathi Shubha Vivah Chat
              </button>
            </div>
          </div>

          {/* TABS */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/40">
            <div className="border-b flex text-sm">
              <button
                onClick={() => setActiveTab("details")}
                className={`px-5 py-3 font-semibold ${
                  activeTab === "details"
                    ? "border-b-2 border-pink-500 text-pink-600"
                    : "text-gray-500 hover:text-pink-500"
                }`}
              >
                Detailed Profile
              </button>

              {/* <button
                onClick={() => setActiveTab("preferences")}
                className={`px-5 py-3 font-semibold ${
                  activeTab === "preferences"
                    ? "border-b-2 border-pink-500 text-pink-600"
                    : "text-gray-500 hover:text-pink-500"
                }`}
              >
                Partner Preferences
              </button> */}
            </div>

            <div className="p-5">
              {activeTab === "details" && (
                <div className="space-y-6">
                  {/* ABOUT */}
                  <TimelineBlock
                    icon="❝"
                    title={`About ${user?.firstName || "User"} ${user?.lastName || ""}`}
                  >
                    {/* <div className="flex items-center gap-2 mb-2 text-xs">
                      <span className="border px-2 py-0.5 rounded-full text-gray-500">
                        ID: SH0712632
                      </span>
                      <span className="border px-2 py-0.5 rounded-full text-gray-500">
                        Profile Managed by Parent
                      </span>
                    </div> */}

                    <p className="text-sm text-gray-600 leading-relaxed break-words whitespace-pre-wrap max-w-full">
                      {user?.about || user?.bio || "No description added yet."}
                    </p>
                  </TimelineBlock>

                  {/* CONTACT */}
                  <TimelineBlock icon="📞" title="Contact Details">
                    <div className="flex items-center gap-6">
                      <div className="border rounded-lg p-3 bg-gray-50">
                        {/* PHONE */}
                        <p className="text-sm text-gray-700">
                          📞 Contact Number <br />
                          <span
                            onClick={() => {
                              if (user?.subscriptionStatus !== "active") {
                                setShowUpgradeModal(true);
                              }
                            }}
                            className="text-gray-500 cursor-pointer"
                          >
                            {user?.subscriptionStatus === "active"
                              ? user?.phone || "Not available"
                              : "+91 XXXXXXXX"}
                          </span>
                        </p>
                        {/* Address & Languages moved to Background */}

                        {/* EMAIL */}
                        <p className="text-sm mt-2 text-gray-700">
                          📧 Email ID <br />
                          <span
                            onClick={() => {
                              if (user?.subscriptionStatus !== "active") {
                                setShowUpgradeModal(true);
                              }
                            }}
                            className="text-gray-500 cursor-pointer"
                          >
                            {user?.subscriptionStatus === "active"
                              ? user?.email
                              : "XXXXXXXX@gmail.com"}
                          </span>
                        </p>
                      </div>

                      {/* STATUS */}
                      <p className="text-sm text-gray-500 flex items-center gap-2">
                        {user?.subscriptionStatus === "active"
                          ? "✅ You can contact directly"
                          : "🔒 Click to unlock contact details"}
                      </p>
                    </div>
                  </TimelineBlock>
                  {/* LIFESTYLE */}
                  <TimelineBlock icon="🍗" title="Lifestyle">
                    <div className="flex flex-col items-start w-full border rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">🍽️</span>
                        <div className="text-sm text-gray-600">
                          {user?.diet ||
                            user?.foodPreference ||
                            "Diet: Not specified"}
                        </div>
                      </div>

                      <div className="mt-3 flex items-center gap-3">
                        <span className="text-2xl">🚬</span>
                        <div className="text-sm text-gray-600">
                          Smoking: {user?.smoking || "Not specified"}
                        </div>
                      </div>

                      <div className="mt-3 flex items-center gap-3">
                        <span className="text-2xl">🍷</span>
                        <div className="text-sm text-gray-600">
                          Drinking: {user?.drinking || "Not specified"}
                        </div>
                      </div>

                      {user?.presentAddress ||
                      (user?.languages && user.languages.length) ? (
                        <div className="mt-3 text-sm text-gray-600">
                          {/* moved Address/Languages to Contact Details */}
                        </div>
                      ) : null}
                    </div>
                  </TimelineBlock>

                  {/* BACKGROUND */}
                  <TimelineBlock icon="🎓" title="Background">
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>🕌 {user?.religion || "Not specified"}</p>
                      <p>👑 {user?.caste || "Not specified"}</p>
                      <p>
                        📍 Lives in{" "}
                        {user?.jobLocation ||
                          user?.city ||
                          "Location not added"}
                        , India
                      </p>
                      {user?.state ? <p>🏠 State: {user.state}</p> : null}
                      {user?.presentAddress ? (
                        <p>🏠 Address: {user.presentAddress}</p>
                      ) : null}
                      {user?.languages ? (
                        <p>
                          🗣️ Languages:{" "}
                          {Array.isArray(user.languages)
                            ? user.languages.join(", ")
                            : user.languages}
                        </p>
                      ) : null}
                    </div>
                  </TimelineBlock>

                  {/* FAMILY */}
                  <TimelineBlock icon="👨‍👩‍👧" title="Family Details">
                    <div className="text-sm text-gray-600 space-y-1">
                      {user?.family && typeof user.family === "object" ? (
                        <>
                          {user.family.father && (
                            <p>Father: {user.family.father}</p>
                          )}
                          {user.family.mother && (
                            <p>Mother: {user.family.mother}</p>
                          )}
                          {user.family.siblings && (
                            <p>Siblings: {user.family.siblings}</p>
                          )}
                          {user.family.income && (
                            <p>Family income: {user.family.income}</p>
                          )}
                        </>
                      ) : (
                        <>
                          <p>
                            {user?.familyDetails ||
                              "Family information not provided"}
                          </p>
                        </>
                      )}
                    </div>
                  </TimelineBlock>

                  {/* EDUCATION */}
                  <TimelineBlock icon="🎓" title="Education & Career">
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>{user?.education || "Education not specified"}</p>
                      {user?.fieldOfStudy && <p>{user.fieldOfStudy}</p>}
                      <p>
                        {user?.employmentStatus ||
                          user?.job ||
                          "Not working / Not specified"}
                      </p>
                      {user?.jobLocation && <p>Works in: {user.jobLocation}</p>}
                    </div>
                  </TimelineBlock>
                </div>
              )}

              {activeTab === "preferences" && <ModernPreferences user={user} />}
            </div>
          </div>
        </div>
      </div>
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-[90%] max-w-lg overflow-hidden shadow-xl relative">
            {/* CLOSE */}
            <button
              onClick={() => setShowUpgradeModal(false)}
              className="absolute top-3 right-4 text-gray-500 text-xl"
            >
              ✕
            </button>

            {/* HEADER */}
            <div className="bg-gradient-to-r from-green-400 to-teal-500 text-white text-center py-6">
              <h2 className="text-lg font-semibold">
                To contact her directly, Upgrade Now
              </h2>
            </div>

            {/* PROFILE */}
            <div className="p-6 flex flex-col items-center text-center">
              <img
                src="https://via.placeholder.com/100"
                className="w-20 h-20 rounded-full mb-3"
              />

              <h3 className="font-semibold text-gray-800">
                {user?.firstName} {user?.lastName}
              </h3>

              <p className="text-gray-500 text-sm mt-1">+91-98XXXXXXX</p>

              <p className="text-gray-400 text-sm">XXXXX@gmail.com</p>

              <div className="flex gap-6 mt-4 text-sm">
                <span className="text-blue-500">💬 Chat</span>
                <span className="text-green-500">WhatsApp</span>
                <span className="text-teal-500">Call</span>
              </div>
            </div>

            {/* FOOTER */}
            <div className="text-center pb-6">
              <p className="text-gray-500 text-sm mb-4">
                Save upto{" "}
                <span className="text-green-600 font-semibold">10%</span> on
                Premium Plans!
              </p>

              <button
                onClick={() => {
                  setShowUpgradeModal(false);
                  navigate("/user/packages");
                }}
                className="px-8 py-2 rounded-full bg-gradient-to-r from-teal-400 to-blue-500 text-white font-semibold shadow hover:scale-105 transition"
              >
                View Plans
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Block = ({ title, children }) => (
  <div>
    <h3 className="font-semibold text-gray-800 mb-3 text-base">{title}</h3>
    {children}
  </div>
);

const Pref = ({ label, value }) => (
  <div className="flex justify-between border-b border-gray-100 py-2 text-sm">
    <span className="text-gray-600">{label}</span>
    <span className="text-emerald-600 font-semibold">{value} ✔</span>
  </div>
);

export default UserDetailsPage;

const TimelineBlock = ({ icon, title, children }) => (
  <div className="flex gap-4 relative">
    {/* LEFT ICON + LINE */}
    <div className="flex flex-col items-center">
      <div className="w-10 h-10 rounded-full border bg-white flex items-center justify-center text-gray-500 shadow-sm">
        {icon}
      </div>

      {/* vertical line */}
      <div className="w-px bg-gray-200 flex-1 mt-1"></div>
    </div>

    {/* CONTENT */}
    <div className="flex-1 pb-6 min-w-0 ">
      <h3 className="font-semibold text-gray-800 mb-2">{title}</h3>
      {children}
    </div>
  </div>
);
const ModernPreferences = ({ user }) => {
  const data = [
    {
      label: "Age",
      value:
        user?.preferredMinAge && user?.preferredMaxAge
          ? `${user.preferredMinAge} to ${user.preferredMaxAge}`
          : "Not specified",
    },
    {
      label: "Height",
      value: user?.preferredHeight || "Not specified",
    },
    {
      label: "Marital Status",
      value: user?.preferredMaritalStatus || "Not specified",
    },
    {
      label: "Religion",
      value: user?.preferredReligion || "Not specified",
    },
    {
      label: "Caste",
      value: user?.preferredCaste || "Not specified",
    },
    {
      label: "Education",
      value: user?.preferredEducation || "Not specified",
    },
  ];

  return (
    <>
      {/* <div>
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          What {user?.firstName}'s Partner Preferences
        </h3>

        <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-100">
          <p className="text-sm text-gray-600">
            You match <span className="font-semibold text-pink-600">7/8</span>
          </p>

          <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
            <div className="h-full w-[85%] bg-gradient-to-r from-pink-500 to-rose-500 rounded-full"></div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {data.map((item, i) => (
            <div
              key={i}
              className="p-4 rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition"
            >
              <p className="text-xs text-gray-500">{item.label}</p>

              <div className="flex justify-between items-center mt-1">
                <p className="font-semibold text-gray-800">{item.value}</p>

                <span className="text-green-500 text-sm">✔</span>
              </div>
            </div>
          ))}
        </div>
      </div> */}
    </>
  );
};
