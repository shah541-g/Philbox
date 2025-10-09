import Admin from "../../../models/Admin.js";
import Branch from "../../../models/Branch.js";
import bcrypt from "bcryptjs";
import sendResponse from "../../../utils/sendResponse.js";
import { seedAddress } from "../../utils/seedAddress.js";

// 🟩 CREATE Branch Admin
export const createBranchAdmin = async (req, res) => {
  try {
    const { name, email, password, phone_number, branches_managed = [], addresses = [] } = req.body;

    // Check if email already exists
    const existing = await Admin.findOne({ email: email.toLowerCase() });
    if (existing) return sendResponse(res, 400, "Email already exists");

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    // Create new admin
    const newAdmin = new Admin({
      name,
      email: email.toLowerCase(),
      password: hashed,
      phone_number: phone_number || "",
      category: "branch-admin",
      branches_managed: branches_managed || [],
    });

    // Add admin under branches' administration
    for (let branchID of branches_managed) {
      const branch = await Branch.findById(branchID);
      if (branch) {
        branch.under_administration_of.push(newAdmin._id);
        await branch.save();
      }
    }

    // Seed addresses
    const addressIds = [];
    for (let address of addresses) {
      address.id = newAdmin._id;
      const addressId = await seedAddress(address);
      addressIds.push(addressId);
    }
    newAdmin.addresses = addressIds;

    // Save admin
    await newAdmin.save();

    const { password: _, ...safeData } = newAdmin.toObject();
    return sendResponse(res, 201, "Branch Admin created successfully", safeData);
  } catch (err) {
    console.error(err);
    return sendResponse(res, 500, "Server Error", null, err);
  }
};

// 🟥 DELETE Branch Admin
export const removeBranchAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await Admin.findById(id);

    if (!admin) return sendResponse(res, 404, "Admin not found");

    // Remove admin reference from branches
    for (let branchID of admin.branches_managed) {
      const branch = await Branch.findById(branchID);
      if (branch) {
        branch.under_administration_of = branch.under_administration_of.filter(
          (adminId) => adminId.toString() !== id
        );
        await branch.save();
      }
    }

    await Admin.deleteOne({ _id: id });
    return sendResponse(res, 200, "Branch Admin removed successfully");
  } catch (err) {
    console.error(err);
    return sendResponse(res, 500, "Server Error", null, err);
  }
};

// 🟦 READ All Branch Admins
export const listAdmins = async (req, res) => {
  try {
    const branchAdmins = await Admin.find({ category: "branch-admin" }).select("-password");
    return sendResponse(res, 200, "All Branch Admins retrieved", branchAdmins);
  } catch (err) {
    console.error(err);
    return sendResponse(res, 500, "Server Error", null, err);
  }
};

// 🟨 READ Single Branch Admin
export const getBranchAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await Admin.findById(id).select("-password");

    if (!admin) return sendResponse(res, 404, "Branch Admin not found");

    return sendResponse(res, 200, "Branch Admin retrieved successfully", admin);
  } catch (err) {
    console.error(err);
    return sendResponse(res, 500, "Server Error", null, err);
  }
};

// 🟧 UPDATE Branch Admin
export const updateBranchAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone_number, password, branches_managed, addresses } = req.body;

    const admin = await Admin.findById(id);
    if (!admin) return sendResponse(res, 404, "Branch Admin not found");

    // Update fields
    if (name) admin.name = name;
    if (email) admin.email = email.toLowerCase();
    if (phone_number) admin.phone_number = phone_number;

    // Hash password if provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      admin.password = await bcrypt.hash(password, salt);
    }

    // Update branches (optional)
    if (branches_managed) admin.branches_managed = branches_managed;

    // Update addresses if needed
    if (addresses && addresses.length > 0) {
      const addressIds = [];
      for (let address of addresses) {
        address.id = admin._id;
        const addressId = await seedAddress(address);
        addressIds.push(addressId);
      }
      admin.addresses = addressIds;
    }

    await admin.save();

    const { password: _, ...safeData } = admin.toObject();
    return sendResponse(res, 200, "Branch Admin updated successfully", safeData);
  } catch (err) {
    console.error(err);
    return sendResponse(res, 500, "Server Error", null, err);
  }
};
