"use client";

import { getPublicFimidaraEndpointsUsingUserToken } from "@/lib/api/fimidaraEndpoints.ts";
import { Collaborator, GetCollaboratorEndpointParams } from "fimidara";
import { useWorkspaceCollaboratorFetchStore } from "../fetchStores/collaborator.ts";
import { useWorkspaceCollaboratorsStore } from "../resourceListStores.ts";
import { makeSingleFetchHook } from "./makeSingleFetchHook.ts";
import { FetchSingleResourceFetchFnData } from "./types.ts";

async function workspaceCollaboratorInputFetchFn(
  params: GetCollaboratorEndpointParams
): Promise<FetchSingleResourceFetchFnData<Collaborator>> {
  const endpoints = await getPublicFimidaraEndpointsUsingUserToken();
  const data = await endpoints.collaborators.getCollaborator(params);
  return { resource: data.collaborator };
}

export const { useFetchHook: useWorkspaceCollaboratorFetchHook } =
  makeSingleFetchHook(
    useWorkspaceCollaboratorsStore,
    useWorkspaceCollaboratorFetchStore,
    workspaceCollaboratorInputFetchFn
  );
