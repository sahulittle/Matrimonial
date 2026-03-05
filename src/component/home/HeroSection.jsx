import React, { useState, useEffect } from 'react';

const HeroSection = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = [
    "https://cdn0.weddingwire.in/article/5050/3_2/1280/jpg/40505-marathibride-rohitnagwekar-lead.jpeg",
    "https://img.weddingbazaar.com/photos/pictures/005/302/747/new_medium/tejas_jagtap_photography_.jpg?1668173568",
    "https://weddingaffair.co.in/wp-content/uploads/2020/07/Wedding-Affair-Pinterest.png"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli", "Daman and Diu", "Delhi", "Lakshadweep", "Puducherry"
  ];

  return (
    <div className="relative w-full flex items-center justify-center overflow-hidden mt-24">
      {/* Background Images */}
      {images.map((img, index) => (
        <div
          key={index}
          className={`absolute inset-0 w-full h-full bg-contain bg-center transition-opacity duration-1000 ease-in-out ${
            index === currentImageIndex ? 'opacity-200' : 'opacity-0'
          }`}
          style={{ backgroundImage: `url(${img})` }}
        />
      ))}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 py-12 flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* Left Side */}
        <div className="text-white text-center lg:text-left lg:w-1/2 space-y-6 animate-fade-in-up lg:ml-10">
          <h3 className="text-2xl md:text-3xl font-semibold text-pink-400 tracking-wide">Welcome to <span className='text-white'>MatriLab</span>
          </h3>
          <h2 className="text-4xl md:text-6xl font-bold leading-tight text-pink-400">
            Find Your Perfect <br />Life Partner With Us
          </h2>
          <button className="px-8 py-3 bg-gradient-to-r from-pink-500 to-pink-400 hover:to-pink-700 text-white font-bold rounded-full shadow-lg transform transition hover:scale-105">
            Success Stories
          </button>
        </div>

        {/* Right Side - Form */}
        <div className="bg-white/95 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-lg lg:w-5/12 border-t-4 border-pink-500 lg:mr-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Find Your Partner</h2>
          <form className="space-y-4">
            
            {/* State */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">State</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none text-gray-700">
                <option value="">Select State</option>
                {indianStates.map((state, idx) => (
                  <option key={idx} value={state}>{state}</option>
                ))}
              </select>
            </div>

            {/* City & Profession */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">City</label>
                <input type="text" placeholder="City" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Profession</label>
                <input type="text" placeholder="Profession" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none" />
              </div>
            </div>

            {/* Marital Status & Looking For */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Marital Status</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none text-gray-700">
                  <option value="single">Single</option>
                  <option value="married">Married</option>
                  <option value="divorced">Divorced</option>
                  <option value="widow">Widow</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Looking For</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none text-gray-700">
                  <option value="bride">Bride</option>
                  <option value="groom">Groom</option>
                </select>
              </div>
            </div>

            {/* Habits */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Smoking</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none text-gray-700">
                  <option value="non-smoker">Non-Smoker</option>
                  <option value="smoker">Smoker</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Drinking</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none text-gray-700">
                  <option value="non-drinker">Non-Drinker</option>
                  <option value="drinker">Drinker</option>
                </select>
              </div>
            </div>

            <button type="submit" className="w-full py-3 mt-4 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-lg transition-all shadow-md hover:shadow-lg">
              Search
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HeroSection