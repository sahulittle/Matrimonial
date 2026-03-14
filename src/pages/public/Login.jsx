import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import {
  getUsers,
  getCurrentUser,
  setCurrentUser,
  getUserProfile,
  createDefaultProfile,
  saveUserProfile,
} from '../../utils/storage';
import { initializeDemoData } from '../../utils/demoSeeder';

const Login = () => {
  // Simple captcha generation for display purposes
  const captchaText = Math.random().toString(36).substring(2, 8).toUpperCase();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    // Ensure default demo data is seeded so demo login works on a clean browser.
    initializeDemoData();

    // If already logged in, redirect to dashboard
    const currentUser = getCurrentUser();
    if (currentUser) {
      const targetPath = currentUser.role === 'admin' ? '/admin/dashboard' : '/user/dashboard';
      navigate(targetPath);
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Authenticate user
    const users = getUsers();
    const normalizedEmail = email.toLowerCase().trim();
    const user = users.find(
      u => u.email.toLowerCase() === normalizedEmail && u.password === password
    );

    if (!user) {
      setError('Invalid email or password. Please try again.');
      return;
    }

    // Save user in localStorage
    setCurrentUser(user);

    // Load or create profile and save to localStorage
    let userProfile = getUserProfile(user.id);
    if (!userProfile) {
      userProfile = createDefaultProfile(user);
      saveUserProfile(user.id, userProfile);
    }

    const targetPath = user.role === 'admin' ? '/admin/dashboard' : '/user/dashboard';
    navigate(targetPath);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 sm:py-24 px-4 sm:px-6 lg:px-8 mt-10">
      <div className="max-w-2xl w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <div>
          <h3 className="mt-6 text-center text-4xl font-bold text-pink-500">
            Welcome Back! Please Login
          </h3>
        </div>
        <div className="my-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700 font-medium mb-2">
            Demo Login:
          </p>
          <p className="text-xs text-blue-600">
            Email: demo@client.com | Password: 123456
          </p>
          <p className="text-xs text-blue-500 mt-2">
            30 demo candidates available
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="rounded-md shadow-sm space-y-5">
            <div>
              <input
                id="identifier"
                name="identifier"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                required
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 focus:z-10 sm:text-sm"
                placeholder="Email Address or Phone Number"
              />
            </div>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 focus:z-10 sm:text-sm pr-10"
                placeholder="Password"
              />
              <span
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          {/* Captcha */}
          <div className="flex items-center gap-4">
            <div className="bg-gray-200 px-4 py-2 rounded-md text-lg font-bold tracking-widest select-none italic">
              {captchaText}
            </div>
            <input
              type="text"
              placeholder="Enter Captcha"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-pink-600 hover:text-pink-500">
                Forget password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-full text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
            >
              Login
            </button>
          </div>
        </form>
        <p className="mt-2 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-pink-600 hover:text-pink-500">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login