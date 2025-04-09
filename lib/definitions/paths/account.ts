import {
  kDefaultRedirectingQueryKey,
  kDefaultReturnToQueryKey,
} from "@/lib/definitions/paths/root.ts";

export const kAppAccountPaths = {
  signup: "/signup",
  login: "/login",
  loginWithReturnPath(returnTo: string) {
    const url = new URL(this.login, window.location.origin);
    url.searchParams.set(
      kDefaultReturnToQueryKey,
      encodeURIComponent(returnTo)
    );
    return url.toString();
  },
  verifyEmail: "/verify-email",
  forgotPassword: "/forgot-password",
  changePassword: "/change-password",
  appendRedirectingQueryKey(path: string) {
    const url = new URL(path, window.location.origin);
    url.searchParams.set(kDefaultRedirectingQueryKey, "true");
    return url.toString();
  },
  isRedirecting(path: string) {
    const url = new URL(path, window.location.origin);
    return url.searchParams.get(kDefaultRedirectingQueryKey) === "true";
  },
};
