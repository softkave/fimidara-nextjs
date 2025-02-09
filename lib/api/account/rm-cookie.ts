import useSWRMutation from "swr/mutation";
import { kAccountApiKeys } from "../keys.ts";
import {
  handleResponse,
  IUseMutationHandlerOpts,
  useMutationHandler,
} from "../utils.ts";

export async function callRmCookieEndpoint(params: { url?: string } = {}) {
  const url = params.url ?? kAccountApiKeys.rmCookie;
  const res = await fetch(url, {
    method: "POST",
  });

  return await handleResponse(res);
}

async function rmCookie(url: string) {
  return await callRmCookieEndpoint({ url });
}

export type RmCookieOnSuccessParams = [
  params: Parameters<typeof rmCookie>,
  res: Awaited<ReturnType<typeof rmCookie>>
];

export function useRmCookie(
  opts: IUseMutationHandlerOpts<typeof rmCookie> = {}
) {
  const mutationHandler = useMutationHandler(rmCookie, opts);

  const { trigger, data, error, isMutating, reset } = useSWRMutation(
    kAccountApiKeys.rmCookie,
    mutationHandler
  );

  return { trigger, data, error, isMutating, reset };
}
