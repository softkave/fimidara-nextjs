"use client";

import AppHeader from "../app/AppHeader.tsx";
import FimidaraSideNav from "../app/FimidaraSideNav.tsx";
import { usePageAuthRequired } from "../hooks/usePageAuthRequired.tsx";
import { ScrollArea } from "../ui/scroll-area.tsx";
import { cn } from "../utils.ts";

export interface IAppLayoutProps {
  children?: React.ReactNode;
  contentClassName?: string;
}

export const AppLayout = (props: IAppLayoutProps) => {
  const { children, contentClassName } = props;

  return usePageAuthRequired({
    render() {
      return (
        <div className="flex flex-1 max-h-screen">
          <FimidaraSideNav />
          <div className="flex-1 flex flex-col">
            <AppHeader />
            <ScrollArea>
              <div
                className={cn(
                  "mx-auto p-4 flex-1 w-full max-w-4xl",
                  contentClassName
                )}
              >
                {children}
              </div>
            </ScrollArea>
          </div>
        </div>
      );
    },
  });
};
