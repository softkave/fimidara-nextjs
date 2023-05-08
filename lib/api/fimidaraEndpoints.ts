import fimidara from "fimidara";
import { useUserSessionFetchStore } from "../hooks/singleResourceFetchStores";
import { FimidaraEndpoints as PrivateFimidaraEndpoints } from "./private-endpoints";

export function getPublicFimidaraEndpointsUsingUserToken() {
  const publicFimidaraEndpoints = new fimidara.FimidaraEndpoints({
    authToken: useUserSessionFetchStore.getState().data?.other?.userToken,
  });
  return publicFimidaraEndpoints;
}

export function getPrivateFimidaraEndpointsUsingUserToken() {
  const privateFimidaraEndpoints = new PrivateFimidaraEndpoints({
    authToken: useUserSessionFetchStore.getState().data?.other?.userToken,
  });
  return privateFimidaraEndpoints;
}

export function getPublicFimidaraEndpointsUsingFimidaraAgentToken() {
  const publicFimidaraEndpoints = new fimidara.FimidaraEndpoints({
    authToken: useUserSessionFetchStore.getState().data?.other?.clientToken,
  });
  return publicFimidaraEndpoints;
}

export function getPrivateFimidaraEndpointsUsingFimidaraAgentToken() {
  const privateFimidaraEndpoints = new PrivateFimidaraEndpoints({
    authToken: useUserSessionFetchStore.getState().data?.other?.clientToken,
  });
  return privateFimidaraEndpoints;
}
