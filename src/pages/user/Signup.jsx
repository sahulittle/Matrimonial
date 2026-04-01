import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { addUser, setCurrentUser, saveUserProfile, createDefaultProfile, getUsers } from '../../utils/storage'

const Signup = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [gender, setGender] = useState('Male')
  const [age, setAge] = useState('')
  const [religion, setReligion] = useState('Hindu')
  const [motherTongue, setMotherTongue] = useState('Hindi')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    
    // Check if user already exists
    const users = getUsers()
    const existingUser = users.find(u => u.email === email)
    
    if (existingUser) {
      setError('An account with this email already exists. Please login.')
      return
    }
    
    // Generate unique ID for new user
    const newUserId = (users.length + 1).toString()
    
    // Create new user object
    const newUser = {
      id: newUserId,
      name: name,
      email: email,
      password: password,
      age: parseInt(age) || 25,
      gender: gender,
      religion: religion,
      motherTongue: motherTongue
    }
    
    // Add user to storage
    addUser(newUser)
    
    // Create default profile for the user
    const defaultProfile = createDefaultProfile(newUser)
    
    // Save profile to profiles storage
    saveUserProfile(newUserId, defaultProfile)
    
    // Initialize user's interests in storage
    const interests = JSON.parse(localStorage.getItem('interests')) || {}
    interests[newUserId] = { sent: [], received: [] }
    localStorage.setItem('interests', JSON.stringify(interests))
    
    // Initialize user's notifications in storage
    const notifications = JSON.parse(localStorage.getItem('notifications')) || {}
    notifications[newUserId] = []
    localStorage.setItem('notifications', JSON.stringify(notifications))
    
    // Set current user (without password)
    setCurrentUser(newUser)
    
    // Navigate to dashboard
    navigate('/user/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-pink-100 to-rose-100 px-4 py-8">
      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-linear-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">💕</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
          <p className="text-gray-500 mt-2">Join Shaadi.com to find your perfect match</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none transition-all"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none transition-all"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Age
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Age"
                min="18"
                max="99"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none transition-all"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Religion
              </label>
              <select
                value={religion}
                onChange={(e) => setReligion(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none transition-all"
              >
                <option value="Hindu">Hindu</option>
                <option value="Muslim">Muslim</option>
                <option value="Christian">Christian</option>
                <option value="Sikh">Sikh</option>
                <option value="Buddhist">Buddhist</option>
                <option value="Jain">Jain</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mother Tongue
              </label>
              <select
                value={motherTongue}
                onChange={(e) => setMotherTongue(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none transition-all"
              >
                <option value="Hindi">Hindi</option>
                <option value="English">English</option>
                <option value="Marathi">Marathi</option>
                <option value="Gujarati">Gujarati</option>
                <option value="Tamil">Tamil</option>
                <option value="Telugu">Telugu</option>
                <option value="Kannada">Kannada</option>
                <option value="Malayalam">Malayalam</option>
                <option value="Punjabi">Punjabi</option>
                <option value="Bengali">Bengali</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none transition-all"
              required
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-linear-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-pink-500/25 transition-all"
          >
            Create Account
          </button>
        </form>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-pink-500 font-semibold hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup
