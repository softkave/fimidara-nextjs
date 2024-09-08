"use client";

import { useUserLoggedIn } from "@/lib/hooks/session/useUserLoggedIn.ts";
import AppHeader from "../app/AppHeader.tsx";
import FimidaraSideNav from "../app/FimidaraSideNav.tsx";
import { ScrollArea } from "../ui/scroll-area.tsx";

export interface IAppLayoutProps {
  children?: React.ReactNode;
}

export const AppLayout = (props: IAppLayoutProps) => {
  const { children } = props;
  const { isLoggedIn } = useUserLoggedIn();

  if (isLoggedIn === undefined || !isLoggedIn) {
    return null;
  }

  return (
    <div className="flex flex-1 max-h-screen">
      <FimidaraSideNav />
      <div className="flex-1 flex flex-col">
        <AppHeader />
        <ScrollArea>
          <div
            style={{ maxWidth: "700px" }}
            className="mx-auto p-4 flex-1 w-full"
          >
            {children}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
