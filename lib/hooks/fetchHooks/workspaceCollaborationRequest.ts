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
  const endpoints = getPublicFimidaraEndpointsUsingUserToken();
  const data = await endpoints.collaborationRequests.getWorkspaceRequest({
    body: params,
  });
  return { resource: data.body.request };
}

export const { useFetchHook: useWorkspaceCollaborationRequestFetchHook } =
  makeSingleFetchHook(
    useWorkspaceCollaborationRequestsStore,
    useWorkspaceCollaborationRequestFetchStore,
    workspaceCollaborationRequestInputFetchFn
  );
