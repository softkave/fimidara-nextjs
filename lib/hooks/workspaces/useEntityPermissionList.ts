import useSWR from "swr";
import PermissionItemAPI, {
  IGetEntityPermissionItemsEndpointResult,
  PermissionItemURLs,
} from "../../api/endpoints/permissionItem";
import { IPaginationQuery } from "../../api/types";
import { checkEndpointResult } from "../../api/utils";
import { AppResourceType } from "../../definitions/system";
import { fetchEveryItem } from "../../utils/utils";
import { swrDefaultConfig } from "../config";

const fetchPageItems = async (
  workspaceId: string,
  entityId: string,
  entityType: AppResourceType,
  p: IPaginationQuery
) => {
  const result = checkEndpointResult(
    await PermissionItemAPI.getEntityPermissionItems({
      workspaceId: workspaceId,
      permissionEntityId: entityId,
      permissionEntityType: entityType,
      ...p,
    })
  );
  return result.items;
};

const fetcher = async (
  workspaceId: string,
  entityId: string,
  entityType: AppResourceType
): Promise<IGetEntityPermissionItemsEndpointResult> => {
  const items = await fetchEveryItem(async (p) =>
    fetchPageItems(workspaceId, entityId, entityType, p)
  );
  return { items };
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
  const { data, error, mutate } =
    useSWR<IGetEntityPermissionItemsEndpointResult>(
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
