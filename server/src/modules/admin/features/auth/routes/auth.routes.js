import express from "express";
import { validate } from "../../../../../validator/joiValidate.middleware.js";
import {
  loginDTO,
  verifyOtpDTO,
  forgetPasswordDTO,
  resetPasswordDTO,
} from "../../../../../dto/auth.dto.js";
import {
  login,
  verifyOTP,
  forgetPassword,
  resetPassword,
} from "../controller/auth.controller.js";
import { authRoutesLimiter } from "../../../../../utils/authRoutesLimiter.js";
import { ROUTES } from "../../../../../constants/global.routes.constants.js";

const router = express.Router();
router.use(authRoutesLimiter);

// ✅ Login
router.post(`${ROUTES.ADMIN_AUTH}/login`, validate(loginDTO), login);

// ✅ Verify OTP
router.post(`${ROUTES.ADMIN_AUTH}/verify-otp`, validate(verifyOtpDTO), verifyOTP);

// ✅ Forget Password
router.post(`${ROUTES.ADMIN_AUTH}/forget-password`, validate(forgetPasswordDTO), forgetPassword);

// ✅ Reset Password
router.post(`${ROUTES.ADMIN_AUTH}/reset-password`, validate(resetPasswordDTO), resetPassword);

export default router;
