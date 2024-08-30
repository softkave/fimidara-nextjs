import { getPrivateFimidaraEndpointsUsingUserToken } from "@/lib/api/fimidaraEndpoints.ts";
import { updateUserSessionWhenResultIsLoginResult } from "./updateUserSessionWhenResultIsLoginResult.ts";
import { makeEndpointMutationHook } from "./makeEndpointMutationHook.ts";

export const useUserLoginMutationHook = makeEndpointMutationHook(
  getPrivateFimidaraEndpointsUsingUserToken,
  (endpoints) => endpoints.users.login,
  updateUserSessionWhenResultIsLoginResult
);
