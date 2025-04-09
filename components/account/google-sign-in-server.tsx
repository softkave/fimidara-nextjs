import { signIn } from "@/auth";
import { kClientPaths } from "@/lib/definitions/paths/clientPath.ts";
import { kAppWorkspacePaths } from "@/lib/definitions/paths/workspace.ts";
import { TbBrandGoogleFilled } from "react-icons/tb";
import { Button } from "../ui/button.tsx";
import { cn } from "../utils.ts";

export interface IGoogleSignInServerProps {
  redirectTo?: string;
  className?: string;
}

export default function GoogleSignInServer({
  redirectTo,
  className,
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
    >
      <Button
        type="submit"
        variant="outline"
        className={cn(className, "space-x-2 font-normal")}
      >
        <TbBrandGoogleFilled className="w-4 h-4" />
        <span className="hidden md:block">Sign-in with Google</span>
      </Button>
    </form>
  );
}
