import fimidara from "fimidara";
import SessionSelectors from "../store/session/selectors";
import store from "../store/store";
import { FimidaraEndpoints as PrivateFimidaraEndpoints } from "./private-endpoints";

export function getPublicFimidaraEndpointsUsingUserToken() {
  const publicFimidaraEndpoints = new fimidara.FimidaraEndpoints({
    authToken: SessionSelectors.getUserToken(store.getState()),
  });
  return publicFimidaraEndpoints;
}

export function getPrivateFimidaraEndpointsUsingUserToken() {
  const privateFimidaraEndpoints = new PrivateFimidaraEndpoints({
    authToken: SessionSelectors.getUserToken(store.getState()),
  });
  return privateFimidaraEndpoints;
}

export function getPublicFimidaraEndpointsUsingFimidaraAgentToken() {
  const publicFimidaraEndpoints = new fimidara.FimidaraEndpoints({
    authToken: SessionSelectors.getUserFimidaraAgentToken(store.getState()),
  });
  return publicFimidaraEndpoints;
}

export function getPrivateFimidaraEndpointsUsingFimidaraAgentToken() {
  const privateFimidaraEndpoints = new PrivateFimidaraEndpoints({
    authToken: SessionSelectors.getUserFimidaraAgentToken(store.getState()),
  });
  return privateFimidaraEndpoints;
}
