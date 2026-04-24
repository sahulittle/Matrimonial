import React from "react";
import { FaCheck } from "react-icons/fa";
import Footer from "../home/Footer";
import { useNavigate } from "react-router-dom";

import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";

import {
  createPaymentIntent,
  confirmPayment,
} from "../../../api/userApi/userApi";

const Packages = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const packages = [
    {
      name: "Gold",
      price: 600,
      duration: 30,
      contactViews: 100,
      interestExpress: 100,
      imageUploads: 50,
      featured: true,
    },
    {
      name: "Diamond",
      price: 1000,
      duration: 30,
      contactViews: 150,
      interestExpress: 150,
      imageUploads: 10,
      featured: false,
    },
  ];

  // ✅ PAYMENT FUNCTION
  const handlePayment = async (pkg) => {
    try {
      if (!stripe || !elements) {
        alert("Stripe not loaded");
        return;
      }

      // 1. Create Payment Intent
      const res = await createPaymentIntent({
        packageId: pkg.name,
      });

      const { clientSecret, paymentId } = res.data;

      // 2. Confirm Payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        alert(result.error.message);
        return;
      }

      // 3. Success
      if (result.paymentIntent.status === "succeeded") {
        await confirmPayment({
          paymentId,
          transactionId: result.paymentIntent.id,
        });

        alert("✅ Payment Successful");
      }
    } catch (err) {
      console.log(err);
      alert("Payment failed");
    }
  };

  // Debug / navigation wrapper for Buy button
  const handleBuy = (pkg) => {
    // quick debug to confirm click handler runs in browser console
    // remove or replace with auth check + payment flow as needed
    console.log("Buy clicked:", pkg.name);
    navigate("/login");
  };

  return (
    <>
      <div className="py-16 bg-gray-100">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-4xl font-bold text-gray-800 mb-4">
            Matrimonial Package
          </h3>

          <p className="text-gray-600 max-w-3xl mx-auto mb-12">
            Every user have their own package. Anyone can upgrade package or buy
            package through online payment system.
          </p>

          {/* ✅ STRIPE CARD POPUP INPUT (invisible until used) */}
          <div className="hidden">
            <CardElement />
          </div>

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
                    <button
                      onClick={() => handleBuy(pkg)}
                      // onClick={() => handlePayment(pkg)}
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
