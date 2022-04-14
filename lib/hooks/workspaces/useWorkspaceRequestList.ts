import useSWR from "swr";
import CollaborationRequestAPI, {
  CollaborationRequestURLs,
} from "../../api/endpoints/collaborationRequest";
import { checkEndpointResult } from "../../api/utils";
import { swrDefaultConfig } from "../config";

const fetcher = async (p: string, workspaceId: string) => {
  return checkEndpointResult(
    await CollaborationRequestAPI.getWorkspaceRequests({
      workspaceId: workspaceId,
    })
  );
};

export function getUseWorkspaceRequestListHookKey(workspaceId: string) {
  return [CollaborationRequestURLs.getWorkspaceRequests, workspaceId];
}

export default function useWorkspaceRequestList(workspaceId: string) {
  const { data, error } = useSWR(
    getUseWorkspaceRequestListHookKey(workspaceId),
    fetcher,
    swrDefaultConfig
  );

  return {
    error,
    data,
    isLoading: !error && !data,
  };
}
