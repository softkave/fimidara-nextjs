import { merge } from "lodash-es";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

export interface SessionStore {
  routeToOnLogout?: string;
  isLogoutRequested?: boolean;
  set(state: { routeToOnLogout?: string; isLogoutRequested?: boolean }): void;
}

export const useSessionStore = create<SessionStore, [["zustand/devtools", {}]]>(
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
    { name: "sessionStore" }
  )
);
