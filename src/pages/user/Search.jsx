import { useState, useEffect } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
// import { religions, castes, qualifications, occupations } from '../mockData/profiles'
import ProfileCard from '../../components/ui/ProfileCard'
import { getUsers, getCurrentUser, getUserProfile } from '../../utils/storage'

const initialFilters = {
  ageRange: [18, 50],
  religion: '',
  caste: '',
  education: '',
  occupation: '',
  location: '',
};

const SearchPage = () => {
  const [filters, setFilters] = useState(initialFilters)
  const [searchResults, setSearchResults] = useState([])
  const [currentProfile, setCurrentProfile] = useState(null)
  const [showFilters, setShowFilters] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setCurrentProfile(getUserProfile(user.id));
    }
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }

  const handleSearch = () => {
    // obtain all saved users + fallback mocked list
    let allProfiles = getUsers()
    if (currentProfile) {
      allProfiles = allProfiles.filter(p => String(p.id) !== String(currentProfile.id))
    }

    const results = allProfiles
      .filter(profile => {
        if (profile.age < filters.ageRange[0] || profile.age > filters.ageRange[1]) return false;
        if (filters.religion && profile.religion !== filters.religion) return false
        if (filters.caste && profile.motherTongue !== filters.caste) return false
        if (filters.education && !profile.education?.qualification?.includes(filters.education)) return false
        if (filters.occupation && profile.education?.occupation !== filters.occupation) return false
        if (filters.location && !profile.location?.city?.toLowerCase().includes(filters.location.toLowerCase())) return false
        return true
      })
      .map(({ password, ...rest }) => rest)
    setSearchResults(results)
  }

  const handleReset = () => {
    setFilters(initialFilters)
    setSearchResults([])
    setSearchQuery('')
  }

  const filterOptions = [
    { key: 'religion', label: 'Religion', options: religions, type: 'select' },
    { key: 'caste', label: 'Caste', options: castes, type: 'select' },
    { key: 'education', label: 'Education', options: qualifications, type: 'select' },
    { key: 'occupation', label: 'Occupation', options: occupations, type: 'select' },
    { key: 'location', label: 'Location', type: 'input' },
  ]

  const hasActiveFilters = Object.values(filters).some(v => v !== '' && v !== null && v !== undefined)

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Search Matches</h1>
          <p className="text-gray-500">Find your perfect match with advanced filters</p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors lg:hidden"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </button>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden'} lg:block`}>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
              {hasActiveFilters && (
                <button
                  onClick={handleReset}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  Reset All
                </button>
              )}
            </div>

            {/* Age Range */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Age Range</label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.ageRange[0]}
                  onChange={(e) => handleFilterChange('ageRange', [parseInt(e.target.value) || 18, filters.ageRange[1]])}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none"
                />
                <span className="text-gray-400">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.ageRange[1]}
                  onChange={(e) => handleFilterChange('ageRange', [filters.ageRange[0], parseInt(e.target.value) || 50])}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none"
                />
              </div>
            </div>

            {/* Other Filters */}
            {filterOptions.map((filter) => (
              <div key={filter.key} className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">{filter.label}</label>
                {filter.type === 'select' ? (
                  <select
                    value={filters[filter.key]}
                    onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none"
                  >
                    <option value="">Any</option>
                    {filter.options.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    placeholder={`Enter ${filter.label.toLowerCase()}`}
                    value={filters[filter.key]}
                    onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none"
                  />
                )}
              </div>
            ))}

            <button
              onClick={handleSearch}
              className="w-full py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary-500/25 transition-all flex items-center justify-center gap-2"
            >
              <Search className="w-5 h-5" />
              Search
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-3">
          {hasActiveFilters ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-gray-600">
                  Found <span className="font-semibold text-gray-900">{searchResults.length}</span> matches
                </p>
              </div>
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {searchResults.map((profile) => (
                  <ProfileCard key={profile.id} profile={profile} />
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
              <Search className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Search for Matches</h3>
              <p className="text-gray-500 mb-6">Use the filters to find your perfect match</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SearchPage
