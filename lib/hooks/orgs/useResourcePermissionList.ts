import useSWR from "swr";
import PermissionItemAPI, {
  PermissionItemURLs,
} from "../../api/endpoints/permissionItem";
import { checkEndpointResult } from "../../api/utils";
import { AppResourceType } from "../../definitions/system";

const fetcher = async (
  p: string,
  orgId: string,
  resourceType: AppResourceType,
  resourceId?: string
) => {
  return checkEndpointResult(
    await PermissionItemAPI.getResourcePermissionItems({
      organizationId: orgId,
      itemResourceId: resourceId,
      itemResourceType: resourceType,
    })
  );
};

export function getUseResourcePermissionListHookKey(
  orgId: string,
  resourceType: AppResourceType,
  resourceId?: string
) {
  return [
    PermissionItemURLs.getResourcePermissionItems,
    orgId,
    resourceId,
    resourceType,
  ];
}

export default function useResourcePermissionList(
  orgId: string,
  resourceType: AppResourceType,
  resourceId?: string
) {
  const { data, error, mutate } = useSWR(
    getUseResourcePermissionListHookKey(orgId, resourceType, resourceId),
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
