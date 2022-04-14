import useSWR from "swr";
import CollaborationRequestAPI, {
  CollaborationRequestURLs,
} from "../../api/endpoints/collaborationRequest";
import { withCheckEndpointResult } from "../../api/utils";
import { swrDefaultConfig } from "../config";

const fetcher = withCheckEndpointResult(
  CollaborationRequestAPI.getUserRequests
);

export default function useUserRequests(id?: string) {
  const { data, error } = useSWR(
    id ? [CollaborationRequestURLs.getUserRequests, id] : null,
    fetcher,
    swrDefaultConfig
  );

  return {
    error,
    data,
    isLoading: !error && !data,
  };
}
