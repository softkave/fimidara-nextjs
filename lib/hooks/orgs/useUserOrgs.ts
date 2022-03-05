import useSWR from "swr";
import OrganizationAPI, {
  OrganizationURLs,
} from "../../api/endpoints/organization";
import { withCheckEndpointResult } from "../../api/utils";

const fetcher = withCheckEndpointResult(OrganizationAPI.getUserOrganizations);

export default function useUserOrgs(id?: string) {
  const { data, error } = useSWR(
    id ? [OrganizationURLs.getUserOrganizations, id] : null,
    fetcher
  );

  return {
    error,
    data,
    isLoading: !error && !data,
  };
}
