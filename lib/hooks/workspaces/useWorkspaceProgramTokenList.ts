import useSWR from "swr";
import ProgramAccessTokenAPI, {
  IGetWorkspaceProgramAccessTokenEndpointParams,
  IGetWorkspaceProgramAccessTokenEndpointResult,
  ProgramAccessTokenURLs,
} from "../../api/endpoints/programAccessToken";
import { checkEndpointResult } from "../../api/utils";
import { swrDefaultConfig } from "../config";

const fetcher = async (
  p: string,
  q: IGetWorkspaceProgramAccessTokenEndpointParams
) => {
  return checkEndpointResult(await ProgramAccessTokenAPI.getWorkspaceTokens(q));
};

export function getUseWorkspaceProgramTokenListHookKey(
  q: IGetWorkspaceProgramAccessTokenEndpointParams
) {
  return [ProgramAccessTokenURLs.getWorkspaceTokens, q];
}

export default function useWorkspaceProgramTokenList(
  q: IGetWorkspaceProgramAccessTokenEndpointParams
) {
  const { data, error } = useSWR<IGetWorkspaceProgramAccessTokenEndpointResult>(
    getUseWorkspaceProgramTokenListHookKey(q),
    fetcher,
    swrDefaultConfig
  );
  return {
    error,
    data,
    isLoading: !error && !data,
  };
}
