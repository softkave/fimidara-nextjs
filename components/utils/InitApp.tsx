"use client";

import { appUserPaths } from "@/lib/definitions/system";
import { useUserLoggedIn } from "@/lib/hooks/session/useUserLoggedIn.ts";
import UserSessionStorageFns from "@/lib/storage/userSession";
import { isRouteToAppOnInitPath } from "@/lib/utils/routes";
import { useMount } from "ahooks";
import { usePathname, useRouter } from "next/navigation";
import FimidaraHeader from "../app/FimidaraHeader.tsx";
import FimidaraSideNav from "../app/FimidaraSideNav.tsx";

export interface IInitAppProps {
  children?: React.ReactNode;
}

export const InitApp = (props: IInitAppProps) => {
  const { children } = props;

  const router = useRouter();
  const p = usePathname();
  const { isLoggedIn } = useUserLoggedIn();

  useMount(() => {
    const savedToken = UserSessionStorageFns.getUserToken();
    const isLoggedIn = !!savedToken;
    const shouldRouteToApp = isLoggedIn && p && isRouteToAppOnInitPath(p);

    if (shouldRouteToApp) router.push(appUserPaths.workspaces);
  });

  if (isLoggedIn === undefined) {
    return null;
  }

  return (
    <>
      <div className="flex flex-1">
        <FimidaraSideNav />
        <div className="flex-1 flex flex-col">
          <FimidaraHeader />
          <div
            style={{ maxWidth: "700px" }}
            className="mx-auto p-4 flex-1 w-full"
          >
            {children}
          </div>
        </div>
      </div>
    </>
  );
};
