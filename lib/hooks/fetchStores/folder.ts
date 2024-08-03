"use client";

import { useWorkspaceFoldersStore } from "../resourceListStores.ts";
import { makeSingleFetchStore } from "./makeSingleFetchStore.ts";

export const { useFetchStore: useWorkspaceFolderFetchStore } =
  makeSingleFetchStore("folderFetch", useWorkspaceFoldersStore);
