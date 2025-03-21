const mongoose = require("mongoose");

const CouponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  claimed: { type: Boolean, default: false },
  claimedBy: {
    ip: { type: String, default: null },
    userAgent: { type: String, default: null },
    timestamp: { type: Date, default: null },
  },
});

const Coupon = mongoose.model("Coupon", CouponSchema);
module.exports = Coupon;
