import React from 'react'
import { FaCheck, FaCheckCircle } from "react-icons/fa";

const Packages = () => {
    const packages = [
    {
      name: "Free",
      price: "0",
      duration: 30,
      contactViews: 20,
      interestExpress: 50,
      imageUploads: 20,
      featured: false,
    },
    {
      name: "One Day",
      price: "10",
      duration: 1,
      contactViews: 10,
      interestExpress: 10,
      imageUploads: 10,
      featured: false,
    },
    {
      name: "Gold",
      price: "50",
      duration: 30,
      contactViews: "100",
      interestExpress: "100",
      imageUploads: "50",
      featured: true,
    },
    {
      name: "Diamond",
      price: "100",
      duration: 30,
      contactViews: "150",
      interestExpress: "150",
      imageUploads: "10",
      featured: false,
    },
    {
      name: "Unlimited Pro",
      price: "999.00",
      duration: "Unlimited",
      contactViews: "Unlimited",
      interestExpress: "Unlimited",
      imageUploads: "Unlimited",
      featured: false,
    },
    {
      name: "Premium",
      price: "849.00",
      duration: 45,
      contactViews: 200,
      interestExpress: 200,
      imageUploads: 200,
      featured: false,
    },
    {
      name: "All Unlimited",
      price: "1199.00",
      duration: "Unlimited",
      contactViews: "Unlimited",
      interestExpress: "Unlimited",
      imageUploads: "Unlimited",
      featured: true,
    },
    {
      name: "Advance",
      price: "899.00",
      duration: 999,
      contactViews: "999",
      interestExpress: "999",
      imageUploads: "999",
      featured: false,
    },
  ];

  return (
     <div className="py-16 bg-gray-100">
      <div className="container mx-auto px-6 text-center">

        <h3 className="text-4xl font-bold text-gray-800 mb-4">
          Matrimonial Package
        </h3>

        <p className="text-gray-600 max-w-3xl mx-auto mb-12">
          Every user have their own package. Anyone can upgrade package or buy
          package through online payment system.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {packages.map((pkg, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">

              {/* Header */}
              <div className="bg-linear-to-r from-pink-500 to-pink-700 text-white py-4 text-xl font-bold relative">
                {pkg.name}

                {/* triangle */}
                <div className="absolute left-1/2 -bottom-3 transform -translate-x-1/2 w-0 h-0 border-l-12 border-l-transparent border-r-12 border-r-transparent border-t-12 border-t-pink-600"></div>
              </div>

              {/* Price */}
              <div className="py-8">
                <p className="text-4xl font-bold text-pink-500">
                  ₹{pkg.price}
                </p>
              </div>

              {/* Features */}
              <div className="px-8 pb-8 text-left space-y-4 text-gray-600">

                <div className="flex items-center gap-3 border-b pb-3">
                  <FaCheck className="text-pink-500 text-sm" />
                  Duration ({pkg.duration})
                </div>

                <div className="flex items-center gap-3 border-b pb-3">
                  <FaCheck className="text-pink-500 text-sm" />
                  Contact View ({pkg.contactViews})
                </div>

                <div className="flex items-center gap-3 border-b pb-3">
                  <FaCheck className="text-pink-500 text-sm" />
                  Interest Express ({pkg.interestExpress})
                </div>

                <div className="flex items-center gap-3 pb-3">
                  <FaCheck className="text-pink-500 text-sm" />
                  Image Upload ({pkg.imageUploads})
                </div>

                {/* Button */}
                <div className="text-center mt-6">
                  <button className="px-6 py-2 bg-linear-to-r from-pink-500 to-pink-700 text-white rounded-md hover:opacity-90">
                    Buy Now
                  </button>
                </div>

              </div>

            </div>
          ))}

        </div>

      </div>
    </div>
  )
}

export default Packages