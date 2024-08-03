"use client";

import { useUserCollaborationRequestsStore } from "../resourceListStores.ts";
import { makeSingleFetchStore } from "./makeSingleFetchStore.ts";

export const { useFetchStore: useUserCollaborationRequestFetchStore } =
  makeSingleFetchStore("userRequestFetch", useUserCollaborationRequestsStore);
