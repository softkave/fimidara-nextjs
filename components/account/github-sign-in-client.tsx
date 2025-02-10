"use client";

import { kClientPaths } from "@/lib/definitions/paths/clientPath.ts";
import { signIn } from "next-auth/react";
import { FaGithub } from "react-icons/fa";
import { useLoggedInReturnTo } from "../hooks/useLoggedInReturnTo.tsx";
import { Button } from "../ui/button.tsx";
import { cn } from "../utils.ts";

export interface IGitHubSignInClientProps {
  redirectTo?: string;
  className?: string;
}

export default function GitHubSignInClient(props: IGitHubSignInClientProps) {
  const { className } = props;
  const returnTo = useLoggedInReturnTo({
    defaultReturnTo: props.redirectTo,
  });

  return (
    <Button
      onClick={() =>
        signIn("github", { redirectTo: kClientPaths.withURL(returnTo) })
      }
      variant="outline"
      className={cn(className, "space-x-2")}
    >
      <FaGithub />
      <span className="hidden md:block">Sign-in with GitHub</span>
    </Button>
  );
}
