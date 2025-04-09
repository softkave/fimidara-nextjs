import { signIn } from "@/auth";
import { kClientPaths } from "@/lib/definitions/paths/clientPath.ts";
import { kAppWorkspacePaths } from "@/lib/definitions/paths/workspace.ts";
import { cn } from "@/lib/utils.ts";
import { VscGithub } from "react-icons/vsc";
import { Button } from "../ui/button.tsx";

export interface IGitHubSignInServerProps {
  redirectTo?: string;
  className?: string;
}

export default function GitHubSignInServer({
  redirectTo,
  className,
}: IGitHubSignInServerProps) {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("github", {
          redirectTo: kClientPaths.withURL(
            redirectTo ?? kAppWorkspacePaths.workspaces
          ),
        });
      }}
    >
      <Button
        type="submit"
        variant="outline"
        className={cn(className, "space-x-2 font-normal")}
      >
        <VscGithub className="w-4 h-4" />
        <span className="hidden md:block">Sign-in with GitHub</span>
      </Button>
    </form>
  );
}
