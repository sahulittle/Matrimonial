import React from "react";
import { Route, Navigate } from "react-router-dom";
import UserDashboardLayout from "../layouts/UserDashboardLayout";
import ProtectedRoute from "./ProtectedRoute";

// User Dashboard Pages
import Dashboard from "../pages/user/Dashboard";
import Profile from "../pages/user/Profile";
import Matches from "../pages/user/Matches";
import Search from "../pages/user/Search";
import Interests from "../pages/user/Interests";
import Messages from "../pages/user/Messages";
import Shortlist from "../pages/user/Shortlist";
import Visitors from "../pages/user/Visitors";
import Notifications from "../pages/user/Notifications";
import Settings from "../pages/user/Settings";
import Signup from "../pages/user/Signup";
import ProfileView from "../pages/user/ProfileView";
import UserDetailsPage from "../pages/user/UserDetailsPage";
import Packages from "../pages/user/Package";


/**
 * UserRoutes - All authenticated user route definitions
 * Protected: requires user.role === "user"
 */
const UserRoutes = () => (
  <Route path="user" element={<ProtectedRoute allowedRoles={["user"]} />}>
    <Route element={<UserDashboardLayout />}>
      {/* Redirect /user → /user/dashboard */}
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="profile" element={<Profile />} />
      <Route path="profile/:id" element={<ProfileView />} />
      <Route path="matches" element={<Matches />} />
      <Route path="search" element={<Search />} />
      <Route path="interests" element={<Interests />} />
      <Route path="messages" element={<Messages />} />
      <Route path="shortlist" element={<Shortlist />} />
      <Route path="visitors" element={<Visitors />} />
      <Route path="notifications" element={<Notifications />} />
      <Route path="settings" element={<Settings />} />
      <Route path="signup" element={<Signup />} />
      <Route path="user-details/:id" element={<UserDetailsPage />} />
      <Route path="user-details" element={<UserDetailsPage />} />
      <Route path="packages" element={<Packages />} />

      {/* Catch-all to redirect to dashboard */}
      <Route path="*" element={<Navigate to="dashboard" replace />} />
    </Route>
  </Route>
);

export default UserRoutes;
