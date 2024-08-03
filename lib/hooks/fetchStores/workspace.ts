"use client";

import { useWorkspacesStore } from "../resourceListStores.ts";
import { makeSingleFetchStore } from "./makeSingleFetchStore.ts";

export const { useFetchStore: useUserWorkspaceFetchStore } =
  makeSingleFetchStore("workspaceFetch", useWorkspacesStore);
