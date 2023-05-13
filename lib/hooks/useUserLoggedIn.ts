import React from "react";
import { appRootPaths } from "../definitions/system";
import UserSessionStorageFns from "../storage/userSession";
import { clearFetchResourceListStores } from "./fetchHooks";
import { clearResourceListStores } from "./resourceListStores";
import {
  clearFetchSingleResourceStores,
  useUserSessionFetchStore,
} from "./singleResourceFetchStores";

export type UserLoggedInResult = {
  /**
   * `undefined` means a decision is not yet made so maybe return `null` if
   * relying on value for rendering, `true` means user is logged in, and `false`
   * means user is not logged in.
   */
  isLoggedIn: boolean | undefined;
  routeToOnLogout?: string;
  logout(p?: string): void;
};

// Put outside the hook because several components should access it as a
// singleton. Used by `withPageAuthRequiredHOC` which handles routing away from
// app routes when user is not logged in. By default, `withPageAuthRequiredHOC`
// routes to /login, but for special cases like when the server recommends the
// client routes to the /forgot-password page when the user requires a password
// change, this workaround is most helpful.
let routeToOnLogout: string | undefined = undefined;
const setLogoutRoute = (p: string) => {
  routeToOnLogout = p;
};

export function useUserLoggedIn(): UserLoggedInResult {
  const session = useUserSessionFetchStore((store) => store.getFetchState({}));
  const userToken = session?.data.other?.userToken;
  const [isLoggedIn, setLoggedIn] = React.useState<boolean | undefined>(
    undefined
  );

  // Run retrieving token from storage in `useEffect` to force Next.js to run
  // this hook on the client-side. Otherwise, it'll run it server-side for ssr
  // where there's no local storage causing error.
  React.useEffect(() => {
    const savedToken = UserSessionStorageFns.getUserToken();

    if (userToken) {
      setLoggedIn(!!userToken);
    } else if (savedToken) {
      setLoggedIn(!!savedToken);
    } else {
      setLoggedIn(false);
    }
  }, [userToken]);

  const logout = (p = appRootPaths.home) => {
    setLogoutRoute(p);
    UserSessionStorageFns.clearSessionData();
    useUserSessionFetchStore.getState().clear();

    // router.push(p);
    // setLoggedIn(false);

    // Clear fetch stores before resource list stores because fetch stores
    // subscribe to changes in resource list stores to remove IDs of deleted
    // resources. The subscription functions will still run but the ID lists
    // will be empty  avoiding unecessary compute.
    clearFetchSingleResourceStores();
    clearFetchResourceListStores();
    clearResourceListStores();
  };

  return { routeToOnLogout, isLoggedIn, logout };
}
