import { signIn } from "@/auth";
import { kClientPaths } from "@/lib/definitions/paths/clientPath.ts";
import { kAppWorkspacePaths } from "@/lib/definitions/paths/workspace.ts";
import { GoogleIcon } from "../icons/google.tsx";
import { Button } from "../ui/button.tsx";
import { cn } from "../utils.ts";

export interface IGoogleSignInServerProps {
  redirectTo?: string;
  className?: string;
  variant?: "default" | "outline";
  showIcon?: boolean;
  buttonClassName?: string;
}

export default function GoogleSignInServer({
  redirectTo,
  className,
  variant = "default",
  showIcon = true,
  buttonClassName,
}: IGoogleSignInServerProps) {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("google", {
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
        {showIcon && <GoogleIcon className={"size-4"} />}
        <span className="flex-1">Sign-in with Google</span>
      </Button>
    </form>
  );
}
