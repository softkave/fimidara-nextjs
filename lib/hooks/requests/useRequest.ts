import useSWR from "swr";
import CollaborationRequestAPI, {
  CollaborationRequestURLs,
  IGetCollaborationRequestEndpointResult,
} from "../../api/endpoints/collaborationRequest";
import { checkEndpointResult } from "../../api/utils";
import { swrDefaultConfig } from "../config";

const fetcher = async (p: string, id: string) => {
  return checkEndpointResult(
    await CollaborationRequestAPI.getRequest({ requestId: id })
  );
};

export function getUseCollaborationRequestHookKey(id: string) {
  return [CollaborationRequestURLs.getRequest, id];
}

export default function useCollaborationRequest(id?: string) {
  const { data, error, mutate } =
    useSWR<IGetCollaborationRequestEndpointResult>(
      id ? getUseCollaborationRequestHookKey(id) : null,
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
