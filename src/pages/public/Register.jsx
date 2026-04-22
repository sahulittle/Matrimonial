import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa";
import toast from "react-hot-toast";
import { registerUser } from "../../api/userApi/userApi";
import { userDataApi } from "../../services/api";
import { casteOptions } from "../../utils/options";
import ImageUploader from "../../components/ImageUploader";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Register = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    // Personal
    fullName: "",
    email: "",
    password: "",
    gender: "",
    dateOfBirth: "",
    height: "",
    rashi: "",
    weight: "",
    motherTongue: "",
    bodyType: "",
    languagesKnown: "",
    images: [],
    imagePreviews: [],

    // Religion / caste
    religion: "Hindu",
    caste: "",

    // Personal location
    country: "India",
    citizenship: "Indian",
    countryOther: "",
    state: "",
    city: "",
    nativePlace: "",

    // Education
    educationCategory: "",
    educationDetails: "",
    college: "",

    // Career
    employedIn: "",
    occupationDetails: "",

    // Job location
    jobCountry: "India",
    jobCountryOther: "",
    jobState: "",
    jobCity: "",
    jobLocationDetails: "",

    // Income
    annualIncome: "",

    // Family
    familyValues: "",
    familyType: "",
    familyStatus: "",
    ancestralOrigin: "",
    fatherName: "",
    fatherJob: "",
    motherName: "",
    motherJob: "",
    siblings: "",
    brothers: "",
    brothersMarried: "",
    sisters: "",
    sistersMarried: "",
    paternalUncleName: "",
    paternalUncleJob: "",
    maternalUncleName: "",
    maternalUncleJob: "",
  });

  const [religions, setReligions] = useState(["Hindu"]);
  const [religionsLoading, setReligionsLoading] = useState(false);
  const [dobError, setDobError] = useState("");
  const [passwordScore, setPasswordScore] = useState(0);
  const [policy, setPolicy] = useState("professional");
  const [policyErrors, setPolicyErrors] = useState([]);
  const [passwordError, setPasswordError] = useState("");
  const [errors, setErrors] = useState({}); // ✅ ADD THIS
  const [showPassword, setShowPassword] = useState(false);
  const [dobDay, setDobDay] = useState("");
  const [dobMonth, setDobMonth] = useState("");
  const [dobYear, setDobYear] = useState("");
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

  const educationOptions = [
    // Basic Education
    "No Formal Education",
    "Primary School",
    "Middle School",
    "High School (10th)",
    "Higher Secondary (12th)",

    // Skill / Training
    "Trade/Technical/Vocational Training",
    "ITI (Industrial Training Institute)",
    "Certification Course",
    "Online Certification (Coursera/Udemy etc)",

    // Diploma Level
    "Diploma",
    "Polytechnic Diploma",
    "Advanced Diploma",
    "Post Diploma",

    // Associate
    "Associate Degree",

    // Bachelor's Degrees
    "Bachelor's Degree (BA/BSc/BCom etc)",
    "Bachelor of Engineering (BE)",
    "Bachelor of Technology (B.Tech)",
    "Bachelor of Medicine (MBBS)",
    "Bachelor of Dental Surgery (BDS)",
    "Bachelor of Pharmacy (B.Pharm)",
    "Bachelor of Nursing (BSc Nursing)",
    "Bachelor of Law (LLB)",
    "Bachelor of Architecture (B.Arch)",
    "Bachelor of Design (B.Des)",
    "Bachelor of Business Administration (BBA)",
    "Bachelor of Computer Applications (BCA)",
    "Bachelor of Science in IT (BSc IT)",
    "Bachelor of Hotel Management (BHM)",
    "Bachelor of Education (B.Ed)",

    // Master's Degrees
    "Master's Degree (MA/MSc/MCom etc)",
    "Master of Technology (M.Tech)",
    "Master of Engineering (ME)",
    "Master of Business Administration (MBA)",
    "Master of Computer Applications (MCA)",
    "Master of Science (MSc)",
    "Master of Arts (MA)",
    "Master of Commerce (MCom)",
    "Master of Pharmacy (M.Pharm)",
    "Master of Law (LLM)",
    "Master of Education (M.Ed)",
    "Master of Design (M.Des)",

    // Doctorate
    "Doctorate (PhD)",
    "Doctor of Medicine (MD)",
    "Doctor of Surgery (MS)",
    "Post Doctorate",

    // Professional / Certifications
    "Professional Degree (CA/CS/CFA/ICWA etc)",
    "Chartered Accountant (CA)",
    "Company Secretary (CS)",
    "Cost and Management Accountant (CMA)",
    "Certified Financial Analyst (CFA)",

    // Others
    "Other",
  ];

  // Dynamic states and cities
  const [states, setStates] = useState([]);
  const [personalCities, setPersonalCities] = useState([]);
  const [jobCities, setJobCities] = useState([]);
  const [statesLoading, setStatesLoading] = useState(false);
  const [personalCitiesLoading, setPersonalCitiesLoading] = useState(false);
  const [jobCitiesLoading, setJobCitiesLoading] = useState(false);
  const [statesError, setStatesError] = useState(null);
  const [personalCitiesError, setPersonalCitiesError] = useState(null);
  const [jobCitiesError, setJobCitiesError] = useState(null);

  // Generate height options
  const heightOptions = [];
  for (let feet = 4; feet <= 7; feet++) {
    for (let inches = 0; inches < 12; inches++) {
      if (feet === 4 && inches < 5) continue;
      if (feet === 7 && inches > 0) break;
      const cm = Math.round(feet * 30.48 + inches * 2.54);
      heightOptions.push(`${feet}ft ${inches}in / ${cm}cm`);
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "dateOfBirth") {
      const age = getAge(value);
      if (age < 18) setDobError("You must be at least 18 years old");
      else setDobError("");
    }

    setFormData((prev) => ({ ...prev, [name]: value }));

    // ✅ ADD THIS LINE (VERY IMPORTANT)
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Fetch religions on mount
  useEffect(() => {
    let mounted = true;
    const fetchReligions = async () => {
      setReligionsLoading(true);
      try {
        const res = await userDataApi.getReligions();
        const list = Array.isArray(res?.data) ? res.data : res?.data || [];
        const finalList = list.length ? list : ["Hindu"];
        if (!mounted) return;
        setReligions(finalList);
        const defaultSel = finalList.includes("Hindu") ? "Hindu" : finalList[0];
        setFormData((prev) => ({ ...prev, religion: defaultSel }));
      } catch (err) {
        console.error("Failed to load religions", err);
        if (!mounted) return;
        setReligions(["Hindu"]);
        setFormData((prev) => ({ ...prev, religion: "Hindu" }));
      } finally {
        if (mounted) setReligionsLoading(false);
      }
    };
    fetchReligions();
    return () => (mounted = false);
  }, []);

  // Fetch Indian states
  const fetchStates = async () => {
    setStatesLoading(true);
    setStatesError(null);
    try {
      const res = await fetch(
        "https://countriesnow.space/api/v0.1/countries/states",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ country: "India" }),
        },
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      let list = [];
      if (json?.data?.states)
        list = json.data.states.map((s) => s.name).filter(Boolean);
      else if (Array.isArray(json?.data))
        list = json.data
          .map((s) => (typeof s === "string" ? s : s.name))
          .filter(Boolean);
      setStates(list.sort((a, b) => a.localeCompare(b)));
    } catch (err) {
      console.error("Failed to fetch states:", err);
      setStatesError(err?.message || "Failed to load states");
      setStates([]);
    } finally {
      setStatesLoading(false);
    }
  };

  useEffect(() => {
    fetchStates();
  }, []);

  // Fetch cities and store separately for personal/job
  const fetchCitiesForState = async (stateName, target = "personal") => {
    if (!stateName) {
      if (target === "personal") setPersonalCities([]);
      else setJobCities([]);
      return;
    }
    if (target === "personal") {
      setPersonalCitiesLoading(true);
      setPersonalCitiesError(null);
    } else {
      setJobCitiesLoading(true);
      setJobCitiesError(null);
    }
    try {
      const res = await fetch(
        "https://countriesnow.space/api/v0.1/countries/state/cities",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ country: "India", state: stateName }),
        },
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const list = Array.isArray(json?.data) ? json.data.filter(Boolean) : [];
      if (target === "personal")
        setPersonalCities(list.sort((a, b) => a.localeCompare(b)));
      else setJobCities(list.sort((a, b) => a.localeCompare(b)));
    } catch (err) {
      console.error("Failed to fetch cities:", err);
      if (target === "personal") {
        setPersonalCitiesError(err?.message || "Failed to load cities");
        setPersonalCities([]);
      } else {
        setJobCitiesError(err?.message || "Failed to load cities");
        setJobCities([]);
      }
    } finally {
      if (target === "personal") setPersonalCitiesLoading(false);
      else setJobCitiesLoading(false);
    }
  };

  // Image handling is provided by ImageUploader component
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

  const handleDobChange = (day, month, year) => {
    if (day && month && year) {
      const formatted = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
      setFormData((prev) => ({ ...prev, dateOfBirth: formatted }));

      const age = getAge(formatted);
      if (age < 18) setDobError("You must be at least 18 years old");
      else setDobError("");
    }
  };
  // ---------------- Password helpers ----------------
  const hasLower = (s) => /[a-z]/.test(s);
  const hasUpper = (s) => /[A-Z]/.test(s);
  const hasDigit = (s) => /\d/.test(s);
  const hasSymbol = (s) => /[!@#$%^&*()_\-+=[\]{};:'",.<>/?\\|`~]/.test(s);
  const lengthScore = (len) => Math.min(30, Math.max(0, (len - 6) * 3));

  const computePasswordScore = (pw = "") => {
    const len = pw.length;
    let score = 0;
    const reasons = [];
    const ls = lengthScore(len);
    score += ls;
    if (ls < 18) reasons.push("Consider increasing length");
    const lower = hasLower(pw);
    const upper = hasUpper(pw);
    const digit = hasDigit(pw);
    const symbol = hasSymbol(pw);
    const variety = [lower, upper, digit, symbol].filter(Boolean).length;
    score += variety * 15;
    if (!lower) reasons.push("Add lowercase letters");
    if (!upper) reasons.push("Add uppercase letters");
    if (!digit) reasons.push("Add numbers");
    if (!symbol) reasons.push("Add special characters");
    const lowers = pw.toLowerCase();
    const weakPatterns = ["password", "1234", "qwerty", "admin", "letmein"];
    const usesWeak = weakPatterns.some((p) => lowers.includes(p));
    if (usesWeak) {
      score = Math.max(0, score - 30);
      reasons.push("Avoid common words or sequences");
    }
    if (/^(.)\1+$/.test(pw)) {
      score = Math.max(0, score - 25);
      reasons.push("Avoid repeated characters");
    }
    score = Math.max(0, Math.min(100, score));
    return {
      score,
      reasons,
      details: { len, lower, upper, digit, symbol, variety },
    };
  };

  // textual classification removed to avoid floating label in UI

  const validateByPolicy = (pw = "", pol = "professional") => {
    const errors = [];
    if (pol === "professional") {
      if (pw.length < 6) errors.push("At least 6 characters required");
      const classes = [
        hasLower(pw),
        hasUpper(pw),
        hasDigit(pw),
        hasSymbol(pw),
      ].filter(Boolean).length;
      if (classes < 3)
        errors.push("Include at least 3 of: lower, upper, number, symbol");
      const { score } = computePasswordScore(pw);
      if (score < 60)
        errors.push("Password strength is low; consider making it stronger");
    } else {
      if (pw.length < 16) errors.push("Minimum 16 characters required");
      if (!hasLower(pw)) errors.push("Include lowercase letters");
      if (!hasUpper(pw)) errors.push("Include uppercase letters");
      if (!hasDigit(pw)) errors.push("Include numbers");
      if (!hasSymbol(pw)) errors.push("Include special characters");
      const lowers = pw.toLowerCase();
      const weakPatterns = [
        "password",
        "1234",
        "qwerty",
        "admin",
        "letmein",
        "company",
        "work",
      ];
      if (weakPatterns.some((p) => lowers.includes(p)))
        errors.push("Avoid dictionary or corporate words");
      if (/^(.)\1+$/.test(pw)) errors.push("Avoid repeated characters");
      const { score } = computePasswordScore(pw);
      if (score < 80)
        errors.push("Password must be strong for industrial policy");
    }
    return { ok: errors.length === 0, errors };
  };
  // ✅ Step 1 validation
  const validateStep1 = () => {
    const newErrors = {};

    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Minimum 6 characters required";
    } else if (formData.password.length > 25) {
      newErrors.password = "Maximum 25 characters allowed";
    }

    if (!formData.state) newErrors.state = "State is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.rashi) newErrors.rashi = "Rashi is required";
    // if (formData.religion === "Hindu" && !formData.caste) {
    //   newErrors.caste = "Caste is required";
    // }
    if (!formData.caste) newErrors.caste = "Caste is required";
    if (!formData.weight) newErrors.weight = "Weight is required";
    if (!formData.motherTongue)
      newErrors.motherTongue = "Mother tongue is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Step 2 validation
  const validateStep2 = () => {
    const newErrors = {};

    if (!formData.educationDetails)
      newErrors.educationDetails = "Education details required";

    if (!formData.college) newErrors.college = "College is required";

    if (!formData.occupationDetails)
      newErrors.occupationDetails = "Occupation is required";
    if (!formData.educationCategory)
      newErrors.educationCategory = "Education category required";

    if (!formData.employedIn) newErrors.employedIn = "Employment is required";

    if (!formData.annualIncome) newErrors.annualIncome = "Income is required";

    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.fatherName ||
      !formData.fatherJob ||
      !formData.motherName ||
      !formData.motherJob ||
      !formData.siblings
    ) {
      toast.error("Please fill all required family details");
      return;
    }
    if (!formData.password) {
      toast.error("Password is required");
      return;
    }
    if (formData.password.length < 6) {
      toast.error("Minimum 6 characters required");
      return;
    }
    if (formData.password.length > 25) {
      toast.error("Maximum 25 characters allowed");
      return;
    }

    const polCheckFinal = validateByPolicy(formData.password, policy);
    if (!polCheckFinal.ok) {
      polCheckFinal.errors.forEach((err) => toast.error(err));
      return;
    }

    try {
      const formDataToSend = new FormData();

      Object.keys(formData).forEach((key) => {
        // ✅ Images upload
        if (key === "images") {
          (formData.images || []).forEach((img) =>
            formDataToSend.append("images", img),
          );
        }

        // ✅ Convert languagesKnown → languages (ARRAY)
        else if (key === "languagesKnown") {
          const langs = formData.languagesKnown
            ? formData.languagesKnown.split(",").map((l) => l.trim())
            : [];

          langs.forEach((lang) => formDataToSend.append("languages", lang));
        }

        // ❌ Skip preview only
        else if (key !== "imagePreviews") {
          // ✅ Send all other fields as-is
          // (includes employedIn & jobLocationDetails)
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
        {/* Step 1: Personal Information */}
        {step === 1 && (
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
                // Validate password and policy before proceeding
                if (!formData.password) {
                  setPasswordError("Password is required");
                  return;
                }
                if (formData.password.length < 6) {
                  setPasswordError("Minimum 6 characters required");
                  return;
                }
                if (formData.password.length > 25) {
                  setPasswordError("Maximum 25 characters allowed");
                  return;
                }
                const polCheck = validateByPolicy(formData.password, policy);
                if (!polCheck.ok) {
                  setPolicyErrors(polCheck.errors);
                  return;
                }
                if (!validateStep1()) {
                  toast.error("Please fill all required fields");
                  return;
                }
                setStep(2);
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Profile Image */}
                <div className="md:col-span-2">
                  <div className="bg-white border rounded-xl p-4 shadow-sm">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <h3 className="text-base font-semibold text-gray-800">
                          Profile Photos
                        </h3>
                        <p className="text-xs text-gray-500">
                          Upload up to 10 photos (Max 5MB each)
                        </p>
                      </div>

                      {/* Count Badge */}
                      <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded">
                        {formData.images?.length || 0}/10
                      </span>
                    </div>

                    {/* Upload Box */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-indigo-400 transition">
                      <ImageUploader
                        images={formData.images}
                        previews={formData.imagePreviews}
                        maxFiles={10}
                        maxSizeMB={5}
                        onChange={(imgs, previews) =>
                          setFormData((prev) => ({
                            ...prev,
                            images: imgs,
                            imagePreviews: previews,
                          }))
                        }
                      />
                    </div>

                    {/* Info Footer */}
                    <p className="text-[11px] text-gray-400 mt-2">
                      Tip: Add clear face photos for better matches
                    </p>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    onChange={handleChange}
                    value={formData.fullName || ""}
                    placeholder="Enter Full Name"
                    className={`mt-1 block w-full px-3 py-3 border rounded-md ${
                      errors.fullName ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    onChange={handleChange}
                    value={formData.email || ""}
                    placeholder="Email Address"
                    className={`mt-1 block w-full px-3 py-3 border rounded-md ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>
                {/* Password */}
                <div className="relative">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password <span className="text-red-500">*</span>
                  </label>

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    maxLength={25}
                    required
                    onChange={(e) => {
                      handleChange(e);
                      const v = e.target.value;
                      const r = computePasswordScore(v);
                      setPasswordScore(r.score);
                      const pol = validateByPolicy(v, policy);
                      setPolicyErrors(pol.errors);
                      if (passwordError) setPasswordError("");
                    }}
                    value={formData.password || ""}
                    placeholder="Password"
                    className={`mt-1 block w-full px-3 py-3 pr-12 border rounded-md ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    }`}
                  />

                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.password}
                    </p>
                  )}

                  {/* 👁 Icon centered */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-[47px] transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <FaEyeSlash size={18} />
                    ) : (
                      <FaEye size={18} />
                    )}
                  </button>

                  {passwordError && (
                    <p className="text-sm text-red-600 mt-1">{passwordError}</p>
                  )}

                  {policyErrors && policyErrors.length > 0 && (
                    <div className="mt-2 text-xs text-red-600">
                      {policyErrors.map((err, i) => (
                        <div key={i}>• {err}</div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Gender */}
                <div className="relative">
                  <label
                    htmlFor="gender"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1 relative">
                    <select
                      id="gender"
                      name="gender"
                      onChange={handleChange}
                      value={formData.gender || ""}
                      className={`appearance-none mt-1 block w-full px-3 py-3 border rounded-md ${
                        errors.gender ? "border-red-500" : "border-gray-300"
                      }`}
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

                {/* Date of Birth */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>

                  <div className="grid grid-cols-3 gap-3 mt-1">
                    {/* Day */}
                    <select
                      value={dobDay}
                      onChange={(e) => {
                        setDobDay(e.target.value);
                        handleDobChange(e.target.value, dobMonth, dobYear);
                      }}
                      className="appearance-none px-3 py-3 border rounded-md"
                    >
                      <option value="">DD</option>
                      {[...Array(31)].map((_, i) => (
                        <option key={i + 1} value={String(i + 1)}>
                          {i + 1}
                        </option>
                      ))}
                    </select>

                    {/* Month */}
                    <select
                      value={dobMonth}
                      onChange={(e) => {
                        setDobMonth(e.target.value);
                        handleDobChange(dobDay, e.target.value, dobYear);
                      }}
                      className="appearance-none px-3 py-3 border rounded-md"
                    >
                      <option value="">MM</option>
                      {[...Array(12)].map((_, i) => (
                        <option key={i + 1} value={String(i + 1)}>
                          {i + 1}
                        </option>
                      ))}
                    </select>

                    {/* Year */}
                    <select
                      value={dobYear}
                      onChange={(e) => {
                        setDobYear(e.target.value);
                        handleDobChange(dobDay, dobMonth, e.target.value);
                      }}
                      className="appearance-none px-3 py-3 border rounded-md"
                    >
                      <option value="">YYYY</option>
                      {Array.from({ length: 60 }, (_, i) => {
                        const year = new Date().getFullYear() - i;
                        return (
                          <option key={year} value={String(year)}>
                            {year}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  {/* 🎂 Age */}
                  {formData.dateOfBirth && (
                    <p className="text-xs text-gray-600 mt-1">
                      Age:{" "}
                      <span className="font-semibold">
                        {getAge(formData.dateOfBirth)} years
                      </span>
                    </p>
                  )}

                  {/* ❌ Error */}
                  {dobError && (
                    <p className="text-red-500 text-sm mt-1">{dobError}</p>
                  )}
                </div>

                {/* Height */}
                <div>
                  <label
                    htmlFor="height"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Height <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1 relative">
                    <select
                      id="height"
                      name="height"
                      onChange={handleChange}
                      value={formData.height || ""}
                      className={`appearance-none mt-1 block w-full px-3 py-3 border rounded-md ${
                        errors.height ? "border-red-500" : "border-gray-300"
                      }`}
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
                {/* Rashi / Zodiac Sign */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Rashi / Zodiac Sign <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="rashi"
                    onChange={handleChange}
                    value={formData.rashi || ""}
                    className={`mt-1 block w-full px-3 py-3 border rounded-md ${
                      errors.rashi ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter Rashi"
                  />
                  {errors.rashi && (
                    <p className="text-red-500 text-sm mt-1">{errors.rashi}</p>
                  )}
                </div>

                {/* Weight */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Weight (kg) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="weight"
                    onChange={handleChange}
                    value={formData.weight || ""}
                    placeholder="Weight (kg)"
                    className={`mt-1 block w-full px-3 py-3 border rounded-md ${
                      errors.weight ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.weight && (
                    <p className="text-red-500 text-sm mt-1">{errors.weight}</p>
                  )}
                </div>

                {/* Mother Tongue */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Mother Tongue <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="motherTongue"
                    onChange={handleChange}
                    value={formData.motherTongue || ""}
                    placeholder="Mother Tongue"
                    className={`mt-1 block w-full px-3 py-3 border rounded-md ${
                      errors.motherTongue ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.motherTongue && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.motherTongue}
                    </p>
                  )}
                </div>

                {/* Body Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Body Type
                  </label>
                  <select
                    name="bodyType"
                    onChange={handleChange}
                    value={formData.bodyType || ""}
                    className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md"
                  >
                    <option value="">Select</option>
                    <option>Slim</option>
                    <option>Average</option>
                    <option>Athletic</option>
                    <option>Heavy</option>
                  </select>
                </div>
                {/* Languages Known */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Languages Known
                  </label>
                  <input
                    name="languagesKnown"
                    onChange={handleChange}
                    value={formData.languagesKnown || ""}
                    placeholder="Hindi, English"
                    className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md"
                  />
                </div>
                {/* Religion (read-only) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Religion
                  </label>
                  <div className="mt-1 relative">
                    {/* If backend provided more than one religion, show a select. Otherwise show read-only single value (default Hindu). */}
                    {religionsLoading ? (
                      <input
                        type="text"
                        readOnly
                        value={"Loading..."}
                        className="appearance-none block w-full px-3 py-3 border border-gray-200 rounded-md bg-gray-50 text-gray-700"
                      />
                    ) : religions && religions.length > 1 ? (
                      <>
                        <select
                          id="religion"
                          name="religion"
                          required
                          onChange={handleChange}
                          value={formData.religion || ""}
                          className="appearance-none block w-full px-3 py-3 border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm pr-8"
                        >
                          <option value="" disabled>
                            Select Religion
                          </option>
                          {religions.map((r) => (
                            <option key={r} value={r}>
                              {r}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                          <FaChevronDown className="h-4 w-4" />
                        </div>
                      </>
                    ) : (
                      <>
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
                      </>
                    )}
                  </div>
                </div>

                {/* Caste */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Caste <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1 relative">
                    <select
                      name="caste"
                      onChange={handleChange}
                      value={formData.caste || ""}
                      className={`mt-1 block w-full px-3 py-3 border rounded-md ${
                        errors.caste ? "border-red-500" : "border-gray-300"
                      }`}
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
                    {errors.caste && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.caste}
                      </p>
                    )}
                  </div>
                </div>
                <h4 className="md:col-span-2 font-bold">Location</h4>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Country
                  </label>
                  <select
                    name="country"
                    value={formData.country || ""}
                    onChange={(e) => {
                      handleChange(e);
                      if (e.target.value === "India") {
                        setFormData((prev) => ({
                          ...prev,
                          citizenship: "Indian",
                        }));
                      } else {
                        setFormData((prev) => ({ ...prev, citizenship: "" }));
                      }
                    }}
                    className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md"
                  >
                    <option value="">Select</option>
                    <option value="India">India</option>
                    <option value="Other">Other</option>
                  </select>
                  {formData.country === "Other" && (
                    <input
                      type="text"
                      name="countryOther"
                      value={formData.countryOther || ""}
                      placeholder="Enter Country"
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Citizenship
                  </label>
                  {formData.country === "India" ? (
                    <input
                      value="Indian"
                      readOnly
                      className="mt-1 block w-full px-3 py-3 border border-gray-200 rounded-md bg-gray-50 text-gray-700"
                    />
                  ) : (
                    <input
                      name="citizenship"
                      value={formData.citizenship || ""}
                      placeholder="Enter Citizenship"
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    State <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="state"
                    value={formData.state || ""}
                    onChange={(e) => {
                      handleChange(e);
                      setFormData((prev) => ({ ...prev, city: "" }));
                      fetchCitiesForState(e.target.value, "personal");
                    }}
                    className={`mt-1 block w-full px-3 py-3 border rounded-md ${
                      errors.state ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select State</option>
                    {states.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  {/* ✅ CORRECT PLACE */}
                  {errors.state && (
                    <p className="text-red-500 text-sm mt-1">{errors.state}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    City <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="city"
                    value={formData.city || ""}
                    onChange={handleChange}
                    className={`mt-1 block w-full px-3 py-3 border rounded-md ${
                      errors.city ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select City</option>
                    {personalCities.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  {errors.city && (
                    <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Native Place
                  </label>
                  <input
                    name="nativePlace"
                    value={formData.nativePlace || ""}
                    onChange={handleChange}
                    placeholder="Native Place"
                    className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-full text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                >
                  Next
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
        )}

        {/* Step 2: Education & Career */}
        {step === 2 && (
          <>
            <div>
              <h3 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Education & Career
              </h3>
              <p className="mt-2 text-center text-sm text-gray-600">
                Tell us about your education and job.
              </p>
            </div>

            <form
              className="mt-8 space-y-6"
              onSubmit={(e) => {
                e.preventDefault();

                if (!validateStep2()) {
                  toast.error("Please fill all required fields");
                  return;
                }

                setStep(3);
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Job */}
                {/* Education Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Education Category <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1 relative">
                    <select
                      name="educationCategory"
                      value={formData.educationCategory || ""}
                      onChange={handleChange}
                      className={`appearance-none mt-1 block w-full px-3 py-3 border rounded-md ${
                        errors.educationCategory
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    >
                      <option value="" disabled>
                        Select Education Category
                      </option>
                      {educationOptions.map((edu) => (
                        <option key={edu} value={edu}>
                          {edu}
                        </option>
                      ))}
                    </select>
                    {errors.educationCategory && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.educationCategory}
                      </p>
                    )}
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <FaChevronDown className="h-4 w-4" />
                    </div>
                  </div>
                </div>

                {/* Education in Detail */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Education in Detail <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="educationDetails"
                    value={formData.educationDetails || ""}
                    onChange={handleChange}
                    placeholder="Education details (e.g. B.Sc, Year)"
                    className={`mt-1 block w-full px-3 py-3 border rounded-md ${
                      errors.educationDetails
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />

                  {errors.educationDetails && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.educationDetails}
                    </p>
                  )}
                </div>

                {/* College / Institute */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    College / Institute <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="college"
                    value={formData.college || ""}
                    onChange={handleChange}
                    placeholder="College / Institute"
                    className={`mt-1 block w-full px-3 py-3 border rounded-md ${
                      errors.college ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.college && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.college}
                    </p>
                  )}
                </div>

                {/* Job Location */}
                <h4 className="md:col-span-2 font-bold">Job Location</h4>
                <div className="md:col-span-2">
                  <label
                    htmlFor="employedIn"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Employed In <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1 relative">
                    <select
                      name="employedIn"
                      value={formData.employedIn || ""}
                      onChange={handleChange}
                      className={`appearance-none mt-1 block w-full px-3 py-3 border rounded-md ${
                        errors.employedIn ? "border-red-500" : "border-gray-300"
                      }`}
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
                    {errors.employedIn && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.employedIn}
                      </p>
                    )}
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <FaChevronDown className="h-4 w-4" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Occupation In Details{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="occupationDetails"
                    value={formData.occupationDetails || ""}
                    onChange={handleChange}
                    placeholder="Occupation / Job title"
                    className={`mt-1 block w-full px-3 py-3 border rounded-md ${
                      errors.occupationDetails
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />

                  {errors.occupationDetails && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.occupationDetails}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Country
                  </label>
                  <select
                    name="jobCountry"
                    value={formData.jobCountry || ""}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md"
                  >
                    <option value="India">India</option>
                    <option value="Other">Other</option>
                  </select>

                  {formData.jobCountry === "Other" && (
                    <input
                      type="text"
                      name="jobCountryOther"
                      value={formData.jobCountryOther || ""}
                      placeholder="Enter Country"
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    State <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="jobState"
                    value={formData.jobState || ""}
                    onChange={(e) => {
                      handleChange(e);
                      setFormData((prev) => ({ ...prev, jobCity: "" }));
                      fetchCitiesForState(e.target.value, "job");
                    }}
                    className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md"
                  >
                    <option value="">Select State</option>
                    {states.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    City <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="jobCity"
                    value={formData.jobCity || ""}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md"
                  >
                    <option value="">Select City</option>
                    {jobCities.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Location In Detail
                  </label>
                  <input
                    name="jobLocationDetails"
                    value={formData.jobLocationDetails || ""}
                    onChange={handleChange}
                    placeholder="Location details (office/local area)"
                    className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md"
                  />
                </div>

                {/* Annual Income */}
                <div className="md:col-span-2">
                  <label
                    htmlFor="annual-income"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Annual Income <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1 relative">
                    <select
                      name="annualIncome"
                      value={formData.annualIncome || ""}
                      onChange={handleChange}
                      className={`appearance-none mt-1 block w-full px-3 py-3 border rounded-md ${
                        errors.annualIncome
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
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
                    {errors.annualIncome && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.annualIncome}
                      </p>
                    )}
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <FaChevronDown className="h-4 w-4" />
                    </div>
                  </div>
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
                  Next
                </button>
              </div>
            </form>
          </>
        )}

        {/* Step 3: Family Details */}
        {step === 3 && (
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
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Family Values
                </label>
                <input
                  name="familyValues"
                  value={formData.familyValues || ""}
                  onChange={handleChange}
                  placeholder="e.g. Traditional, Moderate"
                  className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Family Type
                </label>
                <input
                  name="familyType"
                  value={formData.familyType || ""}
                  onChange={handleChange}
                  placeholder="e.g. Joint, Nuclear"
                  className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Family Status
                </label>
                <input
                  name="familyStatus"
                  value={formData.familyStatus || ""}
                  onChange={handleChange}
                  placeholder="e.g. Upper Middle Class"
                  className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Ancestral Origin
                </label>
                <input
                  name="ancestralOrigin"
                  value={formData.ancestralOrigin || ""}
                  onChange={handleChange}
                  placeholder="Ancestral origin / hometown"
                  className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Father's Name */}
                <div>
                  <label
                    htmlFor="father-name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Father's Name <span className="text-red-500">*</span>
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
                    Father's Job <span className="text-red-500">*</span>
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
                    Mother's Name <span className="text-red-500">*</span>
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
                    Mother's Job <span className="text-red-500">*</span>
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
                    Siblings <span className="text-red-500">*</span>
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
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Brother(s)
                  </label>
                  <input
                    type="number"
                    name="brothers"
                    value={formData.brothers || ""}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md"
                    min={0}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Brother(s) Married
                  </label>
                  <input
                    type="text"
                    name="brothersMarried"
                    value={formData.brothersMarried || ""}
                    onChange={handleChange}
                    onBlur={(e) => {
                      const value = e.target.value.toLowerCase().trim();

                      if (
                        value &&
                        !/^\d+$/.test(value) &&
                        value !== "yes" &&
                        value !== "no"
                      ) {
                        toast.error("Enter only number or Yes/No");
                      }
                    }}
                    placeholder="e.g. 0 / 1 / Yes / No"
                    className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Sister(s)
                  </label>
                  <input
                    type="number"
                    name="sisters"
                    value={formData.sisters || ""}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md"
                    min={0}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Sister(s) Married
                  </label>
                  <input
                    type="text"
                    name="sistersMarried"
                    value={formData.sistersMarried || ""}
                    onChange={handleChange}
                    onBlur={(e) => {
                      const value = e.target.value.toLowerCase().trim();

                      if (
                        value &&
                        !/^\d+$/.test(value) &&
                        value !== "yes" &&
                        value !== "no"
                      ) {
                        toast.error("Enter only number or Yes/No");
                      }
                    }}
                    placeholder="e.g. 0 / 1 / Yes / No"
                    className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md"
                  />
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
                  onClick={() => setStep(2)}
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
