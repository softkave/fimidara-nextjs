"use client";

import { getPublicFimidaraEndpointsUsingUserToken } from "@/lib/api/fimidaraEndpoints.ts";
import {
  CollaborationRequestForUser,
  GetUserCollaborationRequestEndpointParams,
} from "fimidara";
import { useUserCollaborationRequestFetchStore } from "../fetchStores/userCollaborationRequest.ts";
import { useUserCollaborationRequestsStore } from "../resourceListStores.ts";
import { makeSingleFetchHook } from "./makeSingleFetchHook.ts";
import { FetchSingleResourceFetchFnData } from "./types.ts";

async function userCollaborationRequestInputFetchFn(
  params: GetUserCollaborationRequestEndpointParams
): Promise<FetchSingleResourceFetchFnData<CollaborationRequestForUser>> {
  const endpoints = getPublicFimidaraEndpointsUsingUserToken();
  const data = await endpoints.collaborationRequests.getUserRequest({
    body: params,
  });
  return { resource: data.body.request };
}

export const { useFetchHook: useUserCollaborationRequestFetchHook } =
  makeSingleFetchHook(
    useUserCollaborationRequestsStore,
    useUserCollaborationRequestFetchStore,
    userCollaborationRequestInputFetchFn
  );
