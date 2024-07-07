import { merge } from "lodash-es";
import React from "react";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { appRootPaths } from "../definitions/system";
import UserSessionStorageFns from "../storage/userSession";
import { useFetchSingleResourceFetchState } from "./fetchHookUtils";
import { clearFetchResourceListStores } from "./fetchHooks";
import { clearResourceListStores } from "./resourceListStores";
import { useUserSessionFetchHook } from "./singleResourceFetchHooks";
import {
  clearFetchSingleResourceStores,
  useUserSessionFetchStore,
} from "./singleResourceFetchStores";

export interface SessionHookState {
  routeToOnLogout?: string;
  set(state: { routeToOnLogout?: string }): void;
}

export const useSessionHook = create<
  SessionHookState,
  [["zustand/devtools", {}]]
>(
  devtools(
    (set, get) => {
      return {
        routeToOnLogout: undefined,
        set(newState) {
          set((state) => {
            return merge({}, state, newState);
          });
        },
      };
    },
    { name: "sessionHook" }
  )
);

export function useUserLoggedIn() {
  const { fetchState } = useUserSessionFetchHook(undefined);
  const { isLoading, other } = useFetchSingleResourceFetchState(fetchState);
  let isLoggedIn: boolean | undefined = undefined;

  if (!isLoading) {
    if (other?.userToken) {
      isLoggedIn = true;
    } else {
      isLoggedIn = false;
    }
  }

  return { isLoggedIn };
}

export function useLogout() {
  const logout = React.useCallback((p = appRootPaths.home) => {
    useSessionHook.getState().set({
      routeToOnLogout: p,
    });
    UserSessionStorageFns.clearSessionData();

    // There should only ever be one entry in `useUserSessionFetchStore`
    // which'll be the current logged-in user.
    useUserSessionFetchStore.getState().mapFetchState((key, state) => {
      // Set use fetch state's values to `undefined` instead of clearing it
      // (setting the state itself to `undefined`), as clearing it forces the
      // fetch hook to reload the data which is not the behaviour we want.
      return { loading: false, error: undefined, data: undefined };
    });

    // Clear fetch stores before resource list stores because fetch stores
    // subscribe to changes in resource list stores to remove IDs of deleted
    // resources. The subscription functions will still run but the ID lists
    // will be empty  avoiding unecessary compute.
    clearFetchSingleResourceStores({ exclude: [useUserSessionFetchStore] });
    clearFetchResourceListStores();
    clearResourceListStores();
  }, []);

  return { logout };
}
