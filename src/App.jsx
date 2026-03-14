import React, { useState, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { initializeDemoData } from "./user/component/afterlogin/utils/demoSeeder";

// User Components
import UserNavbar from "./user/component/Navbar";
import Login from "./user/component/Login";
import Home from "./user/component/home/Home";
import Register from "./user/component/Register";
import Preloader from "./user/component/Preloader";
import Packages from "./user/component/packages/Packages";
import Stories from "./user/component/stories/Stories";
import Contact from "./user/component/contact/Contact";

// Admin Components
import Admin from "./admin/Admin";
import AfterLogin from "./user/component/afterlogin/AfterLogin";

// Utility: Scrolls to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// This component handles the layout for the user-facing part of the site
const UserLayout = () => {
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, [location.pathname]); // Re-run the effect when the pathname changes

  return (
    <div>
      {loading ? (
        <Preloader />
      ) : (
        <>
          <UserNavbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/packages" element={<Packages />} />
              <Route path="/stories" element={<Stories />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </main>
        </>
      )}
    </div>
  );
};

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
        <Route path="/afterlogin/*" element={<AfterLogin />} />
        <Route path="/admin/*" element={<Admin />} />
        <Route path="/*" element={<UserLayout />} />
      </Routes>
    </div>
  );
}