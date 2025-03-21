require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const Coupon = require("./models/Coupon");

const app = express();
app.use(express.json());

// ✅ CORS Fix
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection failed:", err));

// ✅ Rate Limiter
const claimLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many requests, please try again later",
});

// ✅ Routes
app.get("/api/coupons", async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.json(coupons);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/add", async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ message: "Coupon code is required" });

    const existingCoupon = await Coupon.findOne({ code });
    if (existingCoupon) return res.status(409).json({ message: "Coupon already exists" });

    const newCoupon = new Coupon({ code });
    await newCoupon.save();
    res.status(201).json({ message: "Coupon added successfully", coupon: newCoupon });
  } catch (err) {
    res.status(500).json({ message: "Error adding coupon", error: err.message });
  }
});

app.delete("/api/delete", async (req, res) => {
  try {
    const { code } = req.body;
    const result = await Coupon.deleteOne({ code });
    if (result.deletedCount === 0) return res.status(404).json({ message: "Coupon not found" });
    res.json({ message: "Coupon deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting coupon" });
  }
});

app.post("/api/claim", claimLimiter, async (req, res) => {
  try {
    const userIp = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;
    const userAgent = req.headers["user-agent"];
    console.log("🔍 User Details:", { userIp, userAgent });

    const lastClaimed = await Coupon.findOne({ "claimedBy.ip": userIp, "claimedBy.userAgent": userAgent }).sort({ "claimedBy.timestamp": -1 });
    if (lastClaimed) {
      const lastClaimTime = new Date(lastClaimed.claimedBy.timestamp);
      const currentTime = new Date();
      const timeDiff = (currentTime - lastClaimTime) / (1000 * 60 * 60);
      if (timeDiff < (1 / 60)) {
        return res.status(403).json({ message: `❌ You can claim the next coupon after ${(1 - timeDiff * 60).toFixed(0)} minutes` });
      }
    }

    const coupon = await Coupon.findOne({ claimed: false });
    if (!coupon) return res.status(400).json({ message: "No coupons available" });

    coupon.claimed = true;
    coupon.claimedBy = { ip: userIp, userAgent, timestamp: new Date() };
    await coupon.save();

    res.json({ message: "🎉 Coupon claimed successfully", coupon: coupon.code, claimedBy: coupon.claimedBy });
  } catch (err) {
    console.error("❌ Error claiming coupon:", err);
    res.status(500).json({ message: "Error claiming coupon", error: err.message });
  }
});

app.get("/api/status", async (req, res) => {
  try {
    const claimedCoupon = await Coupon.findOne({ claimed: true });
    res.json({ claimed: !!claimedCoupon });
  } catch (err) {
    res.status(500).json({ message: "Error checking status" });
  }
});

app.get("/", (req, res) => res.send("✅ Coupon Distributor Backend is Running!"));

// ✅ Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
