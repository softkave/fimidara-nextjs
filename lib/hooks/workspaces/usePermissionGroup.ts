import useSWR from "swr";
import PresetPermissionsGroupAPI, {
  PresetPermissionsGroupURL,
} from "../../api/endpoints/presetPermissionsGroup";
import { checkEndpointResult } from "../../api/utils";
import { swrDefaultConfig } from "../config";

const fetcher = async (p: string, id: string) => {
  return checkEndpointResult(
    await PresetPermissionsGroupAPI.getPreset({ presetId: id })
  );
};

export function getUsePermissionGroupHookKey(id: string) {
  return [PresetPermissionsGroupURL.getPreset, id];
}

export default function usePermissionGroup(id?: string) {
  const { data, error, mutate } = useSWR(
    id ? getUsePermissionGroupHookKey(id) : null,
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
