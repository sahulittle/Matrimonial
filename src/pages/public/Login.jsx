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
  const [passwordScore, setPasswordScore] = useState(0);
  const [passwordStrength, setPasswordStrength] = useState("");
  const [error, setError] = useState("");
  const [captchaSvg, setCaptchaSvg] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [captchaError, setCaptchaError] = useState("");

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
    setError("");

    // Final validation before submit
    const validEmail = validateEmailOrPhone(email);
    const validPassword = validatePassword(password);
    const validCaptcha = validateCaptcha(captchaInput);

    if (!validEmail || !validPassword || !validCaptcha) {
      setEmailError(validEmail ? "" : "Enter a valid email.");
      setPasswordError(
        validPassword ? "" : "Password must be at least 6 characters.",
      );
      setCaptchaError(validCaptcha ? "" : "");
      return;
    }

    setLoading(true);

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

  // ---------------- Validation helpers ----------------
  // Password strength helpers (kept local to Login for simplicity)
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

  const classifyStrength = (score) => {
    if (score >= 85) return "strong";
    if (score >= 65) return "good";
    if (score >= 45) return "fair";
    if (score >= 25) return "weak";
    return "very weak";
  };

  const validateEmailOrPhone = (val) => {
    if (!val) return false;
    const v = String(val).trim();
    // simple email regex
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRe.test(v)) return true;
    // phone: digits only, length 7-15
    const phoneRe = /^\d{7,15}$/;
    return phoneRe.test(v);
  };

  const validatePassword = (val) => {
    if (!val) return false;
    return String(val).length >= 6; // keep minimal check for login
  };

  const validateCaptcha = (val) => {
    if (!val) return false;
    // captcha generated by server is 6 characters
    return String(val).trim().length === 6;
  };

  // strength color mapping: make 'good' and above green
  const strengthTextClass =
    passwordScore >= 65
      ? "text-emerald-600"
      : passwordScore >= 45
        ? "text-yellow-600"
        : "text-red-600";
  const strengthBarClass =
    passwordScore >= 65
      ? "bg-emerald-500"
      : passwordScore >= 45
        ? "bg-yellow-400"
        : "bg-red-400";

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 sm:py-24 px-4 sm:px-6 lg:px-8 mt-10">
      <div className="max-w-lg w-full space-y-8 bg-white p-6 sm:p-8 lg:p-10 rounded-xl shadow-lg">
        <h3 className="text-center text-4xl font-bold text-pink-500">
          Welcome Back! Please Login
        </h3>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-5">
            {/* EMAIL */}
            <input
              type="text"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError("");
              }}
              onBlur={() => {
                const ok = validateEmailOrPhone(email);
                setEmailError(ok ? "" : "Enter a valid email.");
              }}
              required
              className={`w-full px-3 py-3 rounded-md ${emailError ? "border-red-500 border" : "border border-gray-300"}`}
              placeholder="Email Address or Phone Number"
            />
            {emailError && (
              <p className="text-sm text-red-600 mt-1">{emailError}</p>
            )}

            {/* PASSWORD */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  const v = e.target.value;
                  setPassword(v);
                  if (passwordError) setPasswordError("");
                  // update strength
                  const r = computePasswordScore(v);
                  setPasswordScore(r.score);
                  setPasswordStrength(classifyStrength(r.score));
                }}
                onBlur={() => {
                  const ok = validatePassword(password);
                  setPasswordError(
                    ok ? "" : "Password must be at least 6 characters.",
                  );
                }}
                required
                className={`w-full px-3 py-3 rounded-md pr-10 ${passwordError ? "border-red-500 border" : "border border-gray-300"}`}
                placeholder="Password"
              />
              {passwordError && (
                <p className="text-sm text-red-600 mt-1">{passwordError}</p>
              )}

              <span
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {/* PASSWORD STRENGTH METER & POLICY */}
            <div className="mt-2">
              <div className="flex items-center justify-between text-xs mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Strength:</span>
                  <span
                    className={`font-semibold capitalize ${strengthTextClass}`}
                  >
                    {passwordStrength || "—"}
                  </span>
                </div>
                <div className="text-gray-500">{passwordScore}%</div>
              </div>

              <div className="h-2 bg-gray-200 rounded overflow-hidden">
                <div
                  style={{ width: `${passwordScore}%` }}
                  className={`h-full ${strengthBarClass}`}
                />
              </div>

              {/* show required character types checklist */}
              <div className="mt-3 text-sm text-gray-700">
                <div className="grid grid-cols-2 gap-2">
                  <div
                    className={`flex items-center gap-2 ${hasLower(password) ? "text-emerald-600" : "text-gray-400"}`}
                  >
                    <span className="font-semibold">
                      {hasLower(password) ? "✔" : "○"}
                    </span>
                    <span>Lowercase (a-z)</span>
                  </div>
                  <div
                    className={`flex items-center gap-2 ${hasUpper(password) ? "text-emerald-600" : "text-gray-400"}`}
                  >
                    <span className="font-semibold">
                      {hasUpper(password) ? "✔" : "○"}
                    </span>
                    <span>Uppercase (A-Z)</span>
                  </div>
                  <div
                    className={`flex items-center gap-2 ${hasDigit(password) ? "text-emerald-600" : "text-gray-400"}`}
                  >
                    <span className="font-semibold">
                      {hasDigit(password) ? "✔" : "○"}
                    </span>
                    <span>Number (0-9)</span>
                  </div>
                  <div
                    className={`flex items-center gap-2 ${hasSymbol(password) ? "text-emerald-600" : "text-gray-400"}`}
                  >
                    <span className="font-semibold">
                      {hasSymbol(password) ? "✔" : "○"}
                    </span>
                    <span>Special (!@#$...)</span>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  Tip: use a mix of the above and at least 8 characters for
                  better security.
                </div>
              </div>
            </div>

            {/* CAPTCHA */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="flex gap-2 items-center justify-between sm:justify-start">
                {/* Captcha Image */}
                <div
                  dangerouslySetInnerHTML={{ __html: captchaSvg }}
                  className="bg-gray-200 p-2 rounded"
                />

                {/* Refresh Button */}
                <button
                  type="button"
                  onClick={fetchCaptcha}
                  className="p-2 bg-gray-200 hover:bg-gray-300 rounded shrink-0"
                >
                  <FaSyncAlt />
                </button>
              </div>
              {/* Captcha Input */}
              <input
                type="text"
                value={captchaInput}
                onChange={(e) => {
                  setCaptchaInput(e.target.value);
                  if (captchaError) setCaptchaError("");
                }}
                onBlur={() => {
                  const ok = validateCaptcha(captchaInput);
                  setCaptchaError(ok ? "" : "");
                }}
                placeholder="Enter Captcha"
                className={`w-full px-4 py-2 rounded-lg ${captchaError ? "border-red-500 border" : "border border-gray-300"}`}
                required
              />
              {captchaError ? (
                <p className="text-sm text-red-600 mt-1">{captchaError}</p>
              ) : (
                <p className="text-xs text-gray-500 mt-1"></p>
              )}
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
            disabled={
              loading ||
              !validateEmailOrPhone(email) ||
              !validatePassword(password) ||
              !validateCaptcha(captchaInput)
            }
            className={`w-full py-3 px-4 text-white rounded-full transition ${
              loading ||
              !validateEmailOrPhone(email) ||
              !validatePassword(password) ||
              !validateCaptcha(captchaInput)
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-pink-600 hover:bg-pink-700"
            }`}
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
