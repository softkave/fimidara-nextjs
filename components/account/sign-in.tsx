import { signIn } from "@/auth";
import { kClientPaths } from "@/src/lib/clientHelpers/clientPaths.ts";
import { Button } from "../ui/button.tsx";

export interface ISignInProps {
  redirectTo?: string;
}

export default function SignIn({ redirectTo }: ISignInProps) {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("google", {
          redirectTo: kClientPaths.withURL(
            redirectTo ?? kClientPaths.app.index
          ),
        });
      }}
    >
      <Button type="submit" variant="outline">
        Sign-in with Google
      </Button>
    </form>
  );
}
