"use client";

import * as fimidara from "fimidara";
import { first } from "lodash-es";
import { FimidaraEndpoints as PrivateFimidaraEndpoints } from "../api-internal/endpoints/privateEndpoints.ts";
import { systemConstants } from "../definitions/system";
import { useUserSessionFetchStore } from "../hooks/fetchStores/session.ts";
import { kUserSessionStorageFns } from "../storage/UserSessionStorageFns.ts";

function getUserTokenFromStore() {
  const state = first(useUserSessionFetchStore.getState().states);
  let token: fimidara.FimidaraJsConfigAuthToken | undefined = undefined;

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
  let token: fimidara.FimidaraJsConfigAuthToken | undefined = undefined;

  if (state) {
    token = state[1].data?.other?.refresh;
  }

  if (!token) {
    token = kUserSessionStorageFns.getData()?.clientJwtToken ?? undefined;
  }

  return token;
}

export function getPublicFimidaraEndpointsUsingUserToken(
  props: { userToken?: string } = {}
) {
  const { userToken = getUserTokenFromStore() } = props;
  const publicFimidaraEndpoints = new fimidara.FimidaraEndpoints({
    serverURL: systemConstants.serverAddr,
    authToken: userToken,
  });
  return publicFimidaraEndpoints;
}

export function getPrivateFimidaraEndpointsUsingUserToken(
  props: { userToken?: string } = {}
) {
  const { userToken = getUserTokenFromStore() } = props;
  const privateFimidaraEndpoints = new PrivateFimidaraEndpoints({
    serverURL: systemConstants.serverAddr,
    authToken: userToken,
  });

  return privateFimidaraEndpoints;
}

export function getPublicFimidaraEndpointsUsingFimidaraAgentToken(
  props: { clientToken?: string } = {}
) {
  const { clientToken = getClientTokenFromStore() } = props;
  const publicFimidaraEndpoints = new fimidara.FimidaraEndpoints({
    serverURL: systemConstants.serverAddr,
    authToken: clientToken,
  });

  return publicFimidaraEndpoints;
}

export function getPrivateFimidaraEndpointsUsingFimidaraAgentToken(
  props: { clientToken?: string } = {}
) {
  const { clientToken = getClientTokenFromStore() } = props;
  const privateFimidaraEndpoints = new PrivateFimidaraEndpoints({
    serverURL: systemConstants.serverAddr,
    authToken: clientToken,
  });

  return privateFimidaraEndpoints;
}
