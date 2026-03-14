import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  getCurrentUser,
  getUserProfile,
  saveUserProfile,
  clearCurrentUser,
  getShortlistForUser,
  getConversationsForUser,
  getInterestsForUser,
  getUserNotifications,
  getProfiles,
} from '../utils/storage';
import { useLocation } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [appData, setAppData] = useState({
    shortlistCount: 0,
    unreadMessagesCount: 0,
    pendingInterestsCount: 0,
    unreadNotificationsCount: 0,
    recommendationsCount: 0,
  });

  const location = useLocation();

  const loadData = useCallback(() => {
    setLoading(true);
    const currentUser = getCurrentUser();
    if (currentUser) {
      // Ensure role is set (default to 'user' if not specified)
      const userWithRole = {
        ...currentUser,
        role: currentUser.role || 'user',
      };
      setUser(userWithRole);
      const userProfile = getUserProfile(currentUser.id);
      setProfile(userProfile);

      // Load app-wide data for badges
      const shortlist = getShortlistForUser(currentUser.id);
      const conversations = getConversationsForUser(currentUser.id);
      const { received } = getInterestsForUser(currentUser.id);
      const notifications = getUserNotifications(currentUser.id);
      const allProfiles = Object.values(getProfiles());

      setAppData({
        shortlistCount: shortlist.length,
        unreadMessagesCount: conversations.reduce((total, conv) => total + (conv.unreadCount || 0), 0),
        pendingInterestsCount: received.filter(i => i.status === 'pending').length,
        unreadNotificationsCount: notifications.filter(n => !n.read).length,
        recommendationsCount: allProfiles.filter(p => String(p.id) !== String(currentUser.id)).length,
      });
    } else {
      setUser(null);
      setProfile(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [location.pathname, loadData]);

  /**
   * Login a user - sets user data with role
   * @param {Object} userData - User data including id, name, email, role
   */
  const login = useCallback((userData) => {
    const userWithRole = {
      ...userData,
      role: userData.role || 'user',
    };
    setUser(userWithRole);
    const userProfile = getUserProfile(userWithRole.id);
    setProfile(userProfile);
  }, []);

  const updateProfile = useCallback(async (newProfileData) => {
    if (user) {
      const updatedProfile = { ...profile, ...newProfileData };
      saveUserProfile(user.id, updatedProfile);
      setProfile(updatedProfile); // Update context state
      return updatedProfile;
    }
  }, [user, profile]);

  const logout = useCallback(() => {
    clearCurrentUser();
    setUser(null);
    setProfile(null);
    window.location.replace("/login");
  }, []);

  const value = { user, profile, loading, appData, login, updateProfile, logout, refreshData: loadData };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};