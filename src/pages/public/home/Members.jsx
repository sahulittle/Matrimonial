import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { publicSearchProfiles } from "../../../api/userApi/userApi";
import { useAuth } from "../../../context/AuthContext";

const Members = () => {
  const indianStates = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli",
    "Daman and Diu",
    "Delhi",
    "Lakshadweep",
    "Puducherry",
  ];

  const [height, setHeight] = useState(5); // Default height 5ft
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  // Filter states
  const [gender, setGender] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("");
  const [stateVal, setStateVal] = useState("");
  const [profession, setProfession] = useState("");
  const [city, setCity] = useState("");
  const [smoking, setSmoking] = useState("");
  const [drinking, setDrinking] = useState("");

  const locationHook = useLocation();
  const navigate = useNavigate();

  const formatHeight = (value) => {
    const feet = Math.floor(value);
    const inches = Math.round((value - feet) * 12);
    if (inches === 12) {
      return `${feet + 1} ft 0 in`;
    }
    return `${feet} ft ${inches} in`;
  };

  const userNames = [
    "Aarav Sharma",
    "Vivaan Singh",
    "Aditya Kumar",
    "Vihaan Patel",
    "Arjun Gupta",
    "Sai Reddy",
    "Reyansh Joshi",
    "Ayaan Khan",
    "Krishna Mehta",
    "Ishaan Ali",
    "Saanvi Sharma",
    "Aanya Singh",
    "Aadhya Kumar",
    "Ananya Patel",
    "Diya Gupta",
    "Pari Reddy",
    "Myra Joshi",
    "Aarohi Khan",
    "Riya Mehta",
    "Anika Ali",
    "Rohan Verma",
    "Priya Jain",
    "Amit Das",
    "Sneha Rao",
    "Vikram Nair",
    "Anjali Menon",
    "Sameer Iyer",
    "Meera Pillai",
    "Rajesh Kumar",
    "Kavita Shah",
    "Arjun Reddy",
    "Deepika Singh",
    "Imran Khan",
    "Aisha Begum",
    "Karan Malhotra",
    "Riya Kapoor",
    "Suresh Babu",
    "Lakshmi Devi",
    "Manoj Tiwari",
    "Sunita Yadav",
    "Anil Agarwal",
    "Pooja Mishra",
    "Sanjay Reddy",
    "Geeta Sharma",
    "Vijay Patil",
    "Rekha Desai",
    "Ashok Kumar",
    "Usha Rani",
    "Naresh Gupta",
    "Sarita Choudhary",
  ];

  // When page loads or query changes, fetch real profiles
  useEffect(() => {
    const params = new URLSearchParams(locationHook.search);
    const minAge = params.get("minAge") || params.get("min_age");
    const maxAge = params.get("maxAge") || params.get("max_age");
    const caste = params.get("caste");
    const education = params.get("education");
    const loc = params.get("location") || params.get("location");
    const state = params.get("state");
    const city = params.get("city");
    const profession = params.get("profession") || params.get("job");
    const gender = params.get("gender");
    const maritalStatus = params.get("maritalStatus");
    const smoking = params.get("smoking");
    const drinking = params.get("drinking");
    const qPage = parseInt(params.get("page"), 10) || 1;

    setPage(qPage);

    const fetchProfiles = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await publicSearchProfiles({
          minAge,
          maxAge,
          caste,
          education,
          location: loc || (state ? state + (city ? ", " + city : "") : city),
          profession,
          gender,
          maritalStatus,
          smoking,
          drinking,
          page: qPage,
          limit: 10,
        });

        setProfiles(Array.isArray(res.profiles) ? res.profiles : []);
        setTotalPages(res.pagination ? res.pagination.pages : 1);
      } catch (err) {
        console.error("Failed to fetch profiles:", err);
        setError(err.message || "Failed to fetch profiles");
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, [locationHook.search]);

  const [currentPage, setCurrentPage] = useState(page);
  const membersPerPage = 10;
  const currentMembers = profiles;
  const { user: currentUser } = useAuth();

  return (
    <div className="container mx-auto px-6 py-16 mt-20">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Side - Filter Section */}
        <div className="lg:col-span-1 bg-white p-5 sm:p-6 rounded-lg shadow-md h-fit">
          <h4 className="text-xl font-bold text-gray-800 mb-6">
            Member Filter
          </h4>
          <form className="space-y-6">
            {/* Height Range */}
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">
                Height
              </label>
              <input
                type="range"
                min="1"
                max="10"
                step="0.0833"
                value={height}
                onChange={(e) => setHeight(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="text-center text-gray-600 mt-2">
                {formatHeight(height)}
              </div>
            </div>

            {/* Looking For */}
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                Looking For
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none text-gray-700"
              >
                <option value="">Any</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Marital Status */}
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                Marital Status
              </label>
              <select
                value={maritalStatus}
                onChange={(e) => setMaritalStatus(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none text-gray-700"
              >
                <option value="">Select Status</option>
                <option value="single">Single</option>
                <option value="married">Married</option>
                <option value="divorced">Divorced</option>
                <option value="widow">Widow</option>
              </select>
            </div>

            {/* State */}
            {/* <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                State
              </label>
              <select
                value={stateVal}
                onChange={(e) => setStateVal(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none text-gray-700"
              >
                <option value="">Select State</option>
                {indianStates.map((state, idx) => (
                  <option key={idx} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div> */}

            {/* Profession */}
            {/* <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                Profession
              </label>
              <input
                type="text"
                placeholder="Profession"
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
              />
            </div> */}

            {/* City */}
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                City
              </label>
              <input
                type="text"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
              />
            </div>

            {/* Smoking Habits */}
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                Smoking Habits
              </label>
              <select
                value={smoking}
                onChange={(e) => setSmoking(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none text-gray-700"
              >
                <option value="">Any</option>
                <option value="non-smoker">Non-Smoker</option>
                <option value="occasional">Occasional</option>
                <option value="smoker">Smoker</option>
              </select>
            </div>

            {/* Drinking Status */}
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                Drinking Status
              </label>
              <select
                value={drinking}
                onChange={(e) => setDrinking(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none text-gray-700"
              >
                <option value="">Any</option>
                <option value="non-drinker">Non-Drinker</option>
                <option value="occasional">Occasional</option>
                <option value="drinker">Drinker</option>
              </select>
            </div>
            {/* Submit Button */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  // Build query params and navigate
                  const params = new URLSearchParams();
                  if (gender) params.set("gender", gender);
                  if (maritalStatus) params.set("maritalStatus", maritalStatus);
                  if (stateVal) params.set("state", stateVal);
                  if (profession) params.set("profession", profession);
                  if (city) params.set("city", city);
                  if (smoking) params.set("smoking", smoking);
                  if (drinking) params.set("drinking", drinking);
                  // reset to first page when applying filters
                  params.set("page", 1);
                  navigate(`${locationHook.pathname}?${params.toString()}`);
                }}
                className="flex-1 py-3 mt-4 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-lg transition-all shadow-md hover:shadow-lg"
              >
                Search
              </button>

              <button
                type="button"
                onClick={() => {
                  // Clear filters and navigate
                  setGender("");
                  setMaritalStatus("");
                  setStateVal("");
                  setProfession("");
                  setCity("");
                  setSmoking("");
                  setDrinking("");
                  navigate(`${locationHook.pathname}`);
                }}
                className="py-3 mt-4 px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-lg transition-all shadow-md hover:shadow-lg"
              >
                Clear
              </button>
            </div>
          </form>
        </div>

        {/* Right Side - Members List */}
        <div className="lg:col-span-3 space-y-6">
          {loading && <div className="p-6">Loading profiles...</div>}
          {!loading && currentMembers.length === 0 && (
            <div className="p-6 text-center text-gray-600">
              No profiles found.
            </div>
          )}

          {currentMembers.map((member) => (
            <div
              key={member._id || member.id}
              className="bg-white p-6 rounded-lg shadow-md flex flex-col sm:flex-row gap-6"
            >
              {/* Profile Photo */}
              <div className="w-36 h-36 flex-shrink-0">
                <img
                  src={
                    member.profilePhoto || member.photo || "/placeholder.png"
                  }
                  alt="Profile"
                  className="rounded-lg w-full h-full object-cover"
                />
              </div>
              {/* Member Details */}
              <div className="flex-grow">
                <h3 className="text-2xl font-bold text-pink-600">
                  {`${member.firstName || ""} ${member.lastName || ""}`.trim() ||
                    member.username}
                </h3>
                <p className="text-gray-500 mb-4">
                  {member.caste ? `${member.caste}` : ""}{" "}
                  {member.education ? `• ${member.education}` : ""}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-gray-700">
                  <p>
                    <span className="font-semibold">Age:</span>{" "}
                    {member.age ||
                      (member.dateOfBirth
                        ? Math.floor(
                            (new Date() - new Date(member.dateOfBirth)) /
                              (365.25 * 24 * 3600 * 1000),
                          )
                        : "—")}{" "}
                    Years
                  </p>
                  <p>
                    <span className="font-semibold">Gender:</span>{" "}
                    {member.gender}
                  </p>
                  <p>
                    <span className="font-semibold">Marital Status:</span>{" "}
                    {member.maritalStatus || member.maritalStatus}
                  </p>
                  <p>
                    <span className="font-semibold">Blood Group:</span>{" "}
                    {member.bloodGroup}
                  </p>
                  <p>
                    <span className="font-semibold">Language:</span>{" "}
                    {member.language}
                  </p>
                  <p>
                    <span className="font-semibold">Height:</span>{" "}
                    {member.height || member.height}
                  </p>
                  <p className="md:col-span-2">
                    <span className="font-semibold">Present Address:</span>{" "}
                    {member.presentAddress}
                  </p>
                  <p className="md:col-span-2">
                    <span className="font-semibold">Permanent Address:</span>{" "}
                    {member.permanentAddress}
                  </p>
                </div>
              </div>
              <div className="flex-shrink-0 flex items-center gap-3">
                <button
                  onClick={() => {
                    // If not logged in, redirect to login. Otherwise go to user details.
                    const id = member._id || member.id;
                    const target = id
                      ? `/user/user-details/${id}`
                      : locationHook.pathname;
                    if (!currentUser) {
                      // send user to login and preserve intended destination
                      navigate(`/login?redirect=${encodeURIComponent(target)}`);
                      return;
                    }
                    if (id) navigate(target);
                  }}
                  className="mt-3 ml-auto px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}

          {/* Pagination */}
          <div className="flex justify-center items-center mt-8 space-x-4">
            <button
              onClick={() => {
                const newPage = Math.max(page - 1, 1);
                const params = new URLSearchParams(locationHook.search);
                params.set("page", newPage);
                navigate(`${locationHook.pathname}?${params.toString()}`);
              }}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-400 transition-colors"
            >
              Previous
            </button>
            <span className="text-gray-700">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => {
                const newPage = Math.min(page + 1, totalPages);
                const params = new URLSearchParams(locationHook.search);
                params.set("page", newPage);
                navigate(`${locationHook.pathname}?${params.toString()}`);
              }}
              disabled={page === totalPages}
              className="px-4 py-2 bg-pink-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-pink-700 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Members;
