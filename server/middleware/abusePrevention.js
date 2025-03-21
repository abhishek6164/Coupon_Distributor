import ClaimHistory from "../models/ClaimHistory.js";
import dotenv from "dotenv";
dotenv.config();

const cooldownTime = process.env.COOLDOWN_TIME || 600000;

const abusePrevention = async (req, res, next) => {
  const userIP = req.ip;
  const userSession = req.cookies.sessionId || req.headers["user-agent"];

  const lastClaim = await ClaimHistory.findOne({ ip: userIP }).sort("-claimedAt");

  if (lastClaim && Date.now() - lastClaim.claimedAt < cooldownTime) {
    return res.status(429).json({ message: "Please wait before claiming another coupon!" });
  }

  next();
};

export default abusePrevention;
