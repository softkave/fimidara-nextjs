import { kClientPaths } from "@/lib/definitions/paths/clientPath.ts";
import { kAppWorkspacePaths } from "@/lib/definitions/paths/workspace.ts";
import { useServerUserLoggedIn } from "@/lib/hooks/session/useServerUserLoggedIn.ts";
import { cn } from "@/lib/utils";
import { redirect } from "next/navigation";
import { DocsSideNav } from "../docs/DocsSideNav.tsx";
import { ScrollArea } from "../ui/scroll-area.tsx";
import WebHeader from "../web/WebHeader.tsx";

export interface IWebLayoutProps {
  isDocs: boolean;
  shouldRedirectToWorkspace: boolean;
  children?: React.ReactNode;
  contentClassName?: string;
}

export const WebLayout = async (props: IWebLayoutProps) => {
  const { children, isDocs, shouldRedirectToWorkspace } = props;
  const isLoggedIn = await useServerUserLoggedIn();

  if (isLoggedIn && shouldRedirectToWorkspace) {
    return redirect(kClientPaths.withURL(kAppWorkspacePaths.workspaces));
  }

  return (
    <div className="flex flex-1 max-h-screen">
      {isDocs && <DocsSideNav />}
      <div className="flex-1 flex flex-col">
        <WebHeader />
        <ScrollArea>
          <div
            className={cn(
              "mx-auto p-4 flex-1 w-full max-w-4xl",
              props.contentClassName
            )}
          >
            {children}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
