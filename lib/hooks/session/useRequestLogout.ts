import { useCallback } from "react";
import { useSessionHook } from "./useSessionHook.ts";

export function useRequestLogout() {
  const requestLogout = useCallback((pathname?: string) => {
    useSessionHook
      .getState()
      .set({ isLogoutRequested: true, routeToOnLogout: pathname });
  }, []);

  return { requestLogout };
}
