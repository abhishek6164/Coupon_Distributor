import React, { useState, useEffect, useContext } from "react";
import CouponStatus from "./CouponStatus"; // Importing status component
import { AppContext } from "./context/AppContext"; // Import Context

const ClaimCoupon = () => {
  const { backendUrl } = useContext(AppContext); // Get backend URL from context
  const [coupon, setCoupon] = useState(null);
  const [isClaimed, setIsClaimed] = useState(false);
  const [remainingTime, setRemainingTime] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const lastClaimTime = Number(localStorage.getItem("lastClaimTime"));

    if (lastClaimTime) {
      const currentTime = Date.now();
      const timeDiff = (currentTime - lastClaimTime) / 1000; // Convert to seconds
      const remainingSeconds = 24 * 60 * 60 - timeDiff; // 24 hours in seconds

      if (remainingSeconds > 0) {
        setIsClaimed(true);
        setRemainingTime(remainingSeconds);
        setError(
          `❌ Coupon already claimed! Try again in ${formatTime(
            remainingSeconds
          )}.`
        );
      } else {
        localStorage.removeItem("lastClaimTime");
        setIsClaimed(false);
        setError("");
      }
    }
  }, []);

  // Format remaining time in HH:MM:SS
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hours}h ${minutes}m ${secs}s`;
  };

  useEffect(() => {
    if (remainingTime > 0) {
      const timer = setInterval(() => {
        setRemainingTime((prev) => (prev > 1 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [remainingTime]);

  const handleClaim = async () => {
    if (isClaimed) return;

    setError("");

    try {
      const response = await fetch(`${backendUrl}/api/claim`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Add token if needed
        },
      });

      const data = await response.json();
      if (response.ok) {
        setCoupon(data.coupon);
        setIsClaimed(true);
        localStorage.setItem("lastClaimTime", Date.now());
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError("⚠️ Failed to claim coupon. Please try again later.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-400 to-blue-500 p-5">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md w-full">
        <h2 className="text-2xl font-bold text-gray-800">
          🎟️ Claim Your Coupon
        </h2>
        <CouponStatus isClaimed={isClaimed} error={error} /> {/* Pass props */}
        {!isClaimed && (
          <button
            onClick={handleClaim}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg mt-4 transition duration-300 transform hover:scale-105 shadow-md"
          >
            🎁 Claim Now
          </button>
        )}
        {coupon && (
          <p className="text-lg font-semibold text-gray-700 mt-4">
            🎉 Your Coupon Code:{" "}
            <span className="text-blue-600 font-bold">{coupon}</span>
          </p>
        )}
        {isClaimed && remainingTime > 0 && (
          <p className="text-red-600 font-semibold mt-4">
            ⏳ Next claim in: {formatTime(remainingTime)}
          </p>
        )}
      </div>
    </div>
  );
};

export default ClaimCoupon;
