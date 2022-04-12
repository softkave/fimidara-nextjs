import useSWR from "swr";
import ClientAssignedTokenAPI, {
  ClientAssignedTokenURLs,
} from "../../api/endpoints/clientAssignedToken";
import { checkEndpointResult } from "../../api/utils";

const fetcher = async (p: string, workspaceId: string) => {
  return checkEndpointResult(
    await ClientAssignedTokenAPI.getWorkspaceTokens({
      workspaceId: workspaceId,
    })
  );
};

export function getUseWorkspaceClientTokenListHookKey(workspaceId: string) {
  return [ClientAssignedTokenURLs.getWorkspaceTokens, workspaceId];
}

export default function useWorkspaceClientTokenList(workspaceId: string) {
  const { data, error } = useSWR(
    getUseWorkspaceClientTokenListHookKey(workspaceId),
    fetcher,
    { shouldRetryOnError: false }
  );

  return {
    error,
    data,
    isLoading: !error && !data,
  };
}
