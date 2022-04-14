import useSWR from "swr";
import PermissionItemAPI, {
  PermissionItemURLs,
} from "../../api/endpoints/permissionItem";
import { checkEndpointResult } from "../../api/utils";
import { AppResourceType } from "../../definitions/system";
import { swrDefaultConfig } from "../config";

const fetcher = async (
  p: string,
  workspaceId: string,
  entityId: string,
  entityType: AppResourceType
) => {
  return checkEndpointResult(
    await PermissionItemAPI.getEntityPermissionItems({
      workspaceId: workspaceId,
      permissionEntityId: entityId,
      permissionEntityType: entityType,
    })
  );
};

export function getUseEntityPermissionListHookKey(
  workspaceId: string,
  entityId: string,
  entityType: AppResourceType
) {
  return [
    PermissionItemURLs.getEntityPermissionItems,
    workspaceId,
    entityId,
    entityType,
  ];
}

export default function useEntityPermissionList(
  workspaceId: string,
  entityId: string,
  entityType: AppResourceType
) {
  const { data, error, mutate } = useSWR(
    getUseEntityPermissionListHookKey(workspaceId, entityId, entityType),
    fetcher,
    swrDefaultConfig
  );

  return {
    error,
    data,
    mutate,
    isLoading: !error && !data,
  };
}
