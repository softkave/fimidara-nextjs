import useSWR from "swr";
import PermissionGroupAPI, {
  IGetWorkspacePermissionGroupEndpointResult,
  PermissionGroupURL,
} from "../../api/endpoints/permissionGroup";
import { checkEndpointResult } from "../../api/utils";
import { swrDefaultConfig } from "../config";

const fetcher = async (p: string, workspaceId: string) => {
  return checkEndpointResult(
    await PermissionGroupAPI.getWorkspacePermissionGroups({
      workspaceId: workspaceId,
    })
  );
};

export function getUseWorkspacePermissionGroupListHookKey(workspaceId: string) {
  return [PermissionGroupURL.getWorkspacePermissionGroups, workspaceId];
}

export default function useWorkspacePermissionGroupList(workspaceId: string) {
  const { data, error, mutate } =
    useSWR<IGetWorkspacePermissionGroupEndpointResult>(
      getUseWorkspacePermissionGroupListHookKey(workspaceId),
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
