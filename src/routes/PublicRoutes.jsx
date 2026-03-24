import React from "react";
import { Route, Navigate } from "react-router-dom";
import UserPublicLayout from "../layouts/UserPublicLayout";

// Public Pages
import Home from "../pages/public/Home";
import Login from "../pages/public/Login";
import AdminLogin from "../pages/admin/AdminLogin";
import Register from "../pages/public/Register";
import SignUp from "../pages/public/SignUp";
import Packages from "../pages/public/packages/Packages";
import Stories from "../pages/public/stories/Stories";
import Contact from "../pages/public/contact/Contact";
import Members from "../pages/public/home/Members";
import Unauthorized from "../pages/public/Unauthorized";
import Privacy from "../pages/public/privacy/Privacy";
import TermAndService from "../pages/public/privacy/TermAndService";
import PurchasePolicy from "../pages/public/privacy/PurchasePolicy";

/**
 * PublicRoutes - All public route definitions
 * No authentication required
 */
const PublicRoutes = () => (
  <>
    {/* Public pages with user layout (navbar + preloader) */}
    <Route element={<UserPublicLayout />}>
      <Route index element={<Home />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="signup" element={<SignUp />} />
      <Route path="packages" element={<Packages />} />
      <Route path="members" element={<Members />} />
      <Route path="stories" element={<Stories />} />
      <Route path="contact" element={<Contact />} />
      <Route path="privacy-policy" element={<Privacy />} />
      <Route path="terms-of-service" element={<TermAndService />} />
      <Route path="purchase-policy" element={<PurchasePolicy />} />
    </Route>

    {/* Admin Login (without layout wrapper) */}
    <Route path="admin-login" element={<AdminLogin />} />

    {/* Unauthorized page (no layout wrapper needed) */}
    <Route path="unauthorized" element={<Unauthorized />} />

    {/* Catch-all for unknown public URLs */}
    <Route path="*" element={<Navigate to="/" replace />} />
  </>
);

export default PublicRoutes;
