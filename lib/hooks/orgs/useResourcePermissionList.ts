import useSWR from "swr";
import PermissionItemAPI, {
  IGetResourcePermissionItemsEndpointParams,
  PermissionItemURLs,
} from "../../api/endpoints/permissionItem";
import { checkEndpointResult } from "../../api/utils";
import { AppResourceType } from "../../definitions/system";

const fetcher = async (
  p: string,
  params: IGetResourcePermissionItemsEndpointParams
) => {
  return checkEndpointResult(
    await PermissionItemAPI.getResourcePermissionItems(params)
  );
};

export function getUseResourcePermissionListHookKey(
  params: IGetResourcePermissionItemsEndpointParams
) {
  return [PermissionItemURLs.getResourcePermissionItems, params];
}

export default function useResourcePermissionList(
  params: IGetResourcePermissionItemsEndpointParams
) {
  const { data, error, mutate } = useSWR(
    getUseResourcePermissionListHookKey(params),
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