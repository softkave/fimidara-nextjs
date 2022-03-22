import useSWR from "swr";
import PresetPermissionsGroupAPI, {
  PresetPermissionsGroupURL,
} from "../../api/endpoints/presetPermissionsGroup";
import { checkEndpointResult } from "../../api/utils";

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
    { shouldRetryOnError: false }
  );

  return {
    error,
    data,
    mutate,
    isLoading: !error && !data,
  };
}
