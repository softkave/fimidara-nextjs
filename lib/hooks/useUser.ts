import useSWR from "swr";
import UserAPI, { UserURLs } from "../api/endpoints/user";
import { withCheckEndpointResult } from "../api/utils";

const fetcher = withCheckEndpointResult(UserAPI.getUserData);

export function getUseUserHookKey(id: string) {
  return [UserURLs.getUserData, id];
}

export default function useUser(id?: string) {
  const { data, error } = useSWR(id ? getUseUserHookKey(id) : null, fetcher);
  return {
    error,
    data,
    isLoading: !error && !data,
  };
}
