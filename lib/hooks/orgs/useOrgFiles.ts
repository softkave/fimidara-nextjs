import useSWR from "swr";
import FolderAPI, { FolderURLs } from "../../api/endpoints/folder";
import { checkEndpointResult } from "../../api/utils";

const fetcher = async (p: string, orgId: string, folderPath: string) => {
  return checkEndpointResult(
    await FolderAPI.listFolderContent({
      organizationId: orgId,
      path: folderPath,
    })
  );
};

export function getUseOrgFilesHookKey(orgId: string, folderPath: string) {
  return [FolderURLs.listFolderContent, orgId, folderPath];
}

export default function useOrgFiles(orgId: string, folderPath = "") {
  const { data, error } = useSWR(
    getUseOrgFilesHookKey(orgId, folderPath),
    fetcher
  );

  return {
    error,
    data,
    isLoading: !error && !data,
  };
}
