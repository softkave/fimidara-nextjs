import { kDefaultReturnToQueryKey } from "@/lib/definitions/paths/root.ts";

export const kAppAccountPaths = {
  signup: "/signup",
  login: "/login",
  loginWithReturnPath(returnTo: string) {
    return `${this.login}?${kDefaultReturnToQueryKey}=${encodeURIComponent(
      returnTo
    )}`;
  },
  verifyEmail: "/verify-email",
  forgotPassword: "/forgot-password",
  changePassword: "/change-password",
};
