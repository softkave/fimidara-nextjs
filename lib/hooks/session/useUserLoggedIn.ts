import { useUserSessionFetchHook } from "../fetchHooks/session.ts";
import { useFetchSingleResourceFetchState } from "../fetchHookUtils.tsx";

export function useUserLoggedIn() {
  const { fetchState } = useUserSessionFetchHook(undefined);
  const { isLoading, other } = useFetchSingleResourceFetchState(fetchState);
  let isLoggedIn: boolean | undefined = undefined;

  if (!isLoading) {
    if (other?.userToken) {
      isLoggedIn = true;
    } else {
      isLoggedIn = false;
    }
  }

  return { isLoggedIn };
}
