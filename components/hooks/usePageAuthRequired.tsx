"use client";

import { kAppAccountPaths } from "@/lib/definitions/system.ts";
import { useLogout } from "@/lib/hooks/session/useLogout.ts";
import { useSessionHook } from "@/lib/hooks/session/useSessionHook.ts";
import { useUserLoggedIn } from "@/lib/hooks/session/useUserLoggedIn.ts";
import { isUndefined } from "lodash-es";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";

const defaultOnRedirecting = (): React.ReactElement => <></>;

export interface WithPageAuthRequiredOptions {
  returnTo?: string;
  renderRedirecting?: () => React.ReactElement;
  render: () => React.ReactElement;
}

export const usePageAuthRequired = (options: WithPageAuthRequiredOptions) => {
  const {
    returnTo,
    render,
    renderRedirecting = defaultOnRedirecting,
  } = options;
  const router = useRouter();
  const pathname = usePathname();
  const { isLogoutRequested, routeToOnLogout, set } = useSessionHook();
  const { isLoggedIn } = useUserLoggedIn();
  const { logout } = useLogout();

  useEffect(() => {
    if (isLogoutRequested) {
      logout();
      set({ isLogoutRequested: false, routeToOnLogout: undefined });
    }
  }, [isLogoutRequested, logout, set]);

  useEffect(() => {
    if (isUndefined(isLoggedIn) || isLoggedIn) {
      return;
    }

    if (routeToOnLogout) {
      // TODO: should we include return to?
      router.push(routeToOnLogout);
    } else if (!returnTo) {
      router.push(kAppAccountPaths.login);
    } else {
      router.push(kAppAccountPaths.loginWithReturnPath(returnTo || pathname));
    }

    set({ routeToOnLogout: undefined });
  }, [isLoggedIn, router, returnTo, routeToOnLogout, pathname, set]);

  return isLoggedIn ? render() : renderRedirecting();
};
