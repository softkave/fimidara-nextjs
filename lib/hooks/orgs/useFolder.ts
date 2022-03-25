import useSWR from "swr";
import FolderAPI, {
  FolderURLs,
  IGetFolderEndpointParams,
} from "../../api/endpoints/folder";
import { checkEndpointResult } from "../../api/utils";

const fetcher = async (p: string, params: IGetFolderEndpointParams) => {
  return checkEndpointResult(await FolderAPI.getFolder(params));
};

export function getUseFolderHookKey(params: IGetFolderEndpointParams) {
  return [FolderURLs.getFolder, params];
}

export default function useFolder(params?: IGetFolderEndpointParams) {
  const { data, error, mutate } = useSWR(
    params ? getUseFolderHookKey(params) : null,
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
