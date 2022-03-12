import useSWR from "swr";
import ProgramAccessTokenAPI, {
  ProgramAccessTokenURLs,
} from "../../api/endpoints/programAccessToken";
import { checkEndpointResult } from "../../api/utils";

const fetcher = async (p: string, id: string) => {
  return checkEndpointResult(
    await ProgramAccessTokenAPI.getToken({ tokenId: id })
  );
};

export function getUseProgramTokenHookKey(id: string) {
  return [ProgramAccessTokenURLs.getToken, id];
}

export default function useProgramToken(id?: string) {
  const { data, error, mutate } = useSWR(
    id ? getUseProgramTokenHookKey(id) : null,
    fetcher
  );

  return {
    error,
    data,
    mutate,
    isLoading: !error && !data,
  };
}
