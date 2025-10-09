import Admin from "../../../models/Admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sendResponse from "../../../utils/sendResponse.js";
import dotenv from "dotenv"
import { generateOTPAndExpiryDate } from "../../../utils/generateOTP.js";
import { sendOTP } from "../../../utils/sendEmail.js";
import { generateToken } from "../../../utils/generateToken.js";

dotenv.config()


export const login = async (req, res) => {
  try {
    const {email, password} = req.body;
    const admin = await Admin.findOne({email: email.toLowerCase()});
    if(!admin) return sendResponse(res,404,"Invalid email")

    const isMatch = await bcrypt.compare(password, admin.password)
    if(!isMatch) return sendResponse(res, 401, "Invalid Credentials")


    if (!admin.isTwoFactorEnabled){
      const otpDetails = generateOTPAndExpiryDate()
      let otp = otpDetails.otp
      let expiryDate = otpDetails.expiresIn
      admin.otpCode = otp;
      admin.otpExpiresAt = expiryDate;
      await admin.save();

      await sendOTP(admin.email, otp)

      return sendResponse(res, 200, "OTP sent to email")
    }
    
      const payload = {
      id: admin._id,
      category: admin.category,
      email: admin.email,
    }
    const token = generateToken(payload)
    admin.password = undefined
    
    return sendResponse(res, 200, "login Successfully", {token, admin})

  } catch (err) {
    console.error(err)
   return sendResponse(res, 500, "Server Error", null, err.message)
  
  }
}


export const verifyOTP = async (req,res) => {
  const {email, otp} = req.body;

  const admin = await Admin.findOne({email}).select("-password");

  if (!admin || !admin.otpCode) return sendResponse(res,400,"Invalid Request")
  
  if (admin.otpCode !==otp || admin.otpExpiresAt < Date.now()){
    return sendResponse(res,400,"Invalid or expired OTP")
  }

  admin.otpCode = null;
  admin.otpExpiresAt = null;
  admin.isTwoFactorEnabled = true
  await admin.save();

  const payload = {
      id: admin._id,
      category: admin.category,
      email: admin.email,
    }
  const token = generateToken(payload)

  return sendResponse(res,200,"2FA Verified",{
    token, 
    admin
  })

}