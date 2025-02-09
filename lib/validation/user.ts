import { z } from "zod";
import { kUserConstants } from "../definitions/user";

export const signupValidationParts = {
  firstName: z
    .string({ required_error: "first name is required" })
    .trim()
    .max(kUserConstants.maxNameLength, {
      message: `${kUserConstants.maxNameLength} max chars`,
    }),
  lastName: z
    .string({ required_error: "last name is required" })
    .trim()
    .max(kUserConstants.maxNameLength, {
      message: `${kUserConstants.maxNameLength} max chars`,
    }),
  email: z.string().trim().email(),
  password: z
    .string()
    .trim()
    .min(kUserConstants.minPasswordLength)
    .max(kUserConstants.maxPasswordLength),
};
