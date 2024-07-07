import * as fimidara from "fimidara";
import { first } from "lodash-es";
import { systemConstants } from "../definitions/system";
import { useUserSessionFetchStore } from "../hooks/singleResourceFetchStores";
import UserSessionStorageFns from "../storage/userSession";
import { FimidaraEndpoints as PrivateFimidaraEndpoints } from "./privateEndpoints";

function getUserTokenFromStore() {
  const state = first(useUserSessionFetchStore.getState().states);
  let token: string | undefined = undefined;

  if (state) token = state[1].data?.other?.userToken;
  if (!token) token = UserSessionStorageFns.getUserToken() ?? undefined;

  return token;
}
function getClientTokenFromStore() {
  const state = first(useUserSessionFetchStore.getState().states);
  let token: string | undefined = undefined;

  if (state) token = state[1].data?.other?.clientToken;
  if (!token)
    token = UserSessionStorageFns.getClientAssignedToken() ?? undefined;

  return token;
}

export function getPublicFimidaraEndpointsUsingUserToken() {
  const userToken = getUserTokenFromStore();
  const publicFimidaraEndpoints = new fimidara.FimidaraEndpoints({
    serverURL: systemConstants.serverAddr,
    authToken: userToken,
  });
  return publicFimidaraEndpoints;
}

export function getPrivateFimidaraEndpointsUsingUserToken() {
  const userToken = getUserTokenFromStore();
  const privateFimidaraEndpoints = new PrivateFimidaraEndpoints({
    serverURL: systemConstants.serverAddr,
    authToken: userToken,
  });
  return privateFimidaraEndpoints;
}

export function getPublicFimidaraEndpointsUsingFimidaraAgentToken() {
  const publicFimidaraEndpoints = new fimidara.FimidaraEndpoints({
    serverURL: systemConstants.serverAddr,
    authToken: getClientTokenFromStore(),
  });
  return publicFimidaraEndpoints;
}

export function getPrivateFimidaraEndpointsUsingFimidaraAgentToken() {
  const privateFimidaraEndpoints = new PrivateFimidaraEndpoints({
    serverURL: systemConstants.serverAddr,
    authToken: getClientTokenFromStore(),
  });
  return privateFimidaraEndpoints;
}
