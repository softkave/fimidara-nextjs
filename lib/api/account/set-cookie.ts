import { setCookieRouteZodSchema } from "@/lib/definitions/user.ts";
import useSWRMutation from "swr/mutation";
import { z } from "zod";
import { kAccountApiKeys } from "../keys.ts";
import {
  handleResponse,
  IUseMutationHandlerOpts,
  useMutationHandler,
} from "../utils.ts";

export async function callSetCookieEndpoint(params: {
  url?: string;
  arg: z.infer<typeof setCookieRouteZodSchema>;
}) {
  const url = params.url ?? kAccountApiKeys.setCookie;
  const res = await fetch(url, {
    method: "POST",
    body: JSON.stringify(params.arg),
  });

  return await handleResponse(res);
}

async function setCookie(
  url: string,
  params: {
    arg: z.infer<typeof setCookieRouteZodSchema>;
  }
) {
  return await callSetCookieEndpoint({
    url,
    arg: params.arg,
  });
}

export type SetCookieOnSuccessParams = [
  params: Parameters<typeof setCookie>,
  res: Awaited<ReturnType<typeof setCookie>>
];

export function useSetCookie(
  opts: IUseMutationHandlerOpts<typeof setCookie> = {}
) {
  const mutationHandler = useMutationHandler(setCookie, opts);

  const { trigger, data, error, isMutating, reset } = useSWRMutation(
    kAccountApiKeys.setCookie,
    mutationHandler
  );

  return { trigger, data, error, isMutating, reset };
}
