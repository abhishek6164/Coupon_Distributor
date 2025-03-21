import Coupon from "../models/Coupon.js";
import ClaimHistory from "../models/ClaimHistory.js";

export const claimCoupon = async (req, res) => {
  const userIP = req.ip;
  const userSession = req.cookies.sessionId || req.headers["user-agent"];

  const availableCoupon = await Coupon.findOne({ isClaimed: false });

  if (!availableCoupon) return res.status(404).json({ message: "No coupons available" });

  availableCoupon.isClaimed = true;
  availableCoupon.claimedBy = userIP;
  await availableCoupon.save();

  await new ClaimHistory({ ip: userIP, sessionId: userSession, coupon: availableCoupon._id }).save();

  res.json({ message: "Coupon claimed!", coupon: availableCoupon.code });
};
