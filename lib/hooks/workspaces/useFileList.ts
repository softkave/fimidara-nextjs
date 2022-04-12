import useSWR from "swr";
import FolderAPI, {
  FolderURLs,
  IListFolderContentEndpointParams,
} from "../../api/endpoints/folder";
import { checkEndpointResult } from "../../api/utils";

const fetcher = async (p: string, params: IListFolderContentEndpointParams) => {
  return checkEndpointResult(await FolderAPI.listFolderContent(params));
};

export function getUseFileListHookKey(
  params: IListFolderContentEndpointParams
) {
  return [FolderURLs.listFolderContent, params];
}

export default function useFileList(params?: IListFolderContentEndpointParams) {
  const { data, error, mutate } = useSWR(
    params ? getUseFileListHookKey(params) : null,
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
