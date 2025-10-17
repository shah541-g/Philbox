import Joi from "joi";

export const createBranchDTO = Joi.object({
  name: Joi.string().trim().required().messages({
    "string.base": "Branch name must be a string",
    "any.required": "Branch name is required",
  }),

  branch_code: Joi.string().optional().trim().messages({
    "string.base": "Branch code must be a string",
  }),

  city: Joi.string().optional().trim().messages({
    "string.base": "City must be a string",
  }),

  address: Joi.string().optional().trim().messages({
    "string.base": "Address must be a string",
  }),

  phone_number: Joi.string().optional().trim().messages({
    "string.base": "Phone number must be a string",
  }),

  email: Joi.string().email().optional().messages({
    "string.email": "Invalid email format",
  }),

  under_administration_of: Joi.array()
    .items(Joi.string().hex().length(24))
    .optional()
    .messages({
      "array.base": "under_administration_of must be an array of admin IDs",
      "string.length": "Each admin ID must be a valid ObjectId",
    }),
});
