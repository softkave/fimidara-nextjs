import { AdapterUser } from "next-auth/adapters";
import { z } from "zod";
import { LoginResult } from "../api-internal/endpoints/privateTypes.ts";

export const kUserConstants = {
  minNameLength: 1,
  maxNameLength: 50,
  minPasswordLength: 7,
  maxPasswordLength: 40,
  maxConfirmationCodeLength: 5,
  resendCodeTimeout: 1 * 60 * 1000, // 1 minute
  changePasswordTokenQueryParam: "t",
  httpOnlyJWTCookieName: "fimidara-jwt",
};

export interface IOAuthUser extends AdapterUser, LoginResult {}

export const setCookieRouteZodSchema = z.object({
  jwtToken: z.string(),
  userId: z.string(),
});

export type SetCookieRouteParams = z.infer<typeof setCookieRouteZodSchema>;
