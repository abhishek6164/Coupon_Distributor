import React from "react";

const CouponStatus = ({ isClaimed, error }) => {
  return (
    <div className="p-4 text-center">
      {error ? (
        <p className="text-red-500 font-bold">{error}</p>
      ) : isClaimed ? (
        <p className="text-red-500 font-bold">
          {/* ❌ You have already claimed a coupon. */}
        </p>
      ) : (
        <p className="text-green-500 font-bold">
          {/* ✅ You can claim a coupon now! */}
        </p>
      )}
    </div>
  );
};

export default CouponStatus;
