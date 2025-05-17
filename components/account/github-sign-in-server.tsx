import { signIn } from "@/auth";
import { kClientPaths } from "@/lib/definitions/paths/clientPath.ts";
import { kAppWorkspacePaths } from "@/lib/definitions/paths/workspace.ts";
import { GithubIcon } from "../icons/github.tsx";
import { Button } from "../ui/button.tsx";
import { cn } from "../utils.ts";

export interface IGitHubSignInServerProps {
  redirectTo?: string;
  className?: string;
  buttonClassName?: string;
  variant?: "default" | "outline";
  showIcon?: boolean;
}

export default function GitHubSignInServer({
  redirectTo,
  className,
  buttonClassName,
  variant = "default",
  showIcon = true,
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
      className={className}
    >
      <Button
        type="submit"
        variant={variant}
        className={cn("space-x-4 font-normal", buttonClassName)}
      >
        {showIcon && <GithubIcon className={"size-4"} />}
        <span className="flex-1">Sign-in with GitHub</span>
      </Button>
    </form>
  );
}
