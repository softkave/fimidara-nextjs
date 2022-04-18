import useSWR, { SWRConfiguration } from "swr";
import FolderAPI, {
  FolderURLs,
  IGetFolderEndpointParams,
  IGetFolderEndpointResult,
} from "../../api/endpoints/folder";
import { checkEndpointResult } from "../../api/utils";
import { swrDefaultConfig } from "../config";

const fetcher = async (p: string, params: IGetFolderEndpointParams) => {
  return checkEndpointResult(await FolderAPI.getFolder(params));
};

export function getUseFolderHookKey(params: IGetFolderEndpointParams) {
  return [FolderURLs.getFolder, params];
}

export default function useFolder(
  params?: IGetFolderEndpointParams,
  config: SWRConfiguration = {}
) {
  const { data, error, mutate } = useSWR<IGetFolderEndpointResult>(
    params ? getUseFolderHookKey(params) : null,
    fetcher,
    { ...swrDefaultConfig, ...config }
  );

  return {
    error,
    data,
    mutate,
    isLoading: !error && !data,
  };
}
