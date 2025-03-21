import React from "react";
import ClaimCoupon from "../ClaimCoupon";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="p-5 text-center">
      <h1 className="text-3xl font-bold">Welcome to Coupon System 🎟️</h1>
      <ClaimCoupon />
      <div className="mt-5">
        <Link to="/admin" className="text-blue-500 underline">
          Admin Dashboard
        </Link>
      </div>
    </div>
  );
};

export default Home;
