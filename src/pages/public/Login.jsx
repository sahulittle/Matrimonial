import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaSyncAlt } from "react-icons/fa";
import { userAuthApi } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [captchaSvg, setCaptchaSvg] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  // ================= FETCH CAPTCHA =================
  const fetchCaptcha = async () => {
    try {
      // getCaptcha now returns SVG text directly
      const svgText = await userAuthApi.getCaptcha();
      setCaptchaSvg(svgText);
      setError("");
    } catch (err) {
      console.error("Captcha error:", err);
      toast.error("Failed to load captcha");
    }
  };

  // ================= LOAD CAPTCHA ON PAGE LOAD =================
  useEffect(() => {
    fetchCaptcha();
  }, []);

  // ================= LOGIN SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Use the AuthContext login function which uses the correct API service
      await login(email, password, captchaInput);

      // Clear sensitive data
      setPassword("");
      setCaptchaInput("");

      // Redirect on success
      navigate("/user/dashboard");
    } catch (error) {
      setError(error.message || "Login failed");
      // Refresh captcha if login fails
      fetchCaptcha();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 sm:py-24 px-4 sm:px-6 lg:px-8 mt-10">
      <div className="max-w-2xl w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <h3 className="text-center text-4xl font-bold text-pink-500">
          Welcome Back! Please Login
        </h3>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-5">
            {/* EMAIL */}
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-3 border border-gray-300 rounded-md"
              placeholder="Email Address or Phone Number"
            />

            {/* PASSWORD */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-3 border border-gray-300 rounded-md pr-10"
                placeholder="Password"
              />

              <span
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {/* CAPTCHA */}
            <div className="flex md:flex-row flex-col items-center gap-3">
              <div className="flex gap-2 ">
                {/* Captcha Image */}
                <div
                  dangerouslySetInnerHTML={{ __html: captchaSvg }}
                  className="bg-gray-200 p-2 rounded"
                />

                {/* Refresh Button */}
                <button
                  type="button"
                  onClick={fetchCaptcha}
                  className="p-2 bg-gray-200 hover:bg-gray-300 rounded"
                >
                  <FaSyncAlt />
                </button>
              </div>
              {/* Captcha Input */}
              <input
                type="text"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                placeholder="Enter Captcha"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
          </div>

          {/* ERROR MESSAGE */}
          {error && (
            <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg">
              {error}
            </div>
          )}

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 text-white bg-pink-600 hover:bg-pink-700 disabled:bg-gray-400 rounded-full transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link to="/register" className="text-pink-600 hover:text-pink-500">
            Register
          </Link>
        </p>

        <div className="mt-4 text-center border-t pt-4">
          <p className="text-sm text-gray-600 mb-2">Are you an admin?</p>
          <Link
            to="/admin-login"
            className="text-red-600 hover:text-red-700 font-semibold"
          >
            Admin Login →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
