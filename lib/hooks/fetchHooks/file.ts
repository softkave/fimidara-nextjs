"use client";

import { getPublicFimidaraEndpointsUsingUserToken } from "@/lib/api/fimidaraEndpoints.ts";
import { File, GetFileDetailsEndpointParams } from "fimidara";
import { useWorkspaceFileFetchStore } from "../fetchStores/file.ts";
import { useWorkspaceFilesStore } from "../resourceListStores.ts";
import { makeSingleFetchHook } from "./makeSingleFetchHook.ts";
import { FetchSingleResourceFetchFnData } from "./types.ts";

async function workspaceFileInputFetchFn(
  params: GetFileDetailsEndpointParams
): Promise<FetchSingleResourceFetchFnData<File>> {
  const endpoints = await getPublicFimidaraEndpointsUsingUserToken();
  const data = await endpoints.files.getFileDetails(params);
  return { resource: data.file };
}

export const { useFetchHook: useWorkspaceFileFetchHook } = makeSingleFetchHook(
  useWorkspaceFilesStore,
  useWorkspaceFileFetchStore,
  workspaceFileInputFetchFn
);
