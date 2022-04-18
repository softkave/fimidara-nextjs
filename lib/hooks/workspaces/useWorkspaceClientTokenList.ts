import useSWR from "swr";
import ClientAssignedTokenAPI, {
  ClientAssignedTokenURLs,
  IGetWorkspaceClientAssignedTokensEndpointResult,
} from "../../api/endpoints/clientAssignedToken";
import { checkEndpointResult } from "../../api/utils";
import { swrDefaultConfig } from "../config";

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
  const { data, error } =
    useSWR<IGetWorkspaceClientAssignedTokensEndpointResult>(
      getUseWorkspaceClientTokenListHookKey(workspaceId),
      fetcher,
      swrDefaultConfig
    );

  return {
    error,
    data,
    isLoading: !error && !data,
  };
}
