import useSWR from "swr";
import CollaborationRequestAPI, {
  CollaborationRequestURLs,
} from "../../api/endpoints/collaborationRequest";
import { checkEndpointResult } from "../../api/utils";

const fetcher = async (p: string, orgId: string) => {
  return checkEndpointResult(
    await CollaborationRequestAPI.getOrganizationRequests({
      organizationId: orgId,
    })
  );
};

export function getUseOrgRequestListHookKey(orgId: string) {
  return [CollaborationRequestURLs.getOrganizationRequests, orgId];
}

export default function useOrgRequestList(orgId: string) {
  const { data, error } = useSWR(getUseOrgRequestListHookKey(orgId), fetcher, {
    shouldRetryOnError: false,
  });

  return {
    error,
    data,
    isLoading: !error && !data,
  };
}
