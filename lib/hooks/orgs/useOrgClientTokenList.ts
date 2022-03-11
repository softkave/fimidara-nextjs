import useSWR from "swr";
import ClientAssignedTokenAPI, {
  ClientAssignedTokenURLs,
} from "../../api/endpoints/clientAssignedToken";
import { checkEndpointResult } from "../../api/utils";

const fetcher = async (p: string, orgId: string) => {
  return checkEndpointResult(
    await ClientAssignedTokenAPI.getOrganizationTokens({
      organizationId: orgId,
    })
  );
};

export function getUseOrgClientTokenListHookKey(orgId: string) {
  return [ClientAssignedTokenURLs.getOrganizationTokens, orgId];
}

export default function useOrgClientTokenList(orgId: string) {
  const { data, error } = useSWR(
    getUseOrgClientTokenListHookKey(orgId),
    fetcher
  );

  return {
    error,
    data,
    isLoading: !error && !data,
  };
}
