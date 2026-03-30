import React from "react";
import "../../assets/styles/Preloader.css";

const Preloader = () => {
  return (
    <div className="preloader">
      <div className="heart-wrapper">
        <div className="heart">
          <img src="/logo-rmbg.png" alt="Loading..." className="logo" />
        </div>
      </div>
    </div>
  );
};

export default Preloader;
