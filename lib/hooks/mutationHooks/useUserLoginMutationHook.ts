import { getPrivateFimidaraEndpoints } from "@/lib/api/fimidaraEndpoints.ts";
import { makeEndpointMutationHook } from "./makeEndpointMutationHook.ts";
import { updateLocalLoginResult } from "./updateLocalLoginResult.ts";

export const useUserLoginMutationHook = makeEndpointMutationHook(
  getPrivateFimidaraEndpoints,
  (endpoints) => endpoints.users.login,
  (result) => updateLocalLoginResult({ result, persistJwtToken: false })
);
