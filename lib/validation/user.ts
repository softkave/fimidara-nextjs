import * as yup from "yup";
import { userConstants } from "../definitions/user";
import { messages } from "../messages/messages";
import { regExPatterns } from "../utilities/validationUtils";

export const signupValidationParts = {
  name: yup.string().trim().max(userConstants.maxNameLength, messages.tooLong),
  email: yup.string().trim().email(messages.invalidEmailAddress),
  phone: yup
    .string()
    .trim()
    .matches(regExPatterns.phone, messages.enterValidPhoneNum),
  confirmEmail: yup
    .string()
    .trim()
    .email()
    .oneOf([yup.ref("email")], messages.emailMismatch),
  password: yup
    .string()
    .trim()
    .min(userConstants.minPasswordLength, messages.tooShort)
    .max(userConstants.maxPasswordLength, messages.tooLong),
  confirmPassword: yup
    .string()
    .trim()
    .oneOf([yup.ref("password")], messages.passwordMismatch),
};
