import React from "react";
import { useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-green-50">
      <h1 className="text-3xl font-bold text-green-600 mb-4">
        🎉 Payment Successful!
      </h1>

      <p className="text-gray-700 mb-6">
        Your subscription has been activated successfully.
      </p>

      <button
        onClick={() => navigate("/dashboard")}
        className="px-6 py-2 bg-green-600 text-white rounded-md"
      >
        Go to Dashboard
      </button>
    </div>
  );
};

export default PaymentSuccess;