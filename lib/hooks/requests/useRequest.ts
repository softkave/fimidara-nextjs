import useSWR from "swr";
import CollaborationRequestAPI, {
  CollaborationRequestURLs,
} from "../../api/endpoints/collaborationRequest";
import { checkEndpointResult } from "../../api/utils";

const fetcher = async (p: string, id: string) => {
  return checkEndpointResult(
    await CollaborationRequestAPI.getRequest({ requestId: id })
  );
};

export function getUseCollaborationRequestHookKey(id: string) {
  return [CollaborationRequestURLs.getRequest, id];
}

export default function useCollaborationRequest(id?: string) {
  const { data, error } = useSWR(
    id ? getUseCollaborationRequestHookKey(id) : null,
    fetcher
  );

  return {
    error,
    data,
    isLoading: !error && !data,
  };
}
