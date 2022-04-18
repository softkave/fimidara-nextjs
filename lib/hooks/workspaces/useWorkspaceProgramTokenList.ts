import useSWR from "swr";
import ProgramAccessTokenAPI, {
  IGetWorkspaceProgramAccessTokenEndpointResult,
  ProgramAccessTokenURLs,
} from "../../api/endpoints/programAccessToken";
import { checkEndpointResult } from "../../api/utils";
import { swrDefaultConfig } from "../config";

const fetcher = async (p: string, workspaceId: string) => {
  return checkEndpointResult(
    await ProgramAccessTokenAPI.getWorkspaceTokens({
      workspaceId: workspaceId,
    })
  );
};

export function getUseWorkspaceProgramTokenListHookKey(workspaceId: string) {
  return [ProgramAccessTokenURLs.getWorkspaceTokens, workspaceId];
}

export default function useWorkspaceProgramTokenList(workspaceId: string) {
  const { data, error } = useSWR<IGetWorkspaceProgramAccessTokenEndpointResult>(
    getUseWorkspaceProgramTokenListHookKey(workspaceId),
    fetcher,
    swrDefaultConfig
  );

  return {
    error,
    data,
    isLoading: !error && !data,
  };
}
