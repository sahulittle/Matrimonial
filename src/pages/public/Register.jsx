import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa";
import toast from "react-hot-toast";
import { registerUser } from "../../api/userApi/authApi";

const Register = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [degree, setDegree] = useState("");

  // Options for dropdowns
  const complexionOptions = ["Fair", "Light", "Medium", "Dark"];
  const bloodGroupOptions = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  // const educationOptions = [
  //   'High School',
  //   'Trade/Technical/Vocational Training',
  //   'Diploma',
  //   'Associate Degree',
  //   'Bachelors Degree',
  //   'Masters Degree',
  //   'Doctorate or higher',
  // ];
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
      "Mechatronics Engineering",
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
      "Forensic Science",
    ],

    BA: [
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
      "Anthropology",
    ],

    BBA: [
      "Marketing",
      "Finance",
      "Human Resource Management",
      "International Business",
      "Entrepreneurship",
      "Business Analytics",
      "Supply Chain Management",
      "Operations Management",
      "Hospital Management",
      "Retail Management",
    ],

    BCA: [
      "Computer Applications",
      "Software Development",
      "Web Development",
      "Mobile App Development",
      "Database Management",
      "Data Science",
      "Artificial Intelligence",
      "Cyber Security",
      "Cloud Computing",
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
      "International Business",
    ],
    LAW: [
      "Corporate Law",
      "Criminal Law",
      "Civil Law",
      "Constitutional Law",
      "International Law",
      "Human Rights Law",
      "Intellectual Property Law",
      "Environmental Law",
      "Taxation Law",
    ],

    MBA: [
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
      "Retail Management",
    ],

    MBBS: [
      "General Medicine",
      "General Surgery",
      "Pediatrics",
      "Orthopedics",
      "Gynecology",
      "Cardiology",
      "Neurology",
      "Dermatology",
      "Radiology",
      "Anesthesiology",
    ],
    PHD: [
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
      "Education",
    ],
    "M.Com": [
      "Accounting",
      "Finance",
      "Banking",
      "Insurance",
      "Taxation",
      "International Business",
      "Marketing",
      "Human Resource Management",
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
      "Mechatronics",
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
      "Education",
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
      "Psychology",
    ],
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // const handleFieldOfStudyChange = (e) => {
  //   setFieldOfStudy(e.target.value);
  // };
  const handleFinalSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        gender: formData.gender,
        dateOfBirth: formData.dob,
        birthTime: formData.birthTime,
        birthName: formData.birthName,
        height: formData.height,
        complexion: formData.complexion,
        bloodGroup: formData.bloodGroup,
        education: formData.education,
        job: formData.job,
        jobLocation: formData.jobLocation,
        annualIncome: formData.annualIncome,
        fieldOfStudy: fieldOfStudy,

        fatherName: formData.fatherName,
        fatherJob: formData.fatherJob,
        motherName: formData.motherName,
        motherJob: formData.motherJob,
        siblings: formData.siblings,
        paternalUncleName: formData.paternalUncleName,
        paternalUncleJob: formData.paternalUncleJob,
        maternalUncleName: formData.maternalUncleName,
        maternalUncleJob: formData.maternalUncleJob,
      };

      const res = await registerUser(payload);

      toast.success(res.message);

      navigate("/login");
    } catch (error) {
      toast.error(error.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 sm:py-24 px-4 sm:px-6 lg:px-8 mt-10">
      <div className="max-w-4xl w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
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
                setStep(2);
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      <option value="" disabled selected>
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
                    name="dob"
                    type="date"
                    required
                    onChange={handleChange}
                    value={formData.dob || ""}
                    className="mt-1 appearance-none block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                  />
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
                      <option value="" disabled selected>
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
                      <option value="" disabled selected>
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
                      <option value="" disabled selected>
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
                        setFieldOfStudy("");
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

                {/* Field of Study */}

                {/* <div>
                  <label
                    htmlFor="fieldOfStudy"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Field of Study
                  </label>
                  <div className="mt-1 relative">
                    <select
                      id="fieldOfStudy"
                      name="fieldOfStudy"
                      required
                      onChange={handleFieldOfStudyChange}
                      value={fieldOfStudy}
                      className="appearance-none block w-full px-3 py-3 border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm pr-8"
                    >
                      <option value="" disabled selected>
                        Select Field of Study
                      </option>{" "}
                      {degree &&
                        fieldOfStudyOptions[degree]?.map((branch, index) => (
                          <option key={index} value={branch}>
                            {" "}
                            {branch}{" "}
                          </option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <FaChevronDown className="h-4 w-4" />
                    </div>
                  </div>
                </div> */}

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
                      <option value="" disabled selected>
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
                      <option value="" disabled selected>
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
                      <option value="" disabled selected>
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
                      <option value="" disabled selected>
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
