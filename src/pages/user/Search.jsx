import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import ProfileCard from "../../components/ui/ProfileCard";
import { searchProfiles } from "../../api/userApi/searchApi";

const religions = [
  "Hindu",
  "Muslim",
  "Christian",
  "Sikh",
  "Buddhist",
  "Jain",
  "Parsi",
  "Jewish",
  "Other",
];

const castes = [
  "Brahmin",
  "Deshastha Brahmin",
  "Chitpavan Brahmin",
  "Karhade Brahmin",
  "Saraswat Brahmin",
  "Daivadnya Brahmin",

  "Maratha",
  "Kunbi",
  "96 Kuli Maratha",

  "Kshatriya",
  "Rajput",
  "Koli",
  "Agri",
  "Bhandari",

  "Vaishya",
  "Komti",
  "Lingayat",
  "Jain",
  "Gujarati Vaishya",
  "Marwari",

  "Mali",
  "Dhangar",
  "Teli",
  "Lohar",
  "Sutar",
  "Sonar",
  "Nhavi",
  "Kumbhar",
  "Shimpi",
  "Gurav",

  "Matang",
  "Mahar",
  "Mang",
  "Chambhar",
  "Bhoi",

  "Banjara",
  "Gavli",
  "Gosavi",
  "Pardhi",

  "Other",
];

const qualifications = [
  // School
  "Below 10th",
  "10th Pass",
  "12th Pass",

  // ITI / Diploma
  "ITI",
  "Polytechnic Diploma",
  "Diploma in Engineering",
  "Diploma in Computer Science",
  "Diploma in Mechanical",
  "Diploma in Electrical",
  "Diploma in Civil",
  "Diploma in Management",
  "Diploma in Pharmacy",

  // Bachelor's Degrees
  "BA",
  "BSc",
  "BCom",
  "BCA",
  "BBA",
  "BE",
  "BTech",
  "BArch",
  "BEd",
  "BPharm",
  "BDS",
  "MBBS",
  "LLB",
  "BHM",
  "BPT",
  "BAMS",
  "BHMS",
  "BUMS",
  "BFA",
  "BDes",
  "BMM",
  "BMS",
  "BPEd",

  // Master's Degrees
  "MA",
  "MSc",
  "MCom",
  "MCA",
  "MBA",
  "ME",
  "MTech",
  "MArch",
  "MEd",
  "MPharm",
  "MDS",
  "LLM",
  "MHM",
  "MPH",
  "MFA",
  "MDes",
  "MPEd",

  // Medical Specializations
  "MD",
  "MS",
  "DM",
  "MCh",

  // Professional Courses
  "CA",
  "CS",
  "CMA",
  "ICWA",
  "CFA",
  "Company Secretary",
  "Chartered Accountant",

  // Doctorate
  "PhD",
  "Doctorate",

  // Others
  "Professional Certification",
  "Post Doctorate",
  "Other",
];

const initialFilters = {
  ageRange: [18, 50],
  religion: "",
  caste: "",
  education: "",
  location: "",
};

const SearchPage = () => {
  const [filters, setFilters] = useState(initialFilters);
  const [searchResults, setSearchResults] = useState([]);
  const [showFilters, setShowFilters] = useState(true);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSearch = async () => {
    try {
      setLoading(true);

      const res = await searchProfiles(filters);

      setSearchResults(res.profiles || []);
      setSearched(true);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFilters(initialFilters);
    setSearchResults([]);
    setSearched(false);
  };

  const filterOptions = [
    { key: "religion", label: "Religion", options: religions },
    { key: "caste", label: "Caste", options: castes },
    { key: "education", label: "Education", options: qualifications },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Search Matches</h1>

          <p className="text-gray-500">
            Find your perfect match with advanced filters
          </p>
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl lg:hidden"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </button>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Filters */}

        <div
          className={`lg:col-span-1 ${showFilters ? "block" : "hidden"} lg:block`}
        >
          <div className="bg-white rounded-2xl p-6 shadow-sm border sticky top-20">
            <div className="flex justify-between mb-6">
              <h2 className="text-lg font-semibold">Filters</h2>

              <button onClick={handleReset} className="text-sm text-pink-600">
                Reset
              </button>
            </div>

            {/* Age */}

            <div className="mb-6">
              <label className="text-sm font-medium">Age Range</label>

              <div className="flex gap-3 mt-2">
                <input
                  type="number"
                  value={filters.ageRange[0]}
                  onChange={(e) =>
                    handleFilterChange("ageRange", [
                      parseInt(e.target.value) || 18,
                      filters.ageRange[1],
                    ])
                  }
                  className="w-full border rounded-lg px-3 py-2"
                />

                <input
                  type="number"
                  value={filters.ageRange[1]}
                  onChange={(e) =>
                    handleFilterChange("ageRange", [
                      filters.ageRange[0],
                      parseInt(e.target.value) || 50,
                    ])
                  }
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
            </div>

            {/* Religion / Caste / Education */}

            {filterOptions.map((filter) => (
              <div key={filter.key} className="mb-5">
                <label className="text-sm font-medium">{filter.label}</label>

                <select
                  value={filters[filter.key]}
                  onChange={(e) =>
                    handleFilterChange(filter.key, e.target.value)
                  }
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                >
                  <option value="">Any</option>

                  {filter.options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            ))}

            {/* Location */}

            <div className="mb-6">
              <label className="text-sm font-medium">Location</label>

              <input
                type="text"
                value={filters.location}
                onChange={(e) => handleFilterChange("location", e.target.value)}
                placeholder="Enter city"
                className="w-full border rounded-lg px-3 py-2 mt-1"
              />
            </div>

            <button
              onClick={handleSearch}
              className="w-full py-3 bg-pink-600 text-white rounded-xl flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />

              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </div>

        {/* Results */}

        <div className="lg:col-span-3">
          {searched ? (
            searchResults.length > 0 ? (
              <div>
                <p className="mb-4 text-gray-600">
                  Found <b>{searchResults.length}</b> matches
                </p>

                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {searchResults.map((profile) => (
                    <ProfileCard key={profile._id} profile={profile} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-12 border text-center">
                <Search className="w-16 h-16 mx-auto text-gray-300 mb-4" />

                <h3 className="text-xl font-semibold">No Matches Found</h3>

                <p className="text-gray-500">Try adjusting your filters</p>
              </div>
            )
          ) : (
            <div className="bg-white rounded-2xl p-12 border text-center">
              <Search className="w-16 h-16 mx-auto text-gray-300 mb-4" />

              <h3 className="text-xl font-semibold">Search for Matches</h3>

              <p className="text-gray-500">
                Use filters to find your perfect match
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
