import useSWR from "swr";
import PermissionGroupAPI, {
  IGetWorkspacePermissionGroupEndpointParams,
  IGetWorkspacePermissionGroupEndpointResult,
  PermissionGroupURL,
} from "../../api/endpoints/permissionGroup";
import { checkEndpointResult } from "../../api/utils";
import { swrDefaultConfig } from "../config";

const fetcher = async (
  p: string,
  q: IGetWorkspacePermissionGroupEndpointParams
) => {
  return checkEndpointResult(
    await PermissionGroupAPI.getWorkspacePermissionGroups(q)
  );
};

export function getUseWorkspacePermissionGroupListHookKey(
  q: IGetWorkspacePermissionGroupEndpointParams
) {
  return [PermissionGroupURL.getWorkspacePermissionGroups, q];
}

export default function useWorkspacePermissionGroupList(
  q: IGetWorkspacePermissionGroupEndpointParams
) {
  const { data, error, mutate } =
    useSWR<IGetWorkspacePermissionGroupEndpointResult>(
      getUseWorkspacePermissionGroupListHookKey(q),
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
