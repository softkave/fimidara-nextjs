"use client";

import { FimidaraEndpoints, FimidaraJsConfigAuthToken } from "fimidara";
import { first } from "lodash-es";
import { getSession } from "next-auth/react";
import { FimidaraEndpoints as PrivateFimidaraEndpoints } from "../api-internal/endpoints/privateEndpoints.ts";
import { systemConstants } from "../definitions/system";
import { IOAuthUser } from "../definitions/user.ts";
import { useUserSessionFetchStore } from "../hooks/fetchStores/session.ts";
import { kUserSessionStorageFns } from "../storage/UserSessionStorageFns.ts";

async function getTokensFromOAuth() {
  const auth = await getSession();
  const user = auth?.user as IOAuthUser;
  const jwtToken = user.jwtToken;
  const clientJwtToken = user.clientJwtToken;

  kUserSessionStorageFns.setData({
    clientJwtToken,
    jwtToken,
    jwtTokenExpiresAt: user.jwtTokenExpiresAt,
    refreshToken: user.refreshToken,
  });

  return { jwtToken, clientJwtToken };
}

function getUserTokenFromStore() {
  const state = first(useUserSessionFetchStore.getState().states);
  if (state) {
    return state[1].data?.other?.refresh;
  }
}

function getUserTokenFromStorage() {
  return kUserSessionStorageFns.getData()?.jwtToken ?? undefined;
}

export async function getUserToken() {
  const token =
    getUserTokenFromStore() ??
    getUserTokenFromStorage() ??
    (await getTokensFromOAuth())?.jwtToken;

  return token;
}

function getClientTokenFromStore() {
  const state = first(useUserSessionFetchStore.getState().states);
  if (state) {
    return state[1].data?.other?.refresh;
  }
}

function getClientTokenFromStorage() {
  return kUserSessionStorageFns.getData()?.clientJwtToken ?? undefined;
}

export async function getClientToken() {
  const token =
    getClientTokenFromStore() ??
    getClientTokenFromStorage() ??
    (await getTokensFromOAuth())?.clientJwtToken;

  return token;
}

export function getPublicFimidaraEndpoints(
  props: { authToken?: FimidaraJsConfigAuthToken } = {}
) {
  const { authToken } = props;
  const publicFimidaraEndpoints = new FimidaraEndpoints({
    authToken,
    serverURL: systemConstants.serverAddr,
  });

  return publicFimidaraEndpoints;
}

export function getPrivateFimidaraEndpoints(
  props: { authToken?: FimidaraJsConfigAuthToken } = {}
) {
  const { authToken } = props;
  const privateFimidaraEndpoints = new PrivateFimidaraEndpoints({
    authToken,
    serverURL: systemConstants.serverAddr,
  });

  return privateFimidaraEndpoints;
}

export async function getPublicFimidaraEndpointsUsingUserToken(
  props: { userToken?: string } = {}
) {
  const { userToken = await getUserToken() } = props;
  return getPublicFimidaraEndpoints({ authToken: userToken });
}

export async function getPrivateFimidaraEndpointsUsingUserToken(
  props: { userToken?: string } = {}
) {
  const { userToken = await getUserToken() } = props;
  return getPrivateFimidaraEndpoints({ authToken: userToken });
}
