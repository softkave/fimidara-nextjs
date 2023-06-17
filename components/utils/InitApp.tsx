import { appUserPaths } from "@/lib/definitions/system";
import UserSessionStorageFns from "@/lib/storage/userSession";
import { isRouteToAppOnInitPath } from "@/lib/utils/routes";
import { useMount } from "ahooks";
import { useRouter } from "next/router";

export const InitApp = () => {
  const router = useRouter();

  useMount(() => {
    const savedToken = UserSessionStorageFns.getUserToken();
    const isLoggedIn = !!savedToken;
    const shouldRouteToApp =
      isLoggedIn && isRouteToAppOnInitPath(router.asPath);

    if (shouldRouteToApp) router.push(appUserPaths.workspaces);
  });

  return null;
};
