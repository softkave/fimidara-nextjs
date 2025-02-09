"use client";

import { getPublicFimidaraEndpointsUsingUserToken } from "@/lib/api/fimidaraEndpoints.ts";
import { AgentToken, GetAgentTokenEndpointParams } from "fimidara";
import { useWorkspaceAgentTokenFetchStore } from "../fetchStores/agentToken.ts";
import { useWorkspaceAgentTokensStore } from "../resourceListStores.ts";
import { makeSingleFetchHook } from "./makeSingleFetchHook.ts";
import { FetchSingleResourceFetchFnData } from "./types.ts";

async function workspaceAgentTokenInputFetchFn(
  params: GetAgentTokenEndpointParams
): Promise<FetchSingleResourceFetchFnData<AgentToken>> {
  const endpoints = await getPublicFimidaraEndpointsUsingUserToken();
  const data = await endpoints.agentTokens.getToken(params);
  return { resource: data.token };
}

export const { useFetchHook: useWorkspaceAgentTokenFetchHook } =
  makeSingleFetchHook(
    useWorkspaceAgentTokensStore,
    useWorkspaceAgentTokenFetchStore,
    workspaceAgentTokenInputFetchFn
  );
