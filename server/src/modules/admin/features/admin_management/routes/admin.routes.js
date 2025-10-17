import express from "express";
import { authenticate, isSuperAdmin } from "../../../middleware/auth.middleware.js";
import { createBranchAdmin, listAdmins, searchBranchAdmin, updateBranchAdmin, removeBranchAdmin } from "../controller/admin.controller.js";
import { ROUTES } from "../../../../../constants/global.routes.constants.js";
import { upload } from "../../../../../middlewares/multer.middleware.js";
import { validate } from "../../../../../validator/joiValidate.middleware.js";
import { createBranchAdminSchema, updateBranchAdminSchema } from "../../../../../dto/branchAdmin.dto.js";

const router = express.Router();

// 🟩 CREATE Branch Admin
router.post(
  `${ROUTES.SUPER_ADMIN}/branch-admin`,
  authenticate,
  isSuperAdmin,
  upload.single("profile_img"),
  validate(createBranchAdminSchema),
  createBranchAdmin
);

// 🟦 READ All Branch Admins
router.get(`${ROUTES.SUPER_ADMIN}/branch-admin`, authenticate, isSuperAdmin, listAdmins);

// 🟨 READ Single Branch Admin
router.get(`${ROUTES.SUPER_ADMIN}/branch-admin/search`, authenticate, isSuperAdmin, searchBranchAdmin);

// 🟧 UPDATE Branch Admin
router.put(
  `${ROUTES.SUPER_ADMIN}/branch-admin/:id`,
  authenticate,
  isSuperAdmin,
  upload.single("profile_img"),
  validate(updateBranchAdminSchema),
  updateBranchAdmin
);

// 🟥 DELETE Branch Admin
router.delete(`${ROUTES.SUPER_ADMIN}/branch-admin/:id`, authenticate, isSuperAdmin, removeBranchAdmin);

export default router;
