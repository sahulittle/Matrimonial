import { useState, useEffect, useMemo } from "react"
import { useAuth } from "../../context/AuthContext"

import {
  User,
  Briefcase,
  Users,
  Save,
  Loader2,
  Check,
  Camera
} from "lucide-react"
import { FaChevronDown } from "react-icons/fa"

const Profile = () => {
  const { user: currentUser, profile: currentProfile, updateProfile, loading } = useAuth()

  const [activeTab, setActiveTab] = useState("basic")
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [completionPercentage, setCompletionPercentage] = useState(0)
  const [degree, setDegree] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("");


  const qualifications = [];
  const occupations = [
    'Private Company',
    'Government/Public Sector',
    'Defence/Civil Service',
    'Business/Self Employed',
    'Not Working',
  ];
  const complexionOptions = ['Fair', 'Light', 'Medium', 'Dark'];
  const bloodGroupOptions = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
  ];

  const fieldOfStudyOptions = {
    "B.Tech": [
      "Computer Science Engineering",
      "Information Technology",
      "Artificial Intelligence",
      "Artificial Intelligence & Data Science",
      "Data Science",
      "Cyber Security",
      "Software Engineering",
      "Mechanical Engineering",
      "Civil Engineering",
      "Electrical Engineering",
      "Electronics Engineering",
      "Electronics & Communication Engineering",
      "Electrical & Electronics Engineering",
      "Chemical Engineering",
      "Petroleum Engineering",
      "Aerospace Engineering",
      "Automobile Engineering",
      "Biotechnology Engineering",
      "Biomedical Engineering",
      "Environmental Engineering",
      "Industrial Engineering",
      "Mining Engineering",
      "Marine Engineering",
      "Agricultural Engineering",
      "Food Technology",
      "Textile Engineering",
      "Robotics Engineering",
      "Mechatronics Engineering"
    ],

    "B.Sc": [
      "Physics",
      "Chemistry",
      "Mathematics",
      "Statistics",
      "Biology",
      "Botany",
      "Zoology",
      "Biotechnology",
      "Microbiology",
      "Biochemistry",
      "Environmental Science",
      "Computer Science",
      "Information Technology",
      "Data Science",
      "Agriculture",
      "Nursing",
      "Psychology",
      "Geology",
      "Forensic Science"
    ],

    "BA": [
      "English Literature",
      "History",
      "Political Science",
      "Sociology",
      "Psychology",
      "Economics",
      "Geography",
      "Philosophy",
      "Journalism",
      "Mass Communication",
      "Public Administration",
      "Fine Arts",
      "Music",
      "Education",
      "Anthropology"
    ],

    "BBA": [
      "Marketing",
      "Finance",
      "Human Resource Management",
      "International Business",
      "Entrepreneurship",
      "Business Analytics",
      "Supply Chain Management",
      "Operations Management",
      "Hospital Management",
      "Retail Management"
    ],

    "BCA": [
      "Computer Applications",
      "Software Development",
      "Web Development",
      "Mobile App Development",
      "Database Management",
      "Data Science",
      "Artificial Intelligence",
      "Cyber Security",
      "Cloud Computing"
    ],

    "B.Com": [
      "Accounting",
      "Finance",
      "Banking",
      "Insurance",
      "Taxation",
      "Economics",
      "Business Administration",
      "Marketing",
      "E-Commerce",
      "International Business"
    ],
    "LAW": [
      "Corporate Law",
      "Criminal Law",
      "Civil Law",
      "Constitutional Law",
      "International Law",
      "Human Rights Law",
      "Intellectual Property Law",
      "Environmental Law",
      "Taxation Law"
    ],

    "MBA": [
      "Finance",
      "Marketing",
      "Human Resource Management",
      "International Business",
      "Business Analytics",
      "Operations Management",
      "Supply Chain Management",
      "Entrepreneurship",
      "Healthcare Management",
      "Hospital Management",
      "Retail Management"
    ],

    "MBBS": [
      "General Medicine",
      "General Surgery",
      "Pediatrics",
      "Orthopedics",
      "Gynecology",
      "Cardiology",
      "Neurology",
      "Dermatology",
      "Radiology",
      "Anesthesiology"
    ],
    "PHD": [
      "Computer Science",
      "Engineering",
      "Management",
      "Economics",
      "Physics",
      "Chemistry",
      "Mathematics",
      "Biotechnology",
      "Psychology",
      "Law",
      "Political Science",
      "Education"
    ],
    "M.Com": [
      "Accounting",
      "Finance",
      "Banking",
      "Insurance",
      "Taxation",
      "International Business",
      "Marketing",
      "Human Resource Management"
    ],
    "M.Tech": [
      "Computer Science Engineering",
      "Artificial Intelligence",
      "Data Science",
      "Cyber Security",
      "Software Engineering",
      "Mechanical Engineering",
      "Civil Engineering",
      "Electrical Engineering",
      "Electronics & Communication Engineering",
      "Chemical Engineering",
      "Biotechnology Engineering",
      "Robotics",
      "Mechatronics"
    ],
    "M.A": [
      "English",
      "History",
      "Political Science",
      "Sociology",
      "Psychology",
      "Economics",
      "Geography",
      "Philosophy",
      "Journalism",
      "Public Administration",
      "Education"
    ],
    "M.SC": [
      "Physics",
      "Chemistry",
      "Mathematics",
      "Statistics",
      "Biotechnology",
      "Microbiology",
      "Biochemistry",
      "Environmental Science",
      "Computer Science",
      "Information Technology",
      "Data Science",
      "Agriculture",
      "Psychology"
    ],
  }

  const heightOptions = [
    { value: "4'6\"", label: "4'6\"" },
    { value: "4'8\"", label: "4'8\"" },
    { value: "4'10\"", label: "4'10\"" },
    { value: "5'0\"", label: "5'0\"" },
    { value: "5'2\"", label: "5'2\"" },
    { value: "5'4\"", label: "5'4\"" },
    { value: "5'6\"", label: "5'6\"" },
    { value: "5'8\"", label: "5'8\"" },
    { value: "5'10\"", label: "5'10\"" },
    { value: "6'0\"", label: "6'0\"" },
    { value: "6'2\"", label: "6'2\"" },
    { value: "6'4\"", label: "6'4\"" }
  ]

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    avatar: "",
  });

  useEffect(() => {
    if (!currentProfile) return

    setFormData({
      name: currentProfile.name || "",
      avatar: currentProfile.avatar || "",
      gender: currentProfile.gender || "Male",
      dateOfBirth: currentProfile.dateOfBirth || "",
      height: currentProfile.height || "",
      birthName: currentProfile.birthName || '',
      birthTime: currentProfile.birthTime || '',
      complexion: currentProfile.complexion || '',
      bloodGroup: currentProfile.bloodGroup || '',

      education: {
        qualification: currentProfile.education?.qualification || "",
        occupation: currentProfile.education?.occupation || "",
        fieldOfStudy: currentProfile.education?.fieldOfStudy || "",
        workLocation: currentProfile.education?.workLocation || "",
        annualIncome: currentProfile.education?.annualIncome || ""
      },

      family: {
        fatherName: currentProfile.family?.fatherName || '',
        fatherOccupation: currentProfile.family?.fatherOccupation || "",
        motherName: currentProfile.family?.motherName || '',
        motherOccupation: currentProfile.family?.motherOccupation || "",
        siblings: currentProfile.family?.siblings || "",
        paternalUncleName: currentProfile.family?.paternalUncleName || '',
        paternalUncleJob: currentProfile.family?.paternalUncleJob || '',
        maternalUncleName: currentProfile.family?.maternalUncleName || '',
        maternalUncleJob: currentProfile.family?.maternalUncleJob || '',
      },
    })
    setDegree(currentProfile.education?.qualification || "");
    setFieldOfStudy(currentProfile.education?.fieldOfStudy || "");

  }, [currentProfile])

  // LIVE PROFILE COMPLETION UPDATE
  // This useEffect recalculates completion whenever formData or imagePreview changes
  useEffect(() => {
    if (!formData || !formData.name) return

    let score = 0

    if (formData.name) score += 10
    if (formData.dateOfBirth) score += 10
    if (formData.height) score += 10
    if (formData.education?.qualification) score += 10
    if (formData.education?.occupation) score += 10
    if (formData.education?.annualIncome) score += 10
    if (formData.family?.fatherName) score += 10
    if (formData.family?.motherName) score += 10
    if (formData.family?.siblings) score += 10
    if (formData.bloodGroup) score += 10

    setCompletionPercentage(score)
  }, [formData])

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result }));
        setSaved(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const tabs = [
    { id: "basic", label: "Basic Details", icon: User },
    { id: "education", label: "Education & Career", icon: Briefcase },
    { id: "family", label: "Family Details", icon: Users }
  ]

  const handleChange = (section, field, value) => {
    if (section) {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
    }
    setSaved(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isSaving) return

    setIsSaving(true)

    const dataToSave = { ...formData };

    if (dataToSave.dateOfBirth) {
      const dob = new Date(dataToSave.dateOfBirth)
      const today = new Date()
      let age = today.getFullYear() - dob.getFullYear()
      const monthDiff = today.getMonth() - dob.getMonth()
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--
      }
      dataToSave.age = age
    }

    await new Promise((resolve) => setTimeout(resolve, 800))

    await updateProfile(dataToSave)

    setIsSaving(false)
    setSaved(true)

    setTimeout(() => setSaved(false), 3000)
  }

  if (loading || !currentProfile) {
    return <div>Loading profile...</div>
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 animate-fadeIn">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative w-24 h-24 group">
            <img
              src={formData.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"}
              alt={formData.name}
              className="w-24 h-24 rounded-lg object-cover border-2 border-white shadow-sm"
            />
            <label htmlFor="profile-upload" className="absolute bottom-0 right-0 p-1.5 bg-white rounded-full shadow-md cursor-pointer border border-gray-100 hover:bg-gray-50 transition-colors">
              <Camera className="w-4 h-4 text-gray-600" />
              <input 
                type="file" 
                id="profile-upload" 
                accept="image/*" 
                onChange={handleImageChange} 
                className="hidden" 
              />
            </label>
          </div>

          <div className="text-center md:text-left">
            <h1 className="text-2xl font-bold text-gray-900">
              {formData?.name || "Your Name"}
            </h1>
            <p className="text-gray-500">{currentProfile?.email}</p>
          </div>

          <div className="ml-auto text-center">
            <div className="relative w-20 h-20">
              <svg className="w-20 h-20 transform -rotate-90">
                <circle cx="40" cy="40" r="36" stroke="#e5e7eb" strokeWidth="6" fill="none" />
                <circle
                  cx="40" cy="40" r="36"
                  stroke="#ec4899"
                  strokeWidth="6"
                  fill="none"
                  strokeDasharray={`${completionPercentage * 2.26} 226`}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-gray-900">
                {completionPercentage}%
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">Profile Complete</p>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-gray-100 overflow-x-auto">
          <div className="flex min-w-max px-4">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${activeTab === tab.id
                    ? "border-pink-500 text-pink-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Basic Tab */}
          {activeTab === "basic" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Basic Personal Information</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={formData?.name || ""}
                    onChange={(e) => handleChange(null, "name", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Gender *</label>
                  <select
                    value={formData?.gender || "Male"}
                    onChange={(e) => handleChange(null, "gender", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Date of Birth</label>
                  <input
                    type="date"
                    value={formData?.dateOfBirth || ""}
                    onChange={(e) => handleChange(null, "dateOfBirth", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Height</label>
                  <select
                    value={formData?.height || ""}
                    onChange={(e) => handleChange(null, "height", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                  >
                    <option value="">Select Height</option>
                    {heightOptions.map((h) => (
                      <option key={h.value} value={h.value}>{h.label}</option>
                    ))} </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Birth Name</label>
                  <input
                    type="text"
                    value={formData?.birthName || ""}
                    onChange={(e) => handleChange(null, "birthName", e.target.value)}
                    placeholder="Enter your birth name"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Birth Time</label>
                  <input
                    type="time"
                    value={formData?.birthTime || ""}
                    onChange={(e) => handleChange(null, "birthTime", e.target.value)}
                    placeholder="Enter your birth time"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Complexion</label>
                  <select
                    value={formData?.complexion || ""}
                    onChange={(e) => handleChange(null, "complexion", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                  >
                    <option value="">Select Complexion</option>
                    {complexionOptions.map((c) => (
                      <option key={c} value={c.toLowerCase()}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Blood Group</label>
                  <select
                    value={formData?.bloodGroup || ""}
                    onChange={(e) => handleChange(null, "bloodGroup", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                  >
                    <option value="">Select Blood Group</option>
                    {bloodGroupOptions.map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Education Tab */}
          {activeTab === "education" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Education & Career</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Education</label>
                  <div className="mt-1 relative">
                    <select
                      value={degree}
                      onChange={(e) => {
                        const newDegree = e.target.value;
                        setDegree(newDegree);
                        setFieldOfStudy("");
                        handleChange('education', 'qualification', newDegree);
                        handleChange('education', 'fieldOfStudy', "");
                      }}
                      className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-pink-500 focus:border-pink-500 pr-8"
                    >
                      <option value="">Select Education</option>
                      {Object.keys(fieldOfStudyOptions).map((deg, index) => (
                        <option key={index} value={deg}>
                          {deg}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-700">
                      <FaChevronDown className="h-4 w-4" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Field of Study</label>
                  <div className="mt-1 relative">
                    <select
                      value={fieldOfStudy}
                      onChange={(e) => {
                        const newField = e.target.value;
                        setFieldOfStudy(newField);
                        handleChange('education', 'fieldOfStudy', newField);
                      }}
                      className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-pink-500 focus:border-pink-500 pr-8"
                      disabled={!degree}
                    >
                      <option value="">Select Field of Study</option>
                      {degree &&
                        fieldOfStudyOptions[degree]?.map((branch, index) => (
                          <option key={index} value={branch}>
                            {branch}
                          </option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-700">
                      <FaChevronDown className="h-4 w-4" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Occupation</label>
                  <select
                    value={formData?.education?.occupation || ""}
                    onChange={(e) => handleChange('education', 'occupation', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                  >
                    <option value="">Select Occupation</option>
                    {occupations.map((o, index) => (
                      <option key={o + index} value={o}>{o}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Work Location</label>
                  <select
                    value={formData?.education?.workLocation || ""}
                    onChange={(e) => handleChange('education', 'workLocation', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                  >
                    <option value="">Select State</option>
                    {indianStates.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Annual Income</label>
                  <select
                    value={formData?.education?.annualIncome || ""}
                    onChange={(e) => handleChange('education', 'annualIncome', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                  >
                    <option value="">Select Income Range</option>
                    {[
                      'Upto 1 Lakh', '1 to 2 Lakhs', '2 to 3 Lakhs', '3 to 4 Lakhs', '4 to 5 Lakhs',
                      '5 to 7.5 Lakhs', '7.5 to 10 Lakhs', '10 to 15 Lakhs', '15 to 20 Lakhs',
                      '20 to 30 Lakhs', '30 to 50 Lakhs', '50 to 75 Lakhs', '75 Lakhs to 1 Crore', '1 Crore & above'
                    ].map(inc => (
                      <option key={inc} value={inc}>{inc}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Family Tab */}
          {activeTab === "family" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Family Information</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Father's Name</label>
                  <input
                    type="text"
                    value={formData?.family?.fatherName || ""}
                    onChange={(e) => handleChange('family', 'fatherName', e.target.value)}
                    placeholder="Enter father's name"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Father's Occupation</label>
                  <input
                    type="text"
                    value={formData?.family?.fatherOccupation || ""}
                    onChange={(e) => handleChange('family', 'fatherOccupation', e.target.value)}
                    placeholder="e.g., Business, Doctor, Retired"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Mother's Name</label>
                  <input
                    type="text"
                    value={formData?.family?.motherName || ""}
                    onChange={(e) => handleChange('family', 'motherName', e.target.value)}
                    placeholder="Enter mother's name"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Mother's Occupation</label>
                  <input
                    type="text"
                    value={formData?.family?.motherOccupation || ""}
                    onChange={(e) => handleChange('family', 'motherOccupation', e.target.value)}
                    placeholder="e.g., Home Maker, Teacher"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Siblings</label>
                  <input
                    type="text"
                    value={formData?.family?.siblings || ""}
                    onChange={(e) => handleChange('family', 'siblings', e.target.value)}
                    placeholder="e.g., 1 Brother, 1 Sister"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                  />
                </div>
                <div className="md:col-span-2">
                  <h4 className="text-md font-semibold text-gray-800 mt-4 mb-2">Extended Family</h4>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Paternal Uncle's Name</label>
                  <input
                    type="text"
                    value={formData?.family?.paternalUncleName || ""}
                    onChange={(e) => handleChange('family', 'paternalUncleName', e.target.value)}
                    placeholder="Paternal Uncle's Name"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Paternal Uncle's Job</label>
                  <input
                    type="text"
                    value={formData?.family?.paternalUncleJob || ""}
                    onChange={(e) => handleChange('family', 'paternalUncleJob', e.target.value)}
                    placeholder="Paternal Uncle's Job"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Maternal Uncle's Name</label>
                  <input
                    type="text"
                    value={formData?.family?.maternalUncleName || ""}
                    onChange={(e) => handleChange('family', 'maternalUncleName', e.target.value)}
                    placeholder="Maternal Uncle's Name"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Maternal Uncle's Job</label>
                  <input
                    type="text"
                    value={formData?.family?.maternalUncleJob || ""}
                    onChange={(e) => handleChange('family', 'maternalUncleJob', e.target.value)}
                    placeholder="Maternal Uncle's Job"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end mt-8 pt-6 border-t border-gray-100">
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl hover:shadow-lg hover:shadow-pink-500/25 transition-all"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : saved ? (
                <>
                  <Check className="w-5 h-5" />
                  Saved!
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </button>
          </div>

        </form>

      </div>

    </div>
  )
}

export default Profile
