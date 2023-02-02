import useSWR from "swr";
import UsageRecordAPI, {
  IGetUsageCostsEndpointResult,
  UsageRecordURLs,
} from "../api/endpoints/usageRecord";
import { checkEndpointResult } from "../api/utils";
import { swrDefaultConfig } from "./config";

const fetcher = async (p: string) => {
  return checkEndpointResult(await UsageRecordAPI.getUsageCosts());
};

export function getUseUsageCostsHookKey() {
  return [UsageRecordURLs.getUsageCosts];
}

export default function useUsageCosts() {
  const { data, error, mutate } = useSWR<IGetUsageCostsEndpointResult>(
    getUseUsageCostsHookKey(),
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
