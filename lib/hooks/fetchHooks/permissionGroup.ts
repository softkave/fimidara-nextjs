"use client";

import { getPublicFimidaraEndpointsUsingUserToken } from "@/lib/api/fimidaraEndpoints.ts";
import { GetPermissionGroupEndpointParams, PermissionGroup } from "fimidara";
import { useWorkspacePermissionGroupFetchStore } from "../fetchStores/permissionGroup.ts";
import { useWorkspacePermissionGroupsStore } from "../resourceListStores.ts";
import { makeSingleFetchHook } from "./makeSingleFetchHook.ts";
import { FetchSingleResourceFetchFnData } from "./types.ts";

async function workspacePermissionGroupInputFetchFn(
  params: GetPermissionGroupEndpointParams
): Promise<FetchSingleResourceFetchFnData<PermissionGroup>> {
  const endpoints = getPublicFimidaraEndpointsUsingUserToken();
  const data = await endpoints.permissionGroups.getPermissionGroup({
    body: params,
  });
  return { resource: data.body.permissionGroup };
}

export const { useFetchHook: useWorkspacePermissionGroupFetchHook } =
  makeSingleFetchHook(
    useWorkspacePermissionGroupsStore,
    useWorkspacePermissionGroupFetchStore,
    workspacePermissionGroupInputFetchFn
  );
