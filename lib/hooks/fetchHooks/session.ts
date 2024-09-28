"use client";

import { User } from "@/lib/api-internal/endpoints/privateTypes.ts";
import { getPrivateFimidaraEndpointsUsingUserToken } from "@/lib/api/fimidaraEndpoints.ts";
import {
  UserSessionFetchStoreOther,
  useUserSessionFetchStore,
} from "../fetchStores/session.ts";
import { useUsersStore } from "../resourceListStores.ts";
import { makeSingleFetchHook } from "./makeSingleFetchHook.ts";
import { FetchSingleResourceFetchFnData } from "./types.ts";

async function getUserDataInputFetchFn(): Promise<
  FetchSingleResourceFetchFnData<User, UserSessionFetchStoreOther>
> {
  const endpoints = getPrivateFimidaraEndpointsUsingUserToken();
  const data = await endpoints.users.getUserData();
  return {
    resource: data.user,
    other: {
      userToken: data.token,
      clientToken: data.clientAssignedToken,
    },
  };
}

export const { useFetchHook: useUserSessionFetchHook } = makeSingleFetchHook(
  useUsersStore,
  useUserSessionFetchStore,
  getUserDataInputFetchFn,
  (willLoad: boolean, params: any, fetchState: any) => {
    return willLoad || !fetchState;
  }
);
