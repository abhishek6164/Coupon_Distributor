import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaPlus, FaTrash } from "react-icons/fa";
// import { AppContextProvider } from "../context/AppContext"; // Import the provider

const AdminDashboard = () => {
  const [coupons, setCoupons] = useState([]);
  const [newCoupon, setNewCoupon] = useState("");
  const backendUrl = import.meta.env.VITE_BACKEND_URL.replace(/\/$/, ""); // Remove trailing slash if any

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/coupons`);
        setCoupons(res.data);
      } catch (error) {
        console.error("Error fetching coupons:", error);
      }
    };

    fetchCoupons();
  }, [backendUrl]); // Add backendUrl to dependencies

  const addCoupon = async () => {
    if (!newCoupon.trim()) return;

    try {
      await axios.post(`${backendUrl}/api/add`, { code: newCoupon });
      setCoupons([...coupons, { code: newCoupon, claimed: false }]);
      setNewCoupon("");
    } catch (error) {
      console.error("Error adding coupon:", error);
    }
  };

  const deleteCoupon = async (code) => {
    try {
      await axios.post(`${backendUrl}/api/delete`, { code });
      setCoupons(coupons.filter((c) => c.code !== code));
    } catch (error) {
      console.error("Error deleting coupon:", error);
    }
  };

  return (
    <div className="p-5 text-center">
      <h1 className="text-3xl font-bold">Admin Dashboard 📊</h1>
      <div className="mt-5">
        <input
          type="text"
          placeholder="Enter New Coupon"
          className="border px-3 py-2"
          value={newCoupon}
          onChange={(e) => setNewCoupon(e.target.value)}
        />
        <button
          className="ml-2 bg-green-500 text-white px-3 py-2 rounded"
          onClick={addCoupon}
        >
          <FaPlus />
        </button>
      </div>

      <h2 className="mt-5 text-xl font-bold">Coupons</h2>
      {coupons.map((coupon) => (
        <div
          key={coupon.code}
          className="mt-2 flex justify-center items-center"
        >
          <span
            className={`px-3 py-1 ${
              coupon.claimed ? "text-red-500" : "text-green-500"
            }`}
          >
            {coupon.code} {coupon.claimed ? "(Claimed)" : "(Available)"}
          </span>
          <button
            className="ml-3 text-red-500"
            onClick={() => deleteCoupon(coupon.code)}
          >
            <FaTrash />
          </button>
        </div>
      ))}
    </div>
  );
};

export default AdminDashboard;
