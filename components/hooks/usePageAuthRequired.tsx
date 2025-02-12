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
import { ReactElement, useEffect } from "react";
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

  useEffect(() => {
    if (isLogoutRequested) {
      console.log("isLogoutRequested", isLogoutRequested);
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
    // Only transition to login if logged in state is newly decided to be false,
    // so this should only run once
    if (
      isNil(trackedLoggedIn.previousState) &&
      trackedLoggedIn.state === false
    ) {
      const loginPath = kAppAccountPaths.loginWithReturnPath(
        returnTo || pathname
      );

      console.log("pushing to login path", {
        loginPath,
        state: trackedLoggedIn.state,
        previousState: trackedLoggedIn.previousState,
        returnTo,
        pathname,
      });
      router.push(loginPath);
    }
  }, [
    trackedLoggedIn.state,
    trackedLoggedIn.previousState,
    returnTo,
    pathname,
  ]);

  if (isLoggedIn === undefined) {
    return null;
  } else if (isLoggedIn) {
    return render();
  } else {
    return renderRedirecting();
  }
};
