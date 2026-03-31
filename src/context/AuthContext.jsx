import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useLocation } from "react-router-dom";
import {
  userAuthApi,
  userProfileApi,
  notificationApi,
  messageApi,
  interestApi,
} from "../services/api";
import { initSocket, disconnectSocket } from "../services/socketService";
import toast from "react-hot-toast";
import { getUserProfile } from "../api/userApi/userApi"; // ✅ NEW API
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authToken, setAuthToken] = useState(null);
  const [appData, setAppData] = useState({
    shortlistCount: 0,
    unreadMessagesCount: 0,
    pendingInterestsCount: 0,
    unreadNotificationsCount: 0,
  });

  const location = useLocation();

  // Initialize auth from stored token
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      const userData = JSON.parse(storedUser);

      setAuthToken(storedToken);
      setUser(userData);

      initSocket(userData._id, userData.role === "admin");

      loadAppData();

      // ✅ ADD THIS LINE
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const loadAppData = async () => {
    try {
      const [notificationsRes, interestsRes] = await Promise.all([
        notificationApi.getUnreadCount().catch(() => ({ unreadCount: 0 })),
        interestApi
          .getReceivedInterests("pending", 1, 1)
          .catch(() => ({ interests: [], pagination: { total: 0 } })),
      ]);

      setAppData((prev) => ({
        ...prev,
        unreadNotificationsCount: notificationsRes.unreadCount || 0,
        pendingInterestsCount: notificationsRes.pagination?.total || 0,
      }));
    } catch (error) {
      console.error("Error loading app data:", error);
    }
    setLoading(false);
  };

  // allow components to refresh app data
  const refreshData = async () => {
    await loadAppData();
  };

  /**
   * Register user
   */
  const register = useCallback(async (userData) => {
    try {
      setLoading(true);
      const response = await userAuthApi.register(userData);
      toast.success("Registration successful! Please login.");
      return response;
    } catch (error) {
      toast.error(error.message || "Registration failed");
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Login user
   */
  const login = useCallback(async (email, password, captcha) => {
    try {
      setLoading(true);
      const response = await userAuthApi.login(email, password, captcha);

      // Store auth data
      const token = response.token;
      const userData = response.user;

      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(userData));

      setAuthToken(token);
      setUser(userData);

      // Initialize socket for real-time features
      initSocket(userData._id, userData.role === "admin");

      // Load initial app data
      await loadAppData();

      toast.success("Login successful!");
      return response;
    } catch (error) {
      toast.error(error.message || "Login failed");
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get user profile from API
   */
  const fetchUserProfile = useCallback(async () => {
    try {
      // ✅ call NEW API
      const response = await getUserProfile();

      console.log("NEW PROFILE:", response);

      // ✅ map correctly for Navbar
      const formattedProfile = {
        _id: response._id,
        name: response.name,
        email: response.email,
        avatar: response.avatar, // ✅ IMPORTANT
      };

      setProfile(formattedProfile);
      setUser((prev) => ({ ...prev, ...formattedProfile }));

      return formattedProfile;
    } catch (error) {
      console.error("Error fetching profile:", error);
      throw error;
    }
  }, []);

  /**
   * Update user profile
   */
  const updateProfile = useCallback(async (newProfileData) => {
    try {
      setLoading(true);
      const response = await userProfileApi.updateProfile(newProfileData);
      setProfile(response.user);
      setUser(response.user);
      toast.success("Profile updated successfully");
      return response.user;
    } catch (error) {
      toast.error(error.message || "Failed to update profile");
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update family information
   */
  const updateFamilyInfo = useCallback(async (familyData) => {
    try {
      const response = await userProfileApi.updateFamilyInfo(familyData);
      setProfile(response.user);
      setUser(response.user);
      toast.success("Family info updated successfully");
      return response.user;
    } catch (error) {
      toast.error(error.message || "Failed to update family info");
      throw error;
    }
  }, []);

  /**
   * Update preferences
   */
  const updatePreferences = useCallback(async (preferences) => {
    try {
      const response = await userProfileApi.updatePreferences(preferences);
      setProfile(response.user);
      setUser(response.user);
      toast.success("Preferences updated successfully");
      return response.user;
    } catch (error) {
      toast.error(error.message || "Failed to update preferences");
      throw error;
    }
  }, []);

  /**
   * Logout user
   */
  const logout = useCallback(() => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setAuthToken(null);
    setUser(null);
    setProfile(null);
    disconnectSocket();
    window.location.replace("/login");
  }, []);

  /**
   * Change password
   */
  const changePassword = useCallback(async (currentPassword, newPassword) => {
    try {
      await userProfileApi.changePassword(currentPassword, newPassword);
      toast.success("Password changed successfully");
    } catch (error) {
      toast.error(error.message || "Failed to change password");
      throw error;
    }
  }, []);

  const value = {
    user,
    profile,
    loading,
    authToken,
    appData,
    register,
    login,
    logout,
    fetchUserProfile,
    updateProfile,
    updateFamilyInfo,
    updatePreferences,
    changePassword,
    setAppData,
    refreshData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
