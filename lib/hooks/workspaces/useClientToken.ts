import useSWR from "swr";
import ClientAssignedTokenAPI, {
  ClientAssignedTokenURLs,
} from "../../api/endpoints/clientAssignedToken";
import { checkEndpointResult } from "../../api/utils";

const fetcher = async (p: string, id: string) => {
  return checkEndpointResult(
    await ClientAssignedTokenAPI.getToken({ tokenId: id })
  );
};

export function getUseClientTokenHookKey(id: string) {
  return [ClientAssignedTokenURLs.getToken, id];
}

export default function useClientToken(id?: string) {
  const { data, error, mutate } = useSWR(
    id ? getUseClientTokenHookKey(id) : null,
    fetcher,
    { shouldRetryOnError: false }
  );

  return {
    error,
    data,
    mutate,
    isLoading: !error && !data,
  };
}
