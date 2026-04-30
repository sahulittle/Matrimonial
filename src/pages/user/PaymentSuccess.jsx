import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const { fetchUserProfile } = useAuth();

  useEffect(() => {
    const updateUser = async () => {
      try {
        await fetchUserProfile(); // ✅ refresh user

        // 🔥 redirect AFTER update
        setTimeout(() => {
          navigate("/user/dashboard");
        }, 500); // small delay ensures UI updates
      } catch (err) {
        console.error("User refresh failed", err);
      }
    };

    updateUser();
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-green-50">
      <h1 className="text-3xl font-bold text-green-600 mb-4">
        🎉 Payment Successful!
      </h1>

      <p className="text-gray-700 mb-6">
        Your subscription has been activated successfully.
      </p>
    </div>
  );
};

export default PaymentSuccess;
