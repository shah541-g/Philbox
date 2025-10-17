import express from "express";
import { authenticate, isSuperAdmin } from "../../../middleware/auth.middleware.js";
import { createBranch, listBranches } from "../controller/branch.controller.js";
import { ROUTES } from "../../../../../constants/global.routes.constants.js";
import { validate } from "../../../../../validator/joiValidate.middleware.js"; // adjust path as needed
import { createBranchDTO } from "../../../../../dto/branch.dto.js";

const router = express.Router();

// 🟩 CREATE Branch
router.post(
  `${ROUTES.SUPER_ADMIN}/branches`,
  authenticate,
  isSuperAdmin,
  validate(createBranchDTO),
  createBranch
);

// 🟦 READ ALL Branches
router.get(`${ROUTES.SUPER_ADMIN}/branches`, authenticate, isSuperAdmin, listBranches);

export default router;
