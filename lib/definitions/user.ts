import { AdapterUser } from "next-auth/adapters";
import { LoginResult } from "../api-internal/endpoints/privateTypes.ts";

export const userConstants = {
  minNameLength: 1,
  maxNameLength: 50,
  minPasswordLength: 7,
  maxPasswordLength: 40,
  maxConfirmationCodeLength: 5,
  resendCodeTimeout: 1 * 60 * 1000, // 1 minute
  changePasswordTokenQueryParam: "t",
};

export interface IOAuthUser extends AdapterUser, LoginResult {}
