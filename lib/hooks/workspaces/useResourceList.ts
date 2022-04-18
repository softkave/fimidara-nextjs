import { uniqBy } from "lodash";
import useSWR from "swr";
import ResourceAPI, {
  IGetResourcesEndpointParams,
  IGetResourcesEndpointResult,
  ResourceURLs,
} from "../../api/endpoints/resources";
import { checkEndpointResult } from "../../api/utils";
import { makeKey } from "../../utilities/fns";
import { swrDefaultConfig } from "../config";

const fetcher = async (p: string, params: IGetResourcesEndpointParams) => {
  return checkEndpointResult(await ResourceAPI.getResources(params));
};

export function getUseResourceListHookKey(params: IGetResourcesEndpointParams) {
  return [ResourceURLs.getResources, params];
}

export default function useResourceList(params: IGetResourcesEndpointParams) {
  const { data, error, mutate } = useSWR<IGetResourcesEndpointResult>(
    getUseResourceListHookKey({
      ...params,
      resources: uniqBy(params.resources, (item) =>
        makeKey([item.resourceId, item.resourceType])
      ),
    }),
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
