import { kClientPaths } from "@/lib/definitions/paths/clientPath.ts";
import { kAppWorkspacePaths } from "@/lib/definitions/paths/workspace.ts";
import { redirect } from "next/navigation";
import { DocsSideNav } from "../docs/DocsSideNav.tsx";
import { ScrollArea } from "../ui/scroll-area.tsx";
import WebHeader from "../web/WebHeader.tsx";
import { useServerUserLoggedIn } from "@/lib/hooks/session/useServerUserLoggedIn.ts";

export interface IWebLayoutProps {
  isDocs: boolean;
  shouldRedirectToWorkspace: boolean;
  children?: React.ReactNode;
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
