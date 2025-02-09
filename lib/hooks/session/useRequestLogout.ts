import { useCallback } from "react";
import { useSessionStore } from "./useSessionStore.ts";

export function useRequestLogout() {
  const requestLogout = useCallback((pathname?: string) => {
    useSessionStore
      .getState()
      .set({ isLogoutRequested: true, routeToOnLogout: pathname });
  }, []);

  return { requestLogout };
}
