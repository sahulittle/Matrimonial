import React from "react";
import "../../assets/styles/Preloader.css";

const Preloader = () => {
  return (
    <div className="preloader">
      <div className="heart-wrapper">
        <div className="heart">
          <img
            src="/favicon.png"
            alt="Loading..."
            className="preloader-logo"
            aria-hidden="false"
          />
        </div>
      </div>
    </div>
  );
};

export default Preloader;
