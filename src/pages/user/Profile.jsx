import React, { useState, useEffect, useRef } from "react";
import { getUserProfile, updateUserProfile } from "../../api/userApi/userApi";

const Section = ({ title, children, onEdit }) => (
  <div className="border-t last:border-b border-gray-200 py-4">
    <div className="flex justify-between items-start mb-3">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-blue-50 text-blue-600 rounded-md flex items-center justify-center">
          {/* simple section icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m2 0a2 2 0 010 4H7a2 2 0 010-4h10zM7 8h10M7 4h10"
            />
          </svg>
        </div>

        <h3 className="text-base font-semibold text-gray-700">{title}</h3>
      </div>

      {onEdit && (
        <button
          onClick={onEdit}
          aria-label={`Edit ${title}`}
          className="text-sm text-blue-600 hover:bg-blue-50 px-2 py-1 rounded-md flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5h6M5 5h.01M12 12h6m-6 4h6"
            />
          </svg>
          <span className="hidden sm:inline">Edit</span>
        </button>
      )}
    </div>
    {children}
  </div>
);

const Row = ({ label, value }) => (
  <div className="flex justify-between text-sm py-2 items-center">
    <span className="text-gray-500 w-1/3">{label}</span>
    <span className="font-medium text-gray-700 w-2/3 truncate">
      {value || "-"}
    </span>
  </div>
);

// ✅ AGE CALCULATOR
const calculateAge = (dob) => {
  if (!dob) return "-";
  const diff = Date.now() - new Date(dob).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
};

export default function Profile() {
  const [user, setUser] = useState(null);
  const [isBasicEditOpen, setIsBasicEditOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [isReligionOpen, setIsReligionOpen] = useState(false);
  const [isEducationOpen, setIsEducationOpen] = useState(false);
  const [isCareerOpen, setIsCareerOpen] = useState(false);
  const [isFamilyOpen, setIsFamilyOpen] = useState(false);
  const [isExtendedOpen, setIsExtendedOpen] = useState(false);
  // ✅ FETCH PROFILE
  useEffect(() => {
    getUserProfile()
      .then((res) => {
        const u = res.user || res.data || res;
        setUser(u);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (user) {
      setFormData({
        // BASIC
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        gender: user.gender || "",
        dateOfBirth: user.dateOfBirth || "",
        birthTime: user.birthTime || "",
        birthName: user.birthName || "",
        height: user.height || "",
        complexion: user.complexion || "",
        bloodGroup: user.bloodGroup || "",

        // RELIGION
        religion: user.religion || "",
        caste: user.caste || "",

        // EDUCATION
        education: user.education || "",
        fieldOfStudy: user.fieldOfStudy || "",

        // CAREER
        job: user.job || "",
        jobLocation: user.jobLocation || "",
        annualIncome: user.annualIncome || "",

        // FAMILY
        fatherName: user.fatherName || "",
        fatherJob: user.fatherJob || "",
        motherName: user.motherName || "",
        motherJob: user.motherJob || "",
        siblings: user.siblings || "",

        // EXTENDED
        paternalUncleName: user.paternalUncleName || "",
        paternalUncleJob: user.paternalUncleJob || "",
        maternalUncleName: user.maternalUncleName || "",
        maternalUncleJob: user.maternalUncleJob || "",
      });
    }
  }, [user]);
  // ✅ HERE (correct place)
  const handleBasicSave = async () => {
    try {
      const res = await updateUserProfile(formData);

      const updatedUser = res.user || res.data || res;
      setUser(updatedUser);

      setIsBasicEditOpen(false);
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const handleReligionSave = async () => {
    const res = await updateUserProfile({
      religion: formData.religion,
      caste: formData.caste,
    });
    setUser(res.user || res.data || res);
    setIsReligionOpen(false);
  };

  const handleEducationSave = async () => {
    const res = await updateUserProfile({
      education: formData.education,
      fieldOfStudy: formData.fieldOfStudy,
    });
    setUser(res.user || res.data || res);
    setIsEducationOpen(false);
  };

  const handleCareerSave = async () => {
    const res = await updateUserProfile({
      job: formData.job,
      jobLocation: formData.jobLocation,
      annualIncome: formData.annualIncome,
    });
    setUser(res.user || res.data || res);
    setIsCareerOpen(false);
  };

  const handleFamilySave = async () => {
    const res = await updateUserProfile({
      fatherName: formData.fatherName,
      fatherJob: formData.fatherJob,
      motherName: formData.motherName,
      motherJob: formData.motherJob,
      siblings: formData.siblings,
    });
    setUser(res.user || res.data || res);
    setIsFamilyOpen(false);
  };

  const handleExtendedSave = async () => {
    const res = await updateUserProfile({
      paternalUncleName: formData.paternalUncleName,
      paternalUncleJob: formData.paternalUncleJob,
      maternalUncleName: formData.maternalUncleName,
      maternalUncleJob: formData.maternalUncleJob,
    });
    setUser(res.user || res.data || res);
    setIsExtendedOpen(false);
  };
  // ================= PHOTO BLOCK =================
  function ProfilePhotoBlock() {
    const [preview, setPreview] = useState(null);
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);

    const handleChoose = () => inputRef.current?.click();

    const handleFile = (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (ev) => {
        setPreview(ev.target.result);
        setEditing(true);
      };
      reader.readAsDataURL(file);
    };

    const handleSave = async () => {
      try {
        const res = await updateUserProfile({
          profilePhoto: preview,
        });

        const updatedUser = res.user || res.data || res;
        setUser(updatedUser);

        setEditing(false);
        setPreview(null);
      } catch (err) {
        console.error("Photo upload failed", err);
      }
    };

    return (
      <>
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={preview || user?.profilePhoto || "/default-avatar.png"}
              alt="profile"
              className="w-28 h-28 object-cover rounded-full ring-2 ring-blue-50"
            />

            <button
              onClick={handleChoose}
              title="Change photo"
              className="absolute right-0 bottom-0 bg-white border rounded-full p-1 text-blue-600 shadow-sm hover:bg-blue-50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536M9 11l6-6 3 3-6 6H9v-3z"
                />
              </svg>
            </button>

            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="hidden"
            />
          </div>

          <div>
            <h2 className="text-lg font-semibold">
              {user?.firstName} {user?.lastName}
            </h2>

            <p className="text-sm text-gray-500">
              {user?._id ? `SH${user._id.toString().slice(-6)}` : ""}
            </p>

            <p className="text-sm text-gray-600 mt-2">
              {calculateAge(user?.dateOfBirth)} / {user?.height || "-"} •{" "}
              {user?.jobLocation || "-"}
            </p>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
          {user?.about || "No description added"}
        </div>

        {editing && (
          <div className="mt-3 flex gap-2">
            <button
              onClick={handleSave}
              className="px-3 py-1 bg-blue-600 text-white rounded shadow-sm"
            >
              Save
            </button>
            <button
              onClick={() => {
                setPreview(null);
                setEditing(false);
              }}
              className="px-3 py-1 border rounded"
            >
              Cancel
            </button>
          </div>
        )}
      </>
    );
  }

  if (!user) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* LEFT */}
          <aside>
            <div className="border rounded-lg p-4">
              <ProfilePhotoBlock />
            </div>
          </aside>

          {/* RIGHT */}
          <main className="lg:col-span-2">
            <div className="bg-white border rounded-lg p-4">
              {/* BASIC */}
              <Section
                title="Basics & Lifestyle"
                onEdit={() => setIsBasicEditOpen(true)}
              >
                <Row
                  label="Name"
                  value={`${user?.firstName || ""} ${user?.lastName || ""}`}
                />
                <Row label="Email" value={user?.email} />
                <Row label="Gender" value={user?.gender} />
                <Row label="Age" value={calculateAge(user?.dateOfBirth)} />
                <Row label="DOB" value={user?.dateOfBirth} />
                <Row label="Birth Time" value={user?.birthTime} />
                <Row label="Birth Name" value={user?.birthName} />
                <Row label="Height" value={user?.height} />
                <Row label="Complexion" value={user?.complexion} />
                <Row label="Blood Group" value={user?.bloodGroup} />
              </Section>

              {/* RELIGION */}
              <Section
                title="Religious Background"
                onEdit={() => setIsReligionOpen(true)}
              >
                <Row label="Religion" value={user?.religion} />
                <Row label="Caste" value={user?.caste} />
              </Section>

              {/* EDUCATION */}
              <Section
                title="Education Details"
                onEdit={() => setIsEducationOpen(true)}
              >
                <Row label="Education" value={user?.education} />
                <Row label="Field of Study" value={user?.fieldOfStudy} />
              </Section>

              {/* CAREER */}
              <Section
                title="Career Details"
                onEdit={() => setIsCareerOpen(true)}
              >
                <Row label="Job" value={user?.job} />
                <Row label="Job Location" value={user?.jobLocation} />
                <Row label="Annual Income" value={user?.annualIncome} />
              </Section>

              {/* FAMILY */}
              <Section
                title="Family Details"
                onEdit={() => setIsFamilyOpen(true)}
              >
                <Row label="Father Name" value={user?.fatherName} />
                <Row label="Father Job" value={user?.fatherJob} />
                <Row label="Mother Name" value={user?.motherName} />
                <Row label="Mother Job" value={user?.motherJob} />
                <Row label="Siblings" value={user?.siblings} />
              </Section>

              {/* EXTENDED FAMILY */}
              <Section
                title="Extended Family"
                onEdit={() => setIsExtendedOpen(true)}
              >
                <Row
                  label="Paternal Uncle Name"
                  value={user?.paternalUncleName}
                />
                <Row
                  label="Paternal Uncle Job"
                  value={user?.paternalUncleJob}
                />
                <Row
                  label="Maternal Uncle Name"
                  value={user?.maternalUncleName}
                />
                <Row
                  label="Maternal Uncle Job"
                  value={user?.maternalUncleJob}
                />
              </Section>
            </div>
          </main>
        </div>
      </div>

      {/* modal for edit  */}
      {/* isBasicEditOpen */}
      {isBasicEditOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-lg relative">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-lg font-semibold">Edit Basics & Lifestyle</h2>
              <button
                aria-label="Close"
                onClick={() => setIsBasicEditOpen(false)}
                className="text-gray-400 hover:text-gray-600 rounded-md p-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* NAME */}
              <div>
                <label className="text-sm text-gray-600">First Name</label>
                <input
                  type="text"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  className="border p-2 rounded mt-1 w-full"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Last Name</label>
                <input
                  type="text"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  className="border p-2 rounded mt-1 w-full"
                />
              </div>

              {/* EMAIL */}
              <div className="col-span-2">
                <label className="text-sm text-gray-600">Email</label>
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="border p-2 rounded mt-1 w-full"
                />
              </div>

              {/* GENDER */}
              <div>
                <label className="text-sm text-gray-600">Gender</label>
                <input
                  type="text"
                  placeholder="Gender"
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData({ ...formData, gender: e.target.value })
                  }
                  className="border p-2 rounded mt-1 w-full"
                />
              </div>

              {/* DOB */}
              <div>
                <label className="text-sm text-gray-600">Date of Birth</label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) =>
                    setFormData({ ...formData, dateOfBirth: e.target.value })
                  }
                  className="border p-2 rounded mt-1 w-full"
                />
              </div>

              {/* BIRTH TIME */}
              <div>
                <label className="text-sm text-gray-600">Birth Time</label>
                <input
                  type="time"
                  value={formData.birthTime}
                  onChange={(e) =>
                    setFormData({ ...formData, birthTime: e.target.value })
                  }
                  className="border p-2 rounded mt-1 w-full"
                />
              </div>

              {/* BIRTH NAME */}
              <div className="col-span-2">
                <label className="text-sm text-gray-600">Birth Name</label>
                <input
                  type="text"
                  placeholder="Birth Name"
                  value={formData.birthName}
                  onChange={(e) =>
                    setFormData({ ...formData, birthName: e.target.value })
                  }
                  className="border p-2 rounded mt-1 w-full"
                />
              </div>

              {/* HEIGHT */}
              <div>
                <label className="text-sm text-gray-600">Height</label>
                <input
                  type="text"
                  placeholder="Height"
                  value={formData.height}
                  onChange={(e) =>
                    setFormData({ ...formData, height: e.target.value })
                  }
                  className="border p-2 rounded mt-1 w-full"
                />
              </div>

              {/* COMPLEXION */}
              <div>
                <label className="text-sm text-gray-600">Complexion</label>
                <input
                  type="text"
                  placeholder="Complexion"
                  value={formData.complexion}
                  onChange={(e) =>
                    setFormData({ ...formData, complexion: e.target.value })
                  }
                  className="border p-2 rounded mt-1 w-full"
                />
              </div>

              {/* BLOOD GROUP */}
              <div>
                <label className="text-sm text-gray-600">Blood Group</label>
                <input
                  type="text"
                  placeholder="Blood Group"
                  value={formData.bloodGroup}
                  onChange={(e) =>
                    setFormData({ ...formData, bloodGroup: e.target.value })
                  }
                  className="border p-2 rounded mt-1 w-full"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setIsBasicEditOpen(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleBasicSave}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      {/* RELIGION MODAL */}
      {isReligionOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-lg">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-lg font-semibold">
                Edit Religious Background
              </h2>
              <button
                aria-label="Close"
                onClick={() => setIsReligionOpen(false)}
                className="text-gray-400 hover:text-gray-600 rounded-md p-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-gray-600">Religion</label>
                <input
                  type="text"
                  placeholder="Religion"
                  value={formData.religion || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, religion: e.target.value })
                  }
                  className="border p-2 rounded mt-1 w-full"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Caste</label>
                <input
                  type="text"
                  placeholder="Caste"
                  value={formData.caste || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, caste: e.target.value })
                  }
                  className="border p-2 rounded mt-1 w-full"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setIsReligionOpen(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleReligionSave}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDUCATION MODAL */}
      {isEducationOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-lg">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-lg font-semibold">Edit Education Details</h2>
              <button
                aria-label="Close"
                onClick={() => setIsEducationOpen(false)}
                className="text-gray-400 hover:text-gray-600 rounded-md p-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-gray-600">Education</label>
                <input
                  placeholder="Education"
                  value={formData.education || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, education: e.target.value })
                  }
                  className="border p-2 rounded mt-1 w-full"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Field of Study</label>
                <input
                  placeholder="Field of Study"
                  value={formData.fieldOfStudy || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, fieldOfStudy: e.target.value })
                  }
                  className="border p-2 rounded mt-1 w-full"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setIsEducationOpen(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleEducationSave}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      {/* CAREER MODAL */}

      {isCareerOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-lg">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-lg font-semibold">Edit Career Details</h2>
              <button
                aria-label="Close"
                onClick={() => setIsCareerOpen(false)}
                className="text-gray-400 hover:text-gray-600 rounded-md p-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-gray-600">Job</label>
                <input
                  placeholder="Job"
                  value={formData.job || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, job: e.target.value })
                  }
                  className="border p-2 rounded mt-1 w-full"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Job Location</label>
                <input
                  placeholder="Job Location"
                  value={formData.jobLocation || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, jobLocation: e.target.value })
                  }
                  className="border p-2 rounded mt-1 w-full"
                />
              </div>

              <div className="col-span-2">
                <label className="text-sm text-gray-600">Annual Income</label>
                <input
                  placeholder="Annual Income"
                  value={formData.annualIncome || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, annualIncome: e.target.value })
                  }
                  className="border p-2 rounded mt-1 w-full"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setIsCareerOpen(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleCareerSave}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* . FAMILY MODAL */}
      {isFamilyOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-lg">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-lg font-semibold">Edit Family Details</h2>
              <button
                aria-label="Close"
                onClick={() => setIsFamilyOpen(false)}
                className="text-gray-400 hover:text-gray-600 rounded-md p-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-gray-600">Father Name</label>
                <input
                  placeholder="Father Name"
                  value={formData.fatherName || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, fatherName: e.target.value })
                  }
                  className="border p-2 rounded mt-1 w-full"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Father Job</label>
                <input
                  placeholder="Father Job"
                  value={formData.fatherJob || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, fatherJob: e.target.value })
                  }
                  className="border p-2 rounded mt-1 w-full"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Mother Name</label>
                <input
                  placeholder="Mother Name"
                  value={formData.motherName || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, motherName: e.target.value })
                  }
                  className="border p-2 rounded mt-1 w-full"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Mother Job</label>
                <input
                  placeholder="Mother Job"
                  value={formData.motherJob || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, motherJob: e.target.value })
                  }
                  className="border p-2 rounded mt-1 w-full"
                />
              </div>

              <div className="col-span-2">
                <label className="text-sm text-gray-600">Siblings</label>
                <input
                  placeholder="Siblings"
                  value={formData.siblings || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, siblings: e.target.value })
                  }
                  className="border p-2 rounded mt-1 w-full"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setIsFamilyOpen(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleFamilySave}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EXTENDED FAMILY */}
      {isExtendedOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-lg">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-lg font-semibold">Edit Extended Family</h2>
              <button
                aria-label="Close"
                onClick={() => setIsExtendedOpen(false)}
                className="text-gray-400 hover:text-gray-600 rounded-md p-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-gray-600">
                  Paternal Uncle Name
                </label>
                <input
                  placeholder="Paternal Uncle Name"
                  value={formData.paternalUncleName || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      paternalUncleName: e.target.value,
                    })
                  }
                  className="border p-2 rounded mt-1 w-full"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">
                  Paternal Uncle Job
                </label>
                <input
                  placeholder="Paternal Uncle Job"
                  value={formData.paternalUncleJob || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      paternalUncleJob: e.target.value,
                    })
                  }
                  className="border p-2 rounded mt-1 w-full"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">
                  Maternal Uncle Name
                </label>
                <input
                  placeholder="Maternal Uncle Name"
                  value={formData.maternalUncleName || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maternalUncleName: e.target.value,
                    })
                  }
                  className="border p-2 rounded mt-1 w-full"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">
                  Maternal Uncle Job
                </label>
                <input
                  placeholder="Maternal Uncle Job"
                  value={formData.maternalUncleJob || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maternalUncleJob: e.target.value,
                    })
                  }
                  className="border p-2 rounded mt-1 w-full"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setIsExtendedOpen(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleExtendedSave}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
