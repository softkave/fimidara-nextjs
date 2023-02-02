import useSWR from "swr";
import CollaborationRequestAPI, {
  CollaborationRequestURLs,
  IGetWorkspaceCollaborationRequestsEndpointParams,
  IGetWorkspaceCollaborationRequestsEndpointResult,
} from "../../api/endpoints/collaborationRequest";
import { checkEndpointResult } from "../../api/utils";
import { swrDefaultConfig } from "../config";

const fetcher = async (
  p: string,
  q: IGetWorkspaceCollaborationRequestsEndpointParams
) => {
  return checkEndpointResult(
    await CollaborationRequestAPI.getWorkspaceRequests(q)
  );
};

export function getUseWorkspaceRequestListHookKey(
  q: IGetWorkspaceCollaborationRequestsEndpointParams
) {
  return [CollaborationRequestURLs.getWorkspaceRequests, q];
}

export default function useWorkspaceRequestList(
  q: IGetWorkspaceCollaborationRequestsEndpointParams
) {
  const { data, error } =
    useSWR<IGetWorkspaceCollaborationRequestsEndpointResult>(
      getUseWorkspaceRequestListHookKey(q),
      fetcher,
      swrDefaultConfig
    );
  return {
    error,
    data,
    isLoading: !error && !data,
  };
}
