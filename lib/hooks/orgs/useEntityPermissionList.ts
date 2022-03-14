import useSWR from "swr";
import PermissionItemAPI, {
  PermissionItemURLs,
} from "../../api/endpoints/permissionItem";
import { checkEndpointResult } from "../../api/utils";
import { AppResourceType } from "../../definitions/system";

const fetcher = async (
  p: string,
  orgId: string,
  entityId: string,
  entityType: AppResourceType
) => {
  return checkEndpointResult(
    await PermissionItemAPI.getEntityPermissionItems({
      organizationId: orgId,
      permissionEntityId: entityId,
      permissionEntityType: entityType,
    })
  );
};

export function getUseEntityPermissionListHookKey(
  orgId: string,
  entityId: string,
  entityType: AppResourceType
) {
  return [
    PermissionItemURLs.getEntityPermissionItems,
    orgId,
    entityId,
    entityType,
  ];
}

export default function useEntityPermissionList(
  orgId: string,
  entityId: string,
  entityType: AppResourceType
) {
  const { data, error, mutate } = useSWR(
    getUseEntityPermissionListHookKey(orgId, entityId, entityType),
    fetcher
  );

  return {
    error,
    data,
    mutate,
    isLoading: !error && !data,
  };
}
