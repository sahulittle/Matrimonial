import React, { useEffect } from "react";
import { Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { initializeDemoData } from "./utils/demoSeeder";

// Common Components
import ScrollToTop from "./components/common/ScrollToTop";

// Route Definitions
import AdminRoutes from "./routes/AdminRoutes";
import UserRoutes from "./routes/UserRoutes";
import PublicRoutes from "./routes/PublicRoutes";

// This is the main App component that orchestrates the routing
export default function App() {
  useEffect(() => {
    initializeDemoData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Toaster position="top-right" />
      <ScrollToTop />
      <Routes>
        {/* Admin Routes - /admin/* (protected: admin role only) */}
        {AdminRoutes()}

        {/* User Dashboard Routes - /user/* (protected: user role only) */}
        {UserRoutes()}

        {/* Public Routes - / (no auth required) */}
        {PublicRoutes()}
      </Routes>
    </div>
  );
}