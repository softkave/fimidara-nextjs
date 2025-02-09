"use client";

import { kClientPaths } from "@/lib/definitions/paths/clientPath.ts";
import { signIn } from "next-auth/react";
import { useLoggedInReturnTo } from "../hooks/useLoggedInReturnTo.tsx";
import { Button } from "../ui/button.tsx";

export interface ISignInClientProps {
  redirectTo?: string;
  className?: string;
}

export default function SignInClient(props: ISignInClientProps) {
  const { className } = props;
  const returnTo = useLoggedInReturnTo({
    defaultReturnTo: props.redirectTo,
  });

  return (
    <Button
      onClick={() =>
        signIn("google", { redirectTo: kClientPaths.withURL(returnTo) })
      }
      variant="outline"
      className={className}
    >
      Sign-in with Google
    </Button>
  );
}
