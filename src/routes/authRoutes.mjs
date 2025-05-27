import express from "express";
import { signUp,  sendEmailOTP, verifyEmailOTP,sendPhoneOTP ,verifyPhoneOTP} from "../controllers/authController.mjs";

const router = express.Router();

router.post("/signup", signUp);
router.post("/send-phone-otp", sendPhoneOTP);
router.post("/verify-phone-otp", verifyPhoneOTP);
router.post("/send-email-otp", sendEmailOTP);
router.post("/verify-email-otp", verifyEmailOTP);

export default router;
