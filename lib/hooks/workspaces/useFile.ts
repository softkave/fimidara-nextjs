import useSWR, { SWRConfiguration } from "swr";
import FileAPI, {
  FileURLs,
  IGetFileDetailsEndpointParams,
} from "../../api/endpoints/file";
import { checkEndpointResult } from "../../api/utils";

const fetcher = async (p: string, params: IGetFileDetailsEndpointParams) => {
  return checkEndpointResult(await FileAPI.getFileDetails(params));
};

export function getUseFileHookKey(params: IGetFileDetailsEndpointParams) {
  return [FileURLs.getFileDetails, params];
}

export default function useFile(
  params?: IGetFileDetailsEndpointParams,
  config: SWRConfiguration = {}
) {
  const { data, error, mutate } = useSWR(
    params ? getUseFileHookKey(params) : null,
    fetcher,
    { shouldRetryOnError: false, ...config }
  );

  return {
    error,
    data,
    mutate,
    isLoading: !error && !data,
  };
}
