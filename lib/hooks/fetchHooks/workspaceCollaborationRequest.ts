"use client";

import { getPublicFimidaraEndpointsUsingUserToken } from "@/lib/api/fimidaraEndpoints.ts";
import {
  CollaborationRequestForWorkspace,
  GetWorkspaceCollaborationRequestEndpointParams,
} from "fimidara";
import { useWorkspaceCollaborationRequestFetchStore } from "../fetchStores/workspaceCollaborationRequest.ts";
import { useWorkspaceCollaborationRequestsStore } from "../resourceListStores.ts";
import { makeSingleFetchHook } from "./makeSingleFetchHook.ts";
import { FetchSingleResourceFetchFnData } from "./types.ts";

async function workspaceCollaborationRequestInputFetchFn(
  params: GetWorkspaceCollaborationRequestEndpointParams
): Promise<FetchSingleResourceFetchFnData<CollaborationRequestForWorkspace>> {
  const endpoints = await getPublicFimidaraEndpointsUsingUserToken();
  const data = await endpoints.collaborationRequests.getWorkspaceRequest(
    params
  );
  return { resource: data.request };
}

export const { useFetchHook: useWorkspaceCollaborationRequestFetchHook } =
  makeSingleFetchHook(
    useWorkspaceCollaborationRequestsStore,
    useWorkspaceCollaborationRequestFetchStore,
    workspaceCollaborationRequestInputFetchFn
  );
