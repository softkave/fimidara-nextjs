import { signIn } from "@/auth";
import { kClientPaths } from "@/lib/definitions/paths/clientPath.ts";
import { kAppWorkspacePaths } from "@/lib/definitions/paths/workspace.ts";
import { Button } from "../ui/button.tsx";

export interface ISignInProps {
  redirectTo?: string;
  className?: string;
}

export default function SignIn({ redirectTo, className }: ISignInProps) {
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
      <Button type="submit" variant="outline" className={className}>
        Sign-in with Google
      </Button>
    </form>
  );
}
