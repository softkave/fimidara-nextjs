import {
  appAccountPaths,
  appInternalPaths,
  appRootPaths,
} from "../definitions/system";

// Render WebHeader for these routes starting with these paths
const webRoutes = [
  appAccountPaths.signup,
  appAccountPaths.login,
  appAccountPaths.changePassword,
  appAccountPaths.forgotPassword,
  appAccountPaths.verifyEmail,
];
const noHeaderRoutes = [appInternalPaths.waitlist];
const routeToAppOnInitRoutes = [
  // appRootPaths.home,
  appAccountPaths.signup,
  appAccountPaths.login,
];

export function isWebPath(pathname: string) {
  return (
    pathname === appRootPaths.home ||
    webRoutes.some((r) => {
      return pathname.startsWith(r);
    })
  );
}
export function isNoHeaderPath(pathname: string) {
  return noHeaderRoutes.some((r) => {
    return pathname.startsWith(r);
  });
}
export function isRouteToAppOnInitPath(pathname: string) {
  return (
    pathname === appRootPaths.home ||
    routeToAppOnInitRoutes.some((r) => {
      return pathname.startsWith(r);
    })
  );
}
