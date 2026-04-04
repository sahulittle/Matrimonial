import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa";
import toast from "react-hot-toast";
import { registerUser } from "../../api/userApi/userApi";
import { casteOptions } from "../../utils/options";

const Register = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    religion: "Hindu",
    maritalStatus: "single",
  });
  const [degree, setDegree] = useState("");

  // Options for dropdowns
  const complexionOptions = ["Fair", "Light", "Medium", "Dark"];
  const bloodGroupOptions = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  const jobOptions = [
    "Private Company",
    "Government/Public Sector",
    "Defence/Civil Service",
    "Business/Self Employed",
    "Not Working",
  ];
  const incomeOptions = [
    "Upto 1 Lakh",
    "1 to 2 Lakhs",
    "2 to 3 Lakhs",
    "3 to 4 Lakhs",
    "4 to 5 Lakhs",
    "5 to 7.5 Lakhs",
    "7.5 to 10 Lakhs",
    "10 to 15 Lakhs",
    "15 to 20 Lakhs",
    "20 to 30 Lakhs",
    "30 to 50 Lakhs",
    "50 to 75 Lakhs",
    "75 Lakhs to 1 Crore",
    "1 Crore & above",
  ];
  const siblingOptions = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10+",
  ];

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
    "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi",
    "Jammu and Kashmir",
    "Ladakh",
    "Lakshadweep",
    "Puducherry",
  ];
  const religionOptions = ["Hindu"];
  const [dobError, setDobError] = useState("");

  // Generate height options from 4ft 5in to 7ft
  const heightOptions = [];
  for (let feet = 4; feet <= 7; feet++) {
    for (let inches = 0; inches < 12; inches++) {
      if (feet === 4 && inches < 5) continue; // Start from 4ft 5in
      if (feet === 7 && inches > 0) break; // Stop at 7ft 0in
      const cm = Math.round(feet * 30.48 + inches * 2.54);
      heightOptions.push(`${feet}ft ${inches}in / ${cm}cm`);
    }
  }

  const fieldOfStudyOptions = {
    // 🎓 Undergraduate
    "B.Tech": ["Computer Science", "Mechanical", "Civil", "Electrical"],
    "B.E": ["Computer Science", "Mechanical", "Civil", "Electrical"],
    "B.Sc": ["Physics", "Chemistry", "Mathematics", "Biology"],
    "B.A": ["English", "History", "Political Science", "Economics"],
    "B.Com": ["Accounting", "Finance", "Banking"],
    BBA: ["Marketing", "Finance", "HR"],
    BCA: ["Computer Applications", "Software Development"],
    "B.Arch": ["Architecture"],
    "B.Pharm": ["Pharmacy"],
    "B.Ed": ["Education"],
    BDS: ["Dental Surgery"],
    MBBS: ["General Medicine"],

    // 🎓 Postgraduate
    "M.Tech": ["Computer Science", "Data Science", "AI"],
    "M.E": ["Engineering"],
    "M.Sc": ["Physics", "Chemistry", "Mathematics"],
    "M.A": ["English", "History", "Political Science"],
    "M.Com": ["Accounting", "Finance"],
    MBA: ["Marketing", "Finance", "HR"],
    MCA: ["Computer Applications"],
    "M.Arch": ["Architecture"],
    "M.Pharm": ["Pharmacy"],
    "M.Ed": ["Education"],
    MD: ["Medicine"],
    MS: ["Surgery"],

    // 🎓 Doctorate
    PhD: ["All Subjects"],
    Doctorate: ["All Subjects"],

    // 🎓 Diploma
    Diploma: ["Engineering", "Management"],
    Polytechnic: ["Engineering"],
    ITI: ["Technical Trades"],

    // 🎓 Professional
    CA: ["Chartered Accountant"],
    CS: ["Company Secretary"],
    ICWA: ["Cost Accountant"],

    // 🎓 Law
    LLB: ["Law"],
    LLM: ["Advanced Law"],

    // 🎓 Others
    "High School": ["General"],
    Intermediate: ["Science", "Commerce", "Arts"],
    Other: ["Other"],
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "dateOfBirth") {
      const age = getAge(value);

      if (age < 18) {
        setDobError("You must be at least 18 years old");
      } else {
        setDobError("");
      }
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Only image files allowed");
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image must be less than 2MB");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file),
      }));
    }
  };
  const getAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();

      Object.keys(formData).forEach((key) => {
        if (key === "image") {
          formDataToSend.append("image", formData.image);
        } else if (key !== "imagePreview") {
          formDataToSend.append(key, formData[key]);
        }
      });

      const res = await registerUser(formDataToSend);

      toast.success(res.message || "Registration successful");
      navigate("/login");
    } catch (error) {
      toast.error(error.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 sm:py-24 px-4 sm:px-6 lg:px-8 mt-10">
      <div className="max-w-4xl w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        {/* Progress Stepper */}
        <div className="relative mb-6">
          <div
            className="absolute inset-0 flex items-center"
            aria-hidden="true"
          >
            <div className="w-full border-t border-gray-200"></div>
          </div>

          <div className="relative flex justify-between items-center max-w-2xl mx-auto px-6">
            {[
              {
                id: 1,
                label: "Personal Information",
              },
              {
                id: 2,
                label: "Education & Career",
              },
              {
                id: 3,
                label: "Family Details",
              },
            ].map((s) => (
              <div
                key={s.id}
                className="flex-1 flex flex-col items-center text-center cursor-pointer"
                onClick={() => setStep(s.id)}
              >
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                    step === s.id
                      ? "bg-pink-500 text-white border-pink-500"
                      : "bg-white text-gray-500 border-gray-300"
                  }`}
                >
                  <span className="font-semibold">{s.id}</span>
                </div>
                <div
                  className={`mt-2 text-xs sm:text-sm ${step === s.id ? "text-pink-600 font-semibold" : "text-gray-500"}`}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
        {step === 1 ? (
          <>
            <div>
              <h3 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Create an Account & Personal Info
              </h3>
              <p className="mt-2 text-center text-sm text-gray-600">
                Fill out the form to get started.
              </p>
            </div>
            <form
              className="mt-8 space-y-6"
              onSubmit={(e) => {
                e.preventDefault();

                if (!formData.dateOfBirth) {
                  setDobError("Date of Birth is required");
                  return;
                }

                const age = getAge(formData.dateOfBirth);

                if (age < 18) {
                  setDobError("You must be at least 18 years old");
                  return;
                }

                setDobError("");
                setStep(2);
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Profile Image */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Profile Image
                  </label>
                  <div className="mt-1 flex items-center gap-4">
                    {formData.imagePreview && (
                      <img
                        src={formData.imagePreview}
                        alt="Preview"
                        className="h-16 w-16 rounded-full object-cover border-2 border-pink-100"
                      />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
                    />
                  </div>
                </div>

                {/* First Name */}
                <div>
                  <label
                    htmlFor="first-name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    First Name
                  </label>
                  <input
                    id="first-name"
                    name="firstName"
                    type="text"
                    required
                    onChange={handleChange}
                    value={formData.firstName || ""}
                    className="mt-1 appearance-none block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                    placeholder="First Name"
                  />
                </div>
                {/* Last Name */}
                <div>
                  <label
                    htmlFor="last-name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Last Name
                  </label>
                  <input
                    id="last-name"
                    name="lastName"
                    type="text"
                    required
                    onChange={handleChange}
                    value={formData.lastName || ""}
                    className="mt-1 appearance-none block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                    placeholder="Last Name"
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    onChange={handleChange}
                    value={formData.email || ""}
                    className="mt-1 appearance-none block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                    placeholder="Email Address"
                  />
                </div>
                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    onChange={handleChange}
                    value={formData.password || ""}
                    className="mt-1 appearance-none block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                    placeholder="Password"
                  />
                </div>

                {/* Gender */}
                <div className="relative">
                  <label
                    htmlFor="gender"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Gender
                  </label>
                  <div className="mt-1 relative">
                    <select
                      id="gender"
                      name="gender"
                      required
                      onChange={handleChange}
                      value={formData.gender || ""}
                      className="appearance-none block w-full px-3 py-3 border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm pr-8"
                    >
                      <option value="" disabled>
                        Select Gender
                      </option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <FaChevronDown className="h-4 w-4" />
                    </div>
                  </div>
                </div>

                {/* Marital Status */}
                <div className="relative">
                  <label
                    htmlFor="maritalStatus"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Marital Status
                  </label>
                  <div className="mt-1 relative">
                    <select
                      id="maritalStatus"
                      name="maritalStatus"
                      required
                      onChange={handleChange}
                      value={formData.maritalStatus || ""}
                      className="appearance-none block w-full px-3 py-3 border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm pr-8"
                    >
                      <option value="" disabled>
                        Select Marital Status
                      </option>
                      <option value="single">Single</option>
                      <option value="divorced">Divorced</option>
                      <option value="widowed">Widowed</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <FaChevronDown className="h-4 w-4" />
                    </div>
                  </div>
                </div>

                {/* State */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    State
                  </label>
                  <div className="mt-1 relative">
                    <select
                      id="state"
                      name="state"
                      required
                      onChange={handleChange}
                      value={formData.state || ""}
                      className="appearance-none block w-full px-3 py-3 border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm pr-8"
                    >
                      <option value="" disabled>
                        Select State
                      </option>
                      {indianStates.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <FaChevronDown className="h-4 w-4" />
                    </div>
                  </div>
                </div>

                {/* City */}
                <div>
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-700"
                  >
                    City
                  </label>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    onChange={handleChange}
                    value={formData.city || ""}
                    className="mt-1 appearance-none block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                    placeholder="City"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Religion
                  </label>
                  <div className="mt-1 relative">
                    <input
                      type="hidden"
                      name="religion"
                      value={formData.religion}
                    />
                    <input
                      type="text"
                      readOnly
                      value={formData.religion}
                      className="appearance-none block w-full px-3 py-3 border border-gray-200 rounded-md bg-gray-50 text-gray-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Caste
                  </label>
                  <div className="mt-1 relative">
                    <select
                      name="caste"
                      required
                      onChange={handleChange}
                      value={formData.caste || ""}
                      className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-md"
                    >
                      <option value="" disabled>
                        Select Caste
                      </option>
                      {casteOptions.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                {/* DOB */}
                <div>
                  <label
                    htmlFor="dob"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Date of Birth
                  </label>
                  <input
                    id="dob"
                    name="dateOfBirth"
                    type="date"
                    required
                    onChange={handleChange}
                    value={formData.dateOfBirth || ""}
                    className="mt-1 appearance-none block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                  />
                  {dobError && (
                    <p className="text-red-500 text-sm mt-1">{dobError}</p>
                  )}
                </div>

                {/* Birth Name */}
                <div>
                  <label
                    htmlFor="birth-name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Birth Name
                  </label>
                  <input
                    id="birth-name"
                    name="birthName"
                    type="text"
                    onChange={handleChange}
                    value={formData.birthName || ""}
                    className="mt-1 appearance-none block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                    placeholder="Birth Name"
                  />
                </div>
                {/* Birth Time */}
                <div>
                  <label
                    htmlFor="birth-time"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Birth Time
                  </label>
                  <input
                    id="birth-time"
                    name="birthTime"
                    type="time"
                    required
                    onChange={handleChange}
                    value={formData.birthTime || ""}
                    className="mt-1 appearance-none block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                  />
                </div>

                {/* Height */}
                <div>
                  <label
                    htmlFor="height"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Height
                  </label>
                  <div className="mt-1 relative">
                    <select
                      id="height"
                      name="height"
                      required
                      onChange={handleChange}
                      value={formData.height || ""}
                      className="appearance-none block w-full px-3 py-3 border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm pr-8"
                    >
                      <option value="" disabled>
                        Select Height
                      </option>
                      {heightOptions.map((h) => (
                        <option key={h} value={h}>
                          {h}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <FaChevronDown className="h-4 w-4" />
                    </div>
                  </div>
                </div>
                {/* Complexion */}
                <div>
                  <label
                    htmlFor="complexion"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Complexion
                  </label>
                  <div className="mt-1 relative">
                    <select
                      id="complexion"
                      name="complexion"
                      required
                      onChange={handleChange}
                      value={formData.complexion || ""}
                      className="appearance-none block w-full px-3 py-3 border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm pr-8"
                    >
                      <option value="" disabled>
                        Select Complexion
                      </option>
                      {complexionOptions.map((c) => (
                        <option key={c} value={c.toLowerCase()}>
                          {c}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <FaChevronDown className="h-4 w-4" />
                    </div>
                  </div>
                </div>

                {/* Blood Group */}
                <div>
                  <label
                    htmlFor="blood-group"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Blood Group
                  </label>
                  <div className="mt-1 relative">
                    <select
                      id="blood-group"
                      name="bloodGroup"
                      required
                      onChange={handleChange}
                      value={formData.bloodGroup || ""}
                      className="appearance-none block w-full px-3 py-3 border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm pr-8"
                    >
                      <option value="" disabled>
                        Select Blood Group
                      </option>
                      {bloodGroupOptions.map((bg) => (
                        <option key={bg} value={bg}>
                          {bg}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <FaChevronDown className="h-4 w-4" />
                    </div>
                  </div>
                </div>

                {/* Education */}
                <div>
                  <label
                    htmlFor="education"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Education
                  </label>

                  <div className="mt-1 relative">
                    <select
                      id="education"
                      name="education"
                      required
                      value={formData.education || ""}
                      onChange={(e) => {
                        handleChange(e);
                        setDegree(e.target.value);
                        handleChange({
                          target: { name: "fieldOfStudy", value: "" },
                        });
                      }}
                      className="appearance-none block w-full px-3 py-3 border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm pr-8"
                    >
                      <option value="" disabled>
                        Select Education
                      </option>

                      {Object.keys(fieldOfStudyOptions).map((deg, index) => (
                        <option key={index} value={deg}>
                          {deg}
                        </option>
                      ))}
                    </select>

                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <FaChevronDown className="h-4 w-4" />
                    </div>
                  </div>
                </div>

                {/* Languages */}
                <div>
                  <label
                    htmlFor="languages"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Languages (comma separated)
                  </label>
                  <input
                    id="languages"
                    name="languages"
                    type="text"
                    onChange={handleChange}
                    value={formData.languages || ""}
                    className="mt-1 appearance-none block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                    placeholder="e.g. Marathi, Hindi, English"
                  />
                </div>

                {/* Job */}
                <div className="md:col-span-2">
                  <label
                    htmlFor="job"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Job
                  </label>
                  <div className="mt-1 relative">
                    <select
                      id="job"
                      name="job"
                      required
                      onChange={handleChange}
                      value={formData.job || ""}
                      className="appearance-none block w-full px-3 py-3 border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm pr-8"
                    >
                      <option value="" disabled>
                        Select Job
                      </option>
                      {jobOptions.map((job) => (
                        <option key={job} value={job}>
                          {job}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <FaChevronDown className="h-4 w-4" />
                    </div>
                  </div>
                </div>
                {/* Job Location */}
                <div className="md:col-span-2">
                  <label
                    htmlFor="jobLocation"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Job Location
                  </label>
                  <div className="mt-1 relative">
                    <select
                      id="jobLocation"
                      name="jobLocation"
                      required
                      onChange={handleChange}
                      value={formData.jobLocation || ""}
                      className="appearance-none block w-full px-3 py-3 border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm pr-8"
                    >
                      <option value="" disabled>
                        Select State
                      </option>
                      {indianStates.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <FaChevronDown className="h-4 w-4" />
                    </div>
                  </div>
                </div>
                {/* Present Address */}
                <div className="md:col-span-2">
                  <label
                    htmlFor="presentAddress"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Present Address
                  </label>
                  <textarea
                    id="presentAddress"
                    name="presentAddress"
                    onChange={handleChange}
                    value={formData.presentAddress || ""}
                    rows={2}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Present address"
                  />
                </div>

                {/* Smoking */}
                <div>
                  <label
                    htmlFor="smoking"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Smoking Habit
                  </label>
                  <select
                    id="smoking"
                    name="smoking"
                    onChange={handleChange}
                    value={formData.smoking || ""}
                    className="mt-1 appearance-none block w-full px-3 py-3 border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm pr-8"
                  >
                    <option value="" disabled>
                      Select Smoking Habit
                    </option>
                    <option value="non-smoker">Non-Smoker</option>
                    <option value="occasional">Occasional</option>
                    <option value="smoker">Smoker</option>
                  </select>
                </div>

                {/* Drinking */}
                <div>
                  <label
                    htmlFor="drinking"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Drinking Status
                  </label>
                  <select
                    id="drinking"
                    name="drinking"
                    onChange={handleChange}
                    value={formData.drinking || ""}
                    className="mt-1 appearance-none block w-full px-3 py-3 border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm pr-8"
                  >
                    <option value="" disabled>
                      Select Drinking Status
                    </option>
                    <option value="non-drinker">Non-Drinker</option>
                    <option value="occasional">Occasional</option>
                    <option value="drinker">Drinker</option>
                  </select>
                </div>
                {/* Annual Income */}
                <div className="md:col-span-2">
                  <label
                    htmlFor="annual-income"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Annual Income
                  </label>
                  <div className="mt-1 relative">
                    <select
                      id="annual-income"
                      name="annualIncome"
                      required
                      onChange={handleChange}
                      value={formData.annualIncome || ""}
                      className="appearance-none block w-full px-3 py-3 border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm pr-8"
                    >
                      <option value="" disabled>
                        Select Annual Income
                      </option>
                      {incomeOptions.map((income) => (
                        <option key={income} value={income}>
                          {income}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <FaChevronDown className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Field of Study (dependent on Education) */}
              {degree && fieldOfStudyOptions[degree] && (
                <div>
                  <label
                    htmlFor="field-of-study"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Field of Study
                  </label>

                  <div className="mt-1 relative">
                    <select
                      id="field-of-study"
                      name="fieldOfStudy"
                      required
                      onChange={handleChange}
                      value={formData.fieldOfStudy || ""}
                      className="appearance-none block w-full px-3 py-3 border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm pr-8"
                    >
                      <option value="" disabled>
                        Select Field of Study
                      </option>
                      {fieldOfStudyOptions[degree].map((f, idx) => (
                        <option key={idx} value={f}>
                          {f}
                        </option>
                      ))}
                    </select>

                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <FaChevronDown className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-6">
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-full text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                >
                  Save & Continue
                </button>
              </div>
              <p className="mt-2 text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium text-pink-600 hover:text-pink-500"
                >
                  Login to your Account
                </Link>
              </p>
            </form>
          </>
        ) : (
          <>
            <div>
              <h3 className="text-center text-3xl font-extrabold text-gray-900">
                Family Background
              </h3>
              <p className="mt-2 text-center text-sm text-gray-600">
                Tell us about your family.
              </p>
            </div>
            <form className="mt-8 space-y-6" onSubmit={handleFinalSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Father's Name */}
                <div>
                  <label
                    htmlFor="father-name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Father's Name
                  </label>
                  <input
                    id="father-name"
                    name="fatherName"
                    type="text"
                    required
                    onChange={handleChange}
                    value={formData.fatherName || ""}
                    className="mt-1 appearance-none block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                    placeholder="Father's Name"
                  />
                </div>
                {/* Father's Job */}
                <div>
                  <label
                    htmlFor="father-job"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Father's Job
                  </label>
                  <input
                    id="father-job"
                    name="fatherJob"
                    type="text"
                    required
                    onChange={handleChange}
                    value={formData.fatherJob || ""}
                    className="mt-1 appearance-none block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                    placeholder="Father's Job"
                  />
                </div>

                {/* Mother's Name */}
                <div>
                  <label
                    htmlFor="mother-name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Mother's Name
                  </label>
                  <input
                    id="mother-name"
                    name="motherName"
                    type="text"
                    required
                    onChange={handleChange}
                    value={formData.motherName || ""}
                    className="mt-1 appearance-none block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                    placeholder="Mother's Name"
                  />
                </div>
                {/* Mother's Job */}
                <div>
                  <label
                    htmlFor="mother-job"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Mother's Job
                  </label>
                  <input
                    id="mother-job"
                    name="motherJob"
                    type="text"
                    required
                    onChange={handleChange}
                    value={formData.motherJob || ""}
                    className="mt-1 appearance-none block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                    placeholder="Mother's Job"
                  />
                </div>

                {/* Siblings */}
                <div className="md:col-span-2">
                  <label
                    htmlFor="siblings"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Siblings
                  </label>
                  <div className="mt-1 relative">
                    <select
                      id="siblings"
                      name="siblings"
                      required
                      onChange={handleChange}
                      value={formData.siblings || ""}
                      className="appearance-none block w-full px-3 py-3 border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm pr-8"
                    >
                      <option value="" disabled>
                        Select Number of Siblings
                      </option>
                      {siblingOptions.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <FaChevronDown className="h-4 w-4" />
                    </div>
                  </div>
                </div>

                {/* Paternal Uncle */}
                <div>
                  <label
                    htmlFor="paternal-uncle-name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Paternal Uncle's Name
                  </label>
                  <input
                    id="paternal-uncle-name"
                    name="paternalUncleName"
                    type="text"
                    onChange={handleChange}
                    value={formData.paternalUncleName || ""}
                    className="mt-1 appearance-none block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                    placeholder="Paternal Uncle's Name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="paternal-uncle-job"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Paternal Uncle's Job
                  </label>
                  <input
                    id="paternal-uncle-job"
                    name="paternalUncleJob"
                    type="text"
                    onChange={handleChange}
                    value={formData.paternalUncleJob || ""}
                    className="mt-1 appearance-none block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                    placeholder="Paternal Uncle's Job"
                  />
                </div>

                {/* Maternal Uncle */}
                <div>
                  <label
                    htmlFor="maternal-uncle-name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Maternal Uncle's Name
                  </label>
                  <input
                    id="maternal-uncle-name"
                    name="maternalUncleName"
                    type="text"
                    onChange={handleChange}
                    value={formData.maternalUncleName || ""}
                    className="mt-1 appearance-none block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                    placeholder="Maternal Uncle's Name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="maternal-uncle-job"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Maternal Uncle's Job
                  </label>
                  <input
                    id="maternal-uncle-job"
                    name="maternalUncleJob"
                    type="text"
                    onChange={handleChange}
                    value={formData.maternalUncleJob || ""}
                    className="mt-1 appearance-none block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                    placeholder="Maternal Uncle's Job"
                  />
                </div>
              </div>

              <div className="pt-6 flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="group relative w-full flex justify-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-full text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                >
                  Create Account
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Register;
