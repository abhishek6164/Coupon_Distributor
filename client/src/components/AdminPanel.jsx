import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (password === "admin123") {
      navigate("/dashboard");
    } else {
      alert("❌ Invalid Password!");
    }
  };

  return (
    <div className="p-5 text-center">
      <h1 className="text-2xl font-bold">Admin Login 🔑</h1>
      <input
        type="password"
        placeholder="Enter Password"
        className="border px-3 py-2 mt-3"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        className="ml-2 bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleLogin}
      >
        Login
      </button>
    </div>
  );
};

export default AdminLogin;
