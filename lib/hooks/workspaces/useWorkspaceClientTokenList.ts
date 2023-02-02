import useSWR from "swr";
import ClientAssignedTokenAPI, {
  ClientAssignedTokenURLs,
  IGetWorkspaceClientAssignedTokensEndpointParams,
  IGetWorkspaceClientAssignedTokensEndpointResult,
} from "../../api/endpoints/clientAssignedToken";
import { checkEndpointResult } from "../../api/utils";
import { swrDefaultConfig } from "../config";

const fetcher = async (
  p: string,
  q: IGetWorkspaceClientAssignedTokensEndpointParams
) => {
  return checkEndpointResult(
    await ClientAssignedTokenAPI.getWorkspaceTokens(q)
  );
};

export function getUseWorkspaceClientTokenListHookKey(
  q: IGetWorkspaceClientAssignedTokensEndpointParams
) {
  return [ClientAssignedTokenURLs.getWorkspaceTokens, q];
}

export default function useWorkspaceClientTokenList(
  q: IGetWorkspaceClientAssignedTokensEndpointParams
) {
  const { data, error } =
    useSWR<IGetWorkspaceClientAssignedTokensEndpointResult>(
      getUseWorkspaceClientTokenListHookKey(q),
      fetcher,
      swrDefaultConfig
    );
  return {
    error,
    data,
    isLoading: !error && !data,
  };
}
