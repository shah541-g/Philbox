import express from "express"
import { body } from "express-validator"
import runValidation from "../../middlewares/validate.middleware.js"
import { login, verifyOTP } from "../controller/auth.controller.js"
import { authRoutesLimiter } from "../../../utils/authRoutesLimiter.js"
import { ROUTES } from "../../../constants/global.routes.constants.js"

const router = express.Router()
router.use(authRoutesLimiter)
router.post(`${ROUTES.ADMIN_AUTH}/login`,
  [body("email").isEmail().withMessage("Valid Email Required"),
  body("password").notEmpty().withMessage("Password Required")
  ],
  runValidation,
  login
);

router.post(`${ROUTES.ADMIN_AUTH}/verify-otp`, runValidation, verifyOTP)

export default router