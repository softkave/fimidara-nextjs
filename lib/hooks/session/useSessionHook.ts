import { merge } from "lodash-es";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

export interface SessionHookState {
  routeToOnLogout?: string;
  isLogoutRequested?: boolean;
  set(state: { routeToOnLogout?: string; isLogoutRequested?: boolean }): void;
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
