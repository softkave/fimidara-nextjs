import useSWR from "swr";
import CollaborationRequestAPI, {
  CollaborationRequestURLs,
  IGetUserCollaborationRequestsEndpointResult,
} from "../../api/endpoints/collaborationRequest";
import { IPaginationQuery } from "../../api/types";
import { checkEndpointResult } from "../../api/utils";
import { swrDefaultConfig } from "../config";

const fetcher = async (
  endpointPath: string,
  id?: string,
  params?: IPaginationQuery
) => {
  return checkEndpointResult(
    await CollaborationRequestAPI.getUserRequests(params)
  );
};

export default function useUserRequests(id?: string, p?: IPaginationQuery) {
  const { data, error } = useSWR<IGetUserCollaborationRequestsEndpointResult>(
    id ? [CollaborationRequestURLs.getUserRequests, id, p] : null,
    fetcher,
    swrDefaultConfig
  );
  return {
    error,
    data,
    isLoading: !error && !data,
  };
}
