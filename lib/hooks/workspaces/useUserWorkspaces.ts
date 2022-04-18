import useSWR from "swr";
import WorkspaceAPI, {
  IGetUserWorkspacesEndpointResult,
  WorkspaceURLs,
} from "../../api/endpoints/workspace";
import { checkEndpointResult } from "../../api/utils";
import { swrDefaultConfig } from "../config";

const fetcher = async (p: string) => {
  const result = await WorkspaceAPI.getUserWorkspaces();
  checkEndpointResult(result);
  return result;
};

export default function useUserWorkspaces() {
  const { data, error } = useSWR<IGetUserWorkspacesEndpointResult>(
    [WorkspaceURLs.getUserWorkspaces],
    fetcher,
    swrDefaultConfig
  );

  return {
    error,
    data,
    isLoading: !error && !data,
  };
}
