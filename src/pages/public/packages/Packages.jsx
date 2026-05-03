import React, { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa";
import Footer from "../home/Footer";
import { useNavigate } from "react-router-dom";

import { createPaymentIntent, getPackages } from "../../../api/userApi/userApi";

const Packages = () => {
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);

  // ✅ FETCH PACKAGES
  const fetchPackages = async () => {
    try {
      const res = await getPackages();
      setPackages(res?.data?.packages || []);
      console.log("Packages fetched:", res.data.packages);
    } catch (err) {
      console.log("Error fetching packages", err);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  // ✅ PAYMENT FUNCTION
  const handlePayment = async (pkg) => {
    try {
      const res = await createPaymentIntent({
        packageId: pkg._id,
      });

      const { access_code, encRequest } = res.data.ccavenue;

      // 🔥 CREATE FORM FOR REDIRECT
      const form = document.createElement("form");
      form.method = "POST";
      form.action =
        "https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction";

      const encInput = document.createElement("input");
      encInput.type = "hidden";
      encInput.name = "encRequest";
      encInput.value = encRequest;

      const accessInput = document.createElement("input");
      accessInput.type = "hidden";
      accessInput.name = "access_code";
      accessInput.value = access_code;

      form.appendChild(encInput);
      form.appendChild(accessInput);

      document.body.appendChild(form);
      form.submit();
    } catch (err) {
      console.log(err);
      alert("Payment failed");
    }
  };

  // ✅ NEW: LOGIN CHECK FUNCTION
  const handleBuy = (pkg) => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      alert("Please login to continue");
      navigate("/login");
      return;
    }

    handlePayment(pkg);
  };

  return (
    <>
      <div className="py-16 bg-gray-100">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-4xl font-bold text-gray-800 mb-4">
            Matrimonial Package
          </h3>

          <p className="text-gray-600 max-w-3xl mx-auto mb-12">
            Every user has their own package. Anyone can upgrade or buy a
            package through the online payment system.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {packages.map((pkg, index) => (
              <div
                key={pkg._id || index}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-pink-500 to-pink-700 text-white py-4 text-xl font-bold relative">
                  {pkg.name}
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
                  {/* Duration */}
                  <div className="flex items-center gap-3 border-b pb-3">
                    <FaCheck className="text-pink-500 text-sm" />
                    Duration ({pkg.validity} Days)
                  </div>

                  {/* ✅ BENEFITS */}
                  {(pkg.benefits || []).map((benefit, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 border-b pb-3"
                    >
                      <FaCheck className="text-pink-500 text-sm" />
                      {benefit}
                    </div>
                  ))}

                  {/* Button */}
                  <div className="text-center mt-6">
                    <button
                      onClick={() => handleBuy(pkg)} // ✅ FIXED HERE
                      className="px-6 py-2 bg-gradient-to-r from-pink-500 to-pink-700 text-white rounded-md hover:opacity-90"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Packages;
