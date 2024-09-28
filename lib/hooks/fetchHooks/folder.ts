"use client";

import { getPublicFimidaraEndpointsUsingUserToken } from "@/lib/api/fimidaraEndpoints.ts";
import { Folder, GetFolderEndpointParams } from "fimidara";
import { useWorkspaceFolderFetchStore } from "../fetchStores/folder.ts";
import { useWorkspaceFoldersStore } from "../resourceListStores.ts";
import { makeSingleFetchHook } from "./makeSingleFetchHook.ts";
import { FetchSingleResourceFetchFnData } from "./types.ts";

async function workspaceFolderInputFetchFn(
  params: GetFolderEndpointParams
): Promise<FetchSingleResourceFetchFnData<Folder>> {
  const endpoints = getPublicFimidaraEndpointsUsingUserToken();
  const data = await endpoints.folders.getFolder(params);
  return { resource: data.folder };
}

export const { useFetchHook: useWorkspaceFolderFetchHook } =
  makeSingleFetchHook(
    useWorkspaceFoldersStore,
    useWorkspaceFolderFetchStore,
    workspaceFolderInputFetchFn
  );
