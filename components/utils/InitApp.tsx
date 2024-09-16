"use client";

import { kAppUserPaths } from "@/lib/definitions/paths/user.ts";
import { useUserLoggedIn } from "@/lib/hooks/session/useUserLoggedIn.ts";
import { isRouteToAppOnInitPath } from "@/lib/utils/routes";
import { useMount } from "ahooks";
import { usePathname, useRouter } from "next/navigation";

export interface IInitAppProps {
  children?: React.ReactNode;
}

export const InitApp = (props: IInitAppProps) => {
  const { children } = props;

  const router = useRouter();
  const p = usePathname();
  const { isLoggedIn } = useUserLoggedIn();

  useMount(() => {
    const shouldRouteToApp = isLoggedIn && p && isRouteToAppOnInitPath(p);

    if (shouldRouteToApp) {
      router.push(kAppUserPaths.workspaces);
    }
  });

  if (isLoggedIn === undefined) {
    return null;
  }

  return <>{children}</>;
};
