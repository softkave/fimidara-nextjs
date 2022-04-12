import useSWR from "swr";
import WorkspaceAPI, { WorkspaceURLs } from "../../api/endpoints/workspace";
import { checkEndpointResult } from "../../api/utils";

const fetcher = async (p: string) => {
  const result = await WorkspaceAPI.getUserWorkspaces();
  checkEndpointResult(result);
  return result.workspaces;
};

export default function useUserWorkspaces() {
  const { data, error } = useSWR([WorkspaceURLs.getUserWorkspaces], fetcher, {
    shouldRetryOnError: false,
  });

  return {
    error,
    data,
    isLoading: !error && !data,
  };
}
