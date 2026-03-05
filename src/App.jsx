import React, { useState, useEffect } from "react";
import Navbar from "./component/Navbar";
import Login from "./component/Login";
import Home from "./component/home/Home";
import Register from "./component/Register";
import { Route, Routes, useLocation } from "react-router-dom";
import Preloader from "./component/Preloader";
import Packages from "./component/packages/Packages";
import SignUp from "./component/SignUp";

const App = () => {
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // On any location change, we want to show the loader.
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500); // Using a 1.5 second delay for all loads
    return () => clearTimeout(timer);
  }, [location]); // Re-run the effect when the location changes

  return (
    <div>
      {loading ? (
        <Preloader />
      ) : (
        <>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/packages" element={<Packages/>}/>
            <Route path="/signup" element={<SignUp/>}/>
          </Routes>
        </>
      )}
    </div>
  );
};

export default App;