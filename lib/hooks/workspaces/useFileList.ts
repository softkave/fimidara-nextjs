import useSWR from "swr";
import FolderAPI, {
  FolderURLs,
  IListFolderContentEndpointParams,
  IListFolderContentEndpointResult,
} from "../../api/endpoints/folder";
import { checkEndpointResult } from "../../api/utils";
import { swrDefaultConfig } from "../config";

const fetcher = async (p: string, params: IListFolderContentEndpointParams) => {
  return checkEndpointResult(await FolderAPI.listFolderContent(params));
};

export function getUseFileListHookKey(
  params: IListFolderContentEndpointParams
) {
  return [FolderURLs.listFolderContent, params];
}

export default function useFileList(params?: IListFolderContentEndpointParams) {
  const { data, error, mutate } = useSWR<IListFolderContentEndpointResult>(
    params ? getUseFileListHookKey(params) : null,
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
