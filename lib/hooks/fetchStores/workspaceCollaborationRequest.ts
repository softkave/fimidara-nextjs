"use client";

import { useWorkspaceCollaborationRequestsStore } from "../resourceListStores.ts";
import { makeSingleFetchStore } from "./makeSingleFetchStore.ts";

export const { useFetchStore: useWorkspaceCollaborationRequestFetchStore } =
  makeSingleFetchStore(
    "workspaceRequestFetch",
    useWorkspaceCollaborationRequestsStore
  );
