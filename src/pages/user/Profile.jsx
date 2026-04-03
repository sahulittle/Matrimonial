import React, { useState, useEffect, useRef } from "react";
import { getUserProfile } from "../../api/userApi/userApi";
import { casteOptions } from "../../utils/options";
import { useAuth } from "../../context/AuthContext";

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

// Format DOB for display: YYYY-MM-D (month padded to 2, day without leading zero)
const formatDobDisplay = (dob) => {
  if (!dob) return "-";
  try {
    const d = new Date(dob);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()); // no pad to remove leading zero
    return `${y}-${m}-${day}`;
  } catch (e) {
    return dob;
  }
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
  const [isHobbiesOpen, setIsHobbiesOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isLifestyleOpen, setIsLifestyleOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [newHobby, setNewHobby] = useState("");
  const { updateProfile: updateProfileContext } = useAuth();
  const [isPartnerPrefOpen, setIsPartnerPrefOpen] = useState(false);
  const [partnerMatch, setPartnerMatch] = useState({
    match: 0,
    total: 0,
    percentage: 0,
  });
  const [ageError, setAgeError] = useState("");
  const [minAgeInvalid, setMinAgeInvalid] = useState(false);
  const [maxAgeInvalid, setMaxAgeInvalid] = useState(false);
  const aboutRef = useRef(null);
  const preferencesRef = useRef(null);

  const validateAges = (minRaw, maxRaw) => {
    const min = minRaw === "" || minRaw == null ? null : Number(minRaw);
    const max = maxRaw === "" || maxRaw == null ? null : Number(maxRaw);
    let ok = true;
    setMinAgeInvalid(false);
    setMaxAgeInvalid(false);

    if (min != null && (isNaN(min) || min < 18)) {
      setAgeError("Preferred minimum age must be a number and at least 18.");
      setMinAgeInvalid(true);
      ok = false;
    }
    if (max != null && (isNaN(max) || max < 18)) {
      setAgeError("Preferred maximum age must be a number and at least 18.");
      setMaxAgeInvalid(true);
      ok = false;
    }
    if (ok && min != null && max != null && min > max) {
      setAgeError(
        "Preferred min age cannot be greater than preferred max age.",
      );
      setMinAgeInvalid(true);
      setMaxAgeInvalid(true);
      ok = false;
    }
    if (ok) setAgeError("");
    return ok;
  };
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
        // provide YYYY-MM-DD (no time) so <input type="date"> displays correctly
        dateOfBirth: user.dateOfBirth
          ? new Date(user.dateOfBirth).toISOString().split("T")[0]
          : "",
        birthTime: user.birthTime || "",
        birthName: user.birthName || "",
        height: user.height || "",
        complexion: user.complexion || "",
        bloodGroup: user.bloodGroup || "",

        // RELIGION
        religion: user.religion || "Hindu",
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
        // New fields
        about: user.about || "",
        hobbies: Array.isArray(user.hobbies)
          ? user.hobbies
          : user.hobbies
            ? [user.hobbies]
            : [],
        lifestyle: user.lifestyle || "",
        contactDisplay: user.contactDisplay || "",
        phone: user.phone || "",
        state: user.state || "",
        city: user.city || "",
        presentAddress: user.presentAddress || "",
        languages: Array.isArray(user.languages)
          ? user.languages
          : user.languages
            ? [user.languages]
            : [],
        smoking: user.smoking || "",
        drinking: user.drinking || "",
        // PREFERENCES
        preferredMinAge: user.preferredMinAge ?? "",
        preferredMaxAge: user.preferredMaxAge ?? "",
        preferredHeight: user.preferredHeight || "",
        preferredMaritalStatus: user.preferredMaritalStatus || "",
        preferredReligion: user.preferredReligion || "",
        preferredCaste: user.preferredCaste || "",
        preferredEducation: user.preferredEducation || "",
      });
    }
  }, [user]);
  // ✅ HERE (correct place)
  const handleBasicSave = async () => {
    try {
      const updatedUser = await updateProfileContext(formData);
      setUser(updatedUser);
      setIsBasicEditOpen(false);
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const handleReligionSave = async () => {
    // Religion is fixed (Hindu) and should not be changed here — update only caste
    const updatedUser = await updateProfileContext({ caste: formData.caste });
    setUser(updatedUser);
    setIsReligionOpen(false);
  };

  const handleEducationSave = async () => {
    const updatedUser = await updateProfileContext({
      education: formData.education,
      fieldOfStudy: formData.fieldOfStudy,
    });
    setUser(updatedUser);
    setIsEducationOpen(false);
  };

  const handleCareerSave = async () => {
    const updatedUser = await updateProfileContext({
      job: formData.job,
      jobLocation: formData.jobLocation,
      annualIncome: formData.annualIncome,
    });
    setUser(updatedUser);
    setIsCareerOpen(false);
  };

  const handleFamilySave = async () => {
    const updatedUser = await updateProfileContext({
      fatherName: formData.fatherName,
      fatherJob: formData.fatherJob,
      motherName: formData.motherName,
      motherJob: formData.motherJob,
      siblings: formData.siblings,
    });
    setUser(updatedUser);
    setIsFamilyOpen(false);
  };

  const handleExtendedSave = async () => {
    const updatedUser = await updateProfileContext({
      paternalUncleName: formData.paternalUncleName,
      paternalUncleJob: formData.paternalUncleJob,
      maternalUncleName: formData.maternalUncleName,
      maternalUncleJob: formData.maternalUncleJob,
    });
    setUser(updatedUser);
    setIsExtendedOpen(false);
  };

  const handleHobbiesSave = async () => {
    try {
      const hobbiesArr = Array.isArray(formData.hobbies)
        ? formData.hobbies.map((h) => String(h).trim()).filter(Boolean)
        : [];
      const updatedUser = await updateProfileContext({ hobbies: hobbiesArr });
      setUser(updatedUser);
      setIsHobbiesOpen(false);
      setNewHobby("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleAboutSave = async () => {
    try {
      const updatedUser = await updateProfileContext({ about: formData.about });
      setUser(updatedUser);
      // close the dedicated About modal when saved
      setIsAboutOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleContactSave = async () => {
    try {
      const updatedUser = await updateProfileContext({
        phone: formData.phone,
        email: formData.email,
      });
      setUser(updatedUser);
      setIsContactOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLifestyleSave = async () => {
    try {
      // Prepare languages as array if provided as comma-separated
      let languagesValue = formData.languages;
      if (typeof languagesValue === "string") {
        languagesValue = languagesValue
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }

      const updatedUser = await updateProfileContext({
        lifestyle: formData.lifestyle,
        presentAddress: formData.presentAddress,
        languages: languagesValue,
        smoking: formData.smoking,
        drinking: formData.drinking,
      });
      setUser(updatedUser);
      setIsLifestyleOpen(false);
    } catch (err) {
      console.error(err);
    }
  };
  // ================= PARTNER PREFERENCES HELPERS =================
  const handlePartnerPrefSave = async () => {
    try {
      console.log("Saving partner preferences, payload:", {
        preferredMinAge: formData.preferredMinAge,
        preferredMaxAge: formData.preferredMaxAge,
        preferredHeight: formData.preferredHeight,
        preferredMaritalStatus: formData.preferredMaritalStatus,
        preferredReligion: formData.preferredReligion,
        preferredCaste: formData.preferredCaste,
        preferredEducation: formData.preferredEducation,
      });
      // Validate ages: must be >= 18 and min <= max when both provided
      const minAgeRaw = formData.preferredMinAge;
      const maxAgeRaw = formData.preferredMaxAge;
      const minAge =
        minAgeRaw === "" || minAgeRaw == null ? null : Number(minAgeRaw);
      const maxAge =
        maxAgeRaw === "" || maxAgeRaw == null ? null : Number(maxAgeRaw);

      if (minAge != null && (isNaN(minAge) || minAge < 18)) {
        alert("Preferred minimum age must be a number and at least 18.");
        return;
      }
      if (maxAge != null && (isNaN(maxAge) || maxAge < 18)) {
        alert("Preferred maximum age must be a number and at least 18.");
        return;
      }
      if (minAge != null && maxAge != null && minAge > maxAge) {
        alert("Preferred min age cannot be greater than preferred max age.");
        return;
      }

      const prefs = {
        preferredMinAge: minAge,
        preferredMaxAge: maxAge,
        preferredHeight: formData.preferredHeight || "",
        preferredMaritalStatus: formData.preferredMaritalStatus || "",
        preferredReligion: formData.preferredReligion || "",
        preferredCaste: formData.preferredCaste || "",
        preferredEducation: formData.preferredEducation || "",
      };

      const updatedUser = await updateProfileContext(prefs);
      console.log("Partner preferences saved, response user:", updatedUser);
      setUser(updatedUser);
      setIsPartnerPrefOpen(false);
      calcPartnerMatch(updatedUser, prefs);
    } catch (err) {
      console.error("Failed to save preferences", err);
      alert("Failed to save partner preferences. See console for details.");
    }
  };

  const calcPartnerMatch = (currentUserObj, prefs) => {
    if (!currentUserObj || !prefs)
      return setPartnerMatch({ match: 0, total: 0, percentage: 0 });

    let total = 0;
    let match = 0;
    const safe = (v) => (v == null ? "" : String(v).trim().toLowerCase());
    const getAge = (dob) => {
      if (!dob) return null;
      const d = new Date(dob);
      if (isNaN(d)) return null;
      return Math.floor(
        (Date.now() - d.getTime()) / (1000 * 60 * 60 * 24 * 365.25),
      );
    };

    if (prefs.preferredMinAge != null && prefs.preferredMaxAge != null) {
      total++;
      const age = getAge(currentUserObj.dateOfBirth);
      if (
        age != null &&
        age >= Number(prefs.preferredMinAge) &&
        age <= Number(prefs.preferredMaxAge)
      )
        match++;
    }

    if (prefs.preferredHeight) {
      total++;
      if (safe(currentUserObj.height) === safe(prefs.preferredHeight)) match++;
    }

    if (prefs.preferredMaritalStatus) {
      total++;
      if (
        safe(currentUserObj.maritalStatus) ===
        safe(prefs.preferredMaritalStatus)
      )
        match++;
    }

    if (prefs.preferredReligion) {
      total++;
      if (safe(currentUserObj.religion) === safe(prefs.preferredReligion))
        match++;
    }

    if (prefs.preferredCaste) {
      total++;
      if (safe(currentUserObj.caste) === safe(prefs.preferredCaste)) match++;
    }

    if (prefs.preferredEducation) {
      total++;
      if (safe(currentUserObj.education) === safe(prefs.preferredEducation))
        match++;
    }

    const percentage = total > 0 ? Math.round((match / total) * 100) : 0;
    setPartnerMatch({ match, total, percentage });
  };

  // recalc when user or preference changes
  useEffect(() => {
    if (!user) return;
    const prefs = {
      preferredMinAge: formData.preferredMinAge,
      preferredMaxAge: formData.preferredMaxAge,
      preferredHeight: formData.preferredHeight,
      preferredMaritalStatus: formData.preferredMaritalStatus,
      preferredReligion: formData.preferredReligion,
      preferredCaste: formData.preferredCaste,
      preferredEducation: formData.preferredEducation,
    };
    calcPartnerMatch(user, prefs);
  }, [
    user,
    formData.preferredMinAge,
    formData.preferredMaxAge,
    formData.preferredHeight,
    formData.preferredMaritalStatus,
    formData.preferredReligion,
    formData.preferredCaste,
    formData.preferredEducation,
  ]);

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
        const updatedUser = await updateProfileContext({
          profilePhoto: preview,
        });
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

            {/* <p className="text-sm text-gray-500">
              {user?._id ? `SH${user._id.toString().slice(-6)}` : ""}
            </p> */}

            <p className="text-sm text-gray-600 mt-2">
              {calculateAge(user?.dateOfBirth)} / {user?.height || "-"} •{" "}
              {user?.jobLocation || "-"}
            </p>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-600 bg-gray-50 p-3 rounded-md whitespace-pre-wrap break-words w-full max-h-40 overflow-auto text-justify">
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
              {/* TOP TABS: About Myself / Partner Preferences (sticky) */}
              <div className="sticky top-16 z-30 bg-white p-2 mb-4 rounded">
                <div className="flex gap-2">
                  <button className="px-3 py-1 text-sm rounded border bg-blue-50 text-blue-600">
                    About Myself
                  </button>

                  <button
                    onClick={() => {
                      // scroll to Partner Preferences
                      preferencesRef.current?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    }}
                    className="px-3 py-1 text-sm rounded border bg-pink-50 text-pink-600"
                  >
                    Partner Preferences
                  </button>
                </div>
              </div>

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
                <Row label="DOB" value={formatDobDisplay(user?.dateOfBirth)} />
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

              {/* HOBBIES & INTERESTS */}
              <Section
                title="Hobbies and Interests"
                onEdit={() => setIsHobbiesOpen(true)}
              >
                <div className="flex gap-2 flex-wrap">
                  {(user?.hobbies || []).length > 0 ? (
                    user.hobbies.map((h) => (
                      <span
                        key={h}
                        className="px-3 py-1 rounded-full border text-sm text-pink-600 bg-pink-50"
                      >
                        {h}
                      </span>
                    ))
                  ) : (
                    <div className="text-gray-500">No hobbies added</div>
                  )}
                </div>
              </Section>

              {/* ABOUT */}
              <div ref={aboutRef} style={{ scrollMarginTop: "4rem" }}>
                <Section title="About" onEdit={() => setIsAboutOpen(true)}>
                  <div className="text-sm text-gray-700 whitespace-pre-wrap break-words w-full">
                    {user?.about || "No description added"}
                  </div>
                </Section>
              </div>

              {/* CONTACT DETAILS */}
              <Section
                title="My Contact detail"
                onEdit={() => setIsContactOpen(true)}
              >
                <Row label="Mobile" value={user?.phone} />
                <Row label="Email" value={user?.email} />
              </Section>

              {/* LIFESTYLE */}
              <Section
                title="Life Style"
                onEdit={() => setIsLifestyleOpen(true)}
              >
                <div className="text-sm text-gray-700 space-y-1">
                  <div>
                    <strong>Present Address:</strong>{" "}
                    {user?.presentAddress || "-"}
                  </div>
                  <div>
                    <strong>Languages:</strong>{" "}
                    {(user?.languages || []).length > 0
                      ? Array.isArray(user.languages)
                        ? user.languages.join(", ")
                        : user.languages
                      : "-"}
                  </div>
                  <div>
                    <strong>Smoking:</strong> {user?.smoking || "-"}
                  </div>
                  <div>
                    <strong>Drinking:</strong> {user?.drinking || "-"}
                  </div>
                  <div>
                    <strong>Other:</strong> {user?.lifestyle || "-"}
                  </div>
                </div>
              </Section>

              {/* PARTNER PREFERENCES */}
              <div ref={preferencesRef} style={{ scrollMarginTop: "4rem" }}>
                <Section
                  title="Partner Preferences"
                  onEdit={() => {
                    console.log("Opening Partner Preferences modal");
                    setIsPartnerPrefOpen(true);
                  }}
                >
                  <div className="mb-3">
                    <p className="text-sm text-gray-600">
                      You match{" "}
                      <span className="font-semibold text-pink-600">
                        {partnerMatch.percentage}%
                      </span>{" "}
                      ({partnerMatch.match}/{partnerMatch.total})
                    </p>

                    <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
                      <div
                        className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full"
                        style={{ width: `${partnerMatch.percentage}%` }}
                      />
                    </div>
                  </div>

                  <Row
                    label="Age"
                    value={
                      formData.preferredMinAge && formData.preferredMaxAge
                        ? `${formData.preferredMinAge} to ${formData.preferredMaxAge}`
                        : "-"
                    }
                  />

                  <Row label="Height" value={formData.preferredHeight || "-"} />
                  <Row
                    label="Marital Status"
                    value={formData.preferredMaritalStatus || "-"}
                  />
                  <Row
                    label="Religion / Community"
                    value={formData.preferredReligion || "-"}
                  />
                  <Row label="Caste" value={formData.preferredCaste || "-"} />
                  <Row
                    label="Education"
                    value={formData.preferredEducation || "-"}
                  />
                </Section>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* modal for edit  */}
      {/* ABOUT EDIT MODAL */}
      {isAboutOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-start sm:items-center justify-center overflow-auto z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto relative">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-lg font-semibold">Edit About</h2>
              <button
                aria-label="Close"
                onClick={() => setIsAboutOpen(false)}
                className="text-gray-400 hover:text-gray-600 rounded-md p-1"
              >
                ×
              </button>
            </div>

            <div>
              <label className="text-sm text-gray-600">About</label>
              <textarea
                rows={6}
                value={formData.about || ""}
                onChange={(e) =>
                  setFormData({ ...formData, about: e.target.value })
                }
                className="border p-2 rounded mt-1 w-full"
                placeholder="Write something about yourself"
              />
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setIsAboutOpen(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleAboutSave}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      {/* PARTNER PREFERENCES MODAL */}
      {isPartnerPrefOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-start sm:items-center justify-center overflow-auto z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto relative">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-lg font-semibold">
                Edit Partner Preferences
              </h2>
              <button
                aria-label="Close"
                onClick={() => setIsPartnerPrefOpen(false)}
                className="text-gray-400 hover:text-gray-600 rounded-md p-1"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-gray-600">
                  Preferred Min Age
                </label>
                <input
                  type="number"
                  min={18}
                  placeholder="Min Age"
                  value={formData.preferredMinAge || ""}
                  onChange={(e) => {
                    const v = e.target.value;
                    setFormData({ ...formData, preferredMinAge: v });
                    validateAges(v, formData.preferredMaxAge);
                  }}
                  className={`border p-2 rounded mt-1 w-full ${minAgeInvalid ? "border-red-500" : ""}`}
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">
                  Preferred Max Age
                </label>
                <input
                  type="number"
                  min={18}
                  placeholder="Max Age"
                  value={formData.preferredMaxAge || ""}
                  onChange={(e) => {
                    const v = e.target.value;
                    setFormData({ ...formData, preferredMaxAge: v });
                    validateAges(formData.preferredMinAge, v);
                  }}
                  className={`border p-2 rounded mt-1 w-full ${maxAgeInvalid ? "border-red-500" : ""}`}
                />
              </div>
              <div className="col-span-2">
                {ageError && (
                  <p className="text-sm text-red-600 mt-1">{ageError}</p>
                )}
              </div>

              <div>
                <label className="text-sm text-gray-600">
                  Preferred Height
                </label>
                <input
                  placeholder="e.g. 5'4 (163cm)"
                  value={formData.preferredHeight || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      preferredHeight: e.target.value,
                    })
                  }
                  className="border p-2 rounded mt-1 w-full"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">
                  Preferred Marital Status
                </label>
                <input
                  placeholder="e.g. Never Married"
                  value={formData.preferredMaritalStatus || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      preferredMaritalStatus: e.target.value,
                    })
                  }
                  className="border p-2 rounded mt-1 w-full"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">
                  Preferred Religion
                </label>
                <input
                  placeholder="Religion"
                  value={formData.preferredReligion || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      preferredReligion: e.target.value,
                    })
                  }
                  className="border p-2 rounded mt-1 w-full"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Preferred Caste</label>
                <select
                  value={formData.preferredCaste || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, preferredCaste: e.target.value })
                  }
                  className="border p-2 rounded mt-1 w-full"
                >
                  <option value="">Any</option>
                  {casteOptions.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-2">
                <label className="text-sm text-gray-600">
                  Preferred Education
                </label>
                <input
                  placeholder="e.g. B.Tech"
                  value={formData.preferredEducation || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      preferredEducation: e.target.value,
                    })
                  }
                  className="border p-2 rounded mt-1 w-full"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setIsPartnerPrefOpen(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handlePartnerPrefSave}
                disabled={Boolean(ageError)}
                className={`px-4 py-2 rounded ${ageError ? "bg-gray-300 text-gray-600 cursor-not-allowed" : "bg-blue-600 text-white"}`}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* isBasicEditOpen */}
      {isBasicEditOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-start sm:items-center justify-center overflow-auto z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto relative">
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

              {/* STATE */}
              <div>
                <label className="text-sm text-gray-600">State</label>
                <input
                  placeholder="State"
                  value={formData.state || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, state: e.target.value })
                  }
                  className="border p-2 rounded mt-1 w-full"
                />
              </div>

              {/* CITY */}
              <div>
                <label className="text-sm text-gray-600">City</label>
                <input
                  placeholder="City"
                  value={formData.city || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
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
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-start sm:items-center justify-center overflow-auto z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
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
                <div className="mt-1">
                  <select
                    value={formData.caste || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, caste: e.target.value })
                    }
                    className="border p-2 rounded mt-1 w-full max-h-48 overflow-auto"
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
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-start sm:items-center justify-center overflow-auto z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
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
      {/* HOBBIES MODAL */}
      {isHobbiesOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-start sm:items-center justify-center overflow-auto z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-lg font-semibold">
                Edit Hobbies & Interests
              </h2>
              <button
                aria-label="Close"
                onClick={() => setIsHobbiesOpen(false)}
                className="text-gray-400 hover:text-gray-600 rounded-md p-1"
              >
                ×
              </button>
            </div>

            <div>
              <label className="text-sm text-gray-600">
                Add Hobby / Interest
              </label>
              <div className="flex gap-2 mt-1">
                <input
                  placeholder="Type hobby and press Add or Enter"
                  value={newHobby}
                  onChange={(e) => setNewHobby(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const val = newHobby.trim();
                      if (!val) return;
                      const existing = Array.isArray(formData.hobbies)
                        ? formData.hobbies
                        : [];
                      if (!existing.includes(val)) {
                        setFormData({
                          ...formData,
                          hobbies: [...existing, val],
                        });
                      }
                      setNewHobby("");
                    }
                  }}
                  className="border p-2 rounded w-full"
                />
                <button
                  type="button"
                  onClick={() => {
                    const val = newHobby.trim();
                    if (!val) return;
                    const existing = Array.isArray(formData.hobbies)
                      ? formData.hobbies
                      : [];
                    if (!existing.includes(val)) {
                      setFormData({ ...formData, hobbies: [...existing, val] });
                    }
                    setNewHobby("");
                  }}
                  className="px-3 py-2 bg-pink-600 text-white rounded"
                >
                  Add
                </button>
              </div>

              <div className="mt-3 flex gap-2 flex-wrap">
                {(Array.isArray(formData.hobbies) ? formData.hobbies : [])
                  .length > 0 ? (
                  (formData.hobbies || []).map((h, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full border text-sm text-pink-600 bg-pink-50 flex items-center gap-2"
                    >
                      {h}
                      <button
                        type="button"
                        onClick={() => {
                          const arr = Array.isArray(formData.hobbies)
                            ? [...formData.hobbies]
                            : [];
                          arr.splice(idx, 1);
                          setFormData({ ...formData, hobbies: arr });
                        }}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        ✕
                      </button>
                    </span>
                  ))
                ) : (
                  <div className="text-gray-500">No hobbies added</div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setIsHobbiesOpen(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleHobbiesSave}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONTACT MODAL */}
      {isContactOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-start sm:items-center justify-center overflow-auto z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-lg font-semibold">Edit Contact Details</h2>
              <button
                aria-label="Close"
                onClick={() => setIsContactOpen(false)}
                className="text-gray-400 hover:text-gray-600 rounded-md p-1"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="text-sm text-gray-600">Mobile</label>
                <input
                  placeholder="Phone"
                  value={formData.phone || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="border p-2 rounded mt-1 w-full"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Email</label>
                <input
                  placeholder="Email"
                  value={formData.email || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="border p-2 rounded mt-1 w-full"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setIsContactOpen(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleContactSave}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LIFESTYLE MODAL */}
      {isLifestyleOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-start sm:items-center justify-center overflow-auto z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-lg font-semibold">Edit Life Style</h2>
              <button
                aria-label="Close"
                onClick={() => setIsLifestyleOpen(false)}
                className="text-gray-400 hover:text-gray-600 rounded-md p-1"
              >
                ×
              </button>
            </div>

            <div>
              <div className="grid gap-3">
                <div>
                  <label className="text-sm text-gray-600">
                    Present Address
                  </label>
                  <input
                    placeholder="Present Address"
                    value={formData.presentAddress || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        presentAddress: e.target.value,
                      })
                    }
                    className="border p-2 rounded mt-1 w-full"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600">
                    Languages (comma separated)
                  </label>
                  <input
                    placeholder="e.g. Marathi, Hindi"
                    value={
                      Array.isArray(formData.languages)
                        ? formData.languages.join(", ")
                        : formData.languages || ""
                    }
                    onChange={(e) =>
                      setFormData({ ...formData, languages: e.target.value })
                    }
                    className="border p-2 rounded mt-1 w-full"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm text-gray-600">Smoking</label>
                    <select
                      value={formData.smoking || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, smoking: e.target.value })
                      }
                      className="border p-2 rounded mt-1 w-full"
                    >
                      <option value="">Select</option>
                      <option value="non-smoker">Non-Smoker</option>
                      <option value="occasional">Occasional</option>
                      <option value="smoker">Smoker</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm text-gray-600">Drinking</label>
                    <select
                      value={formData.drinking || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, drinking: e.target.value })
                      }
                      className="border p-2 rounded mt-1 w-full"
                    >
                      <option value="">Select</option>
                      <option value="non-drinker">Non-Drinker</option>
                      <option value="occasional">Occasional</option>
                      <option value="drinker">Drinker</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-600">Life Style</label>
                  <input
                    placeholder="e.g. Vegetarian"
                    value={formData.lifestyle || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, lifestyle: e.target.value })
                    }
                    className="border p-2 rounded mt-1 w-full"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setIsLifestyleOpen(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleLifestyleSave}
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
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-start sm:items-center justify-center overflow-auto z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
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
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-start sm:items-center justify-center overflow-auto z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
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
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-start sm:items-center justify-center overflow-auto z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
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
