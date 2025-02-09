"use client";

import { kClientPaths } from "@/lib/definitions/paths/clientPath.ts";
import { kAppWorkspacePaths } from "@/lib/definitions/paths/workspace.ts";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Button } from "../ui/button.tsx";

export interface ISignInClientProps {
  redirectTo?: string;
  className?: string;
}

export default function SignInClient(props: ISignInClientProps) {
  const { className } = props;
  const searchParams = useSearchParams();
  const redirectTo =
    props.redirectTo ??
    searchParams.get("redirectTo") ??
    kAppWorkspacePaths.workspaces;

  return (
    <Button
      onClick={() =>
        signIn("google", { redirectTo: kClientPaths.withURL(redirectTo) })
      }
      variant="outline"
      className={className}
    >
      Sign-in with Google
    </Button>
  );
}
