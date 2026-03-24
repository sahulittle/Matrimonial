import React from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
const UserDetailsPage = () => {
  const [activeTab, setActiveTab] = useState("details");
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const data = [
    { label: "Age", value: "26 to 30" },
    { label: "Height", value: "5'2'' to 6'1''" },
    { label: "Marital Status", value: "Never Married" },
    { label: "Religion", value: "Hindu: Khandayat" },
    { label: "Mother Tongue", value: "Odia" },
    { label: "Country", value: "India" },
    { label: "Income", value: "4–10 LPA" },
  ];
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getUserById(id); // create this API
        setUser(res);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
  }, [id]);
  return (
    <div className="bg-gradient-to-br from-[#fdfbfb] to-[#ebedee] min-h-screen p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6">
        {/* LEFT SIDEBAR */}
        <div className="col-span-3 space-y-6">
          {/* PROFILE CARD */}
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-white/40 overflow-hidden">
            <img
              src="https://via.placeholder.com/300"
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

              <button className="mt-3 text-xs font-medium text-pink-600 hover:text-pink-700 transition">
                Get Your Blue Tick →
              </button>
            </div>
          </div>

          {/* SUCCESS STORY */}
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-white/40 p-3">
            <img
              src="https://via.placeholder.com/300"
              className="rounded-xl mb-2"
              alt=""
            />
            <p className="text-xs font-semibold text-gray-800">
              Sathish & Charmila
            </p>
            <p className="text-xs text-gray-500">
              Now everything, no everything...
            </p>
          </div>
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
                <p>23 yrs, 5'2", Taurus</p>
                <p>Never Married</p>
                <p>Odisha</p>
                <p>Cuttack, Orissa</p>
                <p>Hindu, Khandayat</p>
                <p>Not working</p>
                <p>Bachelor's degree in Medicine</p>
              </div>

              <p className="text-xs text-gray-400 mt-3">
                Invitation sent on 21 Mar 2026
              </p>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col gap-3 items-end">
              <button className="px-4 py-1.5 rounded-lg border border-gray-300 text-xs hover:bg-gray-100 transition">
                📞 Call
              </button>

              <button className="px-4 py-1.5 rounded-lg text-white text-xs bg-gradient-to-r from-emerald-500 to-green-600 shadow hover:scale-105 transition">
                WhatsApp
              </button>

              <button className="px-4 py-1.5 rounded-lg text-white text-xs bg-gradient-to-r from-pink-500 to-rose-500 shadow hover:scale-105 transition">
                MatriLab Chat
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
                  <TimelineBlock icon="❝" title="About Chnmayee R">
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
                        <p className="text-sm text-gray-700">
                          📞 Contact Number <br />
                          <span className="text-gray-500">+91 700XX XXXXX</span>
                        </p>

                        <p className="text-sm mt-2 text-gray-700">
                          📧 Email ID <br />
                          <span className="text-gray-500">
                            XXXXXXXX@gmail.com
                          </span>
                        </p>
                      </div>

                      <p className="text-sm text-gray-500 flex items-center gap-2">
                        🔒 She Declined your Invitation
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
                      <p>🕌 Hindu, Odia</p>
                      <p>👑 Khandayat</p>
                      <p>📍 Lives in Cuttack, Orissa, India</p>
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

              {activeTab === "preferences" && <ModernPreferences />}
            </div>
          </div>
        </div>
      </div>
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
const ModernPreferences = () => {
  const data = [
    { label: "Age", value: "26 to 30" },
    { label: "Height", value: "5'2'' to 6'1''" },
    { label: "Marital Status", value: "Never Married" },
    { label: "Religion", value: "Hindu: Khandayat" },
    { label: "Mother Tongue", value: "Odia" },
    { label: "Country", value: "India" },
    { label: "Income", value: "4–10 LPA" },
  ];

  return (
    <div>
      <h3 className="text-lg font-bold text-gray-800 mb-4">
        What She Is Looking For
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
  );
};
