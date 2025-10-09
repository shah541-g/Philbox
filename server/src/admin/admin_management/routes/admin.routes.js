import express from "express";
import { body, param } from "express-validator";
import runValidation from "../../middlewares/validate.middleware.js";
import { authenticate, isSuperAdmin } from "../../auth/middleware/auth.middleware.js";
import {
  createBranchAdmin,
  listAdmins,
  getBranchAdmin,
  updateBranchAdmin,
  removeBranchAdmin,
} from "../controller/admin.controller.js";
import { ROUTES } from "../../../constants/global.routes.constants.js";

const router = express.Router();

// Base path: /api/super-admin/branch-admin

// 🟩 CREATE Branch Admin
router.post(
  `${ROUTES.SUPER_ADMIN}/branch-admin`,
  authenticate,
  isSuperAdmin,
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters long"),
    body("branches_managed").isArray().withMessage("Branches managed must be an array"),
    body("addresses").optional().isArray().withMessage("Addresses must be an array if provided"),
  ],
  runValidation,
  createBranchAdmin
);

// 🟦 READ All Branch Admins
router.get(
  `${ROUTES.SUPER_ADMIN}/branch-admin`,
  authenticate,
  isSuperAdmin,
  listAdmins
);

// 🟨 READ Single Branch Admin
router.get(
  `${ROUTES.SUPER_ADMIN}/branch-admin/:id`,
  authenticate,
  isSuperAdmin,
  [param("id").isMongoId().withMessage("Valid admin ID required")],
  runValidation,
  getBranchAdmin
);

// 🟧 UPDATE Branch Admin
router.put(
  `${ROUTES.SUPER_ADMIN}/branch-admin/:id`,
  authenticate,
  isSuperAdmin,
  [
    param("id").isMongoId().withMessage("Valid admin ID required"),
    body("email").optional().isEmail().withMessage("Valid email required"),
    body("password").optional().isLength({ min: 8 }).withMessage("Password must be at least 8 characters long"),
    body("branches_managed").optional().isArray().withMessage("Branches managed must be an array"),
    body("addresses").optional().isArray().withMessage("Addresses must be an array"),
  ],
  runValidation,
  updateBranchAdmin
);

// 🟥 DELETE Branch Admin
router.delete(
  `${ROUTES.SUPER_ADMIN}/branch-admin/:id`,
  authenticate,
  isSuperAdmin,
  [param("id").isMongoId().withMessage("Valid admin ID required")],
  runValidation,
  removeBranchAdmin
);

export default router;
