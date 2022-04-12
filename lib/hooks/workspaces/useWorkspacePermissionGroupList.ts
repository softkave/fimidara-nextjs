import useSWR from "swr";
import PresetPermissionsGroupAPI, {
  PresetPermissionsGroupURL,
} from "../../api/endpoints/presetPermissionsGroup";
import { checkEndpointResult } from "../../api/utils";

const fetcher = async (p: string, workspaceId: string) => {
  return checkEndpointResult(
    await PresetPermissionsGroupAPI.getWorkspacePresets({
      workspaceId: workspaceId,
    })
  );
};

export function getUseWorkspacePermissionGroupListHookKey(workspaceId: string) {
  return [PresetPermissionsGroupURL.getWorkspacePresets, workspaceId];
}

export default function useWorkspacePermissionGroupList(workspaceId: string) {
  const { data, error, mutate } = useSWR(
    getUseWorkspacePermissionGroupListHookKey(workspaceId),
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
