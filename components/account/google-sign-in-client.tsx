"use client";

import { kClientPaths } from "@/lib/definitions/paths/clientPath.ts";
import { signIn } from "next-auth/react";
import { useLoggedInReturnTo } from "../hooks/useLoggedInReturnTo.tsx";
import { GoogleIcon } from "../icons/google.tsx";
import { Button } from "../ui/button.tsx";
import { cn } from "../utils.ts";

export interface IGoogleSignInClientProps {
  redirectTo?: string;
  className?: string;
  variant?: "default" | "outline";
  showIcon?: boolean;
}

export default function GoogleSignInClient(props: IGoogleSignInClientProps) {
  const { className, variant = "outline", showIcon = true } = props;
  const returnTo = useLoggedInReturnTo({
    defaultReturnTo: props.redirectTo,
  });

  return (
    <Button
      onClick={() =>
        signIn("google", { redirectTo: kClientPaths.withURL(returnTo) })
      }
      variant={variant}
      className={cn(className, "space-x-4 font-normal")}
    >
      {showIcon && <GoogleIcon className={"size-4"} />}
      <span className="flex-1">Sign-in with Google</span>
    </Button>
  );
}
