import useSWR from "swr";
import CollaborationRequestAPI, {
  CollaborationRequestURLs,
} from "../../api/endpoints/collaborationRequest";
import { withCheckEndpointResult } from "../../api/utils";

const fetcher = withCheckEndpointResult(
  CollaborationRequestAPI.getUserRequests
);

export default function useUserRequests(id?: string) {
  const { data, error } = useSWR(
    id ? [CollaborationRequestURLs.getUserRequests, id] : null,
    fetcher
  );

  return {
    error,
    data,
    isLoading: !error && !data,
  };
}
