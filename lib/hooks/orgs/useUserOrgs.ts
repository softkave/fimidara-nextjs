import useSWR from "swr";
import OrganizationAPI, {
  OrganizationURLs,
} from "../../api/endpoints/organization";
import { checkEndpointResult } from "../../api/utils";

const fetcher = async (p: string) => {
  const result = await OrganizationAPI.getUserOrganizations();
  checkEndpointResult(result);
  return result.organizations;
};

export default function useUserOrgs() {
  const { data, error } = useSWR(
    [OrganizationURLs.getUserOrganizations],
    fetcher
  );

  return {
    error,
    data,
    isLoading: !error && !data,
  };
}
