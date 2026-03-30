import React from "react";
import { FaCheck } from "react-icons/fa";
import { useState, useEffect } from "react";

import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";

import {
  createPaymentIntent,
  confirmPayment,
  getPackages,
} from "../../api/userApi/userApi";

const Packages = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const res = await getPackages();
      setPackages(res.data.packages); // 🔥 important
      console.log("Packages fetched:", res.data.packages);
    } catch (error) {
      console.error("Error fetching packages:", error);
    }
  };
  // ✅ PAYMENT FUNCTION
  const handlePayment = async (pkg) => {
    try {
      if (!stripe || !elements) {
        alert("Stripe not loaded");
        return;
      }

      const cardElement = elements.getElement(CardElement);

      if (!cardElement) {
        alert("Card element not found");
        return;
      }

      // 🔄 Loading (optional UX)
      console.log("Creating payment intent...");

      // 1️⃣ Create Payment Intent
      const res = await createPaymentIntent({
        packageId: pkg._id,
      });

      const { clientSecret, paymentId } = res.data;

      // 2️⃣ Confirm Payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      // ❌ Error handling
      if (result.error) {
        alert(result.error.message);
        return;
      }

      // ✅ Success
      if (result.paymentIntent.status === "succeeded") {
        await confirmPayment({
          paymentId,
          transactionId: result.paymentIntent.id,
        });

        alert("✅ Payment Successful 🎉");

        setShowModal(false);
        setSelectedPackage(null);
      }
    } catch (err) {
      console.error(err);
      alert("Payment failed");
    }
  };

  return (
    <>
      <div className="py-16 bg-gray-100 mt-20">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-4xl font-bold text-gray-800 mb-4">
            Matrimonial Package
          </h3>

          <p className="text-gray-600 max-w-3xl mx-auto mb-12">
            Every user have their own package. Anyone can upgrade package or buy
            package through online payment system.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {packages.map((pkg, index) => (
              <div
                key={index}
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
                  <div className="flex items-center gap-3 border-b pb-3">
                    <FaCheck className="text-pink-500 text-sm" />
                    Duration ({pkg.validity} Days)
                  </div>

                  <div className="flex items-center gap-3 border-b pb-3">
                    <FaCheck className="text-pink-500 text-sm" />
                    Profile View ({pkg.profileLimit})
                  </div>

                  <div className="flex items-center gap-3 border-b pb-3">
                    <FaCheck className="text-pink-500 text-sm" />
                    Interest Express ({pkg.interestLimit})
                  </div>

                  <div className="flex items-center gap-3 pb-3">
                    <FaCheck className="text-pink-500 text-sm" />
                    Image Upload ({pkg.imageLimit})
                  </div>

                  {/* Button */}
                  <div className="text-center mt-6">
                    <button
                      onClick={() => {
                        setSelectedPackage(pkg);
                        setShowModal(true);
                      }}
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
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-md shadow-lg relative">
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-3 text-gray-500 text-xl"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold text-center mb-4">
              Pay for {selectedPackage?.name}
            </h2>

            <p className="text-center text-pink-500 text-2xl font-bold mb-4">
              ₹{selectedPackage?.price}
            </p>

            {/* Card Input */}
            <div className="border p-4 rounded mb-4">
              <CardElement />
            </div>

            {/* Pay Button */}
            {/* Pay Button with Loading */}
            <button
              onClick={async () => {
                setLoading(true);
                await handlePayment(selectedPackage);
                setLoading(false);
              }}
              disabled={loading}
              className="w-full py-2 bg-gradient-to-r from-pink-500 to-pink-700 text-white rounded-md"
            >
              {loading ? "Processing..." : "Pay Now"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Packages;
