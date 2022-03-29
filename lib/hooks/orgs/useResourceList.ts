import useSWR from "swr";
import ResourceAPI, {
  IGetResourcesEndpointParams,
  ResourceURLs,
} from "../../api/endpoints/resources";
import { checkEndpointResult } from "../../api/utils";

const fetcher = async (p: string, params: IGetResourcesEndpointParams) => {
  return checkEndpointResult(await ResourceAPI.getResources(params));
};

export function getUseResourceListHookKey(params: IGetResourcesEndpointParams) {
  return [ResourceURLs.getResources, params];
}

export default function useResourceList(params: IGetResourcesEndpointParams) {
  const { data, error, mutate } = useSWR(
    getUseResourceListHookKey(params),
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
