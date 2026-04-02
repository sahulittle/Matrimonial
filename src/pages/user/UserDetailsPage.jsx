import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  getUserById,
  trackVisit,
  getSentInterests,
} from "../../api/userApi/userApi";
const UserDetailsPage = () => {
  const [activeTab, setActiveTab] = useState("details");
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [sentInterest, setSentInterest] = useState(null);
  const navigate = useNavigate();
  const age = user?.dateOfBirth
    ? Math.floor(
        (new Date() - new Date(user.dateOfBirth)) /
          (1000 * 60 * 60 * 24 * 365.25),
      )
    : "";

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getUserById(id);
        setUser(res.user);

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
                ✔ Verified profile
              </div>

              <p className="text-xs text-gray-500 mt-2">
                Name verified against Govt. ID
              </p>
              <p className="text-xs text-gray-500">Mobile no. is verified</p>

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
                <span className="text-emerald-500 font-medium">
                  ● Online now
                </span>
                <span className="hover:text-pink-500 cursor-pointer">
                  You & Her
                </span>
                <span className="hover:text-pink-500 cursor-pointer">
                  Astro
                </span>
              </div>

              <div className="grid grid-cols-2 gap-x-8 mt-4 text-sm text-gray-700">
                <p>
                  {age} yrs, {user?.height}
                </p>
                {/* <p>{user?.maritalStatus || "Not specified"}</p> */}
                <p>{user?.jobLocation}</p>
                <p>{user?.jobLocation}</p>
                <p>
                  {user?.religion}, {user?.caste}
                </p>
                <p>{user?.job}</p>
                <p>{user?.education}</p>
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
                onClick={() => setShowUpgradeModal(true)}
                className="px-4 py-1.5 rounded-lg border border-gray-300 text-xs hover:bg-gray-100 transition"
              >
                📞 Call
              </button>

              <button
                onClick={() => setShowUpgradeModal(true)}
                className="px-4 py-1.5 rounded-lg text-white text-xs bg-gradient-to-r from-emerald-500 to-green-600 shadow hover:scale-105 transition"
              >
                WhatsApp
              </button>

              <button
                onClick={() => setShowUpgradeModal(true)}
                className="px-4 py-1.5 rounded-lg text-white text-xs bg-gradient-to-r from-pink-500 to-rose-500 shadow hover:scale-105 transition"
              >
                Marathi Shubha Vivah
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

              <button
                onClick={() => setActiveTab("preferences")}
                className={`px-5 py-3 font-semibold ${
                  activeTab === "preferences"
                    ? "border-b-2 border-pink-500 text-pink-600"
                    : "text-gray-500 hover:text-pink-500"
                }`}
              >
                Partner Preferences
              </button>
            </div>

            <div className="p-5">
              {activeTab === "details" && (
                <div className="space-y-6">
                  {/* ABOUT */}
                  <TimelineBlock
                    icon="❝"
                    title={`About ${user?.firstName || "User"} ${user?.lastName || ""}`}
                  >
                    <div className="flex items-center gap-2 mb-2 text-xs">
                      <span className="border px-2 py-0.5 rounded-full text-gray-500">
                        ID: SH0712632
                      </span>
                      <span className="border px-2 py-0.5 rounded-full text-gray-500">
                        Profile Managed by Parent
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 leading-relaxed">
                      I am looking for a suitable partner for my daughter. She
                      is currently living in India. With hard work and
                      determination, she has built a successful career. We are
                      looking for a kind natured and mature individual.
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
                    <div className="flex flex-col items-center w-40 border rounded-lg p-4 bg-gray-50">
                      <span className="text-3xl">🍗</span>
                      <p className="text-sm text-gray-600 text-center mt-2">
                        Occasionally Non-Vegetarian
                      </p>
                    </div>
                  </TimelineBlock>

                  {/* BACKGROUND */}
                  <TimelineBlock icon="🎓" title="Background">
                    <div className="space-y-1 text-sm text-gray-600">
                      {/* RELIGION */}
                      <p>🕌 {user?.religion || "Not specified"}</p>

                      {/* CASTE */}
                      <p>👑 {user?.caste || "Not specified"}</p>

                      {/* LOCATION */}
                      <p>
                        📍 Lives in {user?.jobLocation || "Location not added"},
                        India
                      </p>
                    </div>
                  </TimelineBlock>

                  {/* FAMILY */}
                  <TimelineBlock icon="👨‍👩‍👧" title="Family Details">
                    <div className="flex gap-2 mb-2">
                      <span className="px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-600">
                        Nuclear
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
                        Moderate
                      </span>
                    </div>

                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Father runs a business</p>
                      <p>Mother is a homemaker</p>
                      <p>1 Brother</p>
                      <p>Family income: 10–30 lakhs</p>
                    </div>
                  </TimelineBlock>

                  {/* EDUCATION */}
                  <TimelineBlock icon="🎓" title="Education & Career">
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>BAMS - Bachelor of Ayurvedic Medicine and Surgery</p>
                      <p>Medicine</p>
                      <p>Currently not working</p>
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
    <div className="flex-1 pb-6">
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
      <div>
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
      </div>
    </>
  );
};
