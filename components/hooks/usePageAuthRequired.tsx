"use client";

import { kAppAccountPaths } from "@/lib/definitions/paths/account.ts";
import { useLogout } from "@/lib/hooks/session/useLogout.ts";
import { useSessionHook } from "@/lib/hooks/session/useSessionHook.ts";
import { useUserLoggedIn } from "@/lib/hooks/session/useUserLoggedIn.ts";
import { isUndefined } from "lodash-es";
import { usePathname, useRouter } from "next/navigation";
import { ReactElement, useEffect } from "react";

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

  if (isLoggedIn === undefined) {
    return null;
  } else if (isLoggedIn) {
    return render();
  } else {
    return renderRedirecting();
  }
};
