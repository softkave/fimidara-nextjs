"use client";

import { User } from "fimidara";
import { useUsersStore } from "../resourceListStores.ts";
import { makeSingleFetchStore } from "./makeSingleFetchStore.ts";

export type UserSessionFetchStoreOther = {
  userToken: string;
  clientToken: string;
};

export const { useFetchStore: useUserSessionFetchStore } = makeSingleFetchStore<
  User,
  UserSessionFetchStoreOther
>(
  "sessionFetch",
  useUsersStore,
  // There should be only one user session at a time, so return `true` for all
  // comparisons enforcing the single session. `set` calls to update a session
  // entry will always update the one session.
  () => true
);
