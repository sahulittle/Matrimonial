import React from "react";
import "../../assets/styles/Preloader.css";

const Preloader = () => {
  return (
    <div className="preloader">
      <div className="loader-wrapper">
        <img src="/logo-rmbg.png" alt="Loading..." className="logo" />
      </div>
    </div>
  );
};

export default Preloader;
