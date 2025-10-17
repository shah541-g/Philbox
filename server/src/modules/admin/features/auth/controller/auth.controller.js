import Admin from "../../../../../models/Admin.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import sendResponse from "../../../../../utils/sendResponse.js";
import dotenv from "dotenv";
import { generateOTPAndExpiryDate } from "../../../../../utils/generateOTP.js";
import { sendOTP, sendResetEmail } from "../../../../../utils/sendEmail.js";
import { generateToken } from "../../../../../utils/generateToken.js";
import { logAdminActivity } from "../../../utils/logAdminActivities.js";

dotenv.config();

// ------------------------- EXISTING LOGIN --------------------------
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) return sendResponse(res, 404, "Invalid email");

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return sendResponse(res, 401, "Invalid Credentials");

    if (!admin.isTwoFactorEnabled) {
      const { otp, expiresIn } = generateOTPAndExpiryDate();
      admin.otpCode = otp;
      admin.otpExpiresAt = expiresIn;
      await admin.save();
      await sendOTP(admin.email, otp);
      return sendResponse(res, 200, "OTP sent to email");
    }

    const payload = { id: admin._id, category: admin.category, email: admin.email };
    const token = generateToken(payload);
    const { password: _, ...safe } = admin.toObject();

    await logAdminActivity(
      { user: admin, ip: req.ip, headers: req.headers },
      "login",
      `Admin (${admin.email}) logged in successfully`,
      "admins",
      admin._id
    );

    return sendResponse(res, 200, "Login Successful", { token, safe });
  } catch (err) {
    console.error(err);
    return sendResponse(res, 500, "Server Error", null, err.message);
  }
};

// ------------------------- VERIFY OTP --------------------------
export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  const admin = await Admin.findOne({ email }).select("-password");
  if (!admin || !admin.otpCode) return sendResponse(res, 400, "Invalid Request");

  if (admin.otpCode !== otp || admin.otpExpiresAt < Date.now()) {
    return sendResponse(res, 400, "Invalid or expired OTP");
  }

  admin.otpCode = null;
  admin.otpExpiresAt = null;
  admin.isTwoFactorEnabled = true;
  await admin.save();

  const payload = { id: admin._id, category: admin.category, email: admin.email };
  const token = generateToken(payload);

  await logAdminActivity(
    { user: admin, ip: req.ip, headers: req.headers },
    "verify_otp",
    `Admin (${admin.email}) verified OTP successfully`,
    "admins",
    admin._id
  );

  const { password: _, ...safe } = admin.toObject();
  return sendResponse(res, 200, "2FA Verified", { token, safe });
};
// ------------------------- FORGET PASSWORD --------------------------
export const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) return sendResponse(res, 404, "Admin not found");

    // Generate a secure reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Save hashed token and expiry
    admin.resetPasswordToken = resetTokenHash;
    admin.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 mins
    await admin.save();

    // Create reset link
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // Send email
    await sendResetEmail(admin.email, resetLink, admin.name);

    await logAdminActivity(
      { user: admin, ip: req.ip, headers: req.headers },
      "forget_password",
      `Password reset link sent to ${admin.email}`,
      "admins",
      admin._id
    );

    return sendResponse(res, 200, "Password reset email sent successfully");
  } catch (err) {
    console.error(err);
    return sendResponse(res, 500, "Server Error", null, err.message);
  }
};

// ------------------------- RESET PASSWORD --------------------------
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const resetTokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const admin = await Admin.findOne({
      resetPasswordToken: resetTokenHash,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!admin) return sendResponse(res, 400, "Invalid or expired token");

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedPassword;
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpires = undefined;
    await admin.save();

    await logAdminActivity(
      { user: admin, ip: req.ip, headers: req.headers },
      "reset_password",
      `Admin (${admin.email}) reset password successfully`,
      "admins",
      admin._id
    );

    return sendResponse(res, 200, "Password reset successfully");
  } catch (err) {
    console.error(err);
    return sendResponse(res, 500, "Server Error", null, err.message);
  }
};
