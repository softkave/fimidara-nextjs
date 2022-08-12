import useSWR from "swr";
import UsageRecordAPI, {
  IGetWorkspaceSummedUsageEndpointParams,
  IGetWorkspaceSummedUsageEndpointResult,
  UsageRecordURLs,
} from "../../api/endpoints/usageRecord";
import { checkEndpointResult } from "../../api/utils";
import { swrDefaultConfig } from "../config";

const fetcher = async (
  p: string,
  q: IGetWorkspaceSummedUsageEndpointParams
) => {
  return checkEndpointResult(await UsageRecordAPI.getWorkspaceSummedUsage(q));
};

export function getUseWorkspaceSummedUsageHookKey(
  q: IGetWorkspaceSummedUsageEndpointParams
) {
  return [UsageRecordURLs.getWorkspaceSummedUsage, q];
}

export default function useWorkspaceSummedUsage(
  q: IGetWorkspaceSummedUsageEndpointParams
) {
  const { data, error, mutate } =
    useSWR<IGetWorkspaceSummedUsageEndpointResult>(
      q.workspaceId ? getUseWorkspaceSummedUsageHookKey(q) : null,
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
