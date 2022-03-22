import useSWR from "swr";
import OrganizationAPI, {
  OrganizationURLs,
} from "../../api/endpoints/organization";
import { checkEndpointResult } from "../../api/utils";

const fetcher = async (p: string, id: string) => {
  return checkEndpointResult(
    await OrganizationAPI.getOrganization({ organizationId: id })
  );
};

export function getUseOrgHookKey(id: string) {
  return [OrganizationURLs.getOrganization, id];
}

export default function useOrg(id?: string) {
  const { data, error } = useSWR(id ? getUseOrgHookKey(id) : null, fetcher, {
    shouldRetryOnError: false,
  });
  return {
    error,
    data,
    isLoading: !error && !data,
  };
}
