import { SWRConfiguration } from "swr";

export const swrDefaultConfig: SWRConfiguration = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  revalidateOnMount: true,
  shouldRetryOnError: false,
};
