import useSWR from "swr";
import ProgramAccessTokenAPI, {
  ProgramAccessTokenURLs,
} from "../../api/endpoints/programAccessToken";
import { checkEndpointResult } from "../../api/utils";

const fetcher = async (p: string, orgId: string) => {
  return checkEndpointResult(
    await ProgramAccessTokenAPI.getOrganizationTokens({
      organizationId: orgId,
    })
  );
};

export function getUseOrgProgramTokenListHookKey(orgId: string) {
  return [ProgramAccessTokenURLs.getOrganizationTokens, orgId];
}

export default function useOrgProgramTokenList(orgId: string) {
  const { data, error } = useSWR(
    getUseOrgProgramTokenListHookKey(orgId),
    fetcher,
    { shouldRetryOnError: false }
  );

  return {
    error,
    data,
    isLoading: !error && !data,
  };
}
