import { kUserSessionStorageFns } from "@/lib/storage/UserSessionStorageFns.ts";
import React from "react";
import { clearFetchResourceListStores } from "../fetchHooks.ts";
import { clearFetchSingleResourceStores } from "../fetchStores/clearFetchSingleResourceStores.ts";
import { useUserSessionFetchStore } from "../fetchStores/session.ts";
import { clearResourceListStores } from "../resourceListStores.ts";

export function useLogout() {
  const logout = React.useCallback(() => {
    kUserSessionStorageFns.clearData();

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
