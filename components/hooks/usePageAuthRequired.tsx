"use client";

import { toast } from "@/hooks/use-toast.ts";
import { callRmCookieEndpoint } from "@/lib/api/account/rm-cookie.ts";
import { kAppAccountPaths } from "@/lib/definitions/paths/account.ts";
import { useLogout } from "@/lib/hooks/session/useLogout.ts";
import { useSessionStore } from "@/lib/hooks/session/useSessionStore";
import { useUserLoggedIn } from "@/lib/hooks/session/useUserLoggedIn.ts";
import { isNil } from "lodash-es";
import { signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { ReactElement, useEffect, useRef } from "react";
import { useStateHistory } from "./useStateHistory.tsx";

const defaultOnRedirecting = (): ReactElement => <></>;

export interface WithPageAuthRequiredOptions {
  returnTo?: string;
  renderRedirecting?: () => ReactElement;
  render: () => ReactElement;
}

export const usePageAuthRequired = (options: WithPageAuthRequiredOptions) => {
  const {
    returnTo,
    render,
    renderRedirecting = defaultOnRedirecting,
  } = options;

  const router = useRouter();
  const pathname = usePathname();
  const { isLogoutRequested, routeToOnLogout, set } = useSessionStore();
  const { isLoggedIn } = useUserLoggedIn();
  const { logout } = useLogout();
  const trackedLoggedIn = useStateHistory({
    state: isLoggedIn,
    maxHistorySize: 2,
  });
  const isRedirectingToLogin = useRef(false);

  console.log("isLoggedIn", isLoggedIn);

  useEffect(() => {
    if (isLogoutRequested) {
      const toastControl = toast({
        description: "Logging out...",
      });

      callRmCookieEndpoint()
        .catch(console.error.bind(console))
        .finally(() => toastControl.dismiss())
        .then(() => {
          logout();
          set({ isLogoutRequested: false, routeToOnLogout: undefined });
          signOut({ redirectTo: routeToOnLogout || kAppAccountPaths.login });
        });
    }
  }, [isLogoutRequested, logout, set, routeToOnLogout]);

  useEffect(() => {
    console.log("trackedLoggedIn", trackedLoggedIn);
    console.log("isRedirectingToLogin", isRedirectingToLogin.current);

    // Only transition to login if logged in state is newly decided to be false,
    // so this should only run once
    if (
      isNil(trackedLoggedIn.previousState) &&
      trackedLoggedIn.state === false &&
      !isRedirectingToLogin.current
    ) {
      isRedirectingToLogin.current = true;
      const returnToPath = returnTo || pathname;
      const loginPath = kAppAccountPaths.loginWithReturnPath(returnToPath);
      console.log("redirecting to login", {
        returnToPath,
        loginPath,
        pathname,
      });

      if (!pathname.includes(returnToPath)) {
        router.push(loginPath);
      }
    }
  }, [
    trackedLoggedIn.state,
    trackedLoggedIn.previousState,
    returnTo,
    pathname,
    router,
  ]);

  if (isLoggedIn === undefined) {
    return null;
  } else if (isLoggedIn) {
    return render();
  } else {
    return renderRedirecting();
  }
};
