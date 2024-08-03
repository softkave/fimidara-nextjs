"use client";

import { useWorkspaceAgentTokensStore } from "../resourceListStores.ts";
import { makeSingleFetchStore } from "./makeSingleFetchStore.ts";

export const { useFetchStore: useWorkspaceAgentTokenFetchStore } =
  makeSingleFetchStore("agentTokenFetch", useWorkspaceAgentTokensStore);
