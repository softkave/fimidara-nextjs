export const kAppAccountPaths = {
  signup: "/signup",
  login: "/login",
  loginWithReturnPath(returnTo: string) {
    return `${this.login}?returnTo=${encodeURIComponent(returnTo)}`;
  },

  verifyEmail: "/verify-email",
  forgotPassword: "/forgot-password",
  changePassword: "/change-password",
};
