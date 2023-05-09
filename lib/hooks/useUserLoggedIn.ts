import { isNull, isUndefined } from "lodash";
import { useRouter } from "next/router";
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
  logout(): void;
};

export function useUserLoggedIn(): UserLoggedInResult {
  const { logout } = useUserLogout();
  const session = useUserSessionFetchStore((store) => store.getFetchState({}));
  const [tokenFromLocalStorage, setTokenFromLocalStorage] = React.useState<
    string | null | undefined
  >(null);

  const token = session?.data.other?.userToken || tokenFromLocalStorage;
  const isLoggedIn = React.useMemo(
    () => (isUndefined(token) || isNull(token) ? false : true),
    [token]
  );

  // Run retrieving token from storage in `useEffect` to force Next.js to run
  // this hook on the client-side. Otherwise, it'll run it server-side for ssr
  // where there's no local storage causing error.
  React.useEffect(() => {
    const tokenFromLocalStorage = UserSessionStorageFns.getUserToken();
    setTokenFromLocalStorage(tokenFromLocalStorage);
  }, [isLoggedIn]);

  return { isLoggedIn, logout };
}

export function useUserLogout() {
  const router = useRouter();

  const logout = () => {
    router.push(appRootPaths.home);

    // Clear fetch stores before resource list stores because fetch stores
    // subscribe to changes in resource list stores to remove IDs of deleted
    // resources. The subscription functions will still run but the ID lists
    // will be empty  avoiding unecessary compute.
    clearFetchSingleResourceStores();
    clearFetchResourceListStores();
    clearResourceListStores();
  };

  return { logout };
}
