"use client";

import {
  CollaborationRequestForUser,
  GetUserCollaborationRequestEndpointParams,
} from "@/lib/api-internal/endpoints/privateTypes.ts";
import { getPrivateFimidaraEndpointsUsingUserToken } from "@/lib/api/fimidaraEndpoints.ts";
import { useUserCollaborationRequestFetchStore } from "../fetchStores/userCollaborationRequest.ts";
import { useUserCollaborationRequestsStore } from "../resourceListStores.ts";
import { makeSingleFetchHook } from "./makeSingleFetchHook.ts";
import { FetchSingleResourceFetchFnData } from "./types.ts";

async function userCollaborationRequestInputFetchFn(
  params: GetUserCollaborationRequestEndpointParams
): Promise<FetchSingleResourceFetchFnData<CollaborationRequestForUser>> {
  const endpoints = await getPrivateFimidaraEndpointsUsingUserToken();
  const data = await endpoints.collaborationRequests.getUserRequest(params);
  return { resource: data.request };
}

export const { useFetchHook: useUserCollaborationRequestFetchHook } =
  makeSingleFetchHook(
    useUserCollaborationRequestsStore,
    useUserCollaborationRequestFetchStore,
    userCollaborationRequestInputFetchFn
  );
