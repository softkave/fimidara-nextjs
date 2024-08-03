"use client";

import { useWorkspaceFilesStore } from "../resourceListStores.ts";
import { makeSingleFetchStore } from "./makeSingleFetchStore.ts";

export const { useFetchStore: useWorkspaceFileFetchStore } =
  makeSingleFetchStore("fileFetch", useWorkspaceFilesStore);
