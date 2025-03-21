import mongoose from "mongoose";

const claimHistorySchema = new mongoose.Schema({
  ip: { type: String, required: true },
  sessionId: { type: String, required: true },
  coupon: { type: mongoose.Schema.Types.ObjectId, ref: "Coupon" },
  claimedAt: { type: Date, default: Date.now },
});

const ClaimHistory = mongoose.model("ClaimHistory", claimHistorySchema);
export default ClaimHistory;
