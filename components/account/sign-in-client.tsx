"use client";

import { kClientPaths } from "@/src/lib/clientHelpers/clientPaths.ts";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Button } from "../ui/button.tsx";

export interface ISignInClientProps {
  redirectTo?: string;
}

export default function SignInClient(props: ISignInClientProps) {
  const searchParams = useSearchParams();
  const redirectTo =
    props.redirectTo ??
    searchParams.get("redirectTo") ??
    kClientPaths.app.index;

  return (
    <Button
      onClick={() =>
        signIn("google", { redirectTo: kClientPaths.withURL(redirectTo) })
      }
      variant="outline"
    >
      Sign-in with Google
    </Button>
  );
}
