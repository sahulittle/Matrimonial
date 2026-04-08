import React from "react";

const AboutHero = ({ title, image }) => {
  return (
    <div className="bg-white">
      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-12">
        <div className="flex flex-col-reverse md:flex-row items-center gap-8">
          <div className="w-full md:w-1/2 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-pink-600">
              {title}
            </h2>
            <p className="mt-3 text-gray-600 max-w-xl mx-auto md:mx-0">
              Discover our mission and values.
            </p>
          </div>
          <div className="w-full md:w-1/2 flex justify-center md:justify-end">
            <img
              src={image}
              alt="About hero"
              className="w-full max-w-md rounded-lg shadow-lg object-cover h-56 md:h-64 lg:h-72"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutHero;
