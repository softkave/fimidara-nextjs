"use client";

import { getPublicFimidaraEndpointsUsingUserToken } from "@/lib/api/fimidaraEndpoints.ts";
import { User } from "fimidara";
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
  const endpoints = getPublicFimidaraEndpointsUsingUserToken();
  const data = await endpoints.users.getUserData();
  return {
    resource: data.body.user,
    other: {
      userToken: data.body.token,
      clientToken: data.body.clientAssignedToken,
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
