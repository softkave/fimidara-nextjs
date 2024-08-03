"use client";

import { useWorkspacePermissionGroupsStore } from "../resourceListStores.ts";
import { makeSingleFetchStore } from "./makeSingleFetchStore.ts";

export const { useFetchStore: useWorkspacePermissionGroupFetchStore } =
  makeSingleFetchStore(
    "permissionGroupFetch",
    useWorkspacePermissionGroupsStore
  );
