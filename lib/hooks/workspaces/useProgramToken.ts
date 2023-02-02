import useSWR from "swr";
import ProgramAccessTokenAPI, {
  IGetProgramAccessTokenEndpointResult,
  ProgramAccessTokenURLs,
} from "../../api/endpoints/programAccessToken";
import { checkEndpointResult } from "../../api/utils";
import { swrDefaultConfig } from "../config";

const fetcher = async (p: string, id: string) => {
  return checkEndpointResult(
    await ProgramAccessTokenAPI.getToken({ tokenId: id })
  );
};

export function getUseProgramTokenHookKey(id: string) {
  return [ProgramAccessTokenURLs.getToken, id];
}

export default function useProgramToken(id?: string) {
  const { data, error, mutate } = useSWR<IGetProgramAccessTokenEndpointResult>(
    id ? getUseProgramTokenHookKey(id) : null,
    fetcher,
    swrDefaultConfig
  );
  return {
    error,
    data,
    mutate,
    isLoading: !error && !data,
  };
}
