import useSWR from "swr";
import PresetPermissionsGroupAPI, {
  IGetWorkspacePresetPermissionsGroupEndpointResult,
  PresetPermissionsGroupURL,
} from "../../api/endpoints/presetPermissionsGroup";
import { checkEndpointResult } from "../../api/utils";
import { swrDefaultConfig } from "../config";

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
  const { data, error, mutate } =
    useSWR<IGetWorkspacePresetPermissionsGroupEndpointResult>(
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
