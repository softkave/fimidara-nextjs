"use client";

import { useUserSessionFetchHook } from "../fetchHooks/session.ts";
import { useFetchSingleResourceFetchState } from "../fetchHookUtils.tsx";

export function useUserLoggedIn() {
  const { fetchState } = useUserSessionFetchHook(undefined);
  const { isLoading, other } = useFetchSingleResourceFetchState(fetchState);
  let isLoggedIn: boolean | undefined = undefined;

  console.log("fetchState", fetchState);
  console.log("isLoading", isLoading);
  console.log("other", other);

  if (!isLoading) {
    if (other?.refresh.getJwtToken()) {
      isLoggedIn = true;
    } else {
      isLoggedIn = false;
    }
  }

  return { isLoggedIn };
}
