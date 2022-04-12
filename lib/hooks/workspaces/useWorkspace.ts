import useSWR, { SWRConfiguration } from "swr";
import WorkspaceAPI, { WorkspaceURLs } from "../../api/endpoints/workspace";
import { checkEndpointResult } from "../../api/utils";

const fetcher = async (p: string, id: string) => {
  return checkEndpointResult(
    await WorkspaceAPI.getWorkspace({ workspaceId: id })
  );
};

export function getUseWorkspaceHookKey(id: string) {
  return [WorkspaceURLs.getWorkspace, id];
}

export default function useWorkspace(
  id?: string,
  swrConfig: SWRConfiguration = {}
) {
  const { data, error } = useSWR(
    id ? getUseWorkspaceHookKey(id) : null,
    fetcher,
    {
      shouldRetryOnError: false,
      ...swrConfig,
    }
  );
  return {
    error,
    data,
    isLoading: !error && !data,
  };
}
