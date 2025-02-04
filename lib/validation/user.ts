import { z } from "zod";
import { userConstants } from "../definitions/user";

export const signupValidationParts = {
  firstName: z
    .string({ required_error: "first name is required" })
    .trim()
    .min(1)
    .max(userConstants.maxNameLength, {
      message: `${userConstants.maxNameLength} max chars`,
    }),
  lastName: z
    .string({ required_error: "last name is required" })
    .trim()
    .min(1)
    .max(userConstants.maxNameLength, {
      message: `${userConstants.maxNameLength} max chars`,
    }),
  email: z.string().trim().email({ message: "invalid email" }),
  password: z
    .string()
    .trim()
    .min(userConstants.minPasswordLength)
    .max(userConstants.maxPasswordLength),
};
