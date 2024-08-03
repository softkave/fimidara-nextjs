"use client";

import { useWorkspaceCollaboratorsStore } from "../resourceListStores.ts";
import { makeSingleFetchStore } from "./makeSingleFetchStore.ts";

export const { useFetchStore: useWorkspaceCollaboratorFetchStore } =
  makeSingleFetchStore("collaboratorFetch", useWorkspaceCollaboratorsStore);
