"use client";

import { useUserLoggedIn } from "@/lib/hooks/session/useUserLoggedIn.ts";
import { usePathname } from "next/navigation";
import { DocsSideNav } from "../docs/DocsSideNav.tsx";
import { ScrollArea } from "../ui/scroll-area.tsx";
import WebHeader from "../web/WebHeader.tsx";
import { kAppRootPaths } from "@/lib/definitions/paths/root.ts";

export interface IWebLayoutProps {
  children?: React.ReactNode;
}

export const WebLayout = (props: IWebLayoutProps) => {
  const { children } = props;

  const p = usePathname();
  const { isLoggedIn } = useUserLoggedIn();

  if (isLoggedIn === undefined || isLoggedIn) {
    return null;
  }

  const isDocs = p.startsWith(kAppRootPaths.docs);
  return (
    <div className="flex flex-1 max-h-screen">
      {isDocs && <DocsSideNav />}
      <div className="flex-1 flex flex-col">
        <WebHeader />
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
