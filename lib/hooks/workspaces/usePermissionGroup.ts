import useSWR from "swr";
import PermissionGroupAPI, {
  IGetPermissionGroupEndpointResult,
  PermissionGroupURL,
} from "../../api/endpoints/permissionGroup";
import { checkEndpointResult } from "../../api/utils";
import { swrDefaultConfig } from "../config";

const fetcher = async (p: string, id: string) => {
  return checkEndpointResult(
    await PermissionGroupAPI.getPermissionGroup({ permissionGroupId: id })
  );
};

export function getUsePermissionGroupHookKey(id: string) {
  return [PermissionGroupURL.getPermissionGroup, id];
}

export default function usePermissionGroup(id?: string) {
  const { data, error, mutate } = useSWR<IGetPermissionGroupEndpointResult>(
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
