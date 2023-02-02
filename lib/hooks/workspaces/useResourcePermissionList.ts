import useSWR from "swr";
import PermissionItemAPI, {
  IGetResourcePermissionItemsEndpointParams,
  IGetResourcePermissionItemsEndpointResult,
  PermissionItemURLs,
} from "../../api/endpoints/permissionItem";
import { checkEndpointResult } from "../../api/utils";
import { fetchEveryItem } from "../../utils/utils";
import { swrDefaultConfig } from "../config";

const fetchPageItems = async (
  params: IGetResourcePermissionItemsEndpointParams
) => {
  const result = checkEndpointResult(
    await PermissionItemAPI.getResourcePermissionItems(params)
  );
  return result.items;
};

const fetcher = async (
  p: string,
  params: IGetResourcePermissionItemsEndpointParams
): Promise<IGetResourcePermissionItemsEndpointResult> => {
  const items = await fetchEveryItem(async (p) =>
    fetchPageItems({ ...params, ...p })
  );
  return { items };
};

export function getUseResourcePermissionListHookKey(
  params: IGetResourcePermissionItemsEndpointParams
) {
  return [PermissionItemURLs.getResourcePermissionItems, params];
}

export default function useResourcePermissionList(
  params: IGetResourcePermissionItemsEndpointParams
) {
  const { data, error, mutate } =
    useSWR<IGetResourcePermissionItemsEndpointResult>(
      getUseResourcePermissionListHookKey(params),
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
