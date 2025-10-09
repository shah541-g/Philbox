import express from "express"
import {body} from "express-validator"
import runValidation from "../../middlewares/validate.middleware.js"
import {authenticate, isSuperAdmin} from "../../auth/middleware/auth.middleware.js"
import {createBranch, listBranches} from "../controller/branch.controller.js"
import { ROUTES } from "../../../constants/global.routes.constants.js"


const router = express.Router()

router.post(`${ROUTES.SUPER_ADMIN}/branches`, 
  authenticate, isSuperAdmin, [body("name").notEmpty().withMessage("name requried")],
  runValidation,
  createBranch
);

router.get(`${ROUTES.SUPER_ADMIN}/branches`, authenticate, isSuperAdmin, listBranches)

export default router