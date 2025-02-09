"use client";

import { User } from "@/lib/api-internal/endpoints/privateTypes.ts";
import { RefreshUserToken } from "@/lib/api-internal/RefreshUserToken.ts";
import { callSetCookieEndpoint } from "@/lib/api/account/index.ts";
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
  const endpoints = await getPrivateFimidaraEndpointsUsingUserToken();
  const data = await endpoints.users.getUserData();

  callSetCookieEndpoint({
    arg: { jwtToken: data.jwtToken, userId: data.user.resourceId },
  }).catch(console.error.bind(console));

  return {
    resource: data.user,
    other: {
      session: data,
      refresh: new RefreshUserToken({
        endpoints,
        user: data,
      }),
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
