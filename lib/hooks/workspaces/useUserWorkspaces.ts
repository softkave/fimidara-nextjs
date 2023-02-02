import useSWR from "swr";
import WorkspaceAPI, {
  IGetUserWorkspacesEndpointResult,
  WorkspaceURLs,
} from "../../api/endpoints/workspace";
import { IPaginationQuery } from "../../api/types";
import { checkEndpointResult } from "../../api/utils";
import { swrDefaultConfig } from "../config";

const fetcher = async (p: string, q?: IPaginationQuery) => {
  const result = await WorkspaceAPI.getUserWorkspaces();
  checkEndpointResult(result);
  return result;
};

export function getUseUserWorkspacesHookKey(q?: IPaginationQuery) {
  return [WorkspaceURLs.getUserWorkspaces, q];
}

export default function useUserWorkspaces(q?: IPaginationQuery) {
  const { data, error } = useSWR<IGetUserWorkspacesEndpointResult>(
    getUseUserWorkspacesHookKey(q),
    fetcher,
    swrDefaultConfig
  );
  return {
    error,
    data,
    isLoading: !error && !data,
  };
}
