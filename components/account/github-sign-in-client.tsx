"use client";

import { kClientPaths } from "@/lib/definitions/paths/clientPath.ts";
import { signIn } from "next-auth/react";
import { useLoggedInReturnTo } from "../hooks/useLoggedInReturnTo.tsx";
import { GithubIcon } from "../icons/github.tsx";
import { Button } from "../ui/button.tsx";
import { cn } from "../utils.ts";

export interface IGitHubSignInClientProps {
  redirectTo?: string;
  className?: string;
  size?: "icon" | "default" | "sm" | "lg";
  variant?: "default" | "outline";
  showIcon?: boolean;
}

export default function GitHubSignInClient(props: IGitHubSignInClientProps) {
  const {
    className,
    size = "default",
    variant = "outline",
    showIcon = true,
  } = props;
  const returnTo = useLoggedInReturnTo({
    defaultReturnTo: props.redirectTo,
  });

  return (
    <Button
      onClick={() =>
        signIn("github", { redirectTo: kClientPaths.withURL(returnTo) })
      }
      variant={variant}
      className={cn(className, "space-x-4 font-normal")}
      size={size}
    >
      {showIcon && <GithubIcon className={"size-4"} />}
      <span className="flex-1">Sign-in with GitHub</span>
    </Button>
  );
}
