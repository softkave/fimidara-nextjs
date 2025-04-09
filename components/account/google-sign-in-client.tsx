"use client";

import { kClientPaths } from "@/lib/definitions/paths/clientPath.ts";
import { signIn } from "next-auth/react";
import { TbBrandGoogleFilled } from "react-icons/tb";
import { useLoggedInReturnTo } from "../hooks/useLoggedInReturnTo.tsx";
import { Button } from "../ui/button.tsx";
import { cn } from "../utils.ts";

export interface IGoogleSignInClientProps {
  redirectTo?: string;
  className?: string;
}

export default function GoogleSignInClient(props: IGoogleSignInClientProps) {
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
      className={cn(className, "space-x-2 font-normal")}
    >
      <TbBrandGoogleFilled className="w-4 h-4" />
      <span className="hidden md:block">Sign-in with Google</span>
    </Button>
  );
}
