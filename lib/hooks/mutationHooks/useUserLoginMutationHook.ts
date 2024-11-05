import { getPrivateFimidaraEndpoints } from "@/lib/api/fimidaraEndpoints.ts";
import { makeEndpointMutationHook } from "./makeEndpointMutationHook.ts";
import { updateUserSessionWhenResultIsLoginResult } from "./updateUserSessionWhenResultIsLoginResult.ts";

export const useUserLoginMutationHook = makeEndpointMutationHook(
  getPrivateFimidaraEndpoints,
  (endpoints) => endpoints.users.login,
  updateUserSessionWhenResultIsLoginResult
);
