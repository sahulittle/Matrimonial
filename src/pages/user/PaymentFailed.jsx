import React from "react";
import { useNavigate } from "react-router-dom";

const PaymentFailed = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-red-50">
      <h1 className="text-3xl font-bold text-red-600 mb-4">
        ❌ Payment Failed
      </h1>

      <p className="text-gray-700 mb-6">
        Something went wrong. Please try again.
      </p>

      <button
        onClick={() => navigate("/packages")}
        className="px-6 py-2 bg-red-600 text-white rounded-md"
      >
        Try Again
      </button>
    </div>
  );
};

export default PaymentFailed;