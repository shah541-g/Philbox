import express from "express"
import {body} from "express-validator"
import runValidation from "../../middlewares/validate.middleware.js"
import {authenticate, isSuperAdmin} from "../../auth/middleware/auth.middleware.js"
import {createSalesperson, listSalespersons} from "../controller/salesperson.controller.js"
import { ROUTES } from "../../../constants/global.routes.constants.js"


const router = express.Router()

router.post(`${ROUTES.SUPER_ADMIN}/salespersons`, 
  authenticate, isSuperAdmin, [body("fullName").notEmpty().withMessage("Name Requried"), body("gender").notEmpty().withMessage("Gender Requried"), body("contactNumber").notEmpty().withMessage("contact Number Requried"), body("email").isEmail().withMessage("Valid Email Required"), body("city").notEmpty().withMessage("City Required"), body("country").notEmpty().withMessage("Country Required"), body("province").notEmpty().withMessage("Province Required")],
  runValidation,
  createSalesperson
);

router.get(`${ROUTES.SUPER_ADMIN}/salespersons`, authenticate, isSuperAdmin, listSalespersons)

export default router