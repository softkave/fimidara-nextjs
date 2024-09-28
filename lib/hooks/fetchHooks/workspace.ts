"use client";

import { getPublicFimidaraEndpointsUsingUserToken } from "@/lib/api/fimidaraEndpoints.ts";
import { GetWorkspaceEndpointParams, Workspace } from "fimidara";
import { useUserWorkspaceFetchStore } from "../fetchStores/workspace.ts";
import { useWorkspacesStore } from "../resourceListStores.ts";
import { makeSingleFetchHook } from "./makeSingleFetchHook.ts";
import { FetchSingleResourceFetchFnData } from "./types.ts";

async function userWorkspaceInputFetchFn(
  params: GetWorkspaceEndpointParams
): Promise<FetchSingleResourceFetchFnData<Workspace>> {
  const endpoints = getPublicFimidaraEndpointsUsingUserToken();
  const data = await endpoints.workspaces.getWorkspace(params);
  return { resource: data.workspace };
}

export const { useFetchHook: useUserWorkspaceFetchHook } = makeSingleFetchHook(
  useWorkspacesStore,
  useUserWorkspaceFetchStore,
  userWorkspaceInputFetchFn
);
