import express from "express";
import { claimCoupon } from "../controllers/couponController.js";
import abusePrevention from "../middlewares/abusePrevention.js";
const router = express.Router();
router.put("/claim", abusePrevention, claimCoupon);
export default router;