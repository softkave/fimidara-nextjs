"use client";

import { FimidaraEndpoints, FimidaraJsConfigAuthToken } from "fimidara";
import { first } from "lodash-es";
import { FimidaraEndpoints as PrivateFimidaraEndpoints } from "../api-internal/endpoints/privateEndpoints.ts";
import { systemConstants } from "../definitions/system";
import { useUserSessionFetchStore } from "../hooks/fetchStores/session.ts";
import { kUserSessionStorageFns } from "../storage/UserSessionStorageFns.ts";

function getUserTokenFromStore() {
  const state = first(useUserSessionFetchStore.getState().states);
  let token: FimidaraJsConfigAuthToken | undefined = undefined;

  if (state) {
    token = state[1].data?.other?.refresh;
  }

  if (!token) {
    token = kUserSessionStorageFns.getData()?.jwtToken ?? undefined;
  }

  return token;
}

function getClientTokenFromStore() {
  const state = first(useUserSessionFetchStore.getState().states);
  let token: FimidaraJsConfigAuthToken | undefined = undefined;

  if (state) {
    token = state[1].data?.other?.refresh;
  }

  if (!token) {
    token = kUserSessionStorageFns.getData()?.clientJwtToken ?? undefined;
  }

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

export function getPublicFimidaraEndpointsUsingUserToken(
  props: { userToken?: string } = {}
) {
  const { userToken = getUserTokenFromStore() } = props;
  return getPublicFimidaraEndpoints({ authToken: userToken });
}

export function getPrivateFimidaraEndpointsUsingUserToken(
  props: { userToken?: string } = {}
) {
  const { userToken = getUserTokenFromStore() } = props;
  return getPrivateFimidaraEndpoints({ authToken: userToken });
}

export function getPublicFimidaraEndpointsUsingFimidaraAgentToken(
  props: { clientToken?: string } = {}
) {
  const { clientToken = getClientTokenFromStore() } = props;
  return getPublicFimidaraEndpoints({ authToken: clientToken });
}

export function getPrivateFimidaraEndpointsUsingFimidaraAgentToken(
  props: { clientToken?: string } = {}
) {
  const { clientToken = getClientTokenFromStore() } = props;
  return getPrivateFimidaraEndpoints({ authToken: clientToken });
}
