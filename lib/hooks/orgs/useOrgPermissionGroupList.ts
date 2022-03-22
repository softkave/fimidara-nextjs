import useSWR from "swr";
import PresetPermissionsGroupAPI, {
  PresetPermissionsGroupURL,
} from "../../api/endpoints/presetPermissionsGroup";
import { checkEndpointResult } from "../../api/utils";

const fetcher = async (p: string, orgId: string) => {
  return checkEndpointResult(
    await PresetPermissionsGroupAPI.getOrganizationPresets({
      organizationId: orgId,
    })
  );
};

export function getUseOrgPermissionGroupListHookKey(orgId: string) {
  return [PresetPermissionsGroupURL.getOrganizationPresets, orgId];
}

export default function useOrgPermissionGroupList(orgId: string) {
  const { data, error, mutate } = useSWR(
    getUseOrgPermissionGroupListHookKey(orgId),
    fetcher,
    { shouldRetryOnError: false }
  );

  return {
    error,
    data,
    mutate,
    isLoading: !error && !data,
  };
}
